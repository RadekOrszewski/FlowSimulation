// ---------------------------------------------------------------------------
// Kanban Flow Game — configuration
//
// 1. Create a free Firebase project (see README.md), add a Web app and paste
//    its config object below in place of `null`.
// 2. Leave it as `null` to run in TEST MODE: everything works, but only
//    between tabs of the same browser on one computer (good for rehearsing).
// ---------------------------------------------------------------------------
window.APP_CONFIG = {
  firebase: null,
  /* Example:
  firebase: {
    apiKey: "AIza...",
    authDomain: "my-kanban-game.firebaseapp.com",
    databaseURL: "https://my-kanban-game-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "my-kanban-game",
    appId: "1:1234567890:web:abcdef"
  },
  */

  appName: 'Kanban Flow Game',
  brand: 'Lean Agile Ninja',
  brandUrl: 'https://leanagile.ninja',
  defaultLang: 'en' // 'en' or 'pl'
};
