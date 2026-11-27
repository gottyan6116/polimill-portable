import Link from "next/link";
import type { News, NewsKind, Training } from "@/lib/polimill-news";
import { dotDate } from "@/lib/polimill-news";
import { TrainingApply } from "@/components/TrainingApply";

// 運営元 Polimill の情報だと分かる印。編集部（グレー）・PR（琥珀）と見分けられるよう、黒地にオレンジの点。
export function PolimillBadge({ label = "Polimill から", className = "" }: { label?: string; className?: string }) {
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-chip bg-ink px-2 py-0.5 text-[12px] font-bold leading-5 text-white ${className}`}>
      <span aria-hidden className="size-2 rounded-full bg-brand" />
      {label}
    </span>
  );
}

const KIND_STYLE: Record<NewsKind, string> = {
  研修: "bg-brand-soft text-brand-deep",
  機能: "bg-public-soft text-public",
  メンテナンス: "bg-surface-2 text-ink-2",
  お知らせ: "bg-surface-2 text-ink-2",
};

export function NewsKindTag({ kind }: { kind: NewsKind }) {
  return <span className={`inline-block min-w-[4.5em] shrink-0 whitespace-nowrap rounded-chip px-2 text-center text-[12px] font-bold leading-6 ${KIND_STYLE[kind]}`}>{kind}</span>;
}

// お知らせの行（日付・種類・タイトル）。本文は詳しく見せたいときだけ。
export function NewsList({ items, withBody = false }: { items: News[]; withBody?: boolean }) {
  return (
    <ul className="divide-y divide-line border-y border-line">
      {items.map((n) => (
        <li key={n.id} id={n.id} className="scroll-mt-32 py-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <time dateTime={n.date} className="w-[5.5em] text-[13px] text-ink-3 tabular">
              {dotDate(n.date)}
            </time>
            <NewsKindTag kind={n.kind} />
          </div>
          <p className="mt-1.5 text-[15px] font-bold leading-relaxed text-ink">{n.title}</p>
          {withBody && <p className="mt-1 text-[14px] leading-relaxed text-ink-2">{n.body}</p>}
        </li>
      ))}
    </ul>
  );
}

// 研修のカード（対象・形式・日時）。申し込みはデモなので送らない。
export function TrainingCard({ t, compact = false }: { t: Training; compact?: boolean }) {
  return (
    <article className="flex h-full flex-col rounded-card border border-line bg-surface p-5">
      <p className="text-[12px] font-bold text-brand-strong">Polimill 主催の研修</p>
      <h3 className="mt-1 text-[17px] font-bold leading-snug text-ink">{t.title}</h3>
      {!compact && <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{t.summary}</p>}
      <dl className="mt-3 grid grid-cols-[4em_minmax(0,1fr)] gap-x-2 gap-y-1 text-[13px]">
        <dt className="text-ink-3">対象</dt>
        <dd className="text-ink-2">{t.target}</dd>
        <dt className="text-ink-3">形式</dt>
        <dd className="text-ink-2">{t.format}</dd>
        <dt className="text-ink-3">日時</dt>
        <dd className="text-ink-2 tabular">
          {dotDate(t.date)} {t.time}（{t.minutes}分）
        </dd>
      </dl>
      <div className="mt-auto pt-4">
        {compact ? (
          <Link
            href={`/polimill/#${t.id}`}
            className="inline-flex h-10 items-center rounded-control border border-line-strong px-4 text-[14px] font-bold text-ink transition-colors hover:border-ink hover:bg-canvas"
          >
            内容と申し込み
          </Link>
        ) : (
          <TrainingApply title={t.title} />
        )}
      </div>
    </article>
  );
}
