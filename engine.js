/*
 * Kanban Flow Game — rules engine (Featureban-style, dice variant).
 *
 * Pure functions operating on a plain JSON "game" object. Every mutation the
 * UI performs goes through this file, inside a database transaction, so the
 * rules are enforced against the freshest shared state even when several
 * players click at the same moment.
 *
 * Board: Backlog → [workflow columns] → Done.
 *   Workflow columns are configurable. "active" columns are where work
 *   happens; "passive" columns are queues between two active columns
 *   (e.g. "Ready for Testing"): no work happens there, tasks in them
 *   cannot be blocked, and moving in / out costs an action as usual.
 *
 * Dice rules (from the printed instruction card):
 *   1-2  Block one of your tasks AND start a new task.
 *   3-4  Do ONE of: move your task, unblock your task, start a new task.
 *   5-6  Do TWO of: move your task, unblock your task, start a new task
 *        (never two actions on the same task in one day).
 *   If you can't do any of the above, help someone else (unblock or move
 *   another player's task).
 * Round 1 has no WIP limits; round 2 enforces the per-column WIP limits set
 * by the facilitator (blocked tasks count towards WIP).
 *
 * Urgent tasks (optional, settings.urgentPct % of new tasks):
 *   - If you can move or unblock one of your urgent tasks, you must do that
 *     first (same when helping: urgent tasks first).
 *   - Urgent tasks respect WIP limits like any other task (no expedite).
 */
(function (root) {
  'use strict';

  var PALETTE = [
    '#ffd43b', '#74c0fc', '#ff8787', '#8ce99a', '#da77f2', '#ffa94d',
    '#63e6be', '#f783ac', '#a9e34b', '#91a7ff', '#ffc078', '#c0eb75',
    '#99e9f2', '#e599f7', '#ffe066', '#b197fc'
  ];
  var MAX_ACTIVE = 4;

  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function arr(x) {
    if (!x) return [];
    if (Array.isArray(x)) return x.filter(function (v) { return v != null; });
    return Object.keys(x).sort(function (a, b) { return a - b; }).map(function (k) { return x[k]; });
  }

  function defaultColumns() {
    return [
      { id: 'dev', type: 'active', name: '', wip: 3 },
      { id: 'test', type: 'active', name: '', wip: 2 }
    ];
  }

  function newGame(facilitatorId, now) {
    return {
      v: 2,
      phase: 'lobby',          // lobby | playing | roundEnd | debrief
      round: 0,
      day: 0,
      facilitator: facilitatorId,
      createdAt: now || Date.now(),
      settings: {
        days: 10,
        turnMode: 'simultaneous', // simultaneous | turns
        autoAdvance: true,
        columns: defaultColumns(),
        colSeq: 2,
        names: { backlog: '', done: '' },
        urgentPct: 0
      },
      players: {},
      cards: {},
      nextNo: 1,
      nextUrgent: false,
      seq: 0,
      turns: {},
      history: {}
    };
  }

  // Realtime databases drop empty objects/arrays; restore the shape.
  function norm(g) {
    if (!g) return g;
    g.players = g.players || {};
    g.cards = g.cards || {};
    g.turns = g.turns || {};
    g.history = g.history || {};
    var s = g.settings = g.settings || {};
    s.names = s.names || {};
    if (!s.columns) {
      // sessions created by version 1 stored WIP as {dev, test}
      s.columns = defaultColumns();
      if (s.wip) s.columns.forEach(function (c) { if (s.wip[c.id] != null) c.wip = s.wip[c.id]; });
    }
    s.columns = arr(s.columns).map(function (c) {
      c.name = c.name || ''; c.wip = parseInt(c.wip, 10) || 0; return c;
    });
    if (s.urgentPct == null) s.urgentPct = 0;
    delete s.urgentExpedite;
    Object.keys(g.turns).forEach(function (k) {
      var t = g.turns[k];
      t.steps = arr(t.steps);
      t.touched = t.touched || {};
    });
    Object.keys(g.cards).forEach(function (k) { g.cards[k].path = arr(g.cards[k].path); });
    Object.keys(g.history).forEach(function (k) {
      var h = g.history[k];
      h.days = h.days || {};
      if (h.columns) h.columns = arr(h.columns);
      h.wipLog = arr(h.wipLog);
    });
    return g;
  }

  // ---------- board structure ----------
  function columns(g) { return g.settings.columns; }
  function colIndex(g, id) {
    var c = columns(g);
    for (var i = 0; i < c.length; i++) if (c[i].id === id) return i;
    return -1;
  }
  function colById(g, id) { var i = colIndex(g, id); return i < 0 ? null : columns(g)[i]; }
  function nextCol(g, id) {
    var i = colIndex(g, id), c = columns(g);
    return i < 0 || i === c.length - 1 ? 'done' : c[i + 1].id;
  }
  function firstCol(g) { return columns(g)[0].id; }
  function isActive(g, id) { var c = colById(g, id); return !!c && c.type === 'active'; }
  function hasPassive(g) { return columns(g).some(function (c) { return c.type === 'passive'; }); }

  // ---------- helpers ----------
  function playerList(g) {
    return Object.keys(g.players)
      .map(function (id) { var p = g.players[id]; p.id = id; return p; })
      .sort(function (a, b) { return a.seq - b.seq; });
  }

  function roundCards(g, round) {
    var r = round == null ? g.round : round;
    return Object.keys(g.cards).map(function (id) { return g.cards[id]; })
      .filter(function (c) { return c.round === r; })
      .sort(function (a, b) { return a.no - b.no; });
  }

  function countIn(g, col) {
    return roundCards(g).filter(function (c) { return c.col === col; }).length;
  }

  function wipActive(g) { return g.round === 2; }

  function limitOf(g, col) {
    if (!wipActive(g) || col === 'done') return 0;
    var c = colById(g, col);
    return c && c.wip > 0 ? c.wip : 0;
  }

  // Urgent tasks get priority but never exceed WIP limits.
  function hasCapacity(g, col) {
    var l = limitOf(g, col);
    if (!l) return true;
    return countIn(g, col) < l;
  }

  function activePlayerId(g) {
    var list = playerList(g);
    for (var i = 0; i < list.length; i++) {
      var t = g.turns[list[i].id];
      if (!t || !t.done) return list[i].id;
    }
    return null;
  }

  function canAct(g, pid) {
    if (g.phase !== 'playing' || !g.players[pid]) return false;
    var t = g.turns[pid];
    if (t && t.done) return false;
    if (g.settings.turnMode === 'turns') return activePlayerId(g) === pid;
    return true;
  }

  // ---------- legal actions ----------
  function urgentFirst(g, acts) {
    var urgentActs = acts.filter(function (a) { return a.card && g.cards[a.card].urgent; });
    return urgentActs.length ? urgentActs : acts;
  }

  function cardActions(g, cards, help) {
    var acts = [];
    cards.forEach(function (c) {
      if (c.blocked) acts.push(help ? { type: 'unblock', card: c.id, help: true } : { type: 'unblock', card: c.id });
      else if (hasCapacity(g, nextCol(g, c.col))) acts.push(help ? { type: 'move', card: c.id, help: true } : { type: 'move', card: c.id });
    });
    return acts;
  }

  function ownActions(g, pid, step, touched) {
    var mine = roundCards(g).filter(function (c) {
      return c.owner === pid && c.col !== 'done' && !touched[c.id];
    });
    if (step === 'block') {
      return mine.filter(function (c) { return !c.blocked && isActive(g, c.col); })
        .map(function (c) { return { type: 'block', card: c.id }; });
    }
    var canStart = hasCapacity(g, firstCol(g));
    if (step === 'start') return canStart ? [{ type: 'start' }] : [];
    // step === 'any'
    var acts = cardActions(g, mine, false);
    var urgent = acts.filter(function (a) { return g.cards[a.card].urgent; });
    if (urgent.length) return urgent; // urgent work first
    if (canStart) acts.push({ type: 'start' });
    return acts;
  }

  function helpActions(g, pid, touched) {
    var others = roundCards(g).filter(function (c) {
      return c.owner !== pid && c.col !== 'done' && !touched[c.id];
    });
    return urgentFirst(g, cardActions(g, others, true));
  }

  function stepActions(g, pid, step, touched) {
    var own = ownActions(g, pid, step, touched);
    if (own.length || step === 'block') return own;
    return helpActions(g, pid, touched);
  }

  function legalActions(g, pid) {
    if (!canAct(g, pid)) return [];
    var t = g.turns[pid];
    if (!t || !t.roll || !t.steps.length) return [];
    return stepActions(g, pid, t.steps[0], t.touched);
  }

  function stepsFor(roll) {
    if (roll <= 2) return ['block', 'start'];
    if (roll <= 4) return ['any'];
    return ['any', 'any'];
  }

  function rollUrgent(g) {
    var p = Math.max(0, Math.min(100, Number(g.settings.urgentPct) || 0));
    g.nextUrgent = p > 0 && Math.random() * 100 < p;
  }

  // ---------- day / turn flow ----------
  function snapshot(g) {
    var h = g.history['r' + g.round];
    if (!h) return;
    var s = { c: {}, done: 0, blocked: 0, urgent: 0 };
    columns(g).forEach(function (c) { s.c[c.id] = 0; });
    roundCards(g).forEach(function (c) {
      if (c.col === 'done') { s.done++; return; }
      s.c[c.col] = (s.c[c.col] || 0) + 1;
      if (c.blocked) s.blocked++;
      if (c.urgent) s.urgent++;
    });
    h.days['d' + g.day] = s;
  }

  function allDone(g) {
    var list = playerList(g);
    return list.length > 0 && list.every(function (p) { return g.turns[p.id] && g.turns[p.id].done; });
  }

  function advanceDay(g, events) {
    snapshot(g);
    events.push({ t: 'dayEnd', day: g.day });
    if (g.day >= g.settings.days) {
      g.phase = 'roundEnd';
      g.history['r' + g.round].endedAt = Date.now();
      g.turns = {};
      events.push({ t: 'roundEnd', round: g.round });
      return;
    }
    g.day++;
    g.turns = {};
  }

  function settle(g, pid, events) {
    // Skip steps that cannot be performed; finish turn when nothing is left.
    var t = g.turns[pid];
    while (t.steps.length && !stepActions(g, pid, t.steps[0], t.touched).length) {
      var s = t.steps.shift();
      events.push({ t: 'skip', pid: pid, step: s });
    }
    if (!t.steps.length) finishTurn(g, pid, events);
  }

  // After any change, other players' open turns may have lost all options.
  function settleAll(g, events) {
    var guard = 0, changed = true;
    while (changed && g.phase === 'playing' && guard++ < 50) {
      changed = false;
      var ids = Object.keys(g.turns);
      for (var i = 0; i < ids.length; i++) {
        var t = g.turns[ids[i]];
        if (t && t.roll && !t.done && g.players[ids[i]]) {
          var before = g.day;
          settle(g, ids[i], events);
          if (t.done || g.day !== before) { changed = true; break; }
        }
      }
    }
  }

  function finishTurn(g, pid, events) {
    var t = g.turns[pid];
    t.done = true;
    t.steps = [];
    events.push({ t: 'turnDone', pid: pid });
    if (allDone(g) && (g.settings.autoAdvance || g.settings.turnMode === 'turns')) advanceDay(g, events);
  }

  // ---------- public mutations (each returns {ok, error, events}) ----------
  function fail(code) { return { ok: false, error: code, events: [] }; }
  function ok(ev) { return { ok: true, events: ev || [] }; }

  function addPlayer(g, pid, name) {
    name = String(name || '').trim().slice(0, 24);
    if (!name) return fail('nameRequired');
    if (g.players[pid]) { g.players[pid].name = name; return ok(); }
    var used = {};
    Object.keys(g.players).forEach(function (k) { used[g.players[k].color] = true; });
    var color = PALETTE.filter(function (c) { return !used[c]; })[0] ||
      PALETTE[Object.keys(g.players).length % PALETTE.length];
    g.seq = (g.seq || 0) + 1;
    g.players[pid] = { name: name, color: color, seq: g.seq };
    return ok([{ t: 'join', pid: pid, name: name }]);
  }

  function removePlayer(g, pid) {
    if (!g.players[pid]) return fail('noPlayer');
    var name = g.players[pid].name;
    delete g.players[pid];
    delete g.turns[pid];
    var ev = [{ t: 'leave', name: name }];
    if (g.phase === 'playing' && allDone(g)) advanceDay(g, ev);
    return ok(ev);
  }

  function clampInt(v, lo, hi, dflt) {
    var n = parseInt(v, 10);
    if (isNaN(n)) n = dflt;
    return Math.max(lo, Math.min(hi, n));
  }

  function updateSettings(g, patch) {
    var s = g.settings, ev = [];
    if (g.phase === 'debrief') return fail('badPhase');
    if (patch.days != null) {
      var d = clampInt(patch.days, 1, 40, s.days);
      if (g.phase === 'playing' && d < g.day) d = g.day;
      s.days = d;
    }
    if (patch.turnMode && g.phase !== 'playing') s.turnMode = patch.turnMode === 'turns' ? 'turns' : 'simultaneous';
    if (patch.autoAdvance != null) s.autoAdvance = !!patch.autoAdvance;
    if (patch.names) {
      ['backlog', 'done'].forEach(function (k) {
        if (patch.names[k] != null) s.names[k] = String(patch.names[k]).trim().slice(0, 28);
      });
    }
    if (patch.colNames) {
      Object.keys(patch.colNames).forEach(function (id) {
        var c = colById(g, id); if (c) c.name = String(patch.colNames[id]).trim().slice(0, 28);
      });
    }
    if (patch.wip) {
      Object.keys(patch.wip).forEach(function (id) {
        var c = colById(g, id); if (!c) return;
        var w = clampInt(patch.wip[id], 0, 30, c.wip);
        if (w === c.wip) return;
        c.wip = w;
        if (g.phase === 'playing' && g.round === 2) {
          var h = g.history.r2;
          h.wipLog = h.wipLog || [];
          h.wipLog.push({ day: g.day, col: id, wip: w });
          ev.push({ t: 'wipChange', col: id, wip: w });
        }
      });
    }
    if (patch.urgentPct != null && g.phase !== 'playing') s.urgentPct = clampInt(patch.urgentPct, 0, 100, s.urgentPct);
    var r = ok(ev);
    if (ev.length && g.phase === 'playing') settleAll(g, r.events);
    return r;
  }

  // Board structure can only change before the first round, so both rounds
  // are played on the same board and can be compared.
  function addActiveColumn(g) {
    if (g.phase !== 'lobby') return fail('badPhase');
    var cols = columns(g);
    if (cols.filter(function (c) { return c.type === 'active'; }).length >= MAX_ACTIVE) return fail('maxColumns');
    s_seq(g);
    cols.push({ id: 'a' + g.settings.colSeq, type: 'active', name: '', wip: 2 });
    return ok();
  }

  function s_seq(g) { g.settings.colSeq = (g.settings.colSeq || 2) + 1; }

  function removeColumn(g, id) {
    if (g.phase !== 'lobby') return fail('badPhase');
    var cols = columns(g), i = colIndex(g, id);
    if (i < 0) return fail('noColumn');
    var c = cols[i];
    if (c.type === 'active') {
      if (cols.filter(function (x) { return x.type === 'active'; }).length <= 1) return fail('minColumns');
      cols.splice(i, 1);
      // a queue must sit between two active columns
      if (cols[i] && cols[i - 1] && cols[i].type === 'passive' && cols[i - 1].type === 'passive') cols.splice(i, 1);
      while (cols.length && cols[0].type === 'passive') cols.shift();
      while (cols.length && cols[cols.length - 1].type === 'passive') cols.pop();
    } else cols.splice(i, 1);
    return ok();
  }

  // Add (or remove) a queue column right after the given active column.
  function togglePassiveAfter(g, id) {
    if (g.phase !== 'lobby') return fail('badPhase');
    var cols = columns(g), i = colIndex(g, id);
    if (i < 0 || cols[i].type !== 'active') return fail('noColumn');
    if (i === cols.length - 1) return fail('noColumn'); // must be between two active columns
    if (cols[i + 1].type === 'passive') { cols.splice(i + 1, 1); return ok(); }
    s_seq(g);
    cols.splice(i + 1, 0, { id: 'q' + g.settings.colSeq, type: 'passive', name: '', wip: 2 });
    return ok();
  }

  // WIP suggestion that scales with group size.
  function suggestWip(g) {
    var n = Math.max(1, playerList(g).length), out = {}, firstActive = true;
    columns(g).forEach(function (c) {
      if (c.type === 'passive') out[c.id] = Math.max(1, Math.ceil(n / 4));
      else { out[c.id] = firstActive ? Math.max(2, Math.ceil(n / 2)) : Math.max(1, Math.ceil(n / 3)); firstActive = false; }
    });
    return out;
  }

  function startRound(g, n) {
    if (n === 1 && g.phase !== 'lobby') return fail('badPhase');
    if (n === 2 && !(g.round === 1 && g.phase === 'roundEnd')) return fail('badPhase');
    if (!playerList(g).length) return fail('noPlayers');
    g.phase = 'playing';
    g.round = n;
    g.day = 1;
    g.turns = {};
    rollUrgent(g);
    var d0 = { c: {}, done: 0, blocked: 0, urgent: 0 };
    columns(g).forEach(function (c) { d0.c[c.id] = 0; });
    g.history['r' + n] = {
      days: { d0: d0 },
      columns: clone(columns(g)),
      wipLimits: n === 2,
      urgentPct: g.settings.urgentPct,
      players: playerList(g).length,
      startedAt: Date.now()
    };
    return ok([{ t: 'roundStart', round: n }]);
  }

  function roll(g, pid, value) {
    if (!canAct(g, pid)) return fail('notYourTurn');
    if (g.turns[pid] && g.turns[pid].roll) return fail('alreadyRolled');
    var v = value || (1 + Math.floor(Math.random() * 6));
    g.turns[pid] = { roll: v, steps: stepsFor(v), touched: {}, done: false };
    var events = [{ t: 'roll', pid: pid, value: v }];
    settle(g, pid, events);
    settleAll(g, events);
    return { ok: true, events: events, value: v };
  }

  function sameAction(a, b) { return a.type === b.type && (a.card || null) === (b.card || null); }

  function apply(g, pid, action) {
    var legal = legalActions(g, pid).filter(function (a) { return sameAction(a, action); });
    if (!legal.length) return fail('illegal');
    var act = legal[0];
    var t = g.turns[pid];
    var events = [];
    var card;
    if (act.type === 'start') {
      var id = 'c' + g.round + '_' + g.nextNo;
      card = {
        id: id, no: g.nextNo++, owner: pid, col: firstCol(g), blocked: false, round: g.round,
        startDay: g.day, urgent: !!g.nextUrgent, path: [{ c: firstCol(g), d: g.day }]
      };
      g.cards[id] = card;
      rollUrgent(g);
      events.push({ t: 'start', pid: pid, no: card.no, urgent: card.urgent });
    } else {
      card = g.cards[act.card];
      var ev = { pid: pid, no: card.no, help: !!act.help, owner: card.owner, urgent: !!card.urgent };
      if (act.type === 'block') { card.blocked = true; ev.t = 'block'; }
      else if (act.type === 'unblock') { card.blocked = false; ev.t = 'unblock'; }
      else if (act.type === 'move') {
        ev.t = 'move'; ev.from = card.col; card.col = nextCol(g, card.col); ev.to = card.col;
        card.path = card.path || [];
        card.path.push({ c: card.col, d: g.day });
        if (card.col === 'done') card.doneDay = g.day;
      }
      if (act.help) { card.helpers = card.helpers || {}; card.helpers[pid] = true; }
      events.push(ev);
    }
    t.touched[card.id] = true;
    t.steps.shift();
    settle(g, pid, events);
    settleAll(g, events);
    return { ok: true, events: events };
  }

  function forceEndTurn(g, pid) {
    if (g.phase !== 'playing' || !g.players[pid]) return fail('badPhase');
    var t = g.turns[pid] || (g.turns[pid] = { roll: 0, steps: [], touched: {}, done: false });
    if (t.done) return fail('alreadyDone');
    var events = [{ t: 'skipTurn', pid: pid }];
    finishTurn(g, pid, events);
    return ok(events);
  }

  function nextDay(g) {
    if (g.phase !== 'playing') return fail('badPhase');
    var events = [];
    advanceDay(g, events);
    return ok(events);
  }

  function endRound(g) {
    if (g.phase !== 'playing') return fail('badPhase');
    g.settings.days = g.day;
    var events = [];
    advanceDay(g, events);
    return ok(events);
  }

  function showDebrief(g) {
    if (g.phase !== 'roundEnd') return fail('badPhase');
    g.phase = 'debrief';
    return ok();
  }

  // ---------- metrics ----------
  function waitDays(card, passiveIds) {
    var p = card.path || [], w = 0;
    for (var i = 0; i < p.length - 1; i++) if (passiveIds[p[i].c]) w += p[i + 1].d - p[i].d;
    return w;
  }

  function avg(a) { return a.length ? a.reduce(function (x, y) { return x + y; }, 0) / a.length : null; }

  function metrics(g, round) {
    var h = g.history['r' + round];
    if (!h) return null;
    var cols = h.columns || columns(g);
    var passiveIds = {};
    cols.forEach(function (c) { if (c.type === 'passive') passiveIds[c.id] = true; });
    var cards = roundCards(g, round);
    var done = cards.filter(function (c) { return c.col === 'done'; });
    var ctOf = function (c) { return c.doneDay - c.startDay + 1; };
    var ct = done.map(ctOf);
    var dayKeys = Object.keys(h.days).map(function (k) { return parseInt(k.slice(1), 10); })
      .sort(function (a, b) { return a - b; });
    var days = dayKeys.map(function (d) {
      var s = h.days['d' + d], c = {};
      cols.forEach(function (col) { c[col.id] = (s.c && s.c[col.id]) || 0; });
      var wip = 0; Object.keys(c).forEach(function (k) { wip += c[k]; });
      return { day: d, c: c, wip: wip, done: s.done || 0, blocked: s.blocked || 0 };
    });
    var played = days.filter(function (d) { return d.day > 0; });
    var sorted = ct.slice().sort(function (a, b) { return a - b; });
    function pct(p) { return sorted.length ? sorted[Math.min(sorted.length - 1, Math.ceil(p * sorted.length) - 1)] : null; }
    var urgentDone = done.filter(function (c) { return c.urgent; });
    var stdDone = done.filter(function (c) { return !c.urgent; });
    var hasQ = Object.keys(passiveIds).length > 0;
    var waits = hasQ ? done.map(function (c) { return waitDays(c, passiveIds); }) : [];
    var sumCt = ct.reduce(function (a, b) { return a + b; }, 0);
    var sumWait = waits.reduce(function (a, b) { return a + b; }, 0);
    return {
      round: round,
      daysPlayed: played.length,
      started: cards.length,
      finished: done.length,
      inProgress: cards.length - done.length,
      blockedAtEnd: cards.filter(function (c) { return c.blocked && c.col !== 'done'; }).length,
      throughputPerDay: played.length ? done.length / played.length : 0,
      avgCycleTime: avg(ct),
      p85CycleTime: pct(0.85),
      cycleTimes: ct,
      avgWip: played.length ? avg(played.map(function (d) { return d.wip; })) : 0,
      helpedCards: cards.filter(function (c) { return c.helpers && Object.keys(c.helpers).length; }).length,
      urgentStarted: cards.filter(function (c) { return c.urgent; }).length,
      urgentFinished: urgentDone.length,
      avgCtUrgent: avg(urgentDone.map(ctOf)),
      avgCtStandard: avg(stdDone.map(ctOf)),
      hasQueues: hasQ,
      avgWait: hasQ ? avg(waits) : null,
      flowEfficiency: hasQ && sumCt ? (sumCt - sumWait) / sumCt : null,
      columns: cols,
      wipLimits: !!h.wipLimits,
      wipLog: h.wipLog || [],
      urgentPct: h.urgentPct || 0,
      days: days
    };
  }

  var api = {
    PALETTE: PALETTE, MAX_ACTIVE: MAX_ACTIVE,
    newGame: newGame, norm: norm, clone: clone,
    columns: columns, colById: colById, nextCol: nextCol, firstCol: firstCol, isActive: isActive, hasPassive: hasPassive,
    playerList: playerList, roundCards: roundCards, countIn: countIn,
    wipActive: wipActive, limitOf: limitOf, hasCapacity: hasCapacity,
    activePlayerId: activePlayerId, canAct: canAct, legalActions: legalActions, stepsFor: stepsFor,
    addPlayer: addPlayer, removePlayer: removePlayer, updateSettings: updateSettings,
    addActiveColumn: addActiveColumn, removeColumn: removeColumn, togglePassiveAfter: togglePassiveAfter, suggestWip: suggestWip,
    startRound: startRound, roll: roll, apply: apply, forceEndTurn: forceEndTurn,
    nextDay: nextDay, endRound: endRound, showDebrief: showDebrief, metrics: metrics
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Engine = api;
})(this);
