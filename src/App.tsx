import { useState } from "react";
import { Plus } from "lucide-react";
import { useBank } from "@/lib/bank";
import { splitMoney } from "@/lib/format";
import { KidCard } from "@/components/KidCard";
import { KidSheet } from "@/components/KidSheet";
import { AddKidSheet } from "@/components/AddKidSheet";

const today = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
}).format(new Date());

export default function App() {
  const kids = useBank();
  const [openId, setOpenId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  // Keep the last-opened kid mounted so the sheet can animate closed.
  const [lastId, setLastId] = useState<string | null>(null);

  const total = kids?.reduce((s, k) => s + k.balance, 0) ?? 0;
  const { sign, whole, cents } = splitMoney(total);
  const shownIndex = kids?.findIndex((k) => k.id === lastId) ?? -1;
  const shown = shownIndex >= 0 ? kids![shownIndex] : null;

  return (
    <main className="mx-auto min-h-dvh w-full max-w-md px-4 pt-[max(env(safe-area-inset-top),12px)] pb-[max(env(safe-area-inset-bottom),32px)]">
      <header className="pt-3">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-semibold tracking-wide text-label-2 uppercase">{today}</p>
          <button
            onClick={() => setAdding(true)}
            aria-label="Add kid"
            className="flex size-9 items-center justify-center rounded-full bg-fill text-blue transition-transform active:scale-90"
          >
            <Plus className="size-5" strokeWidth={2.5} />
          </button>
        </div>
        <h1 className="mt-1 text-[34px] leading-tight font-bold tracking-tight">Family Bank</h1>
      </header>

      <section className="mt-5 mb-6 px-1">
        <p className="text-[15px] text-label-2">
          {kids ? `Holding for ${kids.length} ${kids.length === 1 ? "kid" : "kids"}` : "Loading…"}
        </p>
        <p className="font-rounded text-[56px] leading-none font-bold tracking-tight tabular-nums">
          {sign}
          {whole}
          <span className="text-[32px] text-label-2">{cents}</span>
        </p>
      </section>

      <div className="space-y-4">
        {kids?.map((kid, i) => (
          <KidCard
            key={kid.id}
            kid={kid}
            index={i}
            onOpen={() => {
              setLastId(kid.id);
              setOpenId(kid.id);
            }}
          />
        ))}

        {kids?.length === 0 && (
          <p className="py-10 text-center text-[15px] text-label-2">Tap + to add a kid.</p>
        )}

        {!kids &&
          [0, 1].map((i) => (
            <div key={i} className="aspect-[1.7/1] animate-pulse rounded-[26px] bg-fill" />
          ))}
      </div>

      {shown && (
        <KidSheet
          kid={shown}
          index={shownIndex}
          open={openId === shown.id}
          onOpenChange={(o) => setOpenId(o ? shown.id : null)}
        />
      )}
      <AddKidSheet open={adding} onOpenChange={setAdding} nextIndex={kids?.length ?? 0} />
    </main>
  );
}
