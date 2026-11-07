import type { Kid } from "@/lib/bank";
import { gradientFor, relative, signedMoney, splitMoney } from "@/lib/format";

export function KidCard({ kid, index, onOpen }: { kid: Kid; index: number; onOpen: () => void }) {
  const { background } = gradientFor(index);
  const { sign, whole, cents } = splitMoney(kid.balance);
  const last = kid.entries[0];

  return (
    <button
      onClick={onOpen}
      style={{ background, animationDelay: `${index * 70}ms` }}
      className="animate-rise relative flex aspect-[1.7/1] w-full flex-col justify-between overflow-hidden rounded-[26px] p-5 text-left text-white shadow-[0_18px_40px_-18px_rgba(0,0,0,0.55)] transition-transform duration-200 ease-out active:scale-[0.97]"
    >
      {/* glass sheen */}
      <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.32)_0%,rgba(255,255,255,0.06)_32%,transparent_45%)]" />
      <span className="pointer-events-none absolute -right-16 -bottom-24 size-64 rounded-full border-[28px] border-white/10" />

      <span className="relative flex items-start justify-between gap-3">
        <span className="truncate text-[24px] font-semibold tracking-tight">{kid.name}</span>
        <span className="mt-1.5 shrink-0 text-[11px] font-semibold tracking-[0.18em] text-white/70 uppercase">
          Family Bank
        </span>
      </span>

      <span className="relative flex items-end justify-between gap-3">
        <span className="min-w-0">
          <span className="flex items-center gap-2 text-[13px] font-medium text-white/75">
            Balance
            {kid.balance < 0 && (
              <span className="rounded-full bg-black/25 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                Owes you
              </span>
            )}
          </span>
          <span className="block font-rounded text-[46px] leading-[1.05] font-bold tracking-tight tabular-nums">
            {sign}
            {whole}
            <span className="text-[26px] text-white/80">{cents}</span>
          </span>
        </span>
        {last && (
          <span className="shrink-0 pb-1.5 text-right text-[13px] leading-tight text-white/80">
            <span className="block font-semibold tabular-nums">{signedMoney(last.amount)}</span>
            <span className="block text-white/65">{relative(last.at)}</span>
          </span>
        )}
      </span>
    </button>
  );
}
