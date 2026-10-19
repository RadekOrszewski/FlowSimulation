// Run: node test/engine.test.js
const E = require('../engine.js');
const assert = require('assert');
let passed = 0;
function test(name, fn) { fn(); passed++; console.log('  ok -', name); }

function setup(n, opts) {
  const g = E.newGame('fac');
  for (let i = 1; i <= n; i++) E.addPlayer(g, 'p' + i, 'Player ' + i);
  E.updateSettings(g, opts || {});
  return g;
}
const cardsOf = (g, p) => Object.values(g.cards).filter(c => c.owner === p);
function toRound2(g) { E.startRound(g, 1); E.endRound(g); E.startRound(g, 2); }

test('roll 1-2 with no tasks: skips block, must start', () => {
  const g = setup(2); E.startRound(g, 1);
  E.roll(g, 'p1', 1);
  assert.deepStrictEqual(g.turns.p1.steps, ['start']);
  assert.deepStrictEqual(E.legalActions(g, 'p1'), [{ type: 'start' }]);
  assert.ok(E.apply(g, 'p1', { type: 'start' }).ok);
  assert.ok(g.turns.p1.done);
});

test('roll 1-2 with a task: must block first, then start', () => {
  const g = setup(2); E.startRound(g, 1);
  E.roll(g, 'p1', 3); E.apply(g, 'p1', { type: 'start' });
  E.roll(g, 'p2', 3); E.apply(g, 'p2', { type: 'start' });
  assert.strictEqual(g.day, 2);
  E.roll(g, 'p1', 2);
  const legal = E.legalActions(g, 'p1');
  assert.deepStrictEqual(legal.map(a => a.type), ['block']);
  assert.strictEqual(E.apply(g, 'p1', { type: 'start' }).ok, false, 'start before block is illegal');
  E.apply(g, 'p1', legal[0]);
  assert.deepStrictEqual(E.legalActions(g, 'p1'), [{ type: 'start' }]);
});

test("cannot touch another player's task while own actions exist", () => {
  const g = setup(2); E.startRound(g, 1);
  E.roll(g, 'p1', 3); E.apply(g, 'p1', { type: 'start' });
  E.roll(g, 'p2', 3); E.apply(g, 'p2', { type: 'start' });
  E.roll(g, 'p1', 3);
  const other = cardsOf(g, 'p2')[0];
  assert.strictEqual(E.apply(g, 'p1', { type: 'move', card: other.id }).ok, false);
});

test('roll 5-6: two actions, never on the same task', () => {
  const g = setup(1); E.startRound(g, 1);
  E.roll(g, 'p1', 3); E.apply(g, 'p1', { type: 'start' });
  const c = Object.values(g.cards)[0];
  E.roll(g, 'p1', 6);
  assert.ok(E.apply(g, 'p1', { type: 'move', card: c.id }).ok);
  assert.strictEqual(E.apply(g, 'p1', { type: 'move', card: c.id }).ok, false);
  assert.deepStrictEqual(E.legalActions(g, 'p1'), [{ type: 'start' }]);
});

test('round 2: WIP limit blocks start, player must help instead', () => {
  const g = setup(2, { wip: { dev: 1, test: 1 } });
  toRound2(g);
  E.roll(g, 'p1', 3); E.apply(g, 'p1', { type: 'start' });
  E.roll(g, 'p2', 3);
  const legal = E.legalActions(g, 'p2');
  assert.ok(legal.every(a => a.help), 'only help actions');
  assert.strictEqual(E.apply(g, 'p2', { type: 'start' }).ok, false);
  assert.ok(E.apply(g, 'p2', legal[0]).ok);
  assert.strictEqual(E.countIn(g, 'test'), 1);
});

test('turn mode: only the active player may roll', () => {
  const g = setup(3, { turnMode: 'turns' }); E.startRound(g, 1);
  assert.strictEqual(E.roll(g, 'p2', 4).ok, false);
  E.roll(g, 'p1', 4); E.apply(g, 'p1', { type: 'start' });
  assert.strictEqual(E.activePlayerId(g), 'p2');
});

// ---------- board configuration ----------
test('rename columns, backlog and done', () => {
  const g = setup(1, { colNames: { dev: 'Build', test: 'Review' }, names: { backlog: 'Ideas', done: 'Live' } });
  assert.deepStrictEqual(E.columns(g).map(c => c.name), ['Build', 'Review']);
  assert.strictEqual(g.settings.names.done, 'Live');
});

test('queue column only between two active columns; structure locked after start', () => {
  const g = setup(1);
  assert.strictEqual(E.togglePassiveAfter(g, 'test').ok, false, 'not after the last active column');
  assert.ok(E.togglePassiveAfter(g, 'dev').ok);
  assert.deepStrictEqual(E.columns(g).map(c => c.type), ['active', 'passive', 'active']);
  assert.ok(E.addActiveColumn(g).ok);
  assert.strictEqual(E.columns(g).length, 4);
  // removing the middle active column also removes the orphaned queue
  assert.ok(E.removeColumn(g, 'test').ok);
  assert.deepStrictEqual(E.columns(g).map(c => c.type), ['active', 'passive', 'active']);
  assert.ok(E.removeColumn(g, E.columns(g)[2].id).ok);
  assert.deepStrictEqual(E.columns(g).map(c => c.id), ['dev'], 'queue cannot be last');
  assert.strictEqual(E.removeColumn(g, 'dev').ok, false, 'at least one active column');
  E.addActiveColumn(g); E.startRound(g, 1);
  assert.strictEqual(E.addActiveColumn(g).ok, false);
  assert.strictEqual(E.togglePassiveAfter(g, 'dev').ok, false);
  assert.ok(E.updateSettings(g, { colNames: { dev: 'Coding' } }).ok, 'renaming still allowed');
});

test('queue column: one move in, one move out, tasks there cannot be blocked', () => {
  const g = setup(1); E.togglePassiveAfter(g, 'dev'); E.startRound(g, 1);
  const q = E.columns(g)[1].id;
  E.roll(g, 'p1', 3); E.apply(g, 'p1', { type: 'start' });
  const c = cardsOf(g, 'p1')[0];
  E.roll(g, 'p1', 3); E.apply(g, 'p1', { type: 'move', card: c.id });
  assert.strictEqual(c.col, q);
  E.roll(g, 'p1', 1);
  assert.deepStrictEqual(g.turns.p1.steps, ['start'], 'block skipped: only task is in a queue');
  E.apply(g, 'p1', { type: 'start' });
  E.roll(g, 'p1', 3); E.apply(g, 'p1', { type: 'move', card: c.id });
  assert.strictEqual(c.col, 'test');
  assert.deepStrictEqual(c.path.map(p => p.c), ['dev', q, 'test']);
});

test('WIP limits can be changed live in round 2 and are logged', () => {
  const g = setup(2, { wip: { dev: 1, test: 1 } });
  toRound2(g);
  E.roll(g, 'p1', 3); E.apply(g, 'p1', { type: 'start' });
  E.roll(g, 'p2', 3);
  assert.ok(E.legalActions(g, 'p2').every(a => a.help));
  const r = E.updateSettings(g, { wip: { dev: 3 } });
  assert.ok(r.ok && r.events.some(e => e.t === 'wipChange'));
  assert.ok(E.legalActions(g, 'p2').some(a => a.type === 'start'), 'start possible again');
  assert.deepStrictEqual(g.history.r2.wipLog, [{ day: 1, col: 'dev', wip: 3 }]);
});

test('WIP suggestion scales with group size', () => {
  const small = setup(3), big = setup(12);
  E.togglePassiveAfter(small, 'dev'); E.togglePassiveAfter(big, 'dev');
  const s = E.suggestWip(small), b = E.suggestWip(big);
  assert.ok(b.dev > s.dev && b.test > s.test);
  assert.ok(Object.keys(s).length === 3);
});

// ---------- urgent tasks ----------
test('urgent tasks: percentage drives the next card; players are not forced to do them first', () => {
  const g = setup(1, { urgentPct: 100 });
  E.startRound(g, 1);
  assert.strictEqual(g.nextUrgent, true);
  E.roll(g, 'p1', 3); E.apply(g, 'p1', { type: 'start' });
  const u = cardsOf(g, 'p1')[0];
  assert.ok(u.urgent);
  g.settings.urgentPct = 0; g.nextUrgent = false;
  E.roll(g, 'p1', 3);
  const l = E.legalActions(g, 'p1');
  assert.ok(l.some(a => a.type === 'start'), 'starting is allowed although an urgent task could move');
  assert.ok(l.some(a => a.type === 'move' && a.card === u.id), 'moving the urgent task is allowed too');
  assert.ok(E.apply(g, 'p1', { type: 'start' }).ok);
  assert.strictEqual(u.col, 'dev', 'urgent task left where it was');
});

test('urgent tasks are not forced when helping either', () => {
  const g = setup(3, { wip: { dev: 2, test: 2 }, urgentPct: 0 });
  toRound2(g);
  E.roll(g, 'p1', 3); E.apply(g, 'p1', { type: 'start' });
  E.roll(g, 'p2', 3); E.apply(g, 'p2', { type: 'start' });
  const [a] = cardsOf(g, 'p1').filter(c => c.round === 2);
  const [b] = cardsOf(g, 'p2').filter(c => c.round === 2);
  a.urgent = true;
  E.roll(g, 'p3', 3); // Development full, p3 has no tasks -> help
  const l = E.legalActions(g, 'p3');
  assert.ok(l.every(x => x.help), 'help mode');
  assert.ok(l.some(x => x.card === a.id) && l.some(x => x.card === b.id), 'urgent and standard tasks both offered');
});

test('urgent tasks never exceed WIP limits', () => {
  const g = setup(2, { wip: { dev: 1, test: 1 }, urgentPct: 100 });
  toRound2(g);
  E.roll(g, 'p1', 3); E.apply(g, 'p1', { type: 'start' });
  assert.ok(g.nextUrgent);
  E.roll(g, 'p2', 3);
  assert.ok(!E.legalActions(g, 'p2').some(a => a.type === 'start'), 'urgent card cannot be started into a full column');
  // an urgent task in Development cannot move into a full Testing column either
  const g2 = setup(1, { wip: { dev: 3, test: 1 } });
  toRound2(g2);
  E.roll(g2, 'p1', 5); E.apply(g2, 'p1', { type: 'start' }); E.apply(g2, 'p1', { type: 'start' }); // d1
  const [a, b] = cardsOf(g2, 'p1');
  b.urgent = true;
  E.roll(g2, 'p1', 3); E.apply(g2, 'p1', { type: 'move', card: b.id });     // d2: urgent b -> test (fills it)
  a.urgent = true;
  E.roll(g2, 'p1', 6);                                                       // d3
  assert.ok(!E.legalActions(g2, 'p1').some(x => x.card === a.id && x.type === 'move'), 'urgent a blocked by full Testing');
});

test('0% urgent never produces urgent tasks', () => {
  const g = setup(4); E.startRound(g, 1);
  for (let i = 0; i < 200; i++) { E.updateSettings(g, {}); }
  assert.strictEqual(g.nextUrgent, false);
});

test('metrics: queue waiting time, flow efficiency, urgent vs standard', () => {
  const g = setup(1); E.togglePassiveAfter(g, 'dev'); E.updateSettings(g, { days: 8 }); E.startRound(g, 1);
  const q = E.columns(g)[1].id;
  E.roll(g, 'p1', 3); E.apply(g, 'p1', { type: 'start' });          // d1 start dev
  const c = cardsOf(g, 'p1')[0];
  E.roll(g, 'p1', 3); E.apply(g, 'p1', { type: 'move', card: c.id }); // d2 -> queue
  E.roll(g, 'p1', 3); E.apply(g, 'p1', { type: 'start' });          // d3
  E.roll(g, 'p1', 3); E.apply(g, 'p1', { type: 'start' });          // d4
  E.roll(g, 'p1', 3); E.apply(g, 'p1', { type: 'move', card: c.id }); // d5 -> test
  E.roll(g, 'p1', 3); E.apply(g, 'p1', { type: 'move', card: c.id }); // d6 -> done
  const m = E.metrics(g, 1);
  assert.strictEqual(m.finished, 1);
  assert.strictEqual(m.p85CycleTime, 6);
  assert.strictEqual(m.p85Wait, 3);
  assert.strictEqual(m.flowEfficiency, 0.5);
  assert.strictEqual(m.p85CtStandard, 6);
  assert.strictEqual(m.p85CtUrgent, null);
  // 85th percentile of daily WIP over the played days (nearest rank)
  const wips = m.days.filter(d => d.day > 0).map(d => d.wip).sort((p, q) => p - q);
  assert.strictEqual(m.p85Wip, wips[Math.ceil(0.85 * wips.length) - 1]);
  assert.ok(m.days.find(d => d.day === 3).c[q] === 1);
});

test('backlog shows the next 5 tasks and refills as tasks are started', () => {
  const g = setup(2, { urgentPct: 50 });
  E.startRound(g, 1);
  assert.strictEqual(E.upcomingTasks(g).length, 5);
  assert.deepStrictEqual(E.upcomingTasks(g).map(x => x.no), [1, 2, 3, 4, 5]);
  const preview = E.upcomingTasks(g)[0];
  E.roll(g, 'p1', 3); E.apply(g, 'p1', { type: 'start' });
  const c = cardsOf(g, 'p1')[0];
  assert.strictEqual(c.no, preview.no);
  assert.strictEqual(!!c.urgent, preview.urgent, 'started task matches the previewed card');
  assert.deepStrictEqual(E.upcomingTasks(g).map(x => x.no), [2, 3, 4, 5, 6], 'a new task is added at the bottom');
  assert.strictEqual(g.nextUrgent, E.upcomingTasks(g)[0].urgent);
});

test('avatars: stored per player, one avatar per player', () => {
  const g = E.newGame('fac');
  assert.ok(E.addPlayer(g, 'p1', 'Ala', 'ninja-red').ok);
  assert.strictEqual(g.players.p1.avatar, 'ninja-red');
  assert.strictEqual(E.addPlayer(g, 'p2', 'Bob', 'ninja-red').error, 'avatarTaken');
  assert.ok(E.addPlayer(g, 'p2', 'Bob', 'robot').ok);
  assert.ok(E.addPlayer(g, 'p3', 'Cyd', 'bad id!').ok, 'invalid id ignored');
  assert.strictEqual(g.players.p3.avatar, '');
});

test('work steps can be marked Analysis or Execution at any time', () => {
  const g = setup(2);
  assert.deepStrictEqual(E.columns(g).map(c => c.kind), ['execution', 'execution']);
  E.startRound(g, 1);
  assert.ok(E.updateSettings(g, { colKinds: { dev: 'analysis' } }).ok);
  assert.strictEqual(E.colById(g, 'dev').kind, 'analysis');
  E.updateSettings(g, { colKinds: { dev: 'nonsense' } });
  assert.strictEqual(E.colById(g, 'dev').kind, 'execution');
});

test('sessions saved by version 1 are upgraded', () => {
  const g = E.newGame('f'); delete g.settings.columns; g.settings.wip = { dev: 4, test: 5 };
  E.norm(g);
  assert.deepStrictEqual(E.columns(g).map(c => [c.id, c.wip]), [['dev', 4], ['test', 5]]);
});

test('Firebase-style objects instead of arrays are normalised', () => {
  const g = setup(1); E.togglePassiveAfter(g, 'dev');
  const raw = JSON.parse(JSON.stringify(g));
  raw.settings.columns = Object.assign({}, raw.settings.columns);
  E.norm(raw);
  assert.ok(Array.isArray(raw.settings.columns) && raw.settings.columns.length === 3);
});

// ---- fuzz: random boards, random players and choices; invariants must always hold ----
const fuzzStats = { r1: 0, r2: 0, ct1: 0, ct2: 0, w1: 0, w2: 0 };
const N = 2000;
function fuzz(games) {
  for (let n = 0; n < games; n++) {
    const players = 2 + (n % 9);
    const g = setup(players, { days: 12, turnMode: n % 2 ? 'turns' : 'simultaneous' });
    // random board
    const actives = 1 + (n % 4);
    for (let i = 1; i < actives; i++) E.addActiveColumn(g);
    E.columns(g).filter(c => c.type === 'active').slice(0, -1).forEach(c => { if (Math.random() < .5) E.togglePassiveAfter(g, c.id); });
    const wip = {}; E.columns(g).forEach(c => { wip[c.id] = Math.random() < .1 ? 0 : 1 + Math.floor(Math.random() * 4); });
    const urgentPct = [0, 0, 10, 25, 50][n % 5];
    E.updateSettings(g, { wip, urgentPct });
    for (const r of [1, 2]) {
      E.startRound(g, r);
      let guard = 0;
      while (g.phase === 'playing' && guard++ < 5000) {
        const ids = Object.keys(g.players).sort(() => Math.random() - .5);
        for (const p of ids) {
          if (!E.canAct(g, p)) continue;
          if (!g.turns[p] || !g.turns[p].roll) { E.roll(g, p); continue; }
          const l = E.legalActions(g, p);
          if (!l.length) continue;
          const touched = Object.assign({}, g.turns[p].touched);
          const a = l[Math.floor(Math.random() * l.length)];
          if (a.card) assert.ok(!touched[a.card], 'same task twice in a day');
          if (a.type === 'block') assert.ok(E.isActive(g, g.cards[a.card].col), 'block only in active columns');
          assert.ok(E.apply(g, p, a).ok);
          if (r === 2) for (const c of E.columns(g)) {
            const lim = E.limitOf(g, c.id); if (!lim) continue;
            const inCol = E.roundCards(g).filter(x => x.col === c.id);
            assert.ok(inCol.length <= lim, `WIP exceeded in ${c.id}: ${inCol.length} > ${lim}`);
          }
        }
      }
      assert.strictEqual(g.phase, 'roundEnd');
    }
    const m1 = E.metrics(g, 1), m2 = E.metrics(g, 2);
    assert.strictEqual(m1.daysPlayed, 12); assert.strictEqual(m2.daysPlayed, 12);
    if (m1.hasQueues && m1.finished) assert.ok(m1.flowEfficiency > 0 && m1.flowEfficiency <= 1);
    if (n % 5 === 0) {
      fuzzStats.r1 += m1.finished; fuzzStats.r2 += m2.finished;
      fuzzStats.ct1 += m1.p85CycleTime || 0; fuzzStats.ct2 += m2.p85CycleTime || 0;
      fuzzStats.w1 += m1.p85Wip; fuzzStats.w2 += m2.p85Wip; fuzzStats.k = (fuzzStats.k || 0) + 1;
    }
  }
}
test(`fuzz ${N} random games (random boards, urgent %, WIP): rules never violated`, () => fuzz(N));
console.log(`\n${passed} tests passed.`);
const k = fuzzStats.k;
console.log(`Default-ish sample  R1: done ${(fuzzStats.r1 / k).toFixed(1)}, WIP ${(fuzzStats.w1 / k).toFixed(1)}, CT ${(fuzzStats.ct1 / k).toFixed(1)}d` +
  `   R2: done ${(fuzzStats.r2 / k).toFixed(1)}, WIP ${(fuzzStats.w2 / k).toFixed(1)}, CT ${(fuzzStats.ct2 / k).toFixed(1)}d`);
