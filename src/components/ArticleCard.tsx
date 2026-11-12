import Link from "next/link";
import { Clock } from "lucide-react";
import { type Article, formatDate, themeOf } from "@/lib/content";
import { Photo } from "./Photo";
import { KindBadge } from "./KindBadge";
import { CompareButton } from "./compare";

export function ArticleRow({ a }: { a: Article }) {
  return (
    <article className="group grid grid-cols-[96px_minmax(0,1fr)] gap-4 border-b border-line py-5 last:border-b-0 sm:grid-cols-[176px_minmax(0,1fr)_auto] sm:items-center">
      <Link href={`/articles/${a.id}/`} tabIndex={-1} aria-hidden className="block self-start">
        <Photo id={a.id} alt="" sizes="176px" className="aspect-[4/3] rounded-control" />
      </Link>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <KindBadge kind={a.kind} company={a.company} />
          <span className="text-[12px] text-ink-3">{themeOf(a.theme).name}</span>
        </div>
        <h3 className="mt-1.5 text-[16px] font-bold text-ink sm:text-[17px]">
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
          <span className="hidden truncate md:inline">出典：{a.source}</span>
        </p>
      </div>
      <div className="col-span-2 sm:col-span-1">
        <CompareButton id={a.id} variant="ghost" />
      </div>
    </article>
  );
}

export function ArticleTile({ a, size = "md" }: { a: Article; size?: "md" | "lg" }) {
  return (
    <article className="group flex h-full flex-col">
      <Link href={`/articles/${a.id}/`} tabIndex={-1} aria-hidden>
        <Photo id={a.id} alt="" className={size === "lg" ? "aspect-[16/10] rounded-card" : "aspect-[3/2] rounded-card"} sizes={size === "lg" ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"} />
      </Link>
      <div className="flex flex-1 flex-col gap-2 pt-3">
        <KindBadge kind={a.kind} company={a.company} />
        <h3 className={size === "lg" ? "text-[22px] font-bold leading-snug" : "text-[16px] font-bold leading-snug"}>
          <Link href={`/articles/${a.id}/`} className="decoration-brand decoration-2 underline-offset-4 group-hover:underline">
            {a.title}
          </Link>
        </h3>
        {size === "lg" && <p className="line-clamp-3 text-[14px] text-ink-2">{a.lead}</p>}
        <p className="text-[12px] text-ink-3 tabular">
          {themeOf(a.theme).name}・更新 {formatDate(a.updated)}
        </p>
      </div>
    </article>
  );
}
