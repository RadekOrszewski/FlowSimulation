# Kanban Flow Game

A Featureban-style Kanban simulation for **online workshops**. Every participant opens the same link in their own browser and plays on one shared, live board. The facilitator runs two rounds:

1. **Round 1 – no WIP limits.** Players start work freely; the board fills up, blocked tasks pile up, little gets finished.
2. **Round 2 – with WIP limits.** Starting is impossible while a column is full, so players are pushed to *stop starting, start finishing* and help each other.

A debrief screen then compares both rounds side by side (tasks finished, cycle time, WIP, throughput, cumulative flow diagrams, cycle-time histograms, discussion questions; plus waiting time and flow efficiency when the board has queues, and urgent vs standard cycle time when urgent tasks were used) and lets the facilitator download the data as CSV.

Inspired by Featureban, a game by Mike Burrows, using the dice variant of the rules.

---

## How the rules are enforced

Players can't break the rules: the app only highlights the cards (and the *Start a new task* button) that are legal right now, and every click is re-checked against the shared board inside a database transaction before it is saved.

| Roll | What the player must do |
|---|---|
| **1–2** | Block one of their own tasks **and** start a new task (block first; skipped if they have nothing to block) |
| **3–4** | **One** action: move own task, unblock own task, or start a new task |
| **5–6** | **Two** actions from the same list, never two actions on the same task in one day |
| **Can't act** | If no action on their own tasks is possible, they must **help**: move or unblock another player's task |

- Tasks flow **Backlog → work steps → Done** (default: Development, Testing); a move is one column to the right; blocked tasks can't move.
- A task started today can't also be moved today.
- **Round 2:** every column with a WIP limit enforces it (blocked tasks count). Starting or moving into a full column is not offered. When nothing else is possible, the player is switched to *help mode*.
- **Queue columns** (optional, e.g. "Ready for Testing") sit between two work steps. No work happens there: tasks in a queue can't be blocked, and moving a task in and moving it out take one action each. They make waiting time visible.
- **Urgent tasks** (optional): the facilitator sets what percentage of new tasks are urgent. The next card in the backlog shows whether it is urgent. If a player can move or unblock one of their urgent tasks, that is the only thing they're allowed to do; when helping, urgent tasks come first too. Urgent tasks never exceed WIP limits.
- If an action by someone else removes all of a player's options mid-turn, that turn ends automatically and the log says so.
- Turn order is a facilitator setting: *everyone at once* (fast, good for online) or *one player at a time* (like the table game).

---

## Setup (about 15 minutes, free)

You need two free services: **GitHub Pages** to host the page and **Firebase Realtime Database** (Google) to sync the board between browsers.

### 1. Put the files on GitHub Pages

1. Create a new repository on GitHub, e.g. `kanban-flow-game` (public).
2. Upload all files from this folder (`index.html`, `app.js`, `engine.js`, `sync.js`, `config.js`, …) to the repository root.
3. Go to **Settings → Pages**, set *Source* to **Deploy from a branch**, branch `main`, folder `/ (root)`, and save.
4. After a minute your game is live at `https://<your-user>.github.io/kanban-flow-game/`.

At this point the app runs in **test mode**: it works, but only between tabs of one browser. That's handy for rehearsing; for real sessions continue with step 2.

### 2. Create the Firebase database

1. Open <https://console.firebase.google.com> and click **Create a project** (Google Analytics is not needed).
2. **Build → Realtime Database → Create database.** Pick a location close to your participants (e.g. `europe-west1`), start in **locked mode**.
3. In the database, open the **Rules** tab, replace everything with the contents of [`database.rules.json`](database.rules.json) and click **Publish**.
4. **Build → Authentication → Get started → Sign-in method → Anonymous → Enable.** Participants are signed in invisibly; nobody needs an account.
5. **Project settings (⚙) → General → Your apps → Web (`</>`)**: register an app (no hosting needed) and copy the `firebaseConfig` object.

### 3. Connect the two

Edit `config.js` in your repository and replace `firebase: null` with the copied object. Make sure it contains `databaseURL`; if it doesn't, copy the URL shown at the top of your Realtime Database page.

```js
firebase: {
  apiKey: "AIza...",
  authDomain: "my-kanban-game.firebaseapp.com",
  databaseURL: "https://my-kanban-game-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "my-kanban-game",
  appId: "1:1234567890:web:abcdef"
},
```

Commit, wait a minute, reload the page: the red **TEST MODE** label disappears and sessions now sync across devices.

> The Firebase web config is meant to be public; access is controlled by the database rules and anonymous sign-in, not by hiding the key.

**Free plan limits:** the Spark (free) plan allows 100 simultaneous connections per database, which comfortably covers several parallel workshop groups. Each session uses only a few hundred kilobytes.

---

## Running a workshop

1. Open the app and click **Create new session**. You become the facilitator; the panel shows a 5-letter code.
2. Share the invite link (**Copy invite link**) or the code. Participants enter their name and get a colour.
3. Optional: open **Board & rules setup** to
   - rename any column, including Backlog and Done (names can be changed at any time, also mid-game);
   - add work steps (up to 4) or remove them;
   - add a **queue** between two work steps;
   - set **WIP limits** per column for round 2 (*Apply* fills in a suggestion that scales with the number of players; 0 = no limit);
   - set the **share of urgent tasks** (0–100 %). Urgent tasks get priority but always respect WIP limits.
   The board layout is locked once round 1 starts, so both rounds are played on the same board and can be compared.
4. Choose days per round (10 is a good default, 6–8 if time is short) and the turn order, then **Start round 1**.
5. Players roll the die and click highlighted cards. The day advances automatically when everyone is done (or click **Next day**; use **skip** next to a player who stepped away).
6. After round 1 the board shows the results and a cumulative flow diagram. Discuss, then set **WIP limits** (the panel suggests values for your group size) and, if you like, a different share of urgent tasks, and **Start round 2**.
7. During round 2 you can **change WIP limits live** from the facilitator panel (e.g. tighten them if the group is still starting too much). Changes apply immediately, appear in the activity log and are listed in the debrief.
8. After round 2 click **Show debrief to everyone** and walk through the comparison. **Download data (CSV)** if you want the numbers.

Tips:
- Keep the **Copy my facilitator link** URL: it lets you return as facilitator from another device or browser.
- A participant who refreshed or switched devices can rejoin by picking their name on the join screen.
- The interface is in **English and Polish** (switch in the top-right corner). Default language is set in `config.js`.

---

## Customising

- `config.js` — Firebase connection, app name, brand line in the footer, default language.
- `index.html` — colours and fonts (CSS variables at the top: `--navy`, `--yellow`, …).
- `app.js` — all texts in the `I18N` object (add a language by copying the `en` block).
- `engine.js` — the rules (columns, dice outcomes, WIP logic, metrics).

## Files

| File | Purpose |
|---|---|
| `index.html` | Page shell and styling |
| `app.js` | Screens, board interaction, facilitator controls, charts, translations |
| `engine.js` | Rules engine (pure JS, no dependencies) |
| `sync.js` | Firebase Realtime Database sync + local test mode |
| `config.js` | Your settings |
| `database.rules.json` | Security rules to paste into Firebase |
| `test/engine.test.js` | Rule tests, including 2,000 random games on random boards (queues, urgent tasks, WIP limits) checking the rules are never broken (`node test/engine.test.js`) |

## Security notes

This is built for workshops, not for hostile users: anyone with the session code can join, and a technically skilled participant could tamper with the shared data through the browser console. The rules block listing other sessions and keep everything behind anonymous sign-in. You can delete old sessions any time in the Firebase console under `sessions/`.
