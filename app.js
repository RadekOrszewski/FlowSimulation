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
      hostBtn: 'Create new session', hostGroups: 'Parallel groups',
      groupName: 'Group {x}', wsTitle: 'Workshop {code}', wsChip: 'Workshop',
      wsSub: 'Share each group\'s link with its players. Columns, WIP limits, urgent tasks and days per round are shared by all groups.',
      wsGroupsLabel: 'Number of groups', wsGroupsLocked: 'Groups can be added or removed before round 1.',
      wsShared: 'Shared settings · all groups', wsRounds: 'Rounds · all groups', wsLink: 'Copy dashboard link', wsLinkHint: 'Bookmark this link to return to the dashboard from any device.',
      openBoard: 'Open board ↗', copyLink: 'Copy', noPlayersYet: 'Nobody has joined yet.',
      startR1All: 'Start round 1 in all groups', startR2All: 'Start round 2 in all groups', endRoundAll: 'End round in all groups',
      showDebriefAll: 'Show the debrief to everyone', nextDayShort: 'Next day', addTasksShort: '+{n} tasks',
      gs_lobby: 'Waiting to start', gs_play: 'Round {n} · day {day} of {days}', gs_end: 'Round {n} finished', gs_debrief: 'Debrief',
      results: 'Results by group', resNone: 'Results appear here when a group finishes a round.', resPlaying: 'Round {n} in progress: day {day} of {days}.',
      resWaiting: 'This group hasn\'t started yet.',
      emptyGroupsConfirm: 'These groups have no players and will not start: {list}. Continue?', rmGroupConfirm: '{g} already has players. Remove the group anyway?',
      wsBack: '← All groups', wsSharedNote: 'Settings you change here apply to all groups.', wsNotFac: 'Only the facilitator can open this dashboard. Use your facilitator link.',
      wsNotFound: 'Workshop {code} doesn\'t exist.', teamN: 'Team · {n}',
      joinTitle: 'Join a session', joinText: 'Enter the code your facilitator shared.', joinBtn: 'Join',
      codePh: 'CODE',
      testMode: '<b>Test mode</b> – no database configured. Sessions sync only between tabs of this browser. Open several tabs to rehearse; add a Firebase config in <span class="mono">config.js</span> to play online.',
      notFound: 'Session <b>{code}</b> not found.', backHome: 'Back to start',
      joinAs: 'Join session {code}', yourName: 'Your name', namePh: 'e.g. Anna', enter: 'Enter the board',
      pickAvatar: 'Pick your avatar', avatarTakenHint: 'Greyed-out avatars are already taken.', e_avatarTaken: 'Someone just took that avatar — pick another one.',
      blIdle: 'Tasks appear here when the round starts.', blHint: 'Drag a task onto {col} — or click it.', blEmpty: 'The backlog is empty. The facilitator can add more tasks.',
      addTasks: '+ Add {n} tasks to the backlog', inBacklog: '{n} tasks in the backlog', l_backlogAdd: 'Facilitator added {n} tasks to the backlog', e_taskGone: 'Someone else just took that task — pick another one.', e_backlogFull: 'The backlog is full.',
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
      step_start: 'Start a new task — drag one from the Backlog.',
      step_any: 'Move, unblock or start: click a highlighted card or drag a task from the Backlog.',
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
      k_finished: 'Tasks finished', k_started: 'Tasks started', k_ct85: 'Cycle time (85%)',
      k_wip85: 'Work in progress (85%)', k_tp: 'Throughput / day', k_wipEnd: 'Unfinished at end', k_helped: 'Tasks with help',
      days_u: 'days', nPlayers: 'Players: {n}', r1: 'Round 1', r2: 'Round 2', noWip: 'no WIP limits', withWip: 'WIP {dev}/{test}',
      cfd: 'Cumulative flow', ctDist: 'Cycle time distribution', ctAxis: 'cycle time (days)', tasksAxis: 'tasks',
      csv: 'Download data (CSV)', newSession: 'New session', backToBoard: 'Back to board',
      // errors
      e_illegal: 'The board changed in the meantime — choose again.', e_conflict: 'Someone was faster — the board was updated.',
      e_notYourTurn: 'Not your turn yet.', e_alreadyRolled: 'You already rolled today.', e_noSession: 'Session not found.',
      e_badPhase: 'Not possible at this stage.', e_noPlayers: 'At least one player must join first.', e_nameRequired: 'Please enter your name.',
      e_generic: 'Something went wrong: {msg}', connecting: 'Connecting…',
      e_fb: 'Could not connect to Firebase. Check config.js and that Anonymous sign-in and the Realtime Database are enabled. ({msg})',
      colStep: 'Step {n}', colWait: 'Ready for {next}', queue: 'queue · waiting', urgent: 'URGENT',
      rQueue: 'Queue columns ({names}) are waiting areas: no work happens there and tasks there can\'t be blocked. Moving a task in and moving it out take one action each.',
      rUrgent: 'Urgent tasks (about {p}% of new tasks) are marked ⚡ and shown at the top of their column. How you treat them is up to you.',
      rNoExpedite: 'Urgent tasks still respect WIP limits.',
      boardSetup: 'Board', setupBtn: 'Board & rules setup', renameBtn: 'Rename columns',
      setupTitle: 'Board & rules setup', columnsTitle: 'Columns & WIP limits',
      colType: 'Type', colNameH: 'Name', typeBacklog: 'Backlog', typeDone: 'Done', typeActive: 'Work step', typeQueue: 'Queue',
      kind_execution: '▶ Execution', kind_analysis: '▶ Analysis', kindHint: 'Sets the colour in the cumulative flow diagram (Analysis red, Execution orange). Can be changed any time.',
      measure: 'Measure', change: 'Change',
      addStep: 'Add work step', addQueue: 'Add queue between {a} and {b}', removeCol: 'Remove column',
      queueHelp: 'A queue is a passive column between two work steps (e.g. “Ready for Testing”). It makes waiting time visible: tasks sit there until someone pulls them into the next step.',
      structLocked: 'The board structure is fixed once round 1 has started, so both rounds can be compared. Names and WIP limits can still be changed.',
      wipR2: 'WIP limit (round 2)', wipHint: '0 = no limit.', wipLive: 'Changes apply to the board immediately and are recorded for the debrief.',
      wipTitleLive: 'WIP limits (live)', wipNoPlayers: 'A suggestion based on group size appears once players have joined.',
      urgentTitle: 'Urgent tasks', urgentPct: 'Share of new tasks that are urgent',
      urgentShort: 'Urgent',
      urgentHelp2: 'The next card in the backlog shows whether it is urgent. Urgent tasks are marked and kept at the top of their column, but players are not forced to work on them first. Settings for round 2 can be changed after round 1.',
      urgentLocked: 'Urgent settings can be changed between rounds.',
      done: 'Done', close: 'Close',
      l_wipChange: 'Facilitator set the WIP limit of {col} to {wip}',
      k_wait: 'Time waiting in queues (85%)', k_fe: 'Flow efficiency', k_ctUrgent: 'Cycle time (85%) · urgent', k_ctStd: 'Cycle time (85%) · standard', k_urgentDone: 'Urgent tasks finished',
      wipChanged: 'WIP limits changed during round 2:', allTasks: 'all tasks', urgentTasks: 'urgent tasks',
      footer: 'Inspired by Featureban, a game by Mike Burrows.'
    },
    pl: {
      tagline: 'Symulacja Kanban w stylu Featureban do warsztatów online. Wszyscy grają na tej samej, żywej tablicy — każdy we własnej przeglądarce.',
      heroA: 'Poczuj przepływ.', heroB: 'Przestań zaczynać, zacznij kończyć.',
      hostTitle: 'Poprowadź sesję', hostText: 'Utwórz tablicę, udostępnij kod i przeprowadź grupę przez dwie rundy: bez limitów WIP i z limitami.',
      hostBtn: 'Utwórz nową sesję', hostGroups: 'Równoległe grupy',
      groupName: 'Grupa {x}', wsTitle: 'Warsztat {code}', wsChip: 'Warsztat',
      wsSub: 'Udostępnij każdej grupie jej link. Kolumny, limity WIP, pilne zadania i liczba dni są wspólne dla wszystkich grup.',
      wsGroupsLabel: 'Liczba grup', wsGroupsLocked: 'Grupy można dodawać i usuwać przed rundą 1.',
      wsShared: 'Wspólne ustawienia · wszystkie grupy', wsRounds: 'Rundy · wszystkie grupy', wsLink: 'Kopiuj link do panelu', wsLinkHint: 'Zapisz ten link, by wrócić do panelu z dowolnego urządzenia.',
      openBoard: 'Otwórz tablicę ↗', copyLink: 'Kopiuj', noPlayersYet: 'Nikt jeszcze nie dołączył.',
      startR1All: 'Rozpocznij rundę 1 we wszystkich grupach', startR2All: 'Rozpocznij rundę 2 we wszystkich grupach', endRoundAll: 'Zakończ rundę we wszystkich grupach',
      showDebriefAll: 'Pokaż podsumowanie wszystkim', nextDayShort: 'Następny dzień', addTasksShort: '+{n} zadań',
      gs_lobby: 'Czeka na start', gs_play: 'Runda {n} · dzień {day} z {days}', gs_end: 'Runda {n} zakończona', gs_debrief: 'Podsumowanie',
      results: 'Wyniki grup', resNone: 'Wyniki pojawią się tu, gdy grupa skończy rundę.', resPlaying: 'Trwa runda {n}: dzień {day} z {days}.',
      resWaiting: 'Ta grupa jeszcze nie zaczęła.',
      emptyGroupsConfirm: 'Te grupy nie mają graczy i nie wystartują: {list}. Kontynuować?', rmGroupConfirm: 'W grupie {g} są już gracze. Usunąć ją mimo to?',
      wsBack: '← Wszystkie grupy', wsSharedNote: 'Zmiany ustawień tutaj dotyczą wszystkich grup.', wsNotFac: 'Ten panel jest dostępny tylko dla prowadzącego. Użyj swojego linku prowadzącego.',
      wsNotFound: 'Warsztat {code} nie istnieje.', teamN: 'Zespół · {n}',
      joinTitle: 'Dołącz do sesji', joinText: 'Wpisz kod od prowadzącego.', joinBtn: 'Dołącz',
      codePh: 'KOD',
      testMode: '<b>Tryb testowy</b> – brak skonfigurowanej bazy. Sesje synchronizują się tylko między kartami tej przeglądarki. Otwórz kilka kart, żeby przećwiczyć; dodaj konfigurację Firebase w <span class="mono">config.js</span>, aby grać online.',
      notFound: 'Nie znaleziono sesji <b>{code}</b>.', backHome: 'Wróć na start',
      joinAs: 'Dołącz do sesji {code}', yourName: 'Twoje imię', namePh: 'np. Anna', enter: 'Wejdź na tablicę',
      pickAvatar: 'Wybierz awatar', avatarTakenHint: 'Wyszarzone awatary są już zajęte.', e_avatarTaken: 'Ktoś właśnie wybrał ten awatar — wybierz inny.',
      blIdle: 'Zadania pojawią się tu po rozpoczęciu rundy.', blHint: 'Przeciągnij zadanie do: {col} — albo kliknij je.', blEmpty: 'Backlog jest pusty. Prowadzący może dodać zadania.',
      addTasks: '+ Dodaj {n} zadań do backlogu', inBacklog: 'Zadań w backlogu: {n}', l_backlogAdd: 'Prowadzący dodaje {n} zadań do backlogu', e_taskGone: 'Ktoś właśnie wziął to zadanie — wybierz inne.', e_backlogFull: 'Backlog jest pełny.',
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
      step_start: 'Zacznij nowe zadanie — przeciągnij je z Backlogu.',
      step_any: 'Przesuń, odblokuj lub zacznij: kliknij podświetloną kartę albo przeciągnij zadanie z Backlogu.',
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
      k_finished: 'Ukończone zadania', k_started: 'Rozpoczęte zadania', k_ct85: 'Czas cyklu (85%)',
      k_wip85: 'Praca w toku – WIP (85%)', k_tp: 'Przepustowość / dzień', k_wipEnd: 'Nieukończone na koniec', k_helped: 'Zadania z pomocą',
      days_u: 'dni', nPlayers: 'graczy: {n}', r1: 'Runda 1', r2: 'Runda 2', noWip: 'bez limitów WIP', withWip: 'WIP {dev}/{test}',
      cfd: 'Skumulowany przepływ (CFD)', ctDist: 'Rozkład czasu cyklu', ctAxis: 'czas cyklu (dni)', tasksAxis: 'zadania',
      csv: 'Pobierz dane (CSV)', newSession: 'Nowa sesja', backToBoard: 'Wróć do tablicy',
      e_illegal: 'Tablica zmieniła się w międzyczasie — wybierz ponownie.', e_conflict: 'Ktoś był szybszy — tablica została zaktualizowana.',
      e_notYourTurn: 'To jeszcze nie twój ruch.', e_alreadyRolled: 'Już rzucałeś/-aś dzisiaj.', e_noSession: 'Nie znaleziono sesji.',
      e_badPhase: 'Na tym etapie to niemożliwe.', e_noPlayers: 'Najpierw musi dołączyć co najmniej jeden gracz.', e_nameRequired: 'Wpisz swoje imię.',
      e_generic: 'Coś poszło nie tak: {msg}', connecting: 'Łączenie…',
      e_fb: 'Nie udało się połączyć z Firebase. Sprawdź config.js oraz czy włączone są logowanie anonimowe i Realtime Database. ({msg})',
      colStep: 'Krok {n}', colWait: 'Czeka na: {next}', queue: 'kolejka · oczekiwanie', urgent: 'PILNE',
      rQueue: 'Kolumny-kolejki ({names}) to miejsca oczekiwania: nikt tam nie pracuje, a zadań w nich nie da się zablokować. Wejście do kolejki i wyjście z niej to osobne akcje.',
      rUrgent: 'Pilne zadania (ok. {p}% nowych zadań) są oznaczone ⚡ i widoczne na górze kolumny. To, jak je potraktujecie, zależy od was.',
      rNoExpedite: 'Pilne zadania też podlegają limitom WIP.',
      boardSetup: 'Tablica', setupBtn: 'Ustawienia tablicy i zasad', renameBtn: 'Zmień nazwy kolumn',
      setupTitle: 'Ustawienia tablicy i zasad', columnsTitle: 'Kolumny i limity WIP',
      colType: 'Typ', colNameH: 'Nazwa', typeBacklog: 'Backlog', typeDone: 'Gotowe', typeActive: 'Etap pracy', typeQueue: 'Kolejka',
      kind_execution: '▶ Realizacja', kind_analysis: '▶ Analiza', kindHint: 'Ustala kolor na diagramie skumulowanego przepływu (Analiza czerwona, Realizacja pomarańczowa). Można zmienić w każdej chwili.',
      measure: 'Miara', change: 'Zmiana',
      addStep: 'Dodaj etap pracy', addQueue: 'Dodaj kolejkę między: {a} i {b}', removeCol: 'Usuń kolumnę',
      queueHelp: 'Kolejka to pasywna kolumna między dwoma etapami pracy (np. „Czeka na testy”). Pokazuje czas oczekiwania: zadania czekają tam, aż ktoś pobierze je do kolejnego etapu.',
      structLocked: 'Po starcie rundy 1 układ tablicy jest zablokowany, żeby obie rundy dało się porównać. Nazwy i limity WIP nadal można zmieniać.',
      wipR2: 'Limit WIP (runda 2)', wipHint: '0 = bez limitu.', wipLive: 'Zmiany działają od razu i są zapisywane do podsumowania.',
      wipTitleLive: 'Limity WIP (na żywo)', wipNoPlayers: 'Propozycja dopasowana do liczby graczy pojawi się, gdy dołączą gracze.',
      urgentTitle: 'Pilne zadania', urgentPct: 'Odsetek nowych zadań, które są pilne',
      urgentShort: 'Pilne',
      urgentHelp2: 'Kolejna karta w backlogu pokazuje, czy jest pilna. Pilne zadania są oznaczone i zawsze na górze kolumny, ale gracze nie muszą zajmować się nimi najpierw. Ustawienia na rundę 2 można zmienić po rundzie 1.',
      urgentLocked: 'Ustawienia pilnych zadań można zmieniać między rundami.',
      done: 'Gotowe', close: 'Zamknij',
      l_wipChange: 'Prowadzący ustawia limit WIP dla: {col} na {wip}',
      k_wait: 'Czas oczekiwania w kolejkach (85%)', k_fe: 'Efektywność przepływu', k_ctUrgent: 'Czas cyklu (85%) · pilne', k_ctStd: 'Czas cyklu (85%) · standardowe', k_urgentDone: 'Ukończone pilne zadania',
      wipChanged: 'Zmiany limitów WIP w rundzie 2:', allTasks: 'wszystkie zadania', urgentTasks: 'pilne zadania',
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
    prevCards: {}, changedUntil: {}, setup: false, rolling: false, busy: false, unsub: [], resultsTab: false,
    // workshop dashboard (facilitator, several groups)
    wsCode: null, ws: null, groups: {}, gpres: {}, wsUnsub: [], wsWatched: {}, resGroup: null, nGroups: 1,
    wsGroups: null   // codes of all groups when a facilitator has one group's board open
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
  async function runOn(code, fn) {
      var res = await S.sync.transact(code, function (g) {
        var r = fn(g);
        if (r.ok) r.events = r.events.filter(function (e) {
          return !QUIET[e.t] && !(e.t === 'skip' && e.step === 'block');
        }).map(function (e) { return named(g, e); });
        return r;
      });
      if (res.ok && res.events && res.events.length) S.sync.addLog(code, res.events);
      return res;
  }
  function errText(e) { return t('e_' + e) !== 'e_' + e ? t('e_' + e) : e; }
  function act(fn) { return actOn(S.code, fn); }
  async function actOn(code, fn) {
    if (S.busy) return { ok: false };
    S.busy = true;
    try {
      var res = await runOn(code, fn);
      if (!res.ok && res.error) toast(errText(res.error), true);
      return res;
    } catch (e) {
      console.error(e); toast(t('e_generic', { msg: e.message }), true); return { ok: false };
    } finally { S.busy = false; }
  }
  // Run the same change on several groups (one transaction each).
  async function actMany(codes, fn) {
    if (S.busy) return { ok: false };
    S.busy = true;
    var first = null, okN = 0;
    try {
      for (var i = 0; i < codes.length; i++) {
        var res = await runOn(codes[i], fn);
        if (res.ok) okN++; else if (!first && res.error) first = { code: codes[i], error: res.error };
      }
    } catch (e) { console.error(e); toast(t('e_generic', { msg: e.message }), true); }
    finally { S.busy = false; }
    if (first && !okN) toast(errText(first.error), true);
    return { ok: okN > 0 };
  }
  // Settings (columns, WIP, urgent %, days…) are shared by all groups of a workshop.
  function sharedCodes() { return S.wsCode && S.ws ? wsGroupCodes() : (S.wsGroups && S.wsGroups.length ? S.wsGroups : [S.code]); }
  function actShared(fn) { var c = sharedCodes(); return c.length > 1 ? actMany(c, fn) : actOn(c[0], fn); }
  function suggestShared() {
    var best = S.game;
    if (S.wsCode) wsGames().forEach(function (g) { if (E.playerList(g).length > E.playerList(best).length) best = g; });
    return E.suggestWip(best);
  }
  function withGame(g, fn) {
    var keep = S.game; S.game = g;
    try { return fn(); } finally { S.game = keep; }
  }

  // ================================================================ routing
  function route() {
    var h = decodeURIComponent(location.hash.slice(1));
    var w = h.match(/^ws\/([A-Z0-9]{5})(?:\/host\/([a-z0-9]+))?$/i);
    if (w) {
      var wc = w[1].toUpperCase();
      if (w[2]) { store().setItem('kfg:wsfac:' + wc, w[2]); history.replaceState(null, '', '#ws/' + wc); }
      if (S.code) leaveSession();
      openWorkshop(wc); return;
    }
    leaveWorkshop();
    var m = h.match(/^([A-Z0-9]{5})(?:\/host\/([a-z0-9]+))?$/i);
    if (!m) { leaveSession(); renderHome(); return; }
    var code = m[1].toUpperCase();
    if (m[2]) { store().setItem('kfg:fac:' + code, m[2]); history.replaceState(null, '', '#' + code); }
    openSession(code);
  }

  function leaveSession() {
    S.unsub.forEach(function (u) { try { u(); } catch (e) { } });
    S.unsub = []; S.code = null; S.game = null; S.log = []; S.me = null; S.fac = false; S.prevCards = {};
    S.wsGroups = null; S.wsGroupsWatch = false;
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
        if (S.fac && S.game.ws && !S.wsGroupsWatch) {
          S.wsGroupsWatch = true;
          S.unsub.push(S.sync.wsWatch(S.game.ws, function (ws) { S.wsGroups = ws ? arrOf(ws.groups) : null; }));
        }
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
    if (S.wsCode) {
      h += '<span class="chip">' + t('wsChip') + ' <b>' + S.wsCode + '</b></span>';
    } else if (S.code && g) {
      if (g.groupName) h += '<span class="chip grp">' + esc(t('groupName', { x: g.groupName })) + '</span>';
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
      '<div class="panel"><h2>' + t('hostTitle') + '</h2><p class="muted">' + t('hostText') + '</p>' +
      '<label class="f">' + t('hostGroups') + '</label><div class="seg" role="radiogroup">' + [1, 2, 3, 4].map(function (n) {
        return '<button type="button" role="radio" aria-checked="' + (S.nGroups === n) + '" class="' + (S.nGroups === n ? 'on' : '') + '" data-hostn="' + n + '">' + n + '</button>';
      }).join('') + '</div>' +
      '<button class="btn y" id="hostBtn" style="margin-top:14px">' + t('hostBtn') + '</button></div>' +
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

  // A session is a workshop with 1-4 parallel groups; each group is its own board with its own code.
  async function hostSession() {
    var fid = 'f' + rid(10), wcode = null;
    for (var i = 0; i < 6 && !wcode; i++) {
      var c = newCode();
      if (await S.sync.wsCreate(c, { facilitator: fid, groups: [], createdAt: Date.now() })) wcode = c;
    }
    if (!wcode) { toast('Could not create a session', true); return; }
    store().setItem('kfg:wsfac:' + wcode, fid);
    var settings = null;
    for (var k = 0; k < S.nGroups; k++) {
      var code = await createGroup(wcode, fid, k, settings);
      if (!code) break;
      if (!settings) settings = E.newGame(fid).settings;
    }
    location.hash = 'ws/' + wcode;
  }
  var LETTERS = 'ABCD';
  async function createGroup(wcode, fid, idx, settings) {
    for (var i = 0; i < 6; i++) {
      var code = newCode();
      var game = E.newGame(fid, Date.now(), { ws: wcode, group: idx, groupName: LETTERS[idx], settings: settings || undefined });
      if (await S.sync.create(code, game)) {
        store().setItem('kfg:fac:' + code, fid);
        await S.sync.wsUpdate(wcode, function (ws) { var gl = arrOf(ws.groups); gl.push(code); ws.groups = gl; return true; });
        return code;
      }
    }
    toast('Could not create a group', true); return null;
  }
  function arrOf(x) { return !x ? [] : Array.isArray(x) ? x.filter(Boolean) : Object.keys(x).sort(function (a, b) { return a - b; }).map(function (k) { return x[k]; }); }

  // ================================================================ workshop dashboard
  function wsGroupCodes() { return S.ws ? arrOf(S.ws.groups) : []; }
  function wsGames() { return wsGroupCodes().map(function (c) { return S.groups[c]; }).filter(Boolean); }
  function leaveWorkshop() {
    if (!S.wsCode) return;
    S.wsUnsub.forEach(function (u) { try { u(); } catch (e) { } });
    S.wsUnsub = []; S.wsWatched = {}; S.wsCode = null; S.ws = null; S.groups = {}; S.gpres = {};
    S.game = null; S.fac = false; S.setup = false; $app._html = null;
  }
  function openWorkshop(code) {
    if (S.wsCode === code) return;
    leaveWorkshop();
    S.wsCode = code; S.wsLoaded = false;
    $app._html = null;
    S.wsUnsub.push(S.sync.wsWatch(code, function (ws) {
      S.ws = ws; S.wsLoaded = true;
      wsGroupCodes().forEach(function (c) {
        if (S.wsWatched[c]) return;
        S.wsWatched[c] = true;
        S.wsUnsub.push(S.sync.watch(c, function (g) { S.groups[c] = g ? E.norm(g) : null; syncTemplate(); renderWorkshop(); }));
        S.wsUnsub.push(S.sync.watchPresence(c, function (p) { S.gpres[c] = p || {}; renderWorkshop(); }));
      });
      syncTemplate(); renderWorkshop();
    }));
  }
  // The setup dialog edits "the" game: on the dashboard that is the first group, and every change goes to all groups.
  function syncTemplate() {
    var codes = wsGroupCodes(), g = codes.length ? S.groups[codes[0]] : null;
    S.game = g || null; S.code = null;
    S.fac = !!(S.ws && store().getItem('kfg:wsfac:' + S.wsCode) === S.ws.facilitator);
  }
  function groupStatus(g) {
    if (g.phase === 'lobby') return t('gs_lobby');
    if (g.phase === 'playing') return t('gs_play', { n: g.round, day: Math.min(g.day, g.settings.days), days: g.settings.days });
    if (g.phase === 'roundEnd') return t('gs_end', { n: g.round });
    return t('gs_debrief');
  }
  function groupCard(code) {
    var g = S.groups[code], pres = S.gpres[code] || {};
    if (!g) return '<div class="gcard"><div class="small muted">…</div></div>';
    var url = baseUrl() + '#' + code, list = E.playerList(g), active = g.settings.turnMode === 'turns' && g.phase === 'playing' ? E.activePlayerId(g) : null;
    var doneN = list.filter(function (p) { return g.turns[p.id] && g.turns[p.id].done; }).length;
    var html = '<div class="gcard"><div class="gh"><b>' + esc(t('groupName', { x: g.groupName || '?' })) + '</b><span class="gcode">' + code + '</span>' +
      '<span class="gstat ' + g.phase + '">' + groupStatus(g) + '</span>' +
      (g.phase === 'lobby' && wsGroupCodes().length > 1 ? '<button class="x" data-rmgroup="' + code + '" title="✕">✕</button>' : '') + '</div>';
    if (g.phase === 'playing') html += '<div class="progress"><i style="width:' + Math.round((g.day - 1) / g.settings.days * 100) + '%"></i></div>';
    html += '<div class="glink"><input type="text" readonly value="' + esc(url) + '" aria-label="' + esc(t('invite')) + '"><button class="btn ghost sm" data-copyurl="' + esc(url) + '">' + t('copyLink') + '</button></div>';
    html += list.length ? '<ul class="gplayers">' + list.map(function (p) {
      var tn = g.turns[p.id], st = '';
      if (g.phase === 'playing') st = tn && tn.done ? '✓' : tn && tn.roll ? '🎲 ' + tn.roll : active === p.id ? '▶' : '';
      return '<li>' + av(p, 34) + '<span class="on-dot' + (pres[p.id] ? ' on' : '') + '"></span><span class="pname">' + esc(p.name) + '</span><span class="pstat">' + st + '</span></li>';
    }).join('') + '</ul>' : '<p class="small muted gempty">' + t('noPlayersYet') + '</p>';
    html += '<div class="gbtns"><a class="btn ghost sm" target="_blank" rel="noopener" href="' + esc(baseUrl() + '#' + code + '/host/' + g.facilitator) + '">' + t('openBoard') + '</a>';
    if (g.phase === 'playing') {
      html += '<span class="small muted" style="margin-right:auto">' + t('playersDone', { n: doneN, m: list.length }) + '</span>' +
        '<button class="btn ghost sm" data-gfac="addBacklog" data-gcode="' + code + '" title="' + esc(t('inBacklog', { n: E.backlogTasks(g).length })) + '">' + t('addTasksShort', { n: E.BACKLOG_ADD }) + '</button>' +
        '<button class="btn ghost sm" data-gfac="nextDay" data-gcode="' + code + '">' + t('nextDayShort') + '</button>';
    }
    return html + '</div></div>';
  }
  function wsResults() {
    var codes = wsGroupCodes().filter(function (c) { return S.groups[c]; });
    var any = codes.some(function (c) { var g = S.groups[c]; return g.round > 1 || g.phase === 'roundEnd' || g.phase === 'debrief'; });
    if (!any) return '';
    if (!S.resGroup || codes.indexOf(S.resGroup) < 0) S.resGroup = codes[0];
    var g = S.groups[S.resGroup], body;
    var r2done = g.round === 2 && (g.phase === 'roundEnd' || g.phase === 'debrief');
    if (r2done) body = withGame(g, function () { return debriefBody(g); });
    else if (E.metrics(g, 1) && (g.round === 2 || g.phase === 'roundEnd'))
      body = withGame(g, function () { return roundSummary(1); }) +
        (g.phase === 'playing' ? '<p class="small muted">' + t('resPlaying', { n: g.round, day: g.day, days: g.settings.days }) + '</p>' : '');
    else if (g.phase === 'playing') body = '<p class="muted">' + t('resPlaying', { n: g.round, day: g.day, days: g.settings.days }) + '</p>';
    else body = '<p class="muted">' + t('resWaiting') + '</p>';
    return '<section class="ws-results"><div class="row" style="flex-wrap:wrap;align-items:flex-end"><h2 style="flex:1 1 auto;margin:0">' + t('results') + '</h2>' +
      (r2done || g.phase === 'roundEnd' ? '<button class="btn ghost sm" style="flex:0 0 auto" data-gcsv="' + S.resGroup + '">' + t('csv') + '</button>' : '') + '</div>' +
      '<div class="tabs" role="tablist">' + codes.map(function (c) {
        var gg = S.groups[c], on = c === S.resGroup;
        return '<button role="tab" aria-selected="' + on + '" class="tab' + (on ? ' on' : '') + '" data-restab="' + c + '">' + esc(t('groupName', { x: gg.groupName })) + '<small>' + groupStatus(gg) + '</small></button>';
      }).join('') + '</div><div class="tabbody results">' + body + '</div></section>';
  }
  function wsControls() {
    var games = wsGames(), g = S.game; if (!g) return '';
    var s = g.settings;
    var lobby = games.every(function (x) { return x.phase === 'lobby'; });
    var anyPlaying = games.some(function (x) { return x.phase === 'playing'; });
    var r1done = games.some(function (x) { return x.phase === 'roundEnd' && x.round === 1; });
    var r2end = games.some(function (x) { return x.phase === 'roundEnd' && x.round === 2; });
    var n = wsGroupCodes().length;
    var html = '<div class="panel fac"><h3>' + t('wsGroupsLabel') + '</h3>' +
      '<div class="seg">' + [1, 2, 3, 4].map(function (k) { return '<button class="' + (k === n ? 'on' : '') + '" data-ngroups="' + k + '"' + (lobby ? '' : ' disabled') + '>' + k + '</button>'; }).join('') + '</div>' +
      '<p class="small muted" style="margin:6px 0 0">' + t('wsGroupsLocked') + '</p></div>';
    html += '<div class="panel fac"><h3>' + t('wsRounds') + '</h3><div class="stack-btns" style="margin-top:4px">';
    if (lobby) html += '<button class="btn y" data-wsfac="start1">' + t('startR1All') + '</button>';
    if (anyPlaying) html += '<button class="btn ghost" data-wsfac="endRound">' + t('endRoundAll') + '</button>';
    if (r1done) html += '<button class="btn y" data-wsfac="start2">' + t('startR2All') + '</button>';
    if (r2end) html += '<button class="btn y" data-wsfac="debrief">' + t('showDebriefAll') + '</button>';
    if (!lobby && !anyPlaying && !r1done && !r2end) html += '<p class="small muted" style="margin:0">' + t('gs_debrief') + '</p>';
    html += '</div></div>';
    if (g.phase !== 'debrief') {
      html += '<div class="panel fac"><h3>' + t('wsShared') + '</h3>' + boardSummary(g) +
        '<label class="f">' + t('daysPerRound') + '</label><input type="number" min="3" max="40" value="' + s.days + '" data-set="days">';
      if (lobby) html += '<label class="f">' + t('turnMode') + '</label><select data-set="turnMode"><option value="simultaneous"' + (s.turnMode !== 'turns' ? ' selected' : '') + '>' + t('tm_sim') + '</option><option value="turns"' + (s.turnMode === 'turns' ? ' selected' : '') + '>' + t('tm_turns') + '</option></select>';
      html += '<label class="checkline"><input type="checkbox" data-set="autoAdvance"' + (s.autoAdvance ? ' checked' : '') + '> ' + t('autoAdv') + '</label>';
      var r2live = games.some(function (x) { return x.round === 2 && x.phase === 'playing'; });
      if (!anyPlaying || r2live) html += '<div class="fsec"><div class="fsec-h">' + t(r2live ? 'wipTitleLive' : 'wipTitle') + '</div>' + wipEditor(g, r2live) + '</div>';
      if (!anyPlaying) html += '<div class="fsec"><div class="fsec-h">' + t('urgentTitle') + '</div>' + urgentEditor(g) + '</div>';
      html += '</div>';
    }
    return html;
  }
  function renderWorkshop() {
    if (!S.wsCode) return;
    renderHeader();
    if (!S.wsLoaded) return;
    if (!S.ws) { setHTML($app, '<div class="home"><div class="panel"><p>' + t('wsNotFound', { code: esc(S.wsCode) }) + '</p><a class="btn" href="#">' + t('backHome') + '</a></div></div>'); return; }
    if (!S.fac) { setHTML($app, '<div class="home"><div class="panel"><p>' + t('wsNotFac') + '</p><a class="btn" href="#">' + t('backHome') + '</a></div></div>'); return; }
    renderSetup();
    var codes = wsGroupCodes();
    setHTML($app, '<div class="ws"><div class="ws-head"><div><h1>' + t('wsTitle', { code: S.wsCode }) + '</h1><p class="muted">' + t('wsSub') + '</p></div>' +
      '<button class="btn ghost sm" style="flex:0 0 auto" data-copy="ws" title="' + esc(t('wsLinkHint')) + '">' + t('wsLink') + '</button></div>' +
      '<div class="ws-grid"><div class="ws-main"><div class="gcards n' + codes.length + '">' + codes.map(groupCard).join('') + '</div>' + wsResults() + '</div>' +
      '<aside class="ws-side">' + wsControls() + '</aside></div></div>');
  }
  async function setGroupCount(n) {
    var codes = wsGroupCodes();
    if (n === codes.length || !S.game) return;
    if (n > codes.length) {
      for (var i = codes.length; i < n; i++) {
        var used = wsGames().map(function (x) { return x.group; }), idx = 0;
        while (used.indexOf(idx) >= 0) idx++;
        var c = await createGroup(S.wsCode, S.ws.facilitator, idx, S.game.settings);
        if (!c) return;
        await waitFor(function () { return S.groups[c]; });
      }
    } else {
      var drop = codes.slice(n);
      var withPlayers = drop.filter(function (c) { return S.groups[c] && E.playerList(S.groups[c]).length; });
      if (withPlayers.length && !confirm(t('rmGroupConfirm', { g: withPlayers.map(function (c) { return t('groupName', { x: S.groups[c].groupName }); }).join(', ') }))) return;
      await S.sync.wsUpdate(S.wsCode, function (ws) { ws.groups = arrOf(ws.groups).slice(0, n); return true; });
    }
  }
  function waitFor(fn) {
    return new Promise(function (res) { var k = 0; (function tick() { if (fn() || k++ > 40) res(); else setTimeout(tick, 100); })(); });
  }
  async function removeGroup(code) {
    var g = S.groups[code];
    if (g && E.playerList(g).length && !confirm(t('rmGroupConfirm', { g: t('groupName', { x: g.groupName }) }))) return;
    await S.sync.wsUpdate(S.wsCode, function (ws) { ws.groups = arrOf(ws.groups).filter(function (c) { return c !== code; }); return true; });
  }
  async function wsFac(f) {
    var codes = wsGroupCodes();
    if (f === 'start1' || f === 'start2') {
      var n = f === 'start1' ? 1 : 2;
      var ready = codes.filter(function (c) { var g = S.groups[c]; return g && (n === 1 ? g.phase === 'lobby' : g.phase === 'roundEnd' && g.round === 1); });
      var empty = ready.filter(function (c) { return !E.playerList(S.groups[c]).length; });
      if (empty.length === ready.length) { toast(t('needPlayers'), true); return; }
      if (empty.length && !confirm(t('emptyGroupsConfirm', { list: empty.map(function (c) { return t('groupName', { x: S.groups[c].groupName }); }).join(', ') }))) return;
      actMany(ready.filter(function (c) { return empty.indexOf(c) < 0; }), function (g) { return E.startRound(g, n); });
    }
    if (f === 'endRound' && confirm(t('endRoundConfirm'))) actMany(codes.filter(function (c) { return S.groups[c] && S.groups[c].phase === 'playing'; }), function (g) { return E.endRound(g); });
    if (f === 'debrief') actMany(codes.filter(function (c) { return S.groups[c] && S.groups[c].phase === 'roundEnd' && S.groups[c].round === 2; }), function (g) { return E.showDebrief(g); });
  }


  // ================================================================ avatars
  function avatarOf(p) {
    if (p && p.avatar && Avatars.has(p.avatar)) return p.avatar;
    var l = Avatars.list, i = ((p && p.seq) || 1) - 1;   // sessions from before avatars existed
    return l[((i % l.length) + l.length) % l.length].id;
  }
  function av(p, px) { return Avatars.svg(avatarOf(p), px); }
  function avName(id) { var a = Avatars.list.filter(function (x) { return x.id === id; })[0]; return a ? a.name[lang] || a.name.en : ''; }

  // ================================================================ join
  function renderJoin() {
    var g = S.game;
    var offline = E.playerList(g).filter(function (p) { return !S.presence[p.id]; });
    var html = '<div class="home" style="max-width:580px"><div class="panel" style="padding:24px">' +
      '<h2 style="margin-top:0">' + (g.groupName ? esc(t('groupName', { x: g.groupName })) + ' · ' : '') + t('joinAs', { code: S.code }) + '</h2>';
    if (offline.length) {
      html += '<p class="small muted">' + t('reclaim') + '</p><div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px">' +
        offline.map(function (p) { return '<button class="btn ghost sm" data-reclaim="' + p.id + '" style="display:inline-flex;align-items:center;gap:6px">' + av(p, 20) + esc(p.name) + '</button>'; }).join('') +
        '</div><p class="small muted">' + t('orNew') + '</p>';
    }
    var taken = {};
    E.playerList(g).forEach(function (p) { if (p.avatar) taken[p.avatar] = true; });
    if (!S.pickAv || taken[S.pickAv]) {
      var free = Avatars.list.filter(function (a) { return !taken[a.id]; });
      S.pickAv = (free.length ? free[Math.floor(Math.random() * free.length)] : Avatars.list[0]).id;
    }
    var nameVal = S.joinName || '';
    html += '<form id="nameForm"><label class="f">' + t('yourName') + '</label><input type="text" id="nameIn" maxlength="24" placeholder="' + t('namePh') + '" value="' + esc(nameVal) + '" autofocus>' +
      '<label class="f" style="margin-top:14px">' + t('pickAvatar') + '</label>' +
      '<div class="av-grid" role="radiogroup" aria-label="' + esc(t('pickAvatar')) + '">' + Avatars.list.map(function (a) {
        var nm = a.name[lang] || a.name.en;
        return '<button type="button" class="av-opt' + (a.id === S.pickAv ? ' sel' : '') + '" role="radio" aria-checked="' + (a.id === S.pickAv) + '" data-av="' + a.id + '" title="' + esc(nm) + '" aria-label="' + esc(nm) + '"' + (taken[a.id] ? ' disabled' : '') + '>' + Avatars.svg(a.id, 52) + '</button>';
      }).join('') + '</div>' +
      (Object.keys(taken).length ? '<div class="small muted">' + t('avatarTakenHint') + '</div>' : '') +
      '<div class="av-preview">' + Avatars.svg(S.pickAv, 44) + '<b id="avPrevName">' + esc(nameVal || avName(S.pickAv)) + '</b></div>' +
      '<button class="btn y" style="margin-top:12px;width:100%">' + t('enter') + '</button></form></div></div>';
    setHTML($app, html);
    var nameIn = document.getElementById('nameIn');
    if (nameIn) nameIn.oninput = function () {
      S.joinName = nameIn.value;
      var pv = document.getElementById('avPrevName'); if (pv) pv.textContent = nameIn.value || avName(S.pickAv);
    };
    document.querySelectorAll('[data-av]').forEach(function (b) {
      b.onclick = function () { S.pickAv = b.getAttribute('data-av'); $app._html = null; renderJoin(); };
    });
    var f = document.getElementById('nameForm');
    if (f) f.onsubmit = async function (e) {
      e.preventDefault();
      var name = document.getElementById('nameIn').value;
      var pid = 'p' + rid(10), avId = S.pickAv;
      var res = await act(function (g) { return E.addPlayer(g, pid, name, avId); });
      if (res.ok) { S.joinName = ''; claim(pid); }
      else { $app._html = null; renderJoin(); }
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

  // ================================================================ main render
  function render() {
    if (S.wsCode) { renderWorkshop(); return; }
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
      $app.innerHTML = '<div class="game"><section><div id="top"></div><div id="sPlayers"></div><div class="boardwrap"><div id="board" class="board"></div></div></section>' +
        '<aside class="side"><div id="sTurn"></div><div id="sFac"></div><div id="sRules"></div><div id="sLog"></div></aside></div>';
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
    var k = kpi(t('k_finished'), m.finished) + kpi(t('k_ct85'), fmt(m.p85CycleTime) + ' <span>' + t('days_u') + '</span>') +
      kpi(t('k_wip85'), fmt(m.p85Wip)) + kpi(t('k_wipEnd'), m.inProgress);
    if (m.hasQueues) k += kpi(t('k_fe'), m.flowEfficiency == null ? '–' : Math.round(m.flowEfficiency * 100) + '<span>%</span>');
    if (m.urgentStarted) k += kpi(t('k_ctUrgent'), fmt(m.p85CtUrgent) + ' <span>' + t('days_u') + '</span>');
    return '<div class="panel" style="margin-bottom:12px"><h3>' + t('resultsTitle', { n: n }) + '</h3>' +
      '<div class="kpis" style="margin:8px 0">' + k + '</div>' +
      '<div class="chart summary-chart">' + cfdSvg(m, cfdMax([m]), S.game.settings.days) + '</div>' + cfdLegend(m.columns) + '</div>';
  }
  function kpi(l, v) { return '<div class="kpi"><div class="l">' + l + '</div><div class="v"><b>' + v + '</b></div></div>'; }
  function fmt(x, d) { return x == null ? '–' : (Math.round(x * (d || 10)) / (d || 10)).toString(); }

  // ---------------------------------------------------------------- board
  function renderBoard() {
    var el = document.getElementById('board'); if (!el) return;
    if (S.dragNo) { S.boardStale = true; return; }   // don't pull the card from under the player's cursor
    S.boardStale = false;
    var g = S.game, now = Date.now(), cols = E.columns(g);
    var legal = S.me ? E.legalActions(g, S.me) : [];
    var byCard = {}; legal.forEach(function (a) { if (a.card) byCard[a.card] = a; });
    var canStart = legal.some(function (a) { return a.type === 'start'; });
    var cards = g.phase === 'lobby' ? [] : E.roundCards(g);
    var tn = S.me && g.turns[S.me];
    var myStepCanStart = tn && tn.roll && !tn.done && tn.steps.length && tn.steps[0] !== 'block';
    var startBlockedByWip = myStepCanStart && !canStart && !E.hasCapacity(g, E.firstCol(g)) && E.backlogTasks(g).length > 0;

    function card(c) {
      var p = g.players[c.owner] || { name: '?', color: '#dee2e6' };
      var a = byCard[c.id];
      var cls = 'card' + (c.owner === S.me ? ' mine' : '') + (c.blocked ? ' blocked' : '') + (c.urgent ? ' urgent' : '') + (a ? ' act' + (a.help ? ' help' : '') : '') +
        ((S.changedUntil[c.id] || 0) > now ? ' changed' : '') + (c.helpers ? ' helped' : '');
      var rot = (((c.no * 37) % 7) - 3) * 0.5;
      var tip = a ? t('tip_' + (a.help ? 'help_' : '') + a.type) : '';
      var title = esc(p.name) + (c.urgent ? ' · ' + t('urgent') : '');
      return '<button class="' + cls + '" style="--rot:' + rot + 'deg"' +
        (a ? ' data-act="' + a.type + '" data-card="' + c.id + '" title="' + esc(tip) + '"' : ' tabindex="-1" title="' + title + '"') + '>' +
        '<span class="no">#' + c.no + (c.urgent ? ' <span class="bolt">⚡</span>' : '') + '</span>' + (c.blocked ? '<span class="stamp">' + t('blocked') + '</span>' : '') +
        '<span class="own">' + av(p, 24) + '<span>' + esc(p.name) + '</span></span>' + (a ? '<span class="tip">' + esc(tip) + '</span>' : '') + '</button>';
    }
    function column(key, type) {
      var list = cards.filter(function (c) { return c.col === key; }).sort(function (a, b) {
        return (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0) || a.no - b.no;
      });
      var lim = E.limitOf(g, key), cnt = list.length;
      var badge = key === 'done' ? cnt : (g.round === 2 && lim ? cnt + ' / ' + lim : cnt);
      var full = lim && cnt >= lim;
      var cls = 'col' + (key === 'done' ? ' done' : '') + (type === 'passive' ? ' queue' : '') + (full ? ' full' : '');
      var drop = canStart && key === E.firstCol(g);
      return '<div class="' + cls + (drop ? ' dropzone' : '') + '"' + (drop ? ' data-drop="1"' : '') + '><div class="col-h"><b title="' + esc(colLabel(key)) + '">' + esc(colLabel(key)) + '</b><span class="wipb' + (g.round === 2 && lim ? ' on' : '') + (full ? ' full' : '') + '">' + badge + '</span></div>' +
        (type === 'passive' ? '<div class="qtag">' + t('queue') + '</div>' : '') +
        '<div class="col-b">' + (list.length ? list.map(card).join('') : '<div class="empty-col">' + t('emptyCol') + '</div>') + '</div></div>';
    }
    var playing = g.phase === 'playing';
    var bl = E.backlogTasks(g);
    var pick = !!S.me && canStart;
    var blList = !playing ? '<div class="bl-idle">' + t('blIdle') + '</div>'
      : !bl.length ? '<div class="bl-idle">' + t('blEmpty') + '</div>'
      : '<div class="bl-list">' + bl.map(function (u) {
          return '<button class="bl-card' + (u.urgent ? ' urgent' : '') + (pick ? ' pick' : '') + '"' +
            (pick ? ' draggable="true" data-pick="' + u.no + '" title="' + esc(t('blHint', { col: colLabel(E.firstCol(g)) })) + '"' : ' tabindex="-1"') + '>' +
            '<span>#' + u.no + '</span>' + (u.urgent ? '<em>⚡ ' + t('urgent') + '</em>' : '') + '</button>';
        }).join('') + '</div>';
    var backlog = '<div class="col backlog' + (pick ? ' picking' : '') + '"><div class="col-h"><b title="' + esc(colLabel('backlog')) + '">' + esc(colLabel('backlog')) + '</b><span class="wipb">' + (playing ? bl.length : '–') + '</span></div><div class="col-b">' +
      (pick ? '<div class="bl-hint">' + esc(t('blHint', { col: colLabel(E.firstCol(g)) })) + '</div>' : '') +
      (startBlockedByWip ? '<div class="stop-msg">' + t('stopStart') + '</div>' : '') + blList + '</div></div>';
    var tmpl = ['minmax(134px,164px)'].concat(cols.map(function (c) {
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
      var msg = help ? t('step_help') : t('step_' + step);
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
      (s.urgentPct > 0 || E.backlogTasks(g).some(function (b) { return b.urgent; }) ? '<div class="rule-note urg">⚡ ' + t('rUrgent', { p: s.urgentPct }) + ' ' + t('rNoExpedite') + '</div>' : '') +
      (g.round === 2 ? '<div class="rule-note wip">' + t('rWip', { list: wipList(E.columns(g), true) }) + '</div>' : (g.round === 1 ? '<div class="rule-note">' + t('rNoWip') + '</div>' : '')) +
      '</div></div>';
    setHTML(el, html);
  }

  // ---------------------------------------------------------------- players
  function renderPlayers() {
    var el = document.getElementById('sPlayers'); if (!el || !S.game) return;
    var g = S.game, active = g.settings.turnMode === 'turns' && g.phase === 'playing' ? E.activePlayerId(g) : null;
    var list = E.playerList(g);
    var html = '<div class="team-strip"><span class="team-h">' + (g.groupName ? esc(t('groupName', { x: g.groupName })) + ' · ' : '') + t('teamN', { n: list.length }) + '</span>';
    if (!list.length) html += '<span class="small muted">' + t('noPlayers') + '</span>';
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
      return '<li class="' + (p.id === S.me ? 'me' : '') + stCls + '"><span class="av-wrap">' + av(p, 30) + '<span class="on-dot' + (S.presence[p.id] ? ' on' : '') + '"></span></span>' +
        '<span class="pname' + (p.id === S.me ? ' me' : '') + '">' + esc(p.name) + (p.id === S.me ? ' (' + t('you') + ')' : '') + '</span>' +
        (st ? '<span class="pstat' + stCls + '">' + st + '</span>' : '') + controls + '</li>';
    }).join('') + '</ul></div>';
    setHTML(el, html);
  }

  // ---------------------------------------------------------------- log
  function logText(e) {
    if (!S.game) return '';
    var v = {
      name: esc(e.name), owner: esc(e.ownerName), no: e.no + (e.urgent ? ' ⚡' : ''), value: e.value, day: e.day, round: e.round,
      n: e.n, to: e.to ? esc(colLabel(e.to)) : '', col: e.col ? esc(colLabel(e.col)) : '', wip: e.wip > 0 ? e.wip : '∞'
    };
    if ((e.t === 'move' || e.t === 'unblock') && e.help) return t('l_help_' + e.t, v);
    return t('l_' + e.t, v);
  }
  function renderLog() {
    var el = document.getElementById('sLog'); if (!el) return;
    var items = S.log.slice(-80).reverse().map(function (e) {
      var sys = /dayEnd|roundStart|roundEnd|wipChange|backlogAdd/.test(e.t);
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
    if (g.ws) html += '<a class="btn ghost sm" href="#ws/' + esc(g.ws) + '" style="width:100%;margin-bottom:8px">' + t('wsBack') + '</a>' +
      '<div class="small muted" style="margin-bottom:8px">' + esc(t('groupName', { x: g.groupName })) + ' · ' + t('wsSharedNote') + '</div>';
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
        '<div class="fsec"><div class="fsec-h">' + t('inBacklog', { n: E.backlogTasks(g).length }) + '</div>' +
        '<button class="btn y" data-fac="addBacklog" style="width:100%">' + t('addTasks', { n: E.BACKLOG_ADD }) + '</button></div>' +
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
      var kindSel = '<select data-set="colKind.' + c.id + '" title="' + esc(t('kindHint')) + '">' +
        ['execution', 'analysis'].map(function (k) { return '<option value="' + k + '"' + ((c.kind || 'execution') === k ? ' selected' : '') + '>' + t('kind_' + k) + '</option>'; }).join('') + '</select>';
      rows += '<div class="srow' + (isQ ? ' q' : '') + '"><span class="stype">' + (isQ ? '⋯ ' + t('typeQueue') : kindSel) + '</span>' + nameInput('col', c.id) +
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
  // CFD colours: Done green, Execution orange, Analysis red, queues (awaiting) grey.
  // Several columns of the same kind get shades of the same colour.
  var CFD_SHADES = {
    execution: ['#d9480f', '#ffa94d', '#ffd8a8', '#f76707'],
    analysis: ['#c92a2a', '#ff8787', '#ffc9c9', '#f03e3e'],
    passive: ['#868e96', '#adb5bd', '#ced4da', '#dee2e6']
  };
  var CFD_DONE = '#2f9e44';
  function colKind(c) {
    if (c.type === 'passive') return 'passive';
    var cur = S.game && E.colById(S.game, c.id);   // kind can be changed after the round
    var k = (cur && cur.kind) || c.kind;
    return k === 'analysis' ? 'analysis' : 'execution';
  }
  function colColors(cols) {
    var out = { done: CFD_DONE }, used = { execution: 0, analysis: 0, passive: 0 };
    cols.forEach(function (c) { var k = colKind(c), sh = CFD_SHADES[k]; out[c.id] = sh[used[k]++ % sh.length]; });
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
  function histSvg(cts, maxX, maxY, urgentCts, p85) {
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
    if (p85 != null) {
      var px = L + p85 * bw;
      s += '<line x1="' + px + '" x2="' + px + '" y1="' + T + '" y2="' + (T + ih) + '" stroke="#f5b700" stroke-width="2" stroke-dasharray="5 4"/>' +
        '<text x="' + (px - 4) + '" y="' + (T + 10) + '" font-size="10" text-anchor="end" fill="#16213e" font-family="DM Mono, monospace">85% ≤ ' + p85 + '</text>';
    }
    s += '<text x="' + (L + iw / 2) + '" y="' + (H - 1) + '" font-size="10" text-anchor="middle" fill="#667085">' + esc(t('ctAxis')) + '</text>';
    return s + '</svg>';
  }

  // ================================================================ debrief
  function urgentCycleTimes(g, r) {
    return E.roundCards(g, r).filter(function (c) { return c.urgent && c.col === 'done'; }).map(function (c) { return c.doneDay - c.startDay + 1; });
  }
  function renderDebrief() {
    var g = S.game;
    setHTML($app, '<div class="results"><div class="row" style="flex-wrap:wrap"><h1 style="flex:1 1 auto">' + t('debriefTitle') + (g.groupName ? ' · ' + esc(t('groupName', { x: g.groupName })) : '') + '</h1>' +
      '<div style="flex:0 0 auto;display:flex;gap:8px"><button class="btn ghost sm" data-results="0">' + t('backToBoard') + '</button>' +
      (S.fac ? '<button class="btn ghost sm" data-csv="1">' + t('csv') + '</button>' : '') + '</div></div>' + debriefBody(g) + '</div>');
  }
  // Round 1 vs round 2 comparison for one game (uses S.game for labels: call through withGame for other groups)
  function debriefBody(g) {
    var m1 = E.metrics(g, 1), m2 = E.metrics(g, 2);
    var maxY = cfdMax([m1, m2]), maxX = Math.max(m1 ? m1.daysPlayed : 0, m2 ? m2.daysPlayed : 0);
    function cmp(label, a, b, unit, lowerBetter, dec) {
      var d = '';
      if (a != null && b != null && a !== b) {
        var better = lowerBetter == null ? null : lowerBetter ? b < a : b > a;
        var pct = a ? Math.round((b - a) / a * 100) : null;
        d = '<span class="delta ' + (better == null ? '' : better ? 'good' : 'bad') + '">' + (b > a ? '+' : '') + (pct != null ? pct + '%' : fmt(b - a)) + '</span>';
      }
      var u = unit ? ' <small>' + unit + '</small>' : '';
      return '<tr><th scope="row">' + label + '</th><td>' + fmt(a, dec) + (a != null ? u : '') + '</td><td>' + fmt(b, dec) + (b != null ? u : '') + '</td><td class="chg">' + d + '</td></tr>';
    }
    function pctOf(m, k) { return m && m[k] != null ? m[k] * 100 : null; }
    function roundSub(m) {
      if (!m) return '–';
      var s = m.wipLimits ? 'WIP ' + m.columns.map(function (c) { return c.wip > 0 ? c.wip : '∞'; }).join(' / ') : t('noWip');
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
      cmp(t('k_ct85'), m1 && m1.p85CycleTime, m2 && m2.p85CycleTime, t('days_u'), true) +
      cmp(t('k_wip85'), m1 && m1.p85Wip, m2 && m2.p85Wip, '', true) +
      cmp(t('k_tp'), m1 && m1.throughputPerDay, m2 && m2.throughputPerDay, '', false, 100) +
      cmp(t('k_started'), m1 && m1.started, m2 && m2.started, '', null, 1) +
      cmp(t('k_wipEnd'), m1 && m1.inProgress, m2 && m2.inProgress, '', true, 1) +
      cmp(t('k_helped'), m1 && m1.helpedCards, m2 && m2.helpedCards, '', false, 1);
    if (queues) kp += cmp(t('k_wait'), m1 && m1.p85Wait, m2 && m2.p85Wait, t('days_u'), true) +
      cmp(t('k_fe'), pctOf(m1, 'flowEfficiency'), pctOf(m2, 'flowEfficiency'), '%', false, 1);
    if (anyUrgent) kp += cmp(t('k_ctUrgent'), m1 && m1.p85CtUrgent, m2 && m2.p85CtUrgent, t('days_u'), true) +
      cmp(t('k_ctStd'), m1 && m1.p85CtStandard, m2 && m2.p85CtStandard, t('days_u'), true) +
      cmp(t('k_urgentDone'), m1 && m1.urgentFinished, m2 && m2.urgentFinished, '', null, 1);
    return '<p class="muted">' + t('nPlayers', { n: E.playerList(g).length }) + '</p>' + wipChanges +
      '<div class="panel cmp-panel"><table class="cmp-table"><thead><tr><th scope="col">' + t('measure') + '</th>' +
        '<th scope="col"><span class="rh r1">' + t('r1') + '</span><small>' + esc(roundSub(m1)) + '</small></th>' +
        '<th scope="col"><span class="rh r2">' + t('r2') + '</span><small>' + esc(roundSub(m2)) + '</small></th>' +
        '<th scope="col" class="chg">' + t('change') + '</th></tr></thead><tbody>' + kp + '</tbody></table></div>' +
      '<div class="rounds-h"><div><span class="rh r1">' + t('r1') + '</span> ' + esc(roundSub(m1)) + '</div><div><span class="rh r2">' + t('r2') + '</span> ' + esc(roundSub(m2)) + '</div></div>' +
      '<div class="charts">' +
      '<div class="panel chart"><h3>' + t('cfd') + '<span class="mob"> · ' + t('r1') + '</span></h3>' + (m1 ? cfdSvg(m1, maxY, maxX) + cfdLegend(m1.columns) : '') + '</div>' +
      '<div class="panel chart"><h3>' + t('cfd') + '<span class="mob"> · ' + t('r2') + '</span></h3>' + (m2 ? cfdSvg(m2, maxY, maxX) + cfdLegend(m2.columns) : '') + '</div>' +
      '<div class="panel chart"><h3>' + t('ctDist') + '<span class="mob"> · ' + t('r1') + '</span></h3>' + (m1 ? histSvg(m1.cycleTimes, ctMax, hMax, urgentCycleTimes(g, 1), m1.p85CycleTime) : '') + (anyUrgent ? histLegend() : '') + '</div>' +
      '<div class="panel chart"><h3>' + t('ctDist') + '<span class="mob"> · ' + t('r2') + '</span></h3>' + (m2 ? histSvg(m2.cycleTimes, ctMax, hMax, urgentCycleTimes(g, 2), m2.p85CycleTime) : '') + (anyUrgent ? histLegend() : '') + '</div>' +
      '</div>';
  }
  function histLegend() {
    return '<div class="legend"><span><i style="background:#16213e"></i>' + t('allTasks') + '</span><span><i style="background:#e03131"></i>' + t('urgentTasks') + '</span></div>';
  }

  function downloadCsv(gArg, codeArg) {
    if (gArg) return withGame(gArg, function () { downloadCsvCur(codeArg); });
    downloadCsvCur(S.code);
  }
  function downloadCsvCur(code) {
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
    a.download = 'kanban-flow-game-' + (g.groupName ? 'group-' + g.groupName + '-' : '') + code + '.csv'; a.click();
  }

  // ================================================================ events
  function rerender() { [$app, $ov].concat([].slice.call(document.querySelectorAll('[id]'))).forEach(function (x) { x._html = null; }); render(); }
  // ---------------------------------------------------------------- drag a task from the backlog
  function startTask(no) {
    act(function (g) { return E.apply(g, S.me, { type: 'start', no: Number(no) }); });
  }
  document.addEventListener('dragstart', function (e) {
    var c = e.target.closest && e.target.closest('[data-pick]'); if (!c) return;
    S.dragNo = c.getAttribute('data-pick');
    e.dataTransfer.effectAllowed = 'move';
    try { e.dataTransfer.setData('text/plain', S.dragNo); } catch (x) { }
    c.classList.add('dragging');
    document.body.classList.add('dragging-task');
  });
  function endDrag() {
    S.dragNo = null;
    document.body.classList.remove('dragging-task');
    document.querySelectorAll('.dragging,.drop-over').forEach(function (x) { x.classList.remove('dragging', 'drop-over'); });
    if (S.boardStale) renderBoard();
  }
  document.addEventListener('dragend', endDrag);
  document.addEventListener('dragover', function (e) {
    var z = e.target.closest && e.target.closest('[data-drop]');
    if (!z || !S.dragNo) return;
    e.preventDefault(); e.dataTransfer.dropEffect = 'move';
    z.classList.add('drop-over');
  });
  document.addEventListener('dragleave', function (e) {
    var z = e.target.closest && e.target.closest('[data-drop]');
    if (z && !z.contains(e.relatedTarget)) z.classList.remove('drop-over');
  });
  document.addEventListener('drop', function (e) {
    var z = e.target.closest && e.target.closest('[data-drop]');
    if (!z || !S.dragNo) return;
    e.preventDefault();
    var no = S.dragNo;
    endDrag();
    startTask(no);
  });

  document.addEventListener('click', function (e) {
    var ov = e.target.closest('[data-ovclose]');
    if (ov && e.target === ov) { S.setup = false; renderSetup(); return; }
    var b = e.target.closest('button,[data-lang]'); if (!b) return;
    var d = b.dataset;
    if (d.lang) { lang = d.lang; localStorage.setItem('kfg:lang', lang); $app._html = null; document.querySelectorAll('[id]').forEach(function (x) { x._html = null; }); S.code ? rerender() : renderHome(); return; }
    if (d.copy) {
      if (d.copy === 'ws') copy(baseUrl() + '#ws/' + S.wsCode + '/host/' + S.ws.facilitator);
      else copy(d.copy === 'fac' ? baseUrl() + '#' + S.code + '/host/' + S.game.facilitator : inviteUrl());
      return;
    }
    if (d.copyurl) { copy(d.copyurl); return; }
    if (d.hostn) { S.nGroups = Number(d.hostn); renderHome(); return; }
    if (d.ngroups) { setGroupCount(Number(d.ngroups)); return; }
    if (d.rmgroup) { removeGroup(d.rmgroup); return; }
    if (d.wsfac) { wsFac(d.wsfac); return; }
    if (d.restab) { S.resGroup = d.restab; renderWorkshop(); return; }
    if (d.gcsv) { downloadCsv(S.groups[d.gcsv], d.gcsv); return; }
    if (d.gfac) {
      var gc = d.gcode, gg = S.groups[gc];
      if (d.gfac === 'addBacklog') actOn(gc, function (g) { return E.addBacklog(g); });
      if (d.gfac === 'nextDay' && gg) {
        var allDone = E.playerList(gg).every(function (p) { return gg.turns[p.id] && gg.turns[p.id].done; });
        if (allDone || confirm(t('nextDayConfirm'))) actOn(gc, function (g) { return E.nextDay(g); });
      }
      return;
    }
    if (d.reclaim) { claim(d.reclaim); return; }
    if (d.results != null) { S.resultsTab = d.results === '0'; $app._html = null; $app.innerHTML = ''; render(); return; }
    if (d.csv) { downloadCsv(); return; }
    if (d.setup != null) { S.setup = d.setup === '1'; renderSetup(); return; }
    if (d.addcol) { actShared(function (g) { return E.addActiveColumn(g); }); return; }
    if (d.rmcol) { actShared(function (g) { return E.removeColumn(g, d.rmcol); }); return; }
    if (d.togq) { actShared(function (g) { return E.togglePassiveAfter(g, d.togq); }); return; }
    if (d.roll) {
      S.rolling = true; renderTurn();
      var started = Date.now();
      act(function (g) { return E.roll(g, S.me); }).then(function () {
        setTimeout(function () { S.rolling = false; var el = document.getElementById('sTurn'); if (el) el._html = null; render(); }, Math.max(0, 550 - (Date.now() - started)));
      });
      return;
    }
    if (d.act) { act(function (g) { return E.apply(g, S.me, { type: d.act, card: d.card }); }); return; }
    if (d.pick) { startTask(d.pick); return; }
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
      if (f === 'addBacklog') act(function (g) { return E.addBacklog(g); });
      if (f === 'suggest') { var sw = suggestShared(); actShared(function (g) { return E.updateSettings(g, { wip: sw }); }); }
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
    else if (head === 'colKind') { patch.colKinds = {}; patch.colKinds[id] = val; }
    else if (head === 'names') { patch.names = {}; patch.names[id] = val; }
    else patch[k] = val;
    actShared(function (g) { return E.updateSettings(g, patch); }).then(function () {
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
