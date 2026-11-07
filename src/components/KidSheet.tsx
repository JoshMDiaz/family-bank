import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Minus, Plus, Trash2 } from "lucide-react";
import { Sheet } from "@/components/Sheet";
import { AmountPad } from "@/components/AmountPad";
import { addEntry, deleteEntry, removeKid, type Entry, type Kid } from "@/lib/bank";
import { dayLabel, gradientFor, money, signedMoney, splitMoney, timeLabel } from "@/lib/format";
import { cn } from "@/lib/utils";

type Mode = { view: "detail" } | { view: "amount"; sign: 1 | -1 } | { view: "remove" };

export function KidSheet({
  kid,
  index,
  open,
  onOpenChange,
}: {
  kid: Kid;
  index: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [mode, setMode] = useState<Mode>({ view: "detail" });

  const setOpen = (o: boolean) => {
    onOpenChange(o);
    if (!o) setTimeout(() => setMode({ view: "detail" }), 300);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen} title={kid.name}>
      {mode.view === "amount" ? (
        <AmountPad
          kidName={kid.name}
          balance={kid.balance}
          initialSign={mode.sign}
          onCancel={() => setMode({ view: "detail" })}
          onSubmit={(amount, note) => {
            void addEntry(kid.id, amount, note);
            setMode({ view: "detail" });
          }}
        />
      ) : mode.view === "remove" ? (
        <ConfirmRemove
          kid={kid}
          onCancel={() => setMode({ view: "detail" })}
          onConfirm={() => {
            setOpen(false);
            void removeKid(kid.id);
          }}
        />
      ) : (
        <Detail
          kid={kid}
          index={index}
          onAmount={(sign) => setMode({ view: "amount", sign })}
          onRemove={() => setMode({ view: "remove" })}
        />
      )}
    </Sheet>
  );
}

function Detail({
  kid,
  index,
  onAmount,
  onRemove,
}: {
  kid: Kid;
  index: number;
  onAmount: (sign: 1 | -1) => void;
  onRemove: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [armed, setArmed] = useState<string | null>(null);
  const { background } = gradientFor(index);
  const { sign, whole, cents } = splitMoney(kid.balance);

  const groups: { day: string; items: Entry[] }[] = [];
  for (const e of kid.entries) {
    const day = dayLabel(e.at);
    if (groups.at(-1)?.day === day) groups.at(-1)!.items.push(e);
    else groups.push({ day, items: [e] });
  }

  return (
    <div className="pb-2">
      <div className="flex flex-col items-center pt-4 text-center">
        <span
          style={{ background }}
          className="flex size-16 items-center justify-center rounded-full text-[28px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(0,0,0,0.5)]"
        >
          {kid.name.slice(0, 1).toUpperCase()}
        </span>
        <h2 className="mt-3 text-[20px] font-semibold tracking-tight">{kid.name}</h2>
        <p
          className={cn(
            "mt-1 font-rounded text-[54px] leading-none font-bold tracking-tight tabular-nums",
            kid.balance < 0 && "text-red",
          )}
        >
          {sign}
          {whole}
          <span className="text-[30px] opacity-60">{cents}</span>
        </p>
        <p className="mt-2 text-[13px] text-label-2">
          {kid.balance < 0 ? `${kid.name} owes you` : "Balance"}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          onClick={() => onAmount(-1)}
          className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-surface text-[17px] font-semibold transition-transform active:scale-[0.97]"
        >
          <Minus className="size-5" strokeWidth={2.5} /> Subtract
        </button>
        <button
          onClick={() => onAmount(1)}
          className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-blue text-[17px] font-semibold text-white transition-transform active:scale-[0.97]"
        >
          <Plus className="size-5" strokeWidth={2.5} /> Add
        </button>
      </div>

      <div className="mt-8 flex items-baseline justify-between px-1">
        <h3 className="text-[22px] font-bold tracking-tight">Activity</h3>
        {kid.entries.length > 0 && (
          <button
            onClick={() => {
              setEditing((e) => !e);
              setArmed(null);
            }}
            className="text-[17px] text-blue"
          >
            {editing ? "Done" : "Edit"}
          </button>
        )}
      </div>

      {groups.length === 0 && (
        <div className="mt-3 rounded-2xl bg-surface px-4 py-8 text-center text-[15px] text-label-2">
          No activity yet
        </div>
      )}

      {groups.map((g) => (
        <section key={g.day} className="mt-4">
          <h4 className="px-4 pb-1.5 text-[13px] text-label-2 uppercase">{g.day}</h4>
          <ul className="overflow-hidden rounded-2xl bg-surface">
            {g.items.map((e, i) => (
              <li key={e.id} className="flex items-center gap-3 pl-4">
                {editing && (
                  <button
                    aria-label="Delete entry"
                    onClick={() => setArmed(armed === e.id ? null : e.id)}
                    className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-red text-white"
                  >
                    <Minus className="size-3.5" strokeWidth={3.5} />
                  </button>
                )}
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full",
                    e.amount >= 0 ? "bg-green/15 text-green" : "bg-red/15 text-red",
                  )}
                >
                  {e.amount >= 0 ? (
                    <ArrowDownLeft className="size-[18px]" strokeWidth={2.5} />
                  ) : (
                    <ArrowUpRight className="size-[18px]" strokeWidth={2.5} />
                  )}
                </span>
                <div
                  className={cn(
                    "flex min-h-[60px] min-w-0 flex-1 items-center gap-3 py-2.5 pr-4",
                    i > 0 && "border-t border-separator",
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[16px]">
                      {e.note || (e.amount >= 0 ? "Added" : "Subtracted")}
                    </p>
                    <p className="text-[13px] text-label-2">{timeLabel(e.at)}</p>
                  </div>
                  {armed === e.id ? (
                    <button
                      onClick={() => void deleteEntry(e.id)}
                      className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-red px-3.5 text-[15px] font-semibold text-white"
                    >
                      <Trash2 className="size-4" /> Delete
                    </button>
                  ) : (
                    <span
                      className={cn(
                        "shrink-0 text-[16px] font-semibold tabular-nums",
                        e.amount >= 0 && "text-green",
                      )}
                    >
                      {signedMoney(e.amount)}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <button
        onClick={onRemove}
        className="mt-8 h-12 w-full rounded-2xl bg-surface text-[17px] text-red active:bg-fill"
      >
        Remove {kid.name}
      </button>
    </div>
  );
}

function ConfirmRemove({
  kid,
  onCancel,
  onConfirm,
}: {
  kid: Kid;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="flex flex-col items-center pt-6 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-red/15 text-red">
        <Trash2 className="size-6" />
      </span>
      <h2 className="mt-4 text-[22px] font-bold tracking-tight">Remove {kid.name}?</h2>
      <p className="mt-2 max-w-72 text-[15px] text-label-2">
        This permanently deletes {kid.name}'s {money(kid.balance)} balance and all{" "}
        {kid.entries.length} {kid.entries.length === 1 ? "entry" : "entries"}. This can't be undone.
      </p>
      <button
        onClick={onConfirm}
        className="mt-7 h-14 w-full rounded-2xl bg-red text-[17px] font-semibold text-white active:scale-[0.98]"
      >
        Remove {kid.name}
      </button>
      <button
        onClick={onCancel}
        className="mt-2 h-14 w-full rounded-2xl text-[17px] font-semibold text-blue"
      >
        Cancel
      </button>
    </div>
  );
}
