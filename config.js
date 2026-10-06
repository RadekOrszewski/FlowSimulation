// ---------------------------------------------------------------------------
// Kanban Flow Game — configuration
//
// Firebase is configured below, so sessions sync online between devices.
// Set `firebase: null` to switch back to TEST MODE (tabs of one browser only).
//
// Note: don't add Firebase "import" lines or initializeApp() here —
// the app loads and starts Firebase itself (see sync.js).
// ---------------------------------------------------------------------------
window.APP_CONFIG = {
  firebase: {
    apiKey: "AIzaSyD9-EsoT8JxvLN4OvH88uWgDQNoyOeBzUY",
    authDomain: "kanban-e062c.firebaseapp.com",
    databaseURL: "https://kanban-e062c-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "kanban-e062c",
    storageBucket: "kanban-e062c.firebasestorage.app",
    messagingSenderId: "143213145875",
    appId: "1:143213145875:web:f0ec18522727c39ebab4e6"
  },

  appName: 'Kanban Flow Game',
  brand: 'Lean Agile Ninja',
  brandUrl: 'https://leanagile.ninja',
  defaultLang: 'en' // 'en' or 'pl'
};
