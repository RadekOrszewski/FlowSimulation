// ---------------------------------------------------------------------------
// Kanban Flow Game — configuration
//
// 1. Create a free Firebase project (see README.md), add a Web app and paste
//    its config object below in place of `null`.
// 2. Leave it as `null` to run in TEST MODE: everything works, but only
//    between tabs of the same browser on one computer (good for rehearsing).
// ---------------------------------------------------------------------------
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const app = initializeApp(firebaseConfig);
window.APP_CONFIG = {
const firebaseConfig = {
  apiKey: "AIzaSyD9-EsoT8JxvLN4OvH88uWgDQNoyOeBzUY",
  authDomain: "kanban-e062c.firebaseapp.com",
  databaseURL: "https://kanban-e062c-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "kanban-e062c",
  storageBucket: "kanban-e062c.firebasestorage.app",
  messagingSenderId: "143213145875",
  appId: "1:143213145875:web:f0ec18522727c39ebab4e6"
};
  },
  */

  appName: 'Kanban Flow Game',
  brand: 'Lean Agile Ninja',
  brandUrl: 'https://leanagile.ninja',
  defaultLang: 'en' // 'en' or 'pl'
};
