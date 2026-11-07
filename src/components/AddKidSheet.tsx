import { useState } from "react";
import { Sheet } from "@/components/Sheet";
import { addKid } from "@/lib/bank";
import { gradientFor } from "@/lib/format";

export function AddKidSheet({
  open,
  onOpenChange,
  nextIndex,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nextIndex: number;
}) {
  const [name, setName] = useState("");
  const trimmed = name.trim();
  const { background } = gradientFor(nextIndex);

  const save = () => {
    if (!trimmed) return;
    void addKid(trimmed.slice(0, 100));
    setName("");
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange} title="Add a kid">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center py-2">
        <button onClick={() => onOpenChange(false)} className="justify-self-start text-[17px] text-blue">
          Cancel
        </button>
        <span className="text-[17px] font-semibold">New Kid</span>
        <button
          onClick={save}
          disabled={!trimmed}
          className="justify-self-end text-[17px] font-semibold text-blue disabled:text-label-3"
        >
          Add
        </button>
      </div>

      <div className="flex flex-col items-center pt-6 pb-4">
        <span
          style={{ background }}
          className="flex size-24 items-center justify-center rounded-full text-[42px] font-semibold text-white shadow-[0_12px_28px_-10px_rgba(0,0,0,0.5)]"
        >
          {trimmed.slice(0, 1).toUpperCase() || "?"}
        </span>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && save()}
          placeholder="Name"
          maxLength={100}
          className="mt-6 h-12 w-full rounded-xl bg-surface px-4 text-center text-[20px] font-semibold outline-none placeholder:font-normal placeholder:text-label-3 focus:ring-2 focus:ring-blue/40"
        />
      </div>
    </Sheet>
  );
}
