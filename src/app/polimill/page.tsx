import type { Metadata } from "next";
import Link from "next/link";
import { NEWS, TRAININGS, byDateDesc } from "@/lib/polimill-news";
import { NewsList, PolimillBadge, TrainingCard } from "@/components/PolimillNews";
import { PrTimesAllLink, PrTimesHighlights, PrTimesTrainings } from "@/components/PrTimes";
import Image from "next/image";
import { asset } from "@/lib/asset";
import "../prtimes.css";

export const metadata: Metadata = { title: "Polimill から" };

// 運営元 Polimill の発表・お知らせ・研修。編集部の記事・PR・サービス比較とは分けて、ここにまとめる。
// PR TIMES の欄だけは実在のリリース（src/lib/prtimes.ts）。お知らせと研修はデモ用のサンプル。
export default function Page() {
  const news = byDateDesc(NEWS);
  const trainings = [...TRAININGS].sort((a, b) => (a.date < b.date ? -1 : 1));
  return (
    <>
      <section className="prt-hero border-b border-line">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div>
            <PolimillBadge label="運営元 Polimill の情報" />
            <h1 className="mt-4 font-heading text-[32px] font-bold leading-tight text-ink sm:text-[40px]">Polimill から</h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-2">
              このポータルを運営する Polimill は、市民・行政・企業や大学・AI が同じ基盤でつながる「公共OS Qommons」をつくっています。ここでは、その発表と QommonsAI・Qommons ONE の研修の案内を載せています。
            </p>
            <p className="mt-2 max-w-2xl text-[13px] text-ink-3">
              編集部の記事や企業の PR とは分けて載せています。サービス比較の一覧には入りません。PR TIMES のリリースは実際に公開したもので、お知らせと研修はデモ用のサンプルです。
            </p>
            <nav aria-label="このページの中" className="mt-8 flex flex-wrap gap-2">
              {[
                ["#releases", "PR TIMES の発表"],
                ["#news", "お知らせ"],
                ["#trainings", "研修"],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  className="inline-flex h-10 items-center rounded-full border border-line-strong bg-surface px-4 text-[14px] font-bold text-ink transition-colors hover:border-ink hover:bg-canvas"
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
          {/* 公共OS Qommons の全体図（polimill.jp の図をそのまま使う） */}
          <figure className="prt-os">
            <Image
              src={asset("/brand/qommons-os.webp")}
              alt="公共OS Qommons の図。市民・住民（Surfvote）、パブリックセクター・社会インフラ（QommonsAI）、ヒューマノイド、学術・企業・NPO の4つが、Qommons を中心に輪でつながっている。個別のプロダクトではなく、多様なアプリケーションが連携・発展するエコシステムであり、社会全体が活動する基盤。"
              width={1600}
              height={1200}
              priority
              sizes="(min-width: 1024px) 620px, 100vw"
              className="prt-os__img"
            />
          </figure>
        </div>
      </section>

      {/* PR TIMES で公開した実際のリリース */}
      <section id="releases" aria-labelledby="releases-heading" className="mx-auto max-w-6xl scroll-mt-28 px-4 pt-14 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="prt-eyebrow">PRESS RELEASE</p>
            <h2 id="releases-heading" className="mt-1 text-[26px] font-bold">
              PR TIMES で発表しました
            </h2>
            <p className="mt-1 text-[13px] text-ink-3">新しい機能、自治体との協定、共催セミナー。押すと PR TIMES の記事が新しいタブで開きます。</p>
          </div>
          <PrTimesAllLink />
        </div>
        <div className="mt-6">
          <PrTimesHighlights />
        </div>
      </section>

      <section aria-labelledby="prt-training-heading" className="prt-band mt-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="prt-eyebrow">TRAINING REPORT</p>
          <h2 id="prt-training-heading" className="mt-1 text-[26px] font-bold">
            全国の自治体で、研修を開いています
          </h2>
          <p className="mt-1 text-[13px] text-ink-3">QommonsAI 活用研修の実施レポート（PR TIMES）。参加した職員の声を見出しにしています。</p>
        </div>
        <div className="mt-6">
          <PrTimesTrainings />
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
