const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export const money = (n: number) => (n < 0 ? `-${usd.format(-n)}` : usd.format(n));

export const signedMoney = (n: number) => `${n < 0 ? "−" : "+"}${usd.format(Math.abs(n))}`;

/** "$1,234" and ".56" so cents can be drawn smaller. */
export function splitMoney(n: number) {
  const s = usd.format(Math.abs(n));
  const dot = s.lastIndexOf(".");
  return { sign: n < 0 ? "−" : "", whole: s.slice(0, dot), cents: s.slice(dot) };
}

const time = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });
const day = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" });
const dayYear = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

export function dayLabel(ms: number) {
  const d = new Date(ms);
  const today = new Date();
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((startOf(today) - startOf(d)) / 86_400_000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (d.getFullYear() === today.getFullYear()) return day.format(d);
  return dayYear.format(d);
}

export const timeLabel = (ms: number) => time.format(new Date(ms));

export function relative(ms: number) {
  const label = dayLabel(ms);
  return label === "Today" || label === "Yesterday" ? label : label.replace(/^\w+, /, "");
}

// Wallet-style gradients, picked by the kid's position.
const GRADIENTS = [
  ["#5e5ce6", "#bf5af2", "#ff375f"],
  ["#ff9f0a", "#ff375f", "#bf5af2"],
  ["#0a84ff", "#5e5ce6", "#30d158"],
  ["#30d158", "#0a84ff", "#64d2ff"],
  ["#ff375f", "#ff9f0a", "#ffd60a"],
  ["#64d2ff", "#5e5ce6", "#bf5af2"],
];

export function gradientFor(index: number) {
  const [a, b, c] = GRADIENTS[index % GRADIENTS.length];
  return {
    background: `radial-gradient(120% 140% at 0% 0%, ${a} 0%, transparent 60%), radial-gradient(120% 140% at 100% 100%, ${c} 0%, transparent 55%), linear-gradient(135deg, ${a}, ${b})`,
    solid: b,
  };
}
