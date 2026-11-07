// One-time copy of the data exported from Lovable/Supabase into Firestore.
// Keeps the original IDs and dates, so running it twice just overwrites the same docs.
//   npm run import-backup
import { readFileSync } from "node:fs";
import { initializeApp } from "firebase/app";
import { Timestamp, connectFirestoreEmulator, doc, getFirestore, writeBatch } from "firebase/firestore";

const env = process.env;
const app = initializeApp({
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  appId: env.VITE_FIREBASE_APP_ID,
});
const db = getFirestore(app);
if (env.FIRESTORE_EMULATOR_HOST) {
  const [host, port] = env.FIRESTORE_EMULATOR_HOST.split(":");
  connectFirestoreEmulator(db, host, Number(port));
}

const read = (name) => JSON.parse(readFileSync(new URL(`../migration/${name}.json`, import.meta.url)));
const kids = read("kids");
const entries = read("entries");
const ts = (iso) => Timestamp.fromDate(new Date(iso));

const batch = writeBatch(db);
for (const k of kids) {
  batch.set(doc(db, "kids", k.id), { name: k.name, createdAt: ts(k.created_at) });
}
for (const e of entries) {
  batch.set(doc(db, "entries", e.id), {
    kidId: e.kid_id,
    amount: Number(e.amount),
    note: e.note ?? "",
    createdAt: ts(e.created_at),
  });
}
await batch.commit();

console.log(`Imported ${kids.length} kids and ${entries.length} entries:`);
for (const k of kids) {
  const total = entries.filter((e) => e.kid_id === k.id).reduce((s, e) => s + Number(e.amount), 0);
  console.log(`  ${k.name}: $${total.toFixed(2)}`);
}
process.exit(0);
