import type { Metadata } from "next";
import Link from "next/link";
import { NEWS, TRAININGS, byDateDesc } from "@/lib/polimill-news";
import { NewsList, PolimillBadge, TrainingCard } from "@/components/PolimillNews";

export const metadata: Metadata = { title: "Polimill から" };

// 運営元 Polimill からのお知らせと研修。編集部の記事・PR・サービス比較とは分けて、ここにまとめる。
export default function Page() {
  const news = byDateDesc(NEWS);
  const trainings = [...TRAININGS].sort((a, b) => (a.date < b.date ? -1 : 1));
  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
          <PolimillBadge label="運営元 Polimill の情報" />
          <h1 className="mt-4 font-heading text-[32px] font-bold leading-tight text-ink sm:text-[40px]">Polimill から</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-2">
            このポータルを運営する Polimill からのお知らせと、QommonsAI・Qommons ONE の研修の案内です。
          </p>
          <p className="mt-2 max-w-2xl text-[13px] text-ink-3">
            編集部の記事や企業の PR とは分けて載せています。サービス比較の一覧には入りません。掲載内容はデモ用のサンプルです。
          </p>
          <nav aria-label="このページの中" className="mt-8 flex flex-wrap gap-2">
            {[
              ["#news", "お知らせ"],
              ["#trainings", "研修"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="inline-flex h-10 items-center rounded-full border border-line-strong px-4 text-[14px] font-bold text-ink transition-colors hover:border-ink hover:bg-canvas"
              >
                {label}
              </a>
            ))}
            <Link
              href="/seminars/"
              className="inline-flex h-10 items-center rounded-full px-4 text-[14px] font-bold text-ink-3 underline-offset-4 hover:text-ink hover:underline"
            >
              編集部のセミナーはこちら
            </Link>
          </nav>
        </div>
      </section>

      <section id="news" aria-labelledby="news-heading" className="mx-auto max-w-6xl scroll-mt-28 px-4 py-12 sm:px-6">
        <h2 id="news-heading" className="text-[24px] font-bold">
          お知らせ
        </h2>
        <p className="mt-1 text-[13px] text-ink-3">新しい順。機能の追加、メンテナンス、研修の受付開始など。</p>
        <div className="mt-5">
          <NewsList items={news} withBody />
        </div>
      </section>

      <section id="trainings" aria-labelledby="trainings-heading" className="scroll-mt-28 border-t border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2 id="trainings-heading" className="text-[24px] font-bold">
            研修
          </h2>
          <p className="mt-1 text-[13px] text-ink-3">QommonsAI・Qommons ONE を使う職員向けに、Polimill が開く研修です。日付の近い順。</p>
          <ul className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {trainings.map((t) => (
              <li key={t.id} id={t.id} className="scroll-mt-32">
                <TrainingCard t={t} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
