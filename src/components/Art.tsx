import type { Kind, ThemeSlug } from "@/lib/content";
import { ThemeIcon } from "./ThemeIcon";
import clsx from "clsx";

// 記事のサムネイル。写真の代わりに、記事IDから決まる図形とテーマのアイコンで描く（生成画像）。
// 種類ごとに地の色を変え、Polimill のオレンジを差し色に使う。
const PALETTE: Record<Kind, { bg: string; fg: string; mid: string }> = {
  public: { bg: "#dceaf5", fg: "#1f5f8b", mid: "#9ec3df" },
  case: { bg: "#dcefe5", fg: "#2e7d5b", mid: "#9fd0b7" },
  editorial: { bg: "#e6e9f2", fg: "#434956", mid: "#c3c9d8" },
  training: { bg: "#e6e9f2", fg: "#434956", mid: "#c3c9d8" },
  template: { bg: "#e6e9f2", fg: "#434956", mid: "#c3c9d8" },
  pr: { bg: "#fbecc2", fg: "#8a5a00", mid: "#ecc96b" },
};

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

export function Art({ id, kind, theme, className, iconSize = 44 }: { id: string; kind: Kind; theme: ThemeSlug; className?: string; iconSize?: number }) {
  const h = hash(id);
  const c = PALETTE[kind];
  const sunX = 105 + (h % 40);
  const sunY = 22 + ((h >> 4) % 18);
  const hill1 = 62 + ((h >> 8) % 10);
  const hill2 = 70 + ((h >> 12) % 10);
  const bars = Array.from({ length: 5 }, (_, i) => 10 + ((h >> (i * 3)) % 22));
  return (
    <div className={clsx("relative overflow-hidden", className)} style={{ background: c.bg }}>
      <svg viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" aria-hidden>
        <circle cx={sunX} cy={sunY} r="16" fill="#ff6f22" />
        <circle cx={sunX} cy={sunY} r="25" fill="#ff6f22" opacity="0.18" />
        <path d={`M0 ${hill1} C 40 ${hill1 - 18}, 70 ${hill1 + 6}, 160 ${hill1 - 10} V100 H0 Z`} fill={c.mid} />
        <path d={`M0 ${hill2 + 8} C 50 ${hill2 - 6}, 100 ${hill2 + 14}, 160 ${hill2} V100 H0 Z`} fill={c.fg} opacity="0.9" />
        {bars.map((b, i) => (
          <rect key={i} x={14 + i * 9} y={hill1 - b - 2} width="6" height={b + 6} rx="1.5" fill={c.fg} opacity={0.18 + i * 0.06} />
        ))}
      </svg>
      <div className="absolute inset-0 flex items-end p-[6%]">
        <ThemeIcon slug={theme} size={iconSize} strokeWidth={1.8} color="#ffffff" />
      </div>
    </div>
  );
}
