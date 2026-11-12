import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Clock, ExternalLink, Info } from "lucide-react";
import { ARTICLES, articleById, byUpdated, formatDate, themeOf } from "@/lib/content";
import { Photo, PhotoCredit } from "@/components/Photo";
import { KindBadge } from "@/components/KindBadge";
import { ArticleTile } from "@/components/ArticleCard";
import { CompareButton } from "@/components/compare";
import { ConsentDialog, DraftDialog } from "@/components/dialogs";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const a = articleById((await params).id);
  return { title: a?.title ?? "記事" };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const a = articleById((await params).id);
  if (!a) notFound();
  const theme = themeOf(a.theme);
  const related = byUpdated(ARTICLES.filter((x) => x.theme === a.theme && x.id !== a.id)).slice(0, 3);
  const isPr = a.kind === "pr";
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <nav aria-label="パンくず" className="flex flex-wrap items-center gap-1 text-[13px] text-ink-3">
        <Link href="/" className="hover:text-ink">トップ</Link>
        <ChevronRight aria-hidden className="size-3.5" />
        <Link href={`/themes/${theme.slug}/`} className="hover:text-ink">{theme.name}</Link>
      </nav>

      {isPr && (
        <div className="mt-4 flex gap-3 rounded-card border-2 border-pr-line bg-pr-soft p-4 text-[14px] text-pr">
          <Info aria-hidden className="mt-0.5 size-5 shrink-0" />
          <p>
            <span className="font-bold">この記事はPR（企業提供）です。</span>
            {a.company}が提供した情報をもとに掲載しています。行政の推奨ではありません。Talk の回答・検索・推薦の対象には入りません。
          </p>
        </div>
      )}

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <article>
          <KindBadge kind={a.kind} company={a.company} size="md" />
          <h1 className="mt-3 text-[28px] font-bold leading-snug sm:text-[32px]">{a.title}</h1>
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-ink-3">
            <span className="tabular">更新 {formatDate(a.updated)}</span>
            <span className="inline-flex items-center gap-1">
              <Clock aria-hidden className="size-3.5" />
              {a.kind === "training" ? `研修 ${a.minutes}分` : `${a.minutes}分で読める`}
            </span>
            <span>{theme.name}</span>
          </p>
          <figure className="mt-6">
            <Photo id={a.id} alt="" priority zoom={false} sizes="(min-width: 1024px) 760px, 100vw" className="aspect-[16/9] rounded-card" />
            <figcaption className="mt-2">
              <PhotoCredit id={a.id} />
            </figcaption>
          </figure>
          <p className="mt-6 text-[17px] leading-[1.9] text-ink">{a.lead}</p>

          <section aria-labelledby="cond" className="mt-8 rounded-card border border-line bg-surface">
            <h2 id="cond" className="border-b border-line px-4 py-3 text-[16px] font-bold">
              この情報があてはまる条件
            </h2>
            <dl className="grid sm:grid-cols-2">
              {[
                ["人口規模", a.conditions.population],
                ["費用", a.conditions.cost],
                ["個人情報", a.conditions.personalData],
                ["必要な体制", a.conditions.staffing],
              ].map(([k, v]) => (
                <div key={k} className="border-b border-line px-4 py-3 sm:[&:nth-last-child(-n+2)]:border-b-0 sm:odd:border-r">
                  <dt className="text-[12px] font-bold text-ink-3">{k}</dt>
                  <dd className="mt-0.5 text-[15px] text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <div className="mt-8 space-y-8">
            {a.sections.map((s) => (
              <section key={s.h}>
                <h2 className="border-l-0 text-[21px] font-bold">{s.h}</h2>
                {s.p.map((p, i) => (
                  <p key={i} className="mt-3 text-[16px] leading-[1.95] text-ink-2">
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </div>

          <section className="mt-10 rounded-card bg-surface-2 p-4 text-[14px]">
            <h2 className="text-[15px] font-bold">出典</h2>
            <p className="mt-1 flex items-start gap-2 text-ink-2">
              <ExternalLink aria-hidden className="mt-1 size-4 shrink-0" />
              {a.source}
            </p>
            <p className="mt-2 text-[12px] text-ink-3">デモ用のサンプルです。本番では原文へのリンクと、確認した日付を表示します。</p>
          </section>
        </article>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="space-y-3 rounded-card border border-line bg-surface p-4">
            <p className="text-[13px] font-bold text-ink-3">この記事を業務に使う</p>
            <div className="[&>button]:w-full">
              <CompareButton id={a.id} />
            </div>
            <DraftDialog items={[a]} />
            {isPr && <ConsentDialog article={a} />}
            <p className="text-[12px] leading-relaxed text-ink-3">比較に追加すると、画面下のトレイに入ります。最大4件まで並べて比べられます。</p>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="text-[22px] font-bold">{theme.name}の他の情報</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <ArticleTile key={r.id} a={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
