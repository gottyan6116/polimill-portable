"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
// avoid-ai-design-ignore: I3 -- お知らせカードの「開く」を示す矢印（参考サイトの構成に合わせる）
import { ArrowRight, ChevronDown } from "lucide-react";
import { asset } from "@/lib/asset";
import { NEWS, byDateDesc, dotDate } from "@/lib/polimill-news";
import { PolimillBadge } from "@/components/PolimillNews";

// 左下カードに出すのは、Polimill のお知らせのうち「重要」の最新1件（なければ最新）
const latest = byDateDesc(NEWS).find((n) => n.important) ?? byDateDesc(NEWS)[0];

// トップのファーストビュー。淡い色の地に大きな見出しを中央に置き、
// その下にまち全体のイラストを広く見せる。左下にお知らせ、右に Scroll down。
// PC幅ではFVを画面の高さに収め、イラストは残りの高さに合わせて縮める（下が切れないように）。
// 登場の動きは CSS（.fv-in）で行う。JS が読み込めない・遅れるときも、見出しとイラストが消えたままにならないように。
export function HeroFV() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  // 下へ送ると、イラストがわずかに遅れてついてくる
  const illoY = useTransform(scrollY, [0, 600], [0, reduce ? 0 : -40]);

  const toNext = () => {
    document.getElementById("after-fv")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section aria-labelledby="fv-heading" className="fv-bg relative isolate overflow-hidden lg:h-[calc(100svh-4rem)] lg:min-h-[620px]">
      {/* 地の大きな曲線（参考サイトの帯の流れ） */}
      <svg aria-hidden className="pointer-events-none absolute inset-0 -z-10 h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="none">
        <path d="M0 420 C 320 300, 620 520, 980 380 S 1440 260, 1440 260 L1440 900 L0 900 Z" fill="var(--color-fv-mint)" opacity="0.55" />
        <path d="M0 560 C 380 470, 760 640, 1100 520 S 1440 470, 1440 470 L1440 900 L0 900 Z" fill="var(--color-fv-blush)" opacity="0.5" />
      </svg>

      <div className="mx-auto max-w-[1360px] px-4 pt-12 sm:px-6 sm:pt-14 lg:flex lg:h-full lg:flex-col lg:pb-8 lg:pt-12">
        <h1
          id="fv-heading"
          style={{ "--fv-y": "16px", "--fv-dur": "0.8s" } as React.CSSProperties}
          className="fv-in fv-heading text-center text-[28px] font-bold text-ink sm:text-[40px] lg:text-[52px]"
        >
          行政の「知りたい」が、
          <span className="inline-block">見つかる</span>
        </h1>
        <p
          style={{ "--fv-y": "0px", "--fv-dur": "0.8s", "--fv-delay": "0.25s" } as React.CSSProperties}
          className="fv-in mx-auto mt-4 max-w-2xl text-center text-[14px] text-ink-2 sm:text-[15px]"
        >
          制度・ほかの自治体の事例・企業のサービスを、出典と種類を分けて探せる行政ナレッジポータル
        </p>

        <div
          style={{ "--fv-y": "40px", "--fv-dur": "1.1s", "--fv-delay": "0.15s" } as React.CSSProperties}
          className="fv-in relative mx-auto mt-6 w-full max-w-[1240px] sm:mt-8 lg:mt-6 lg:min-h-0 lg:flex-1"
        >
          <motion.div style={{ y: illoY }} className="lg:h-full">
          <div className={`lg:h-full ${reduce ? "" : "fv-float"}`}>
            <Image
              src={asset("/brand/portal-fv.webp")}
              alt="自治体庁舎、住民相談の窓口、データ活用、連携・共創、Qommons ONE のアプリがPolimillを中心につながるまちのイラスト"
              width={1672}
              height={941}
              priority
              className="fv-illo h-auto w-full lg:mx-auto lg:h-full lg:w-auto lg:max-w-full lg:object-contain"
            />
          </div>
          </motion.div>
        </div>
      </div>

      {/* 左下：運営元 Polimill の最新のお知らせ（PC幅より狭いときはイラストの下に置く） */}
      <div
        style={{ "--fv-y": "12px", "--fv-dur": "0.6s", "--fv-delay": "0.7s" } as React.CSSProperties}
        className="fv-in relative mx-4 mb-8 mt-2 sm:mx-6 sm:max-w-[340px] lg:absolute lg:bottom-8 lg:left-8 lg:m-0 lg:w-[280px]"
      >
        <span aria-hidden className="absolute -top-4 left-3 h-9 w-6 -rotate-[24deg] rounded-[2px] bg-fv-tape" />
        <Link
          href={`/polimill/#${latest.id}`}
          className="group relative block rounded-card bg-surface px-5 py-4 shadow-raised transition-transform duration-200 hover:-translate-y-0.5"
        >
          <span className="flex items-center justify-between gap-2">
            <PolimillBadge />
            <time dateTime={latest.date} className="text-[12px] text-ink-3 tabular">
              {dotDate(latest.date)}
            </time>
          </span>
          <span className="mt-2 flex items-end justify-between gap-3">
            <span className="text-[14px] font-bold leading-relaxed text-ink">{latest.title}</span>
            <span className="grid h-7 w-11 shrink-0 place-items-center rounded-full bg-surface-2 text-ink transition-colors group-hover:bg-ink group-hover:text-white">
              <ArrowRight aria-hidden className="size-4" />
            </span>
          </span>
        </Link>
      </div>

      {/* 右：Scroll down */}
      <button
        type="button"
        onClick={toNext}
        className="group absolute bottom-10 right-8 hidden flex-col items-center gap-3 text-ink-2 lg:flex"
        aria-label="次の内容へ移動"
      >
        <span className="text-[12px] font-bold tracking-[0.12em] [writing-mode:vertical-rl]">Scroll down</span>
        <span className="grid size-10 place-items-center rounded-full border border-ink-2 bg-surface/70 transition-colors group-hover:bg-ink group-hover:text-white">
          <ChevronDown aria-hidden className={`size-4 ${reduce ? "" : "fv-nudge"}`} />
        </span>
      </button>
    </section>
  );
}
