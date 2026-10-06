/*
 * Sync layer. Two interchangeable back-ends with the same interface:
 *   - Firebase Realtime Database (real online sessions)
 *   - Local test mode (BroadcastChannel + localStorage, tabs of one browser)
 *
 * Every game change is a transaction: the engine mutation runs against the
 * latest shared state and is retried automatically if someone else changed
 * the board in the meantime, so two players can never both take the last
 * WIP slot.
 */
(function () {
  'use strict';
  var FB_VERSION = '10.12.2';
  var FB = 'https://www.gstatic.com/firebasejs/' + FB_VERSION + '/';

  function plain(o) { return JSON.parse(JSON.stringify(o)); }

  // ------------------------------------------------------------ Firebase
  async function firebaseAdapter(cfg) {
    var appMod = await import(FB + 'firebase-app.js');
    var dbm = await import(FB + 'firebase-database.js');
    var authm = await import(FB + 'firebase-auth.js');
    var app = appMod.initializeApp(cfg);
    await authm.signInAnonymously(authm.getAuth(app));
    var db = dbm.getDatabase(app);
    var r = function (p) { return dbm.ref(db, p); };

    return {
      kind: 'firebase',
      exists: async function (code) {
        return (await dbm.get(r('sessions/' + code + '/game/phase'))).exists();
      },
      create: async function (code, game) {
        var res = await dbm.runTransaction(r('sessions/' + code + '/game'), function (cur) {
          if (cur !== null) return; // abort: code taken
          return plain(game);
        });
        return res.committed;
      },
      watch: function (code, cb) {
        return dbm.onValue(r('sessions/' + code + '/game'), function (s) { cb(s.val()); });
      },
      transact: async function (code, mutate) {
        var result = { ok: false, error: 'noSession', events: [] };
        var res = await dbm.runTransaction(r('sessions/' + code + '/game'), function (cur) {
          if (cur === null) { result = { ok: false, error: 'noSession', events: [] }; return null; }
          var g = Engine.norm(cur);
          result = mutate(g);
          if (!result.ok) return; // abort, nothing written
          return plain(g);
        });
        if (!res.committed && result.ok) result = { ok: false, error: 'conflict', events: [] };
        return result;
      },
      addLog: function (code, entries) {
        entries.forEach(function (e) {
          e.ts = dbm.serverTimestamp();
          dbm.push(r('sessions/' + code + '/log'), plain(e));
        });
      },
      watchLog: function (code, cb) {
        var q = dbm.query(r('sessions/' + code + '/log'), dbm.limitToLast(150));
        return dbm.onValue(q, function (s) {
          var out = []; s.forEach(function (c) { out.push(c.val()); }); cb(out);
        });
      },
      presence: function (code, pid) {
        var me = r('sessions/' + code + '/presence/' + pid);
        dbm.onValue(r('.info/connected'), function (s) {
          if (s.val() !== true) return;
          dbm.onDisconnect(me).remove().then(function () { dbm.set(me, true); });
        });
      },
      watchPresence: function (code, cb) {
        return dbm.onValue(r('sessions/' + code + '/presence'), function (s) { cb(s.val() || {}); });
      }
    };
  }

  // ------------------------------------------------------------ Local test mode
  function localAdapter() {
    var bc = 'BroadcastChannel' in window ? new BroadcastChannel('kfg-local') : null;
    var listeners = [];
    function key(code, k) { return 'kfg:' + code + ':' + k; }
    function read(code, k, d) { try { return JSON.parse(localStorage.getItem(key(code, k))) || d; } catch (e) { return d; } }
    function write(code, k, v) { localStorage.setItem(key(code, k), JSON.stringify(v)); }
    function notify(code, k) {
      listeners.forEach(function (l) { if (l.code === code && l.k === k) l.cb(); });
      if (bc) bc.postMessage({ code: code, k: k });
    }
    if (bc) bc.onmessage = function (m) {
      listeners.forEach(function (l) { if (l.code === m.data.code && l.k === m.data.k) l.cb(); });
    };
    function listen(code, k, cb) {
      var l = { code: code, k: k, cb: cb }; listeners.push(l); cb();
      return function () { listeners = listeners.filter(function (x) { return x !== l; }); };
    }
    function locked(code, fn) {
      if (navigator.locks) return navigator.locks.request(key(code, 'lock'), fn);
      return Promise.resolve().then(fn);
    }
    return {
      kind: 'local',
      exists: async function (code) { return !!read(code, 'game', null); },
      create: async function (code, game) {
        return locked(code, function () {
          if (read(code, 'game', null)) return false;
          write(code, 'game', game); notify(code, 'game'); return true;
        });
      },
      watch: function (code, cb) { return listen(code, 'game', function () { cb(read(code, 'game', null)); }); },
      transact: function (code, mutate) {
        return locked(code, function () {
          var cur = read(code, 'game', null);
          if (!cur) return { ok: false, error: 'noSession', events: [] };
          var g = Engine.norm(cur);
          var res = mutate(g);
          if (res.ok) { write(code, 'game', plain(g)); notify(code, 'game'); }
          return res;
        });
      },
      addLog: function (code, entries) {
        var log = read(code, 'log', []);
        entries.forEach(function (e) { e.ts = Date.now(); log.push(plain(e)); });
        write(code, 'log', log.slice(-150)); notify(code, 'log');
      },
      watchLog: function (code, cb) { return listen(code, 'log', function () { cb(read(code, 'log', [])); }); },
      presence: function (code, pid) {
        function beat() { var p = read(code, 'pres', {}); p[pid] = Date.now(); write(code, 'pres', p); }
        beat(); setInterval(beat, 2000);
      },
      watchPresence: function (code, cb) {
        function tick() {
          var p = read(code, 'pres', {}), now = Date.now(), on = {};
          Object.keys(p).forEach(function (k) { if (now - p[k] < 6000) on[k] = true; });
          cb(on);
        }
        tick(); var t = setInterval(tick, 2000);
        return function () { clearInterval(t); };
      }
    };
  }

  window.Sync = {
    connect: async function (cfg) {
      if (cfg && cfg.firebase) return firebaseAdapter(cfg.firebase);
      return localAdapter();
    }
  };
})();
