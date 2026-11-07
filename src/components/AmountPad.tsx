import { useEffect, useState } from "react";
import { Delete } from "lucide-react";
import { money } from "@/lib/format";
import { cn } from "@/lib/utils";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "del"] as const;

/** Apple Cash-style amount entry with its own keypad (no phone keyboard popping up). */
export function AmountPad({
  kidName,
  balance,
  initialSign,
  onCancel,
  onSubmit,
}: {
  kidName: string;
  balance: number;
  initialSign: 1 | -1;
  onCancel: () => void;
  onSubmit: (amount: number, note: string) => void;
}) {
  const [sign, setSign] = useState<1 | -1>(initialSign);
  const [raw, setRaw] = useState("");
  const [note, setNote] = useState("");
  const [shake, setShake] = useState(0);

  const value = parseFloat(raw || "0");
  const valid = value > 0;

  const press = (k: (typeof KEYS)[number]) => {
    setRaw((v) => {
      if (k === "del") return v.slice(0, -1);
      if (k === ".") return v.includes(".") ? reject(v) : (v || "0") + ".";
      if (v === "0") return k;
      const [whole, dec] = v.split(".");
      if (dec !== undefined ? dec.length >= 2 : whole.length >= 6) return reject(v);
      return v + k;
    });
  };
  const reject = (v: string) => {
    setShake((n) => n + 1);
    return v;
  };

  const submit = () => {
    if (valid) onSubmit(sign * value, note);
    else setShake((n) => n + 1);
  };

  // Typing on a real keyboard works too (when the note field isn't focused).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (/^[0-9]$/.test(e.key)) press(e.key as (typeof KEYS)[number]);
      else if (e.key === ".") press(".");
      else if (e.key === "Backspace") press("del");
      else if (e.key === "Enter") submit();
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const display = raw || "0";
  const size = display.length > 7 ? "text-[52px]" : display.length > 5 ? "text-[62px]" : "text-[72px]";

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center py-2">
        <button onClick={onCancel} className="justify-self-start text-[17px] text-blue">
          Cancel
        </button>
        <span className="text-[17px] font-semibold">{kidName}</span>
        <span />
      </div>

      <div className="relative mx-auto mt-3 grid w-56 grid-cols-2 rounded-[9px] bg-fill p-[2px] text-[13px] font-semibold">
        <span
          className={cn(
            "absolute inset-y-[2px] left-[2px] w-[calc(50%-2px)] rounded-[7px] bg-surface shadow-[0_3px_8px_rgba(0,0,0,0.12),0_3px_1px_rgba(0,0,0,0.04)] transition-transform duration-300 ease-[cubic-bezier(0.3,0.9,0.3,1)] dark:bg-fill-2",
            sign === -1 && "translate-x-full",
          )}
        />
        {([1, -1] as const).map((s) => (
          <button key={s} onClick={() => setSign(s)} className="relative z-10 h-7">
            {s === 1 ? "Add" : "Subtract"}
          </button>
        ))}
      </div>

      <div key={shake} className={cn("mt-6 text-center", shake > 0 && "animate-shake")}>
        <div
          className={cn(
            "font-rounded leading-none font-bold tracking-tight tabular-nums transition-colors",
            size,
            raw ? "text-label" : "text-label-3",
          )}
        >
          <span className="align-top text-[0.55em] opacity-70">{sign === 1 ? "+" : "−"}$</span>
          {display}
        </div>
        <p className="mt-3 text-[13px] text-label-2">
          New balance <span className="font-semibold tabular-nums">{money(balance + sign * value)}</span>
        </p>
      </div>

      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && (e.currentTarget.blur(), submit())}
        placeholder={sign === 1 ? "How did they earn it? (optional)" : "What did they buy? (optional)"}
        maxLength={80}
        className="mt-5 h-11 w-full rounded-xl bg-surface px-4 text-center text-[16px] outline-none placeholder:text-label-3 focus:ring-2 focus:ring-blue/40"
      />

      <div className="mt-3 grid grid-cols-3 gap-1">
        {KEYS.map((k) => (
          <button
            key={k}
            onClick={() => press(k)}
            aria-label={k === "del" ? "Delete" : k}
            className="flex h-[58px] items-center justify-center rounded-2xl font-rounded text-[28px] font-medium transition-colors duration-100 active:bg-fill-2"
          >
            {k === "del" ? <Delete className="size-6" strokeWidth={2} /> : k}
          </button>
        ))}
      </div>

      <button
        onClick={submit}
        disabled={!valid}
        className={cn(
          "mt-3 h-14 w-full rounded-2xl text-[17px] font-semibold text-white transition-[opacity,transform] active:scale-[0.98] disabled:opacity-35",
          sign === 1 ? "bg-blue" : "bg-red",
        )}
      >
        {sign === 1 ? "Add" : "Subtract"} {valid ? money(value) : ""}
      </button>
    </div>
  );
}
