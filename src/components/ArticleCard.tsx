import Link from "next/link";
import { Clock } from "lucide-react";
import { type Article, formatDate, themeOf } from "@/lib/content";
import { Art } from "./Art";
import { KindBadge } from "./KindBadge";
import { CompareButton } from "./compare";

export function ArticleRow({ a }: { a: Article }) {
  return (
    <article className="group grid grid-cols-[88px_minmax(0,1fr)] gap-4 border-b border-line py-4 last:border-b-0 sm:grid-cols-[132px_minmax(0,1fr)_auto] sm:items-center">
      <Link href={`/articles/${a.id}/`} tabIndex={-1} aria-hidden className="block">
        <Art id={a.id} kind={a.kind} theme={a.theme} iconSize={26} className="aspect-[4/3] rounded-control" />
      </Link>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <KindBadge kind={a.kind} company={a.company} />
          <span className="text-[12px] text-ink-3">{themeOf(a.theme).name}</span>
        </div>
        <h3 className="mt-1.5 text-[16px] font-bold text-ink">
          <Link href={`/articles/${a.id}/`} className="decoration-brand decoration-2 underline-offset-4 group-hover:underline">
            {a.title}
          </Link>
        </h3>
        <p className="mt-1 hidden line-clamp-2 text-[13px] leading-relaxed text-ink-3 sm:block">{a.lead}</p>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-3 text-[12px] text-ink-3">
          <span className="tabular">更新 {formatDate(a.updated)}</span>
          <span className="inline-flex items-center gap-1">
            <Clock aria-hidden className="size-3.5" />
            {a.kind === "training" ? `研修 ${a.minutes}分` : `${a.minutes}分で読める`}
          </span>
          <span className="truncate">出典：{a.source}</span>
        </p>
      </div>
      <div className="col-span-2 sm:col-span-1">
        <CompareButton id={a.id} variant="ghost" />
      </div>
    </article>
  );
}

export function ArticleTile({ a }: { a: Article }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface shadow-[var(--shadow-card)] transition-shadow duration-200 hover:shadow-[var(--shadow-raised)]">
      <Link href={`/articles/${a.id}/`} tabIndex={-1} aria-hidden>
        <Art id={a.id} kind={a.kind} theme={a.theme} className="aspect-[16/9]" />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <KindBadge kind={a.kind} company={a.company} />
        <h3 className="text-[16px] font-bold">
          <Link href={`/articles/${a.id}/`} className="decoration-brand decoration-2 underline-offset-4 group-hover:underline">
            {a.title}
          </Link>
        </h3>
        <p className="line-clamp-2 text-[13px] text-ink-3">{a.lead}</p>
        <p className="mt-auto pt-2 text-[12px] text-ink-3 tabular">更新 {formatDate(a.updated)}</p>
      </div>
    </article>
  );
}
