# Firebase setup for Lumenwild

Project: `lumenwild-21b83`

## 1. Enable accounts

In Firebase Console, open **Build → Authentication → Get started → Sign-in method**. Enable **Email/Password** (the first option; passwordless email link is not required).

## 2. Create Firestore

Open **Build → Firestore Database → Create database**. Choose Production mode and the region closest to the majority of players. The region cannot be changed later.

## 3. Deploy the included rules

The checked-in `firestore.rules` permits an authenticated account to access only its own `players/{uid}` document and denies all other access.

With Firebase CLI installed and signed in:

```powershell
firebase deploy --only firestore:rules
```

Alternatively, paste `firestore.rules` into **Firestore Database → Rules** in Firebase Console and publish it.

## 4. Run locally

Double-click `Open Lumenwild.cmd`, create an account, adopt a Glimmer, then sign in with the same account in another browser to confirm the cloud save follows the account.

## 5. Deploy the web app

```powershell
pnpm run build
firebase deploy --only hosting
```

## GitHub Pages authorized domain

For the GitHub Pages deployment, add `hightechstl.github.io` under **Firebase Console → Authentication → Settings → Authorized domains**. Without this entry, Firebase Authentication will reject account sign-in from the Pages site.

## Security boundary

This milestone moves identity and persistence to Firebase Authentication and Firestore with per-user authorization. Before public launch, reward grants, shop purchases, currency changes, and minigame payouts should be moved into Firebase Callable Functions with App Check, idempotency keys, rate limits, and an append-only transaction ledger. Firestore ownership rules prevent cross-account access but cannot make client-calculated economy mutations fully authoritative.
