# Lumenwild

An original, free-to-play virtual-pet browser game built with React, TypeScript, Vite, Firebase Authentication, and Cloud Firestore.

## Open in Microsoft Edge

Do not double-click `index.html`. It is source code for Vite and must be served through the local development server.

For the simplest Windows launch, double-click **Open Lumenwild.cmd**. It starts the local server and opens `http://127.0.0.1:5173/` in Microsoft Edge. Keep the minimized server window open while playing.

## Run manually

```bash
npm install
npm run dev
```

Open the local address shown by Vite. Accounts and game data persist in Firebase rather than local browser storage. Run `npm test` for game-rule tests and `npm run build` for a production build.

Complete the one-time Firebase Console steps in [docs/FIREBASE_SETUP.md](docs/FIREBASE_SETUP.md) before creating the first account.

## GitHub Pages

Pushes to `main` build, test, and deploy automatically through `.github/workflows/deploy-pages.yml`. The site is published at:

https://hightechstl.github.io/Lumenwild/

Add `hightechstl.github.io` to Firebase Authentication's authorized domains before using accounts on the Pages deployment.

## Public playtest loop

Choose a creature → care for it → explore Mossmere → play Skyhop or complete a daily quest → spend Marks → equip an item or decorate the nook → earn an achievement.

Authentication and cloud persistence are live Firebase integrations. The current public playtest has no real-money purchases, trading, competitive leaderboards, or transferable-value economy. Before adding any of those systems, currency and inventory mutations must move behind authenticated, server-authoritative Callable Functions and an append-only transaction ledger.

## Playtest diagnostics

The game version is displayed beside the Lumenwild mark. Add `?diagnostics` to the URL to log the game version, Firebase schema version, build mode, and browser online state without exposing account data. Player documents migrate in place; schema 9 retains transactional revision/action-receipt protection and adds quest records, history, regional material storage, and earned cosmetics.

## Intentionally deferred

Server-authoritative economy validation, player trading, PvE challenges, additional regions/species, crafting, gardening, social features, seasonal events, native apps, and real premium-currency purchase flows.
