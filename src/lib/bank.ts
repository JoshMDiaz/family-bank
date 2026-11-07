import { useEffect, useMemo, useState } from "react";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type Entry = { id: string; kidId: string; amount: number; note: string; at: number };
export type Kid = { id: string; name: string; entries: Entry[]; balance: number };

// Live listeners: changes made on any phone show up everywhere instantly.
export function useBank() {
  const [kidRows, setKidRows] = useState<{ id: string; name: string }[] | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const unsubKids = onSnapshot(query(collection(db, "kids"), orderBy("createdAt")), (snap) =>
      setKidRows(snap.docs.map((d) => ({ id: d.id, name: d.data().name }))),
    );
    const unsubEntries = onSnapshot(
      query(collection(db, "entries"), orderBy("createdAt", "desc")),
      (snap) =>
        setEntries(
          snap.docs.map((d) => {
            const e = d.data();
            return {
              id: d.id,
              kidId: e.kidId,
              amount: Number(e.amount),
              note: e.note ?? "",
              at: (e.createdAt as Timestamp).toMillis(),
            };
          }),
        ),
    );
    return () => {
      unsubKids();
      unsubEntries();
    };
  }, []);

  const kids = useMemo<Kid[] | null>(
    () =>
      kidRows?.map((k) => {
        const own = entries.filter((e) => e.kidId === k.id);
        return { ...k, entries: own, balance: round2(own.reduce((s, e) => s + e.amount, 0)) };
      }) ?? null,
    [kidRows, entries],
  );

  return kids;
}

export const addKid = (name: string) =>
  addDoc(collection(db, "kids"), { name, createdAt: Timestamp.now() });

export const addEntry = (kidId: string, amount: number, note: string) =>
  addDoc(collection(db, "entries"), {
    kidId,
    amount: round2(amount),
    note: note.trim().slice(0, 500),
    createdAt: Timestamp.now(),
  });

export const deleteEntry = (entryId: string) => deleteDoc(doc(db, "entries", entryId));

export async function removeKid(kidId: string) {
  // Firestore has no cascading deletes, so remove the kid's entries too.
  const batch = writeBatch(db);
  const own = await getDocs(query(collection(db, "entries"), where("kidId", "==", kidId)));
  own.forEach((e) => batch.delete(e.ref));
  batch.delete(doc(db, "kids", kidId));
  await batch.commit();
}

const round2 = (n: number) => Math.round(n * 100) / 100;
