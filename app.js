/* Kanban Flow Game — UI */
(function () {
  'use strict';
  var CFG = window.APP_CONFIG || {};
  var E = window.Engine;

  // ================================================================ i18n
  var I18N = {
    en: {
      tagline: 'A Featureban-style Kanban simulation for online workshops. Everyone plays on the same live board from their own browser.',
      heroA: 'Feel the flow.', heroB: 'Stop starting, start finishing.',
      hostTitle: 'Host a session', hostText: 'Create a board, share the code, and guide your group through two rounds: without and with WIP limits.',
      hostBtn: 'Create new session',
      joinTitle: 'Join a session', joinText: 'Enter the code your facilitator shared.', joinBtn: 'Join',
      codePh: 'CODE',
      testMode: '<b>Test mode</b> – no database configured. Sessions sync only between tabs of this browser. Open several tabs to rehearse; add a Firebase config in <span class="mono">config.js</span> to play online.',
      notFound: 'Session <b>{code}</b> not found.', backHome: 'Back to start',
      joinAs: 'Join session {code}', yourName: 'Your name', namePh: 'e.g. Anna', enter: 'Enter the board',
      reclaim: 'Rejoining? Pick yourself:', orNew: 'Or join as someone new',
      session: 'Session', round: 'Round', day: 'Day', lobby: 'Lobby', of: 'of',
      copyInvite: 'Copy invite link', copied: 'Copied to clipboard',
      facilitator: 'Facilitator', you: 'you',
      colBacklog: 'Backlog', colDev: 'Development', colTest: 'Testing', colDone: 'Done',
      blocked: 'BLOCKED', startNew: 'Start a new task', stopStart: 'WIP limit reached — stop starting, start finishing!',
      tip_move: 'move →', tip_block: 'block', tip_unblock: 'unblock', tip_help_move: 'help: move →', tip_help_unblock: 'help: unblock',
      emptyCol: 'No tasks',
      // turn panel
      yourTurn: 'Your turn', waitStart: 'You\'re in! Waiting for the facilitator to start the round.',
      rollPrompt: 'Roll the die', rollSub: 'Click the die to see what you can do today.',
      waitFor: 'Waiting for {name} to play…', doneDay: 'Done for day {day} ✓', doneSub: 'Waiting for the others ({n} of {m} finished).',
      step_block: 'Block one of your tasks — click a highlighted card.',
      step_start: 'Start a new task — use the button in Backlog.',
      step_any: 'Move, unblock or start: click a highlighted card or start a new task.',
      step_help: 'You can\'t act on your own tasks — help a teammate: move or unblock one of their tasks.',
      actionN: 'Action {n}', blockStep: 'Block', startStep: 'Start',
      roundOver: 'Round {n} finished', roundOverSub: 'Have a look at the results while the facilitator prepares the next step.',
      // rules
      rules: 'Rules', r12: '<b>Block</b> one of your tasks <b>and</b> start a new task.',
      r34: 'Do <b>one</b>: move your task, unblock your task or start a new task.',
      r56: 'Do <b>two</b>: move your task, unblock your task, start a new task. Never two actions on the same task in one day.',
      rHelp: 'Can\'t do any of the above? Pair up and help: unblock or move someone else\'s task.',
      rNoWip: 'Round 1: no WIP limits.',
      rWip: 'Round 2 WIP limits: {list}. Blocked tasks count too.',
      // players & log
      team: 'Team', log: 'Activity', noPlayers: 'No players yet — share the code.',
      st_done: '✓ done', st_playing: '▶ playing', st_wait: '…', st_rolled: '🎲 {v}',
      skip: 'skip', remove: 'Remove {name} from the game?',
      l_join: '{name} joined', l_leave: '{name} left', l_roll: '{name} rolled {value}',
      l_start: '{name} started #{no}', l_block: '{name} blocked #{no}', l_unblock: '{name} unblocked #{no}',
      l_move: '{name} moved #{no} to {to}', l_help_unblock: '{name} helped {owner}: unblocked #{no}',
      l_help_move: '{name} helped {owner}: moved #{no} to {to}', l_skip: '{name}: no possible action',
      l_skipTurn: 'Facilitator ended {name}\'s turn', l_dayEnd: '— Day {day} finished —',
      l_roundStart: '=== Round {round} started ===', l_roundEnd: '=== Round {round} finished ===',
      // facilitator
      facPanel: 'Facilitator controls', invite: 'Invite code', facLink: 'Copy my facilitator link',
      facLinkHint: 'Keep this link to return as facilitator from another device.',
      daysPerRound: 'Days per round', turnMode: 'Turn order', tm_sim: 'Everyone plays at once (faster)', tm_turns: 'One player at a time (like the table game)',
      autoAdv: 'Start the next day automatically when everyone is done',
      startR1: 'Start round 1 (no WIP limits)', startR2: 'Start round 2 (with WIP limits)',
      needPlayers: 'Waiting for players to join…',
      dayProgress: 'Day {day} of {days}', playersDone: '{n} of {m} players done',
      nextDay: 'Next day', nextDayConfirm: 'Not everyone has finished. Skip the remaining players and start the next day?',
      endRound: 'End round now', endRoundConfirm: 'End this round now?',
      wipTitle: 'WIP limits for round 2',
      wipSuggest: 'Suggestion for {n} players: {list}', apply: 'Apply',
      showResults: 'Show debrief to everyone', r1done: 'Round 1 is over. Discuss what happened, then set the WIP limits.',
      r2done: 'Both rounds are done. Open the debrief to compare them.',
      // results
      resultsTitle: 'Round {n} results', debriefTitle: 'Debrief: what did limiting WIP change?',
      k_finished: 'Tasks finished', k_started: 'Tasks started', k_ct: 'Avg cycle time', k_ct85: '85% of tasks done within',
      k_wip: 'Avg work in progress', k_tp: 'Throughput / day', k_wipEnd: 'Unfinished at end', k_helped: 'Tasks with help',
      days_u: 'days', nPlayers: '{n} players', r1: 'Round 1', r2: 'Round 2', noWip: 'no WIP limits', withWip: 'WIP {dev}/{test}',
      cfd: 'Cumulative flow', ctDist: 'Cycle time distribution', ctAxis: 'cycle time (days)', tasksAxis: 'tasks',
      questions: 'Questions for the debrief',
      q1: 'How did it feel to start new work in round 1? What happened to the board?',
      q2: 'What changed when WIP limits forced you to stop starting?',
      q3: 'Compare average WIP, throughput and cycle time. Can you see Little\'s Law at work?',
      q4: 'How did blocked tasks affect each round? Who unblocked them?',
      q5: 'What made you help others in round 2? What would that look like in your real team?',
      q6: 'Which WIP limits would you try on your own board, and how would you know they work?',
      csv: 'Download data (CSV)', newSession: 'New session', backToBoard: 'Back to board',
      // errors
      e_illegal: 'The board changed in the meantime — choose again.', e_conflict: 'Someone was faster — the board was updated.',
      e_notYourTurn: 'Not your turn yet.', e_alreadyRolled: 'You already rolled today.', e_noSession: 'Session not found.',
      e_badPhase: 'Not possible at this stage.', e_noPlayers: 'At least one player must join first.', e_nameRequired: 'Please enter your name.',
      e_generic: 'Something went wrong: {msg}', connecting: 'Connecting…',
      e_fb: 'Could not connect to Firebase. Check config.js and that Anonymous sign-in and the Realtime Database are enabled. ({msg})',
      colStep: 'Step {n}', colWait: 'Ready for {next}', queue: 'queue · waiting', urgent: 'URGENT',
      urgentFirstShort: 'Urgent first — move or unblock your urgent task.',
      step_urgent: 'Urgent first: move or unblock your highlighted urgent task.',
      urgentHelp: 'Urgent tasks come first.',
      rQueue: 'Queue columns ({names}) are waiting areas: no work happens there and tasks there can\'t be blocked. Moving a task in and moving it out take one action each.',
      rUrgent: 'Urgent tasks (about {p}% of new tasks): if you can move or unblock your urgent task, you must do that first. When helping, urgent tasks come first too.',
      rNoExpedite: 'Urgent tasks still respect WIP limits.',
      boardSetup: 'Board', setupBtn: 'Board & rules setup', renameBtn: 'Rename columns',
      setupTitle: 'Board & rules setup', columnsTitle: 'Columns & WIP limits',
      colType: 'Type', colNameH: 'Name', typeBacklog: 'Backlog', typeDone: 'Done', typeActive: 'Work step', typeQueue: 'Queue',
      addStep: 'Add work step', addQueue: 'Add queue between {a} and {b}', removeCol: 'Remove column',
      queueHelp: 'A queue is a passive column between two work steps (e.g. “Ready for Testing”). It makes waiting time visible: tasks sit there until someone pulls them into the next step.',
      structLocked: 'The board structure is fixed once round 1 has started, so both rounds can be compared. Names and WIP limits can still be changed.',
      wipR2: 'WIP limit (round 2)', wipHint: '0 = no limit.', wipLive: 'Changes apply to the board immediately and are recorded for the debrief.',
      wipTitleLive: 'WIP limits (live)', wipNoPlayers: 'A suggestion based on group size appears once players have joined.',
      urgentTitle: 'Urgent tasks', urgentPct: 'Share of new tasks that are urgent',
      urgentShort: 'Urgent',
      urgentHelp2: 'The next card in the backlog shows whether it is urgent. Players must work on their urgent tasks first. Settings for round 2 can be changed after round 1.',
      urgentLocked: 'Urgent settings can be changed between rounds.',
      done: 'Done', close: 'Close',
      l_wipChange: 'Facilitator set the WIP limit of {col} to {wip}',
      k_wait: 'Avg time waiting in queues', k_fe: 'Flow efficiency', k_ctUrgent: 'Avg cycle time · urgent', k_ctStd: 'Avg cycle time · standard', k_urgentDone: 'Urgent tasks finished',
      wipChanged: 'WIP limits changed during round 2:', allTasks: 'all tasks', urgentTasks: 'urgent tasks',
      q7: 'What happened to the standard work whenever an urgent task appeared? What does that cost in your real work?',
      q8: 'Where did tasks wait the longest? What would shorten that waiting time?',
      footer: 'Inspired by Featureban, a game by Mike Burrows.'
    },
    pl: {
      tagline: 'Symulacja Kanban w stylu Featureban do warsztatów online. Wszyscy grają na tej samej, żywej tablicy — każdy we własnej przeglądarce.',
      heroA: 'Poczuj przepływ.', heroB: 'Przestań zaczynać, zacznij kończyć.',
      hostTitle: 'Poprowadź sesję', hostText: 'Utwórz tablicę, udostępnij kod i przeprowadź grupę przez dwie rundy: bez limitów WIP i z limitami.',
      hostBtn: 'Utwórz nową sesję',
      joinTitle: 'Dołącz do sesji', joinText: 'Wpisz kod od prowadzącego.', joinBtn: 'Dołącz',
      codePh: 'KOD',
      testMode: '<b>Tryb testowy</b> – brak skonfigurowanej bazy. Sesje synchronizują się tylko między kartami tej przeglądarki. Otwórz kilka kart, żeby przećwiczyć; dodaj konfigurację Firebase w <span class="mono">config.js</span>, aby grać online.',
      notFound: 'Nie znaleziono sesji <b>{code}</b>.', backHome: 'Wróć na start',
      joinAs: 'Dołącz do sesji {code}', yourName: 'Twoje imię', namePh: 'np. Anna', enter: 'Wejdź na tablicę',
      reclaim: 'Wracasz? Wybierz siebie:', orNew: 'Albo dołącz jako nowa osoba',
      session: 'Sesja', round: 'Runda', day: 'Dzień', lobby: 'Poczekalnia', of: 'z',
      copyInvite: 'Kopiuj zaproszenie', copied: 'Skopiowano',
      facilitator: 'Prowadzący', you: 'ty',
      colBacklog: 'Backlog', colDev: 'Wytwarzanie', colTest: 'Testy', colDone: 'Gotowe',
      blocked: 'BLOKADA', startNew: 'Zacznij nowe zadanie', stopStart: 'Limit WIP osiągnięty — przestań zaczynać, zacznij kończyć!',
      tip_move: 'przesuń →', tip_block: 'zablokuj', tip_unblock: 'odblokuj', tip_help_move: 'pomóż: przesuń →', tip_help_unblock: 'pomóż: odblokuj',
      emptyCol: 'Brak zadań',
      yourTurn: 'Twój ruch', waitStart: 'Jesteś w grze! Czekamy, aż prowadzący rozpocznie rundę.',
      rollPrompt: 'Rzuć kostką', rollSub: 'Kliknij kostkę, żeby zobaczyć, co możesz dziś zrobić.',
      waitFor: 'Czekamy na ruch: {name}…', doneDay: 'Dzień {day} zakończony ✓', doneSub: 'Czekamy na pozostałych ({n} z {m} gotowych).',
      step_block: 'Zablokuj jedno ze swoich zadań — kliknij podświetloną kartę.',
      step_start: 'Zacznij nowe zadanie — przycisk w Backlogu.',
      step_any: 'Przesuń, odblokuj lub zacznij: kliknij podświetloną kartę albo zacznij nowe zadanie.',
      step_help: 'Nie możesz nic zrobić ze swoimi zadaniami — pomóż innej osobie: przesuń lub odblokuj jej zadanie.',
      actionN: 'Akcja {n}', blockStep: 'Blokada', startStep: 'Start',
      roundOver: 'Runda {n} zakończona', roundOverSub: 'Przyjrzyj się wynikom, a prowadzący przygotuje kolejny krok.',
      rules: 'Zasady', r12: '<b>Zablokuj</b> jedno ze swoich zadań <b>oraz</b> rozpocznij nowe.',
      r34: 'Wykonaj <b>jedną</b> akcję: przesuń swoje zadanie, odblokuj swoje zadanie albo zacznij nowe.',
      r56: 'Wykonaj <b>dwie</b> akcje: przesuń, odblokuj, zacznij nowe. Nie wykonuj dwóch akcji na jednym zadaniu tego samego dnia.',
      rHelp: 'Nie możesz wykonać żadnej z akcji? Pomóż innej osobie: odblokuj lub przesuń jej zadanie.',
      rNoWip: 'Runda 1: bez limitów WIP.',
      rWip: 'Limity WIP w rundzie 2: {list}. Zablokowane zadania też się liczą.',
      team: 'Zespół', log: 'Aktywność', noPlayers: 'Brak graczy — udostępnij kod.',
      st_done: '✓ gotowe', st_playing: '▶ gra', st_wait: '…', st_rolled: '🎲 {v}',
      skip: 'pomiń', remove: 'Usunąć {name} z gry?',
      l_join: '{name} dołącza', l_leave: '{name} opuszcza grę', l_roll: '{name} wyrzuca {value}',
      l_start: '{name} zaczyna #{no}', l_block: '{name} blokuje #{no}', l_unblock: '{name} odblokowuje #{no}',
      l_move: '{name} przesuwa #{no} do: {to}', l_help_unblock: '{name} pomaga ({owner}): odblokowuje #{no}',
      l_help_move: '{name} pomaga ({owner}): przesuwa #{no} do: {to}', l_skip: '{name}: brak możliwej akcji',
      l_skipTurn: 'Prowadzący kończy ruch: {name}', l_dayEnd: '— Koniec dnia {day} —',
      l_roundStart: '=== Start rundy {round} ===', l_roundEnd: '=== Koniec rundy {round} ===',
      facPanel: 'Panel prowadzącego', invite: 'Kod zaproszenia', facLink: 'Kopiuj mój link prowadzącego',
      facLinkHint: 'Zachowaj ten link, żeby wrócić jako prowadzący z innego urządzenia.',
      daysPerRound: 'Dni w rundzie', turnMode: 'Kolejność ruchów', tm_sim: 'Wszyscy jednocześnie (szybciej)', tm_turns: 'Po kolei (jak w grze stołowej)',
      autoAdv: 'Automatycznie zaczynaj kolejny dzień, gdy wszyscy skończą',
      startR1: 'Start rundy 1 (bez limitów WIP)', startR2: 'Start rundy 2 (z limitami WIP)',
      needPlayers: 'Czekamy, aż dołączą gracze…',
      dayProgress: 'Dzień {day} z {days}', playersDone: '{n} z {m} graczy gotowych',
      nextDay: 'Następny dzień', nextDayConfirm: 'Nie wszyscy skończyli. Pominąć pozostałych i zacząć kolejny dzień?',
      endRound: 'Zakończ rundę teraz', endRoundConfirm: 'Zakończyć rundę teraz?',
      wipTitle: 'Limity WIP na rundę 2',
      wipSuggest: 'Propozycja dla {n} graczy: {list}', apply: 'Zastosuj',
      showResults: 'Pokaż podsumowanie wszystkim', r1done: 'Runda 1 zakończona. Omówcie, co się stało, potem ustaw limity WIP.',
      r2done: 'Obie rundy zakończone. Otwórz podsumowanie, żeby je porównać.',
      resultsTitle: 'Wyniki rundy {n}', debriefTitle: 'Podsumowanie: co zmieniło ograniczenie WIP?',
      k_finished: 'Ukończone zadania', k_started: 'Rozpoczęte zadania', k_ct: 'Śr. czas cyklu', k_ct85: '85% zadań ukończonych w',
      k_wip: 'Śr. praca w toku (WIP)', k_tp: 'Przepustowość / dzień', k_wipEnd: 'Nieukończone na koniec', k_helped: 'Zadania z pomocą',
      days_u: 'dni', nPlayers: 'graczy: {n}', r1: 'Runda 1', r2: 'Runda 2', noWip: 'bez limitów WIP', withWip: 'WIP {dev}/{test}',
      cfd: 'Skumulowany przepływ (CFD)', ctDist: 'Rozkład czasu cyklu', ctAxis: 'czas cyklu (dni)', tasksAxis: 'zadania',
      questions: 'Pytania do omówienia',
      q1: 'Jak się czuliście, zaczynając nowe zadania w rundzie 1? Co stało się z tablicą?',
      q2: 'Co się zmieniło, gdy limity WIP zmusiły was, by przestać zaczynać?',
      q3: 'Porównajcie średni WIP, przepustowość i czas cyklu. Widać prawo Little\'a?',
      q4: 'Jak blokady wpłynęły na każdą z rund? Kto je usuwał?',
      q5: 'Co skłoniło was do pomagania innym w rundzie 2? Jak to wyglądałoby w waszym zespole?',
      q6: 'Jakie limity WIP wypróbowalibyście na swojej tablicy i po czym poznacie, że działają?',
      csv: 'Pobierz dane (CSV)', newSession: 'Nowa sesja', backToBoard: 'Wróć do tablicy',
      e_illegal: 'Tablica zmieniła się w międzyczasie — wybierz ponownie.', e_conflict: 'Ktoś był szybszy — tablica została zaktualizowana.',
      e_notYourTurn: 'To jeszcze nie twój ruch.', e_alreadyRolled: 'Już rzucałeś/-aś dzisiaj.', e_noSession: 'Nie znaleziono sesji.',
      e_badPhase: 'Na tym etapie to niemożliwe.', e_noPlayers: 'Najpierw musi dołączyć co najmniej jeden gracz.', e_nameRequired: 'Wpisz swoje imię.',
      e_generic: 'Coś poszło nie tak: {msg}', connecting: 'Łączenie…',
      e_fb: 'Nie udało się połączyć z Firebase. Sprawdź config.js oraz czy włączone są logowanie anonimowe i Realtime Database. ({msg})',
      colStep: 'Krok {n}', colWait: 'Czeka na: {next}', queue: 'kolejka · oczekiwanie', urgent: 'PILNE',
      urgentFirstShort: 'Najpierw pilne — przesuń lub odblokuj swoje pilne zadanie.',
      step_urgent: 'Najpierw pilne: przesuń lub odblokuj podświetlone pilne zadanie.',
      urgentHelp: 'Pilne zadania mają pierwszeństwo.',
      rQueue: 'Kolumny-kolejki ({names}) to miejsca oczekiwania: nikt tam nie pracuje, a zadań w nich nie da się zablokować. Wejście do kolejki i wyjście z niej to osobne akcje.',
      rUrgent: 'Pilne zadania (ok. {p}% nowych zadań): jeśli możesz przesunąć lub odblokować swoje pilne zadanie, musisz zrobić to najpierw. Pomagając innym, też zaczynasz od pilnych.',
      rNoExpedite: 'Pilne zadania też podlegają limitom WIP.',
      boardSetup: 'Tablica', setupBtn: 'Ustawienia tablicy i zasad', renameBtn: 'Zmień nazwy kolumn',
      setupTitle: 'Ustawienia tablicy i zasad', columnsTitle: 'Kolumny i limity WIP',
      colType: 'Typ', colNameH: 'Nazwa', typeBacklog: 'Backlog', typeDone: 'Gotowe', typeActive: 'Etap pracy', typeQueue: 'Kolejka',
      addStep: 'Dodaj etap pracy', addQueue: 'Dodaj kolejkę między: {a} i {b}', removeCol: 'Usuń kolumnę',
      queueHelp: 'Kolejka to pasywna kolumna między dwoma etapami pracy (np. „Czeka na testy”). Pokazuje czas oczekiwania: zadania czekają tam, aż ktoś pobierze je do kolejnego etapu.',
      structLocked: 'Po starcie rundy 1 układ tablicy jest zablokowany, żeby obie rundy dało się porównać. Nazwy i limity WIP nadal można zmieniać.',
      wipR2: 'Limit WIP (runda 2)', wipHint: '0 = bez limitu.', wipLive: 'Zmiany działają od razu i są zapisywane do podsumowania.',
      wipTitleLive: 'Limity WIP (na żywo)', wipNoPlayers: 'Propozycja dopasowana do liczby graczy pojawi się, gdy dołączą gracze.',
      urgentTitle: 'Pilne zadania', urgentPct: 'Odsetek nowych zadań, które są pilne',
      urgentShort: 'Pilne',
      urgentHelp2: 'Kolejna karta w backlogu pokazuje, czy jest pilna. Gracze muszą najpierw zająć się swoimi pilnymi zadaniami. Ustawienia na rundę 2 można zmienić po rundzie 1.',
      urgentLocked: 'Ustawienia pilnych zadań można zmieniać między rundami.',
      done: 'Gotowe', close: 'Zamknij',
      l_wipChange: 'Prowadzący ustawia limit WIP dla: {col} na {wip}',
      k_wait: 'Śr. czas oczekiwania w kolejkach', k_fe: 'Efektywność przepływu', k_ctUrgent: 'Śr. czas cyklu · pilne', k_ctStd: 'Śr. czas cyklu · standardowe', k_urgentDone: 'Ukończone pilne zadania',
      wipChanged: 'Zmiany limitów WIP w rundzie 2:', allTasks: 'wszystkie zadania', urgentTasks: 'pilne zadania',
      q7: 'Co działo się ze standardową pracą, gdy pojawiało się pilne zadanie? Ile to kosztuje w waszej prawdziwej pracy?',
      q8: 'Gdzie zadania czekały najdłużej? Co skróciłoby ten czas oczekiwania?',
      footer: 'Na podstawie gry Featureban autorstwa Mike\'a Burrowsa.'
    }
  };
  var lang = localStorage.getItem('kfg:lang') || CFG.defaultLang || 'en';
  if (!I18N[lang]) lang = 'en';
  function t(k, v) {
    var s = (I18N[lang][k] != null ? I18N[lang][k] : I18N.en[k]);
    if (s == null) return k;
    return s.replace(/\{(\w+)\}/g, function (_, x) { return v && v[x] != null ? v[x] : ''; });
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  // ================================================================ state
  var S = {
    sync: null, code: null, me: null, fac: false, game: null, log: [], presence: {},
    prevCards: {}, changedUntil: {}, setup: false, rolling: false, busy: false, unsub: [], resultsTab: false
  };
  var $app = document.getElementById('app');
  var $ov = document.getElementById('overlay');

  function store() { return S.sync && S.sync.kind === 'local' ? sessionStorage : localStorage; }
  function rid(n) { var a = 'abcdefghijkmnpqrstuvwxyz23456789', s = ''; for (var i = 0; i < n; i++) s += a[Math.floor(Math.random() * a.length)]; return s; }
  function newCode() { var a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', s = ''; for (var i = 0; i < 5; i++) s += a[Math.floor(Math.random() * a.length)]; return s; }
  function baseUrl() { return location.href.split('#')[0]; }
  function inviteUrl() { return baseUrl() + '#' + S.code; }

  function toast(msg, err) {
    var d = document.createElement('div'); d.className = 'toast' + (err ? ' err' : ''); d.textContent = msg;
    document.body.appendChild(d); setTimeout(function () { d.remove(); }, 2600);
  }
  function copy(text) {
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(
      function () { toast(t('copied')); }, function () { window.prompt('', text); });
  }
  function setHTML(el, html) {
    if (!el || el._html === html) return;
    if (el.contains(document.activeElement) && document.activeElement.matches('input,select')) return;
    el._html = html; el.innerHTML = html;
  }

  // ================================================================ actions
  function named(g, e) {
    var p = function (id) { return g.players[id] ? g.players[id].name : '?'; };
    if (e.pid) e.name = e.name || p(e.pid);
    if (e.owner) e.ownerName = p(e.owner);
    return e;
  }
  var QUIET = { turnDone: 1 };
  async function act(fn) {
    if (S.busy) return { ok: false };
    S.busy = true;
    try {
      var res = await S.sync.transact(S.code, function (g) {
        var r = fn(g);
        if (r.ok) r.events = r.events.filter(function (e) {
          return !QUIET[e.t] && !(e.t === 'skip' && e.step === 'block');
        }).map(function (e) { return named(g, e); });
        return r;
      });
      if (res.ok && res.events && res.events.length) S.sync.addLog(S.code, res.events);
      if (!res.ok && res.error) toast(t('e_' + res.error) !== 'e_' + res.error ? t('e_' + res.error) : res.error, true);
      return res;
    } catch (e) {
      console.error(e); toast(t('e_generic', { msg: e.message }), true); return { ok: false };
    } finally { S.busy = false; }
  }

  // ================================================================ routing
  function route() {
    var h = decodeURIComponent(location.hash.slice(1));
    var m = h.match(/^([A-Z0-9]{5})(?:\/host\/([a-z0-9]+))?$/i);
    if (!m) { leaveSession(); renderHome(); return; }
    var code = m[1].toUpperCase();
    if (m[2]) { store().setItem('kfg:fac:' + code, m[2]); history.replaceState(null, '', '#' + code); }
    openSession(code);
  }

  function leaveSession() {
    S.unsub.forEach(function (u) { try { u(); } catch (e) { } });
    S.unsub = []; S.code = null; S.game = null; S.log = []; S.me = null; S.fac = false; S.prevCards = {};
    $ov.innerHTML = '';
    renderHeader();
  }

  function openSession(code) {
    if (S.code === code) return;
    leaveSession();
    S.code = code;
    S.me = store().getItem('kfg:pid:' + code);
    var first = true;
    S.unsub.push(S.sync.watch(code, function (g) {
      S.game = g ? E.norm(g) : null;
      if (S.game) {
        S.fac = store().getItem('kfg:fac:' + code) === S.game.facilitator;
        if (S.me && !S.game.players[S.me]) S.me = null;
        trackChanges();
      }
      if (first && S.me) S.sync.presence(code, S.me);
      first = false;
      render();
    }));
    S.unsub.push(S.sync.watchLog(code, function (l) { S.log = l || []; renderLog(); }));
    S.unsub.push(S.sync.watchPresence(code, function (p) { S.presence = p || {}; renderPlayers(); }));
  }

  function trackChanges() {
    var now = Date.now(), cur = {};
    E.roundCards(S.game).forEach(function (c) {
      var sig = c.col + (c.blocked ? 'b' : '');
      cur[c.id] = sig;
      if (S.prevCards[c.id] !== undefined && S.prevCards[c.id] !== sig) S.changedUntil[c.id] = now + 900;
      if (S.prevCards[c.id] === undefined && Object.keys(S.prevCards).length) S.changedUntil[c.id] = now + 900;
    });
    S.prevCards = cur;
  }

  // ================================================================ header / footer
  function renderHeader() {
    document.getElementById('appName').textContent = CFG.appName || 'Kanban Flow Game';
    document.title = CFG.appName || 'Kanban Flow Game';
    document.documentElement.lang = lang;
    document.querySelectorAll('.lang button').forEach(function (b) { b.classList.toggle('on', b.dataset.lang === lang); });
    var h = '';
    var g = S.game;
    if (S.code && g) {
      h += '<span class="chip">' + t('session') + ' <b>' + S.code + '</b></span>';
      if (g.phase === 'lobby') h += '<span class="chip y">' + t('lobby') + '</span>';
      else h += '<span class="chip y">' + t('round') + ' ' + g.round + ' · ' + t('day') + ' ' + Math.min(g.day, g.settings.days) + ' ' + t('of') + ' ' + g.settings.days + '</span>';
      if (g.round === 2) h += '<span class="chip">WIP ' + E.columns(g).map(function (c) { return c.wip > 0 ? c.wip : '∞'; }).join(' / ') + '</span>';
      h += '<button class="hbtn" data-copy="invite">' + t('copyInvite') + '</button>';
    }
    if (S.sync && S.sync.kind === 'local') h += '<span class="chip warn">TEST MODE</span>';
    setHTML(document.getElementById('hdrInfo'), h);
    var f = t('footer');
    if (CFG.brand) f += ' · ' + (CFG.brandUrl ? '<a href="' + esc(CFG.brandUrl) + '" target="_blank" rel="noopener">' + esc(CFG.brand) + '</a>' : esc(CFG.brand));
    setHTML(document.getElementById('footer'), f);
  }

  // ================================================================ home
  function renderHome() {
    renderHeader();
    $app._html = null;
    $app.innerHTML =
      '<div class="home"><div class="hero"><h1>' + t('heroA') + '<br><mark>' + t('heroB') + '</mark></h1><p>' + t('tagline') + '</p></div>' +
      '<div class="home-grid">' +
      '<div class="panel"><h2>' + t('hostTitle') + '</h2><p class="muted">' + t('hostText') + '</p><button class="btn y" id="hostBtn">' + t('hostBtn') + '</button></div>' +
      '<div class="panel"><h2>' + t('joinTitle') + '</h2><p class="muted">' + t('joinText') + '</p><form id="joinForm" class="row">' +
      '<input type="text" class="code-input" id="codeIn" maxlength="5" placeholder="' + t('codePh') + '" autocomplete="off"><button class="btn" style="flex:0 0 auto">' + t('joinBtn') + '</button></form></div>' +
      '</div>' + (S.sync.kind === 'local' ? '<div class="testmode">' + t('testMode') + '</div>' : '') + '</div>';
    document.getElementById('hostBtn').onclick = hostSession;
    document.getElementById('joinForm').onsubmit = function (e) {
      e.preventDefault();
      var c = document.getElementById('codeIn').value.trim().toUpperCase();
      if (c.length === 5) location.hash = c;
    };
  }

  async function hostSession() {
    var fid = 'f' + rid(10);
    for (var i = 0; i < 5; i++) {
      var code = newCode();
      var ok = await S.sync.create(code, E.newGame(fid, Date.now()));
      if (ok) { store().setItem('kfg:fac:' + code, fid); location.hash = code; return; }
    }
    toast('Could not create a session', true);
  }

  // ================================================================ join
  function renderJoin() {
    var g = S.game;
    var offline = E.playerList(g).filter(function (p) { return !S.presence[p.id]; });
    var html = '<div class="home" style="max-width:460px"><div class="panel" style="padding:24px">' +
      '<h2 style="margin-top:0">' + t('joinAs', { code: S.code }) + '</h2>';
    if (offline.length) {
      html += '<p class="small muted">' + t('reclaim') + '</p><div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px">' +
        offline.map(function (p) { return '<button class="btn ghost sm" data-reclaim="' + p.id + '"><span class="dot" style="display:inline-block;vertical-align:-2px;margin-right:6px;background:' + p.color + '"></span>' + esc(p.name) + '</button>'; }).join('') +
        '</div><p class="small muted">' + t('orNew') + '</p>';
    }
    html += '<form id="nameForm"><label class="f">' + t('yourName') + '</label><input type="text" id="nameIn" maxlength="24" placeholder="' + t('namePh') + '" autofocus>' +
      '<button class="btn y" style="margin-top:12px;width:100%">' + t('enter') + '</button></form></div></div>';
    setHTML($app, html);
    var f = document.getElementById('nameForm');
    if (f) f.onsubmit = async function (e) {
      e.preventDefault();
      var name = document.getElementById('nameIn').value;
      var pid = 'p' + rid(10);
      var res = await act(function (g) { return E.addPlayer(g, pid, name); });
      if (res.ok) claim(pid);
    };
  }
  function claim(pid) {
    store().setItem('kfg:pid:' + S.code, pid);
    S.me = pid; S.sync.presence(S.code, pid);
    $app._html = null; render();
  }

  // ================================================================ labels
  function colLabel(id, ignoreName) {
    var g = S.game, n = g.settings.names || {};
    if (id === 'backlog') return (!ignoreName && n.backlog) || t('colBacklog');
    if (id === 'done') return (!ignoreName && n.done) || t('colDone');
    var cols = E.columns(g), idx = -1;
    for (var i = 0; i < cols.length; i++) if (cols[i].id === id) idx = i;
    if (idx < 0) return id;
    var c = cols[idx];
    if (c.name && !ignoreName) return c.name;
    if (c.type === 'passive') return t('colWait', { next: colLabel(idx + 1 < cols.length ? cols[idx + 1].id : 'done') });
    var ai = cols.slice(0, idx).filter(function (x) { return x.type === 'active'; }).length;
    return ai === 0 ? t('colDev') : ai === 1 ? t('colTest') : t('colStep', { n: ai + 1 });
  }
  function wipList(cols, html) {
    return cols.map(function (c) {
      var v = c.wip > 0 ? c.wip : '∞';
      return esc(colLabel(c.id)) + ' ' + (html ? '<b>' + v + '</b>' : v);
    }).join(' · ');
  }
  function urgentMode(legal) {
    return legal.length > 0 && legal.some(function (a) { return a.type !== 'block'; }) &&
      legal.every(function (a) { return a.card && S.game.cards[a.card].urgent; });
  }

  // ================================================================ main render
  function render() {
    renderHeader();
    if (!S.code) return;
    if (!S.game) {
      setHTML($app, '<div class="home"><div class="panel"><p>' + t('notFound', { code: esc(S.code) }) + '</p><a class="btn" href="#">' + t('backHome') + '</a></div></div>');
      return;
    }
    if (!S.me && !S.fac) { renderJoin(); return; }
    renderSetup();
    if (S.game.phase === 'debrief' && !S.resultsTab) { renderDebrief(); return; }
    if (!$app.querySelector('#board')) {
      $app._html = null;
      $app.innerHTML = '<div class="game"><section><div id="top"></div><div class="boardwrap"><div id="board" class="board"></div></div></section>' +
        '<aside class="side"><div id="sTurn"></div><div id="sFac"></div><div id="sRules"></div><div id="sPlayers"></div><div id="sLog"></div></aside></div>';
    }
    renderTop(); renderBoard(); renderTurn(); renderFac(); renderRules(); renderPlayers(); renderLog();
  }

  // ---------------------------------------------------------------- top area
  function renderTop() {
    var el = document.getElementById('top'); if (!el) return;
    var g = S.game, html = '';
    if (g.phase === 'roundEnd') html = roundSummary(g.round);
    else if (g.phase === 'debrief') html = '<div class="banner wip"><span>' + t('r2done') + '</span><button class="btn y sm" data-results="1" style="margin-left:auto">' + t('debriefTitle') + '</button></div>';
    else if (g.phase === 'playing' && g.round === 2) html = '<div class="banner wip"><span>' + t('rWip', { list: wipList(E.columns(g), true) }) + '</span></div>';
    if (g.phase === 'playing' && S.me && isHelpMode()) html += '<div class="banner help"><span>' + t('step_help') + '</span></div>';
    setHTML(el, html);
  }

  function isHelpMode() {
    var l = E.legalActions(S.game, S.me);
    return l.length > 0 && l.every(function (a) { return a.help; });
  }

  function roundSummary(n) {
    var m = E.metrics(S.game, n); if (!m) return '';
    var k = kpi(t('k_finished'), m.finished) + kpi(t('k_ct'), fmt(m.avgCycleTime) + ' <span>' + t('days_u') + '</span>') +
      kpi(t('k_wip'), fmt(m.avgWip)) + kpi(t('k_wipEnd'), m.inProgress);
    if (m.hasQueues) k += kpi(t('k_fe'), m.flowEfficiency == null ? '–' : Math.round(m.flowEfficiency * 100) + '<span>%</span>');
    if (m.urgentStarted) k += kpi(t('k_ctUrgent'), fmt(m.avgCtUrgent) + ' <span>' + t('days_u') + '</span>');
    return '<div class="panel" style="margin-bottom:12px"><h3>' + t('resultsTitle', { n: n }) + '</h3>' +
      '<div class="kpis" style="margin:8px 0">' + k + '</div>' +
      '<div class="chart summary-chart">' + cfdSvg(m, cfdMax([m]), S.game.settings.days) + '</div>' + cfdLegend(m.columns) + '</div>';
  }
  function kpi(l, v) { return '<div class="kpi"><div class="l">' + l + '</div><div class="v"><b>' + v + '</b></div></div>'; }
  function fmt(x, d) { return x == null ? '–' : (Math.round(x * (d || 10)) / (d || 10)).toString(); }

  // ---------------------------------------------------------------- board
  function renderBoard() {
    var el = document.getElementById('board'); if (!el) return;
    var g = S.game, now = Date.now(), cols = E.columns(g);
    var legal = S.me ? E.legalActions(g, S.me) : [];
    var byCard = {}; legal.forEach(function (a) { if (a.card) byCard[a.card] = a; });
    var canStart = legal.some(function (a) { return a.type === 'start'; });
    var cards = g.phase === 'lobby' ? [] : E.roundCards(g);
    var tn = S.me && g.turns[S.me];
    var myStepCanStart = tn && tn.roll && !tn.done && tn.steps.length && tn.steps[0] !== 'block';
    var urgentFirst = urgentMode(legal);
    var startBlockedByWip = myStepCanStart && !canStart && !urgentFirst && !E.hasCapacity(g, E.firstCol(g));

    function card(c) {
      var p = g.players[c.owner] || { name: '?', color: '#dee2e6' };
      var a = byCard[c.id];
      var cls = 'card' + (c.owner === S.me ? ' mine' : '') + (c.blocked ? ' blocked' : '') + (c.urgent ? ' urgent' : '') + (a ? ' act' + (a.help ? ' help' : '') : '') +
        ((S.changedUntil[c.id] || 0) > now ? ' changed' : '') + (c.helpers ? ' helped' : '');
      var rot = (((c.no * 37) % 7) - 3) * 0.5;
      var tip = a ? t('tip_' + (a.help ? 'help_' : '') + a.type) : '';
      var title = esc(p.name) + (c.urgent ? ' · ' + t('urgent') : '');
      return '<button class="' + cls + '" style="background:' + p.color + ';--rot:' + rot + 'deg"' +
        (a ? ' data-act="' + a.type + '" data-card="' + c.id + '" title="' + esc(tip) + '"' : ' tabindex="-1" title="' + title + '"') + '>' +
        '<span class="no">#' + c.no + (c.urgent ? ' <span class="bolt">⚡</span>' : '') + '</span>' + (c.blocked ? '<span class="stamp">' + t('blocked') + '</span>' : '') +
        '<span class="own">' + esc(p.name) + '</span>' + (a ? '<span class="tip">' + esc(tip) + '</span>' : '') + '</button>';
    }
    function column(key, type) {
      var list = cards.filter(function (c) { return c.col === key; });
      var lim = E.limitOf(g, key), cnt = list.length;
      var badge = key === 'done' ? cnt : (g.round === 2 && lim ? cnt + ' / ' + lim : cnt);
      var full = lim && cnt >= lim;
      var cls = 'col' + (key === 'done' ? ' done' : '') + (type === 'passive' ? ' queue' : '') + (full ? ' full' : '');
      return '<div class="' + cls + '"><div class="col-h"><b title="' + esc(colLabel(key)) + '">' + esc(colLabel(key)) + '</b><span class="wipb' + (g.round === 2 && lim ? ' on' : '') + (full ? ' full' : '') + '">' + badge + '</span></div>' +
        (type === 'passive' ? '<div class="qtag">' + t('queue') + '</div>' : '') +
        '<div class="col-b">' + (list.length ? list.map(card).join('') : '<div class="empty-col">' + t('emptyCol') + '</div>') + '</div></div>';
    }
    var showNext = g.phase === 'playing';
    var nextUrg = showNext && g.nextUrgent;
    var backlog = '<div class="col backlog"><div class="col-h"><b title="' + esc(colLabel('backlog')) + '">' + esc(colLabel('backlog')) + '</b><span class="wipb">∞</span></div><div class="col-b">' +
      '<div class="stack' + (nextUrg ? ' urgent' : '') + '"><i></i><i></i><i></i><span>#' + (showNext ? g.nextNo : '…') + (nextUrg ? '<em>⚡ ' + t('urgent') + '</em>' : '') + '</span></div>' +
      (S.me ? '<button class="btn y start-btn' + (canStart ? ' hint' : '') + '" data-start="1"' + (canStart ? '' : ' disabled') + '>' + t('startNew') + '</button>' : '') +
      (startBlockedByWip ? '<div class="stop-msg">' + t('stopStart') + '</div>' : '') +
      (myStepCanStart && urgentFirst ? '<div class="stop-msg">' + t('urgentFirstShort') + '</div>' : '') + '</div></div>';
    var tmpl = ['minmax(120px,150px)'].concat(cols.map(function (c) {
      return c.type === 'passive' ? 'minmax(112px,.7fr)' : 'minmax(132px,1fr)';
    }), ['minmax(116px,.85fr)']).join(' ');
    if (el.style.gridTemplateColumns !== tmpl) el.style.gridTemplateColumns = tmpl;
    el.classList.toggle('dense', cols.length >= 5);
    setHTML(el, backlog + cols.map(function (c) { return column(c.id, c.type); }).join('') + column('done', 'done'));
  }

  // ---------------------------------------------------------------- turn panel
  var PIPS = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };
  function dieHtml(v, cls, attrs) {
    if (!v) return '<button class="die idle ' + (cls || '') + '" ' + (attrs || '') + '>' + (cls && cls.indexOf('go') >= 0 ? t('rollPrompt').split(' ')[0] + '!' : '?') + '</button>';
    var pips = PIPS[v], s = '';
    for (var i = 0; i < 9; i++) s += '<i' + (pips.indexOf(i) >= 0 ? ' style="visibility:visible"' : '') + '></i>';
    return '<button class="die ' + (cls || '') + '" ' + (attrs || '') + '>' + s + '</button>';
  }

  function renderTurn() {
    var el = document.getElementById('sTurn'); if (!el) return;
    if (!S.me) { setHTML(el, ''); return; }
    var g = S.game, tn = g.turns[S.me], html = '<div class="panel turn"><h3>' + t('yourTurn') + '</h3>';
    var players = E.playerList(g), doneN = players.filter(function (p) { return g.turns[p.id] && g.turns[p.id].done; }).length;
    if (g.phase === 'lobby') html += '<div class="msg">' + t('waitStart') + '</div>';
    else if (g.phase !== 'playing') html += '<div class="msg">' + t('roundOver', { n: g.round }) + '</div><div class="sub">' + t('roundOverSub') + '</div>';
    else if (tn && tn.done) html += '<div class="dice-row">' + dieHtml(tn.roll, '', 'disabled') + '<div><div class="msg">' + t('doneDay', { day: g.day }) + '</div><div class="sub">' + t('doneSub', { n: doneN, m: players.length }) + '</div></div></div>';
    else if (!tn || !tn.roll) {
      if (E.canAct(g, S.me)) html += '<div class="dice-row">' + dieHtml(0, 'go' + (S.rolling ? ' rolling' : ''), 'data-roll="1"') + '<div><div class="msg">' + t('rollPrompt') + '</div><div class="sub">' + t('rollSub') + '</div></div></div>';
      else { var ap = g.players[E.activePlayerId(g)]; html += '<div class="dice-row">' + dieHtml(0, '', 'disabled') + '<div><div class="msg">' + t('waitFor', { name: esc(ap ? ap.name : '') }) + '</div></div></div>'; }
    } else {
      var step = tn.steps[0], legal = E.legalActions(g, S.me), help = isHelpMode();
      var msg = help ? t('step_help') : (step !== 'block' && urgentMode(legal)) ? t('step_urgent') : t('step_' + step);
      if (help && urgentMode(legal)) msg += ' ' + t('urgentHelp');
      html += '<div class="dice-row">' + dieHtml(tn.roll, S.rolling ? 'rolling' : '', 'disabled') + '<div><div class="msg">' + msg + '</div></div></div>';
      var all = E.stepsFor(tn.roll), usedN = all.length - tn.steps.length;
      html += '<div class="steps">' + all.map(function (s, i) {
        var lbl = s === 'block' ? t('blockStep') : s === 'start' ? t('startStep') : t('actionN', { n: all.slice(0, i + 1).filter(function (x) { return x === 'any'; }).length });
        return '<span class="step' + (i < usedN ? ' used' : i === usedN ? ' cur' : '') + '">' + lbl + '</span>';
      }).join('') + '</div>';
    }
    setHTML(el, html + '</div>');
  }

  // ---------------------------------------------------------------- rules
  function renderRules() {
    var el = document.getElementById('sRules'); if (!el) return;
    var g = S.game, s = g.settings, tn = S.me && g.turns[S.me], r = tn && tn.roll && !tn.done ? tn.roll : 0;
    var queues = E.columns(g).filter(function (c) { return c.type === 'passive'; });
    var html = '<div class="panel"><h3>' + t('rules') + '</h3><div class="rules">' +
      '<div class="rule' + (r && r <= 2 ? ' on' : '') + '"><div class="n">1–2</div><p>' + t('r12') + '</p></div>' +
      '<div class="rule' + (r === 3 || r === 4 ? ' on' : '') + '"><div class="n">3–4</div><p>' + t('r34') + '</p></div>' +
      '<div class="rule' + (r >= 5 ? ' on' : '') + '"><div class="n">5–6</div><p>' + t('r56') + '</p></div>' +
      '<div class="rule-note">⚠ ' + t('rHelp') + '</div>' +
      (queues.length ? '<div class="rule-note q">' + t('rQueue', { names: queues.map(function (c) { return '<b>' + esc(colLabel(c.id)) + '</b>'; }).join(', ') }) + '</div>' : '') +
      (s.urgentPct > 0 || g.nextUrgent ? '<div class="rule-note urg">⚡ ' + t('rUrgent', { p: s.urgentPct }) + ' ' + t('rNoExpedite') + '</div>' : '') +
      (g.round === 2 ? '<div class="rule-note wip">' + t('rWip', { list: wipList(E.columns(g), true) }) + '</div>' : (g.round === 1 ? '<div class="rule-note">' + t('rNoWip') + '</div>' : '')) +
      '</div></div>';
    setHTML(el, html);
  }

  // ---------------------------------------------------------------- players
  function renderPlayers() {
    var el = document.getElementById('sPlayers'); if (!el || !S.game) return;
    var g = S.game, active = g.settings.turnMode === 'turns' && g.phase === 'playing' ? E.activePlayerId(g) : null;
    var list = E.playerList(g);
    var html = '<div class="panel"><h3>' + t('team') + ' · ' + list.length + '</h3>';
    if (!list.length) html += '<p class="small muted">' + t('noPlayers') + '</p>';
    html += '<ul class="plist">' + list.map(function (p) {
      var tn = g.turns[p.id], st = '';
      if (g.phase === 'playing') {
        if (tn && tn.done) st = t('st_done');
        else if (tn && tn.roll) st = t('st_rolled', { v: tn.roll });
        else if (active === p.id) st = t('st_playing');
        else st = t('st_wait');
      }
      var stCls = (active === p.id || (tn && tn.roll && !tn.done)) ? ' act' : '';
      var controls = '';
      if (S.fac) {
        if (g.phase === 'playing' && !(tn && tn.done)) controls += '<button class="btn ghost sm" data-skip="' + p.id + '" style="padding:2px 6px">' + t('skip') + '</button>';
        controls += '<button class="x" data-remove="' + p.id + '" title="✕">✕</button>';
      }
      return '<li><span class="dot" style="background:' + p.color + '"></span><span class="on-dot' + (S.presence[p.id] ? ' on' : '') + '"></span>' +
        '<span class="pname' + (p.id === S.me ? ' me' : '') + '">' + esc(p.name) + (p.id === S.me ? ' (' + t('you') + ')' : '') + '</span>' +
        '<span class="pstat' + stCls + '">' + st + '</span>' + controls + '</li>';
    }).join('') + '</ul></div>';
    setHTML(el, html);
  }

  // ---------------------------------------------------------------- log
  function logText(e) {
    if (!S.game) return '';
    var v = {
      name: esc(e.name), owner: esc(e.ownerName), no: e.no + (e.urgent ? ' ⚡' : ''), value: e.value, day: e.day, round: e.round,
      to: e.to ? esc(colLabel(e.to)) : '', col: e.col ? esc(colLabel(e.col)) : '', wip: e.wip > 0 ? e.wip : '∞'
    };
    if ((e.t === 'move' || e.t === 'unblock') && e.help) return t('l_help_' + e.t, v);
    return t('l_' + e.t, v);
  }
  function renderLog() {
    var el = document.getElementById('sLog'); if (!el) return;
    var items = S.log.slice(-80).reverse().map(function (e) {
      var sys = /dayEnd|roundStart|roundEnd|wipChange/.test(e.t);
      return '<div' + (sys ? ' class="sys"' : '') + '>' + logText(e) + '</div>';
    }).join('');
    setHTML(el, '<div class="panel"><h3>' + t('log') + '</h3><div class="log">' + items + '</div></div>');
  }

  // ---------------------------------------------------------------- facilitator
  function wipEditor(g, live) {
    var cols = E.columns(g), sg = E.suggestWip(g), n = E.playerList(g).length;
    return '<div class="wipedit">' + cols.map(function (c) {
      return '<label class="wiprow' + (c.type === 'passive' ? ' q' : '') + '"><span>' + esc(colLabel(c.id)) + '</span>' +
        '<input type="number" min="0" max="30" value="' + (c.wip || 0) + '" data-set="wip.' + c.id + '"></label>';
    }).join('') + '</div>' +
      (n ? '<div class="row small muted" style="margin-top:6px"><span>' + t('wipSuggest', { n: n, list: cols.map(function (c) { return sg[c.id]; }).join(' · ') }) + '</span>' +
      '<button class="btn ghost sm" style="flex:0 0 auto" data-fac="suggest">' + t('apply') + '</button></div>' : '') +
      '<div class="small muted" style="margin-top:4px">' + t(live ? 'wipLive' : 'wipHint') + '</div>';
  }
  function boardSummary(g) {
    var s = g.settings;
    return '<div class="flowline">' + ['backlog'].concat(E.columns(g).map(function (c) { return c.id; }), ['done']).map(function (id) {
      var c = E.colById(g, id);
      return '<span class="fl' + (c && c.type === 'passive' ? ' q' : '') + '">' + esc(colLabel(id)) + '</span>';
    }).join('<i>→</i>') + '</div>' +
      '<div class="small muted">' + t('wipR2') + ': ' + E.columns(g).map(function (c) { return c.wip > 0 ? c.wip : '∞'; }).join(' · ') +
      ' &nbsp;|&nbsp; ' + t('urgentShort') + ': ' + (s.urgentPct || 0) + '%' + '</div>' +
      '<button class="btn ghost sm" data-setup="1" style="margin-top:8px;width:100%">⚙ ' + t('setupBtn') + '</button>';
  }
  function urgentEditor(g) {
    var s = g.settings;
    return '<div class="row" style="align-items:flex-end"><div><label class="f">' + t('urgentPct') + '</label>' +
      '<div class="pct"><input type="number" min="0" max="100" step="5" value="' + (s.urgentPct || 0) + '" data-set="urgentPct"><span>%</span></div></div></div>' +
      '<p class="small muted" style="margin:6px 0 0">' + t('rNoExpedite') + '</p>';
  }
  function renderFac() {
    var el = document.getElementById('sFac'); if (!el) return;
    if (!S.fac) { setHTML(el, ''); return; }
    var g = S.game, s = g.settings, n = E.playerList(g).length;
    var html = '<div class="panel fac"><h3>' + t('facPanel') + '</h3>';
    html += '<div class="small muted">' + t('invite') + '</div><div class="big-code">' + S.code + '</div>' +
      '<div class="row"><button class="btn ghost sm" data-copy="invite">' + t('copyInvite') + '</button><button class="btn ghost sm" data-copy="fac" title="' + esc(t('facLinkHint')) + '">' + t('facLink') + '</button></div>';

    if (g.phase === 'lobby') {
      html += '<div class="fsec"><div class="fsec-h">' + t('boardSetup') + '</div>' + boardSummary(g) + '</div>' +
        '<label class="f">' + t('daysPerRound') + '</label><input type="number" min="3" max="40" value="' + s.days + '" data-set="days">' +
        '<label class="f">' + t('turnMode') + '</label><select data-set="turnMode"><option value="simultaneous"' + (s.turnMode !== 'turns' ? ' selected' : '') + '>' + t('tm_sim') + '</option><option value="turns"' + (s.turnMode === 'turns' ? ' selected' : '') + '>' + t('tm_turns') + '</option></select>' +
        '<label class="checkline"><input type="checkbox" data-set="autoAdvance"' + (s.autoAdvance ? ' checked' : '') + '> ' + t('autoAdv') + '</label>' +
        '<div class="stack-btns"><button class="btn y" data-fac="start1"' + (n ? '' : ' disabled') + '>' + t('startR1') + '</button>' + (n ? '' : '<div class="small muted">' + t('needPlayers') + '</div>') + '</div>';
    } else if (g.phase === 'playing') {
      var doneN = E.playerList(g).filter(function (p) { return g.turns[p.id] && g.turns[p.id].done; }).length;
      html += '<div style="margin-top:12px;font-weight:600">' + t('round') + ' ' + g.round + ' · ' + t('dayProgress', { day: g.day, days: s.days }) + '</div>' +
        '<div class="progress"><i style="width:' + Math.round((g.day - 1) / s.days * 100) + '%"></i></div>' +
        '<div class="small muted">' + t('playersDone', { n: doneN, m: n }) + '</div>' +
        '<div class="stack-btns"><button class="btn" data-fac="nextDay">' + t('nextDay') + '</button><button class="btn ghost" data-fac="endRound">' + t('endRound') + '</button></div>' +
        (g.round === 2 ? '<div class="fsec"><div class="fsec-h">' + t('wipTitleLive') + '</div>' + wipEditor(g, true) + '</div>' : '') +
        '<label class="f">' + t('daysPerRound') + '</label><input type="number" min="' + g.day + '" max="40" value="' + s.days + '" data-set="days">' +
        (s.turnMode !== 'turns' ? '<label class="checkline"><input type="checkbox" data-set="autoAdvance"' + (s.autoAdvance ? ' checked' : '') + '> ' + t('autoAdv') + '</label>' : '') +
        '<button class="btn ghost sm" data-setup="1" style="margin-top:10px;width:100%">✎ ' + t('renameBtn') + '</button>';
    } else if (g.phase === 'roundEnd' && g.round === 1) {
      html += '<p class="small" style="margin:12px 0 0">' + t('r1done') + '</p>' +
        '<div class="fsec"><div class="fsec-h">' + t('wipTitle') + '</div>' + wipEditor(g, false) + '</div>' +
        '<div class="fsec"><div class="fsec-h">' + t('urgentTitle') + '</div>' + urgentEditor(g) + '</div>' +
        '<label class="f">' + t('daysPerRound') + '</label><input type="number" min="3" max="40" value="' + s.days + '" data-set="days">' +
        '<div class="stack-btns"><button class="btn y" data-fac="start2">' + t('startR2') + '</button>' +
        '<button class="btn ghost sm" data-setup="1">✎ ' + t('renameBtn') + '</button></div>';
    } else if (g.phase === 'roundEnd') {
      html += '<p class="small" style="margin:12px 0 0">' + t('r2done') + '</p><div class="stack-btns"><button class="btn y" data-fac="debrief">' + t('showResults') + '</button></div>';
    } else {
      html += '<div class="stack-btns"><button class="btn y" data-results="1">' + t('debriefTitle') + '</button></div>';
    }
    setHTML(el, html + '</div>');
  }

  // ---------------------------------------------------------------- setup dialog
  function renderSetup() {
    if (!(S.setup && S.fac && S.game && S.game.phase !== 'debrief')) { S.setup = false; if ($ov._html !== '') { $ov._html = ''; $ov.innerHTML = ''; } return; }
    var g = S.game, s = g.settings, cols = E.columns(g), lobby = g.phase === 'lobby';
    var actives = cols.filter(function (c) { return c.type === 'active'; }).length;
    function nameInput(key, id) {
      var val = key === 'names' ? (s.names[id] || '') : (E.colById(g, id).name || '');
      return '<input type="text" maxlength="28" value="' + esc(val) + '" placeholder="' + esc(colLabel(id, true)) + '" data-set="' + (key === 'names' ? 'names.' + id : 'colName.' + id) + '">';
    }
    var rows = '<div class="srow fixed"><span class="stype">' + t('typeBacklog') + '</span>' + nameInput('names', 'backlog') + '<span class="swip muted">∞</span><span></span></div>';
    cols.forEach(function (c, i) {
      var isQ = c.type === 'passive';
      var rm = lobby && (isQ || actives > 1) ? '<button class="x" data-rmcol="' + c.id + '" title="' + esc(t('removeCol')) + '">✕</button>' : '<span></span>';
      rows += '<div class="srow' + (isQ ? ' q' : '') + '"><span class="stype">' + (isQ ? '⋯ ' + t('typeQueue') : '▶ ' + t('typeActive')) + '</span>' + nameInput('col', c.id) +
        '<span class="swip"><input type="number" min="0" max="30" value="' + (c.wip || 0) + '" data-set="wip.' + c.id + '" title="' + esc(t('wipR2')) + '"></span>' + rm + '</div>';
      var next = cols[i + 1];
      if (lobby && !isQ && next && next.type === 'active') {
        rows += '<div class="sins"><button class="btn ghost sm" data-togq="' + c.id + '">+ ' + t('addQueue', { a: esc(colLabel(c.id)), b: esc(colLabel(next.id)) }) + '</button></div>';
      }
    });
    rows += '<div class="srow fixed"><span class="stype">' + t('typeDone') + '</span>' + nameInput('names', 'done') + '<span class="swip muted">–</span><span></span></div>';
    var html = '<div class="overlay" data-ovclose="1"><div class="modal setup" role="dialog" aria-modal="true">' +
      '<div class="row" style="align-items:flex-start"><h2 style="flex:1">' + t('setupTitle') + '</h2><button class="x" data-setup="0" style="flex:0 0 auto;font-size:20px" title="' + esc(t('close')) + '">✕</button></div>' +
      boardPreview(g) +
      '<h3 class="sh">' + t('columnsTitle') + '</h3>' +
      '<div class="srow head"><span>' + t('colType') + '</span><span>' + t('colNameH') + '</span><span>' + t('wipR2') + '</span><span></span></div>' + rows +
      (lobby ? (actives < E.MAX_ACTIVE ? '<button class="btn ghost sm" data-addcol="1" style="margin-top:8px">+ ' + t('addStep') + '</button>' : '') +
        '<p class="small muted">' + t('queueHelp') + '</p>'
        : '<p class="small muted">' + t('structLocked') + '</p>') +
      (E.playerList(g).length ? '<div class="row small muted" style="margin-top:4px"><span>' + t('wipSuggest', { n: E.playerList(g).length, list: cols.map(function (c) { return E.suggestWip(g)[c.id]; }).join(' · ') }) + '<br>' + t('wipHint') + '</span>' +
      '<button class="btn ghost sm" style="flex:0 0 auto" data-fac="suggest">' + t('apply') + '</button></div>' : '<p class="small muted">' + t('wipHint') + ' ' + t('wipNoPlayers') + '</p>') +
      '<h3 class="sh">' + t('urgentTitle') + '</h3>' +
      (g.phase === 'playing' ? '<p class="small">' + t('urgentShort') + ': <b>' + (s.urgentPct || 0) + '%</b>' + '</p><p class="small muted">' + t('urgentLocked') + '</p>'
        : urgentEditor(g) + '<p class="small muted">' + t('urgentHelp2') + '</p>') +
      '<div style="text-align:right;margin-top:16px"><button class="btn y" data-setup="0">' + t('done') + '</button></div>' +
      '</div></div>';
    setHTML($ov, html);
  }
  function boardPreview(g) {
    var ids = ['backlog'].concat(E.columns(g).map(function (c) { return c.id; }), ['done']);
    return '<div class="preview">' + ids.map(function (id) {
      var c = E.colById(g, id);
      return '<div class="pv' + (c && c.type === 'passive' ? ' q' : '') + '">' + esc(colLabel(id)) + '</div>';
    }).join('') + '</div>';
  }

  // ================================================================ charts
  var ACTIVE_COLORS = ['#fadd10', '#4c6ef5', '#f08c00', '#12b886'];
  function colColors(cols) {
    var out = { done: '#16213e' }, i = 0;
    cols.forEach(function (c) { out[c.id] = c.type === 'passive' ? '#c3c8d4' : ACTIVE_COLORS[i++ % ACTIVE_COLORS.length]; });
    return out;
  }
  function cfdMax(ms) { var m = 4; ms.forEach(function (x) { if (x) x.days.forEach(function (d) { m = Math.max(m, d.wip + d.done); }); }); return m; }
  function cfdLegend(cols) {
    var col = colColors(cols);
    return '<div class="legend">' + cols.map(function (c) { return c.id; }).concat(['done']).map(function (k) {
      return '<span><i style="background:' + col[k] + '"></i>' + esc(colLabel(k)) + '</span>';
    }).join('') + '</div>';
  }
  function niceTicks(max) { var step = max <= 8 ? 1 : max <= 20 ? 2 : max <= 50 ? 5 : 10, a = []; for (var v = 0; v <= max; v += step) a.push(v); return a; }
  function cfdSvg(m, maxY, maxX) {
    var days = m.days, cols = m.columns, color = colColors(cols);
    var W = 560, H = 230, L = 34, R = 10, T = 10, B = 26, iw = W - L - R, ih = H - T - B;
    maxX = Math.max(maxX || 1, days.length ? days[days.length - 1].day : 1);
    var x = function (d) { return L + (d / maxX) * iw; }, y = function (v) { return T + ih - (v / maxY) * ih; };
    // stack from the bottom: done, last column, ..., first column
    var order = ['done'].concat(cols.map(function (c) { return c.id; }).reverse());
    function val(d, k) { return k === 'done' ? d.done : (d.c[k] || 0); }
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(t('cfd')) + '">';
    niceTicks(maxY).forEach(function (v) { s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(v) + '" y2="' + y(v) + '" stroke="#eceae3"/><text x="' + (L - 6) + '" y="' + (y(v) + 4) + '" font-size="10" text-anchor="end" fill="#667085" font-family="DM Mono, monospace">' + v + '</text>'; });
    for (var d = 0; d <= maxX; d++) s += '<text x="' + x(d) + '" y="' + (H - 8) + '" font-size="10" text-anchor="middle" fill="#667085" font-family="DM Mono, monospace">' + d + '</text>';
    if (days.length > 1) order.forEach(function (k, li) {
      var below = function (dd) { var v = 0; for (var j = 0; j < li; j++) v += val(dd, order[j]); return v; };
      var top = days.map(function (dd) { return x(dd.day) + ',' + y(below(dd) + val(dd, k)); });
      var bot = days.slice().reverse().map(function (dd) { return x(dd.day) + ',' + y(below(dd)); });
      s += '<polygon points="' + top.concat(bot).join(' ') + '" fill="' + color[k] + '" stroke="#fff" stroke-width="1"/>';
    });
    return s + '</svg>';
  }
  function histSvg(cts, maxX, maxY, urgentCts) {
    var W = 560, H = 200, L = 34, R = 10, T = 10, B = 30, iw = W - L - R, ih = H - T - B;
    var counts = {}, ucounts = {};
    cts.forEach(function (c) { counts[c] = (counts[c] || 0) + 1; });
    (urgentCts || []).forEach(function (c) { ucounts[c] = (ucounts[c] || 0) + 1; });
    var bw = iw / maxX;
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(t('ctDist')) + '">';
    niceTicks(maxY).forEach(function (v) { var yy = T + ih - v / maxY * ih; s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + yy + '" y2="' + yy + '" stroke="#eceae3"/><text x="' + (L - 6) + '" y="' + (yy + 4) + '" font-size="10" text-anchor="end" fill="#667085" font-family="DM Mono, monospace">' + v + '</text>'; });
    for (var i = 1; i <= maxX; i++) {
      var c = counts[i] || 0, u = ucounts[i] || 0, h = c / maxY * ih, hu = u / maxY * ih, xx = L + (i - 1) * bw;
      if (c) s += '<rect x="' + (xx + 3) + '" y="' + (T + ih - h) + '" width="' + Math.max(2, bw - 6) + '" height="' + h + '" rx="3" fill="#16213e"/>';
      if (u) s += '<rect x="' + (xx + 3) + '" y="' + (T + ih - hu) + '" width="' + Math.max(2, bw - 6) + '" height="' + hu + '" rx="3" fill="#e03131"/>';
      s += '<text x="' + (xx + bw / 2) + '" y="' + (H - 14) + '" font-size="10" text-anchor="middle" fill="#667085" font-family="DM Mono, monospace">' + i + '</text>';
    }
    s += '<text x="' + (L + iw / 2) + '" y="' + (H - 1) + '" font-size="10" text-anchor="middle" fill="#667085">' + esc(t('ctAxis')) + '</text>';
    return s + '</svg>';
  }

  // ================================================================ debrief
  function urgentCycleTimes(g, r) {
    return E.roundCards(g, r).filter(function (c) { return c.urgent && c.col === 'done'; }).map(function (c) { return c.doneDay - c.startDay + 1; });
  }
  function renderDebrief() {
    var g = S.game, m1 = E.metrics(g, 1), m2 = E.metrics(g, 2);
    var maxY = cfdMax([m1, m2]), maxX = Math.max(m1 ? m1.daysPlayed : 0, m2 ? m2.daysPlayed : 0);
    function cmp(label, a, b, unit, lowerBetter, dec) {
      var d = '';
      if (a != null && b != null && a !== b) {
        var better = lowerBetter == null ? null : lowerBetter ? b < a : b > a;
        var pct = a ? Math.round((b - a) / a * 100) : null;
        d = '<span class="delta ' + (better == null ? '' : better ? 'good' : 'bad') + '">' + (b > a ? '+' : '') + (pct != null ? pct + '%' : fmt(b - a)) + '</span>';
      }
      return '<div class="kpi"><div class="l">' + label + '</div><div class="v"><span>R1</span><b>' + fmt(a, dec) + '</b><span>R2</span><b>' + fmt(b, dec) + '</b>' + (unit ? '<span>' + unit + '</span>' : '') + d + '</div></div>';
    }
    function pctOf(m, k) { return m && m[k] != null ? m[k] * 100 : null; }
    function roundDesc(m, n) {
      if (!m) return '';
      var s = t('r' + n) + ': ' + (m.wipLimits ? 'WIP ' + m.columns.map(function (c) { return c.wip > 0 ? c.wip : '∞'; }).join(' / ') : t('noWip'));
      if (m.urgentPct) s += ', ' + t('urgentShort').toLowerCase() + ' ' + m.urgentPct + '%';
      return s;
    }
    var anyUrgent = (m1 && m1.urgentStarted) || (m2 && m2.urgentStarted);
    var queues = (m1 && m1.hasQueues) || (m2 && m2.hasQueues);
    var ctMax = 3; [m1, m2].forEach(function (m) { if (m) m.cycleTimes.forEach(function (c) { ctMax = Math.max(ctMax, c); }); });
    var hMax = 2; [m1, m2].forEach(function (m) { if (!m) return; var c = {}; m.cycleTimes.forEach(function (x) { c[x] = (c[x] || 0) + 1; hMax = Math.max(hMax, c[x]); }); });
    var wipChanges = m2 && m2.wipLog.length ? '<p class="small muted">' + t('wipChanged') + ' ' + m2.wipLog.map(function (w) {
      return t('day') + ' ' + w.day + ': ' + esc(colLabel(w.col)) + ' → ' + (w.wip > 0 ? w.wip : '∞');
    }).join('; ') + '</p>' : '';
    var kp = cmp(t('k_finished'), m1 && m1.finished, m2 && m2.finished, '', false, 1) +
      cmp(t('k_ct'), m1 && m1.avgCycleTime, m2 && m2.avgCycleTime, t('days_u'), true) +
      cmp(t('k_ct85'), m1 && m1.p85CycleTime, m2 && m2.p85CycleTime, t('days_u'), true) +
      cmp(t('k_wip'), m1 && m1.avgWip, m2 && m2.avgWip, '', true) +
      cmp(t('k_tp'), m1 && m1.throughputPerDay, m2 && m2.throughputPerDay, '', false, 100) +
      cmp(t('k_started'), m1 && m1.started, m2 && m2.started, '', null, 1) +
      cmp(t('k_wipEnd'), m1 && m1.inProgress, m2 && m2.inProgress, '', true, 1) +
      cmp(t('k_helped'), m1 && m1.helpedCards, m2 && m2.helpedCards, '', false, 1);
    if (queues) kp += cmp(t('k_wait'), m1 && m1.avgWait, m2 && m2.avgWait, t('days_u'), true) +
      cmp(t('k_fe'), pctOf(m1, 'flowEfficiency'), pctOf(m2, 'flowEfficiency'), '%', false, 1);
    if (anyUrgent) kp += cmp(t('k_ctUrgent'), m1 && m1.avgCtUrgent, m2 && m2.avgCtUrgent, t('days_u'), true) +
      cmp(t('k_ctStd'), m1 && m1.avgCtStandard, m2 && m2.avgCtStandard, t('days_u'), true) +
      cmp(t('k_urgentDone'), m1 && m1.urgentFinished, m2 && m2.urgentFinished, '', null, 1);
    var qs = ['q1', 'q2', 'q3', 'q4', 'q5'].concat(queues ? ['q8'] : [], anyUrgent ? ['q7'] : [], ['q6']);
    var html = '<div class="results"><div class="row" style="flex-wrap:wrap"><h1 style="flex:1 1 auto">' + t('debriefTitle') + '</h1>' +
      '<div style="flex:0 0 auto;display:flex;gap:8px"><button class="btn ghost sm" data-results="0">' + t('backToBoard') + '</button>' +
      (S.fac ? '<button class="btn ghost sm" data-csv="1">' + t('csv') + '</button>' : '') + '</div></div>' +
      '<p class="muted">' + [roundDesc(m1, 1), roundDesc(m2, 2), t('nPlayers', { n: E.playerList(g).length })].filter(Boolean).join(' · ') + '</p>' + wipChanges +
      '<div class="kpis">' + kp + '</div><div class="charts">' +
      '<div class="panel chart"><h3>' + t('cfd') + ' · ' + t('r1') + '</h3>' + (m1 ? cfdSvg(m1, maxY, maxX) + cfdLegend(m1.columns) : '') + '</div>' +
      '<div class="panel chart"><h3>' + t('cfd') + ' · ' + t('r2') + '</h3>' + (m2 ? cfdSvg(m2, maxY, maxX) + cfdLegend(m2.columns) : '') + '</div>' +
      '<div class="panel chart"><h3>' + t('ctDist') + ' · ' + t('r1') + '</h3>' + (m1 ? histSvg(m1.cycleTimes, ctMax, hMax, urgentCycleTimes(g, 1)) : '') + (anyUrgent ? histLegend() : '') + '</div>' +
      '<div class="panel chart"><h3>' + t('ctDist') + ' · ' + t('r2') + '</h3>' + (m2 ? histSvg(m2.cycleTimes, ctMax, hMax, urgentCycleTimes(g, 2)) : '') + (anyUrgent ? histLegend() : '') + '</div>' +
      '</div><div class="panel" style="margin-top:14px"><h3>' + t('questions') + '</h3><ol class="debrief-q">' +
      qs.map(function (q) { return '<li>' + t(q) + '</li>'; }).join('') + '</ol></div></div>';
    setHTML($app, html);
  }
  function histLegend() {
    return '<div class="legend"><span><i style="background:#16213e"></i>' + t('allTasks') + '</span><span><i style="background:#e03131"></i>' + t('urgentTasks') + '</span></div>';
  }

  function downloadCsv() {
    var g = S.game, rows = [['round', 'task', 'owner', 'urgent', 'start_day', 'done_day', 'cycle_time_days', 'days_waiting_in_queues', 'column_at_end', 'blocked_at_end', 'helped_by', 'path']];
    var passive = {}; E.columns(g).forEach(function (c) { if (c.type === 'passive') passive[c.id] = true; });
    Object.keys(g.cards).map(function (k) { return g.cards[k]; }).sort(function (a, b) { return a.round - b.round || a.no - b.no; }).forEach(function (c) {
      var p = g.players[c.owner], path = c.path || [], wait = 0;
      for (var i = 0; i < path.length - 1; i++) if (passive[path[i].c]) wait += path[i + 1].d - path[i].d;
      rows.push([c.round, c.no, p ? p.name : '', c.urgent ? 'yes' : 'no', c.startDay, c.doneDay || '', c.doneDay ? c.doneDay - c.startDay + 1 : '', c.doneDay ? wait : '',
        colLabel(c.col), c.blocked ? 'yes' : 'no',
        c.helpers ? Object.keys(c.helpers).map(function (h) { return g.players[h] ? g.players[h].name : '?'; }).join(' | ') : '',
        path.map(function (s) { return colLabel(s.c) + '@' + s.d; }).join(' > ')]);
    });
    rows.push([]);
    var cols = E.columns(g);
    rows.push(['round', 'day'].concat(cols.map(function (c) { return colLabel(c.id); }), [colLabel('done'), 'blocked']));
    [1, 2].forEach(function (r) {
      var m = E.metrics(g, r);
      if (m) m.days.forEach(function (d) { rows.push([r, d.day].concat(cols.map(function (c) { return d.c[c.id] || 0; }), [d.done, d.blocked])); });
    });
    var csv = rows.map(function (r) { return r.map(function (v) { v = String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }).join(','); }).join('\n');
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv' }));
    a.download = 'kanban-flow-game-' + S.code + '.csv'; a.click();
  }

  // ================================================================ events
  function rerender() { [$app, $ov].concat([].slice.call(document.querySelectorAll('[id]'))).forEach(function (x) { x._html = null; }); render(); }
  document.addEventListener('click', function (e) {
    var ov = e.target.closest('[data-ovclose]');
    if (ov && e.target === ov) { S.setup = false; renderSetup(); return; }
    var b = e.target.closest('button,[data-lang]'); if (!b) return;
    var d = b.dataset;
    if (d.lang) { lang = d.lang; localStorage.setItem('kfg:lang', lang); $app._html = null; document.querySelectorAll('[id]').forEach(function (x) { x._html = null; }); S.code ? rerender() : renderHome(); return; }
    if (d.copy) { copy(d.copy === 'fac' ? baseUrl() + '#' + S.code + '/host/' + S.game.facilitator : inviteUrl()); return; }
    if (d.reclaim) { claim(d.reclaim); return; }
    if (d.results != null) { S.resultsTab = d.results === '0'; $app._html = null; $app.innerHTML = ''; render(); return; }
    if (d.csv) { downloadCsv(); return; }
    if (d.setup != null) { S.setup = d.setup === '1'; renderSetup(); return; }
    if (d.addcol) { act(function (g) { return E.addActiveColumn(g); }); return; }
    if (d.rmcol) { act(function (g) { return E.removeColumn(g, d.rmcol); }); return; }
    if (d.togq) { act(function (g) { return E.togglePassiveAfter(g, d.togq); }); return; }
    if (d.roll) {
      S.rolling = true; renderTurn();
      var started = Date.now();
      act(function (g) { return E.roll(g, S.me); }).then(function () {
        setTimeout(function () { S.rolling = false; var el = document.getElementById('sTurn'); if (el) el._html = null; render(); }, Math.max(0, 550 - (Date.now() - started)));
      });
      return;
    }
    if (d.start) { act(function (g) { return E.apply(g, S.me, { type: 'start' }); }); return; }
    if (d.act) { act(function (g) { return E.apply(g, S.me, { type: d.act, card: d.card }); }); return; }
    if (d.skip) { act(function (g) { return E.forceEndTurn(g, d.skip); }); return; }
    if (d.remove) {
      var p = S.game.players[d.remove];
      if (p && confirm(t('remove', { name: p.name }))) act(function (g) { return E.removePlayer(g, d.remove); });
      return;
    }
    if (d.fac) {
      var f = d.fac;
      if (f === 'start1') act(function (g) { return E.startRound(g, 1); });
      if (f === 'start2') act(function (g) { return E.startRound(g, 2); });
      if (f === 'debrief') act(function (g) { return E.showDebrief(g); });
      if (f === 'suggest') act(function (g) { return E.updateSettings(g, { wip: E.suggestWip(g) }); });
      if (f === 'nextDay') {
        var g0 = S.game, all = E.playerList(g0).every(function (p) { return g0.turns[p.id] && g0.turns[p.id].done; });
        if (all || confirm(t('nextDayConfirm'))) act(function (g) { return E.nextDay(g); });
      }
      if (f === 'endRound' && confirm(t('endRoundConfirm'))) act(function (g) { return E.endRound(g); });
    }
  });
  document.addEventListener('change', function (e) {
    var el = e.target, k = el.dataset && el.dataset.set; if (!k) return;
    var patch = {}, val = el.type === 'checkbox' ? el.checked : el.value;
    var dot = k.indexOf('.'), head = dot < 0 ? k : k.slice(0, dot), id = dot < 0 ? null : k.slice(dot + 1);
    if (head === 'wip') { patch.wip = {}; patch.wip[id] = val; }
    else if (head === 'colName') { patch.colNames = {}; patch.colNames[id] = val; }
    else if (head === 'names') { patch.names = {}; patch.names[id] = val; }
    else patch[k] = val;
    act(function (g) { return E.updateSettings(g, patch); }).then(function () {
      if (document.activeElement === el) el.blur();
      rerender();
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && S.setup) { S.setup = false; renderSetup(); }
    if (e.key === 'Enter' && e.target.matches && e.target.matches('.modal input[type=text], .modal input[type=number], .fac input[type=number]')) e.target.blur();
  });
  // refresh "changed" highlights after their animation window
  setInterval(function () {
    var now = Date.now(), dirty = false;
    Object.keys(S.changedUntil).forEach(function (k) { if (S.changedUntil[k] <= now) { delete S.changedUntil[k]; dirty = true; } });
    if (dirty && S.game && document.getElementById('board')) renderBoard();
  }, 400);
  window.addEventListener('hashchange', route);

  // ================================================================ boot
  (async function boot() {
    renderHeader();
    try {
      S.sync = await window.Sync.connect(CFG);
    } catch (e) {
      console.error(e);
      $app.innerHTML = '<div class="home"><div class="panel"><p>' + esc(t('e_fb', { msg: e.message })) + '</p></div></div>';
      return;
    }
    route();
  })();
})();
