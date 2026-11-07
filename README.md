# Family Bank

Tracks money held for the kids. React + Vite, data in Firebase Firestore (free Spark plan), hosted on Vercel. No sign-in.

## 1. Firebase (one time)

1. https://console.firebase.google.com → **Add project** (Analytics off). Stay on the free **Spark** plan.
2. **Build → Firestore Database → Create database** → pick a location → start in **production mode**.
3. **Firestore → Rules** → paste the contents of `firestore.rules` → **Publish**.
   (Don't use "test mode" — those rules expire after 30 days and the app stops working.)
4. **Project settings (gear) → Your apps → Web (`</>`)** → register an app (no Hosting). Copy the config values.
5. `cp .env.example .env.local` and fill in the four values.

## 2. Bring over the existing data (one time)

```bash
npm install
npm run import-backup
```

This copies `migration/kids.json` and `migration/entries.json` (exported from the Lovable app) into Firestore, keeping the original IDs and dates. Safe to re-run.

## 3. Run locally

```bash
npm run dev
```

## 4. Deploy to Vercel

```bash
vercel
```

Then add the same four `VITE_FIREBASE_*` variables in Vercel (Project → Settings → Environment Variables, or `vercel env add`) and run `vercel --prod`.

## Notes

- Anyone with the link can view and edit — same as the Lovable version. `index.html` has `noindex` so search engines skip it.
- Free-tier limits (50k reads / 20k writes per day) are far beyond what this app uses.
- Try changes without touching real data: run `npm run emulator` in one terminal, then `npm run dev:emulator` in another. Seed it with your backup using `FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 node --env-file=.env.emulator scripts/import-backup.mjs`.
