import Link from "next/link";

// トップのバナー。背景の図柄は SVG で描いた生成画像。文字は画像に焼き込まず HTML で置く
function Pattern({ kind }: { kind: "sun" | "grid" | "wave" }) {
  if (kind === "sun")
    return (
      <svg viewBox="0 0 300 160" preserveAspectRatio="xMaxYMid slice" className="absolute inset-0 size-full" aria-hidden>
        <circle cx="250" cy="40" r="70" fill="#ffffff" opacity="0.12" />
        <circle cx="250" cy="40" r="44" fill="#ffffff" opacity="0.18" />
        <circle cx="250" cy="40" r="22" fill="#ffd2b8" />
        <path d="M0 130 C 80 100, 160 150, 300 110 V160 H0 Z" fill="#9c3906" opacity="0.55" />
        <path d="M120 160 L150 118 L170 140 L195 108 L230 160 Z" fill="#7a2c04" opacity="0.6" />
      </svg>
    );
  if (kind === "grid")
    return (
      <svg viewBox="0 0 300 160" preserveAspectRatio="xMaxYMid slice" className="absolute inset-0 size-full" aria-hidden>
        {Array.from({ length: 6 }, (_, r) =>
          Array.from({ length: 7 }, (_, c) => (
            <rect key={`${r}-${c}`} x={170 + c * 18} y={14 + r * 22} width="12" height="16" rx="2" fill="#ffffff" opacity={((r * 7 + c) % 5 === 0 ? 0.55 : 0.1)} />
          )),
        )}
        <circle cx="210" cy="132" r="40" fill="#ff6f22" opacity="0.85" />
      </svg>
    );
  return (
    <svg viewBox="0 0 300 160" preserveAspectRatio="xMaxYMid slice" className="absolute inset-0 size-full" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M140 ${40 + i * 26} C 190 ${20 + i * 26}, 230 ${60 + i * 26}, 300 ${36 + i * 26}`} stroke="#ffffff" strokeOpacity={0.25 + i * 0.12} strokeWidth="7" fill="none" strokeLinecap="round" />
      ))}
      <rect x="196" y="56" width="70" height="88" rx="8" fill="#ffffff" opacity="0.92" />
      <rect x="206" y="70" width="40" height="5" rx="2.5" fill="#2e7d5b" />
      <rect x="206" y="84" width="50" height="4" rx="2" fill="#2e7d5b" opacity="0.4" />
      <rect x="206" y="94" width="44" height="4" rx="2" fill="#2e7d5b" opacity="0.4" />
      <rect x="206" y="104" width="48" height="4" rx="2" fill="#2e7d5b" opacity="0.4" />
    </svg>
  );
}

const BANNERS = [
  { href: "/themes/bousai/", bg: "#c2470a", pat: "sun" as const, kicker: "特集", title: "避難所の受付を見直す", body: "国の考え方・自治体事例・サービスを1か所で" },
  { href: "/seminars/", bg: "#222222", pat: "grid" as const, kicker: "セミナー", title: "12月のオンライン講座", body: "生成AIの庁内ルール、省エネの進め方ほか" },
  { href: "/compare/", bg: "#2e7d5b", pat: "wave" as const, kicker: "使い方", title: "比べて、下書きにする", body: "条件をそろえて並べ、論点表を作る" },
];

export function Banners() {
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {BANNERS.map((b) => (
        <li key={b.title}>
          <Link href={b.href} className="group relative block h-40 overflow-hidden rounded-card p-5 text-white" style={{ background: b.bg }}>
            <span className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-105">
              <Pattern kind={b.pat} />
            </span>
            <span className="relative block max-w-[68%]">
              <span className="block text-[12px] font-bold opacity-85">{b.kicker}</span>
              <span className="font-heading mt-1 block text-[20px] font-bold leading-snug">{b.title}</span>
              <span className="mt-1 block text-[12px] leading-relaxed opacity-90">{b.body}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
