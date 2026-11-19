"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
// avoid-ai-design-ignore: I3 -- お知らせカードの「開く」を示す矢印（参考サイトの構成に合わせる）
import { ArrowRight, ChevronDown, Info } from "lucide-react";
import { asset } from "@/lib/asset";

const EASE = [0.2, 0.7, 0.2, 1] as const;

// トップのファーストビュー。淡い色の地に大きな見出しを中央に置き、
// その下にまち全体のイラストを広く見せる。左下にお知らせ、右に Scroll down。
export function HeroFV() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  // 下へ送ると、イラストがわずかに遅れてついてくる
  const illoY = useTransform(scrollY, [0, 600], [0, reduce ? 0 : -40]);

  const toNext = () => {
    document.getElementById("after-fv")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section aria-labelledby="fv-heading" className="fv-bg relative isolate overflow-hidden lg:h-[calc(100svh-6.5rem)] lg:min-h-[620px]">
      {/* 地の大きな曲線（参考サイトの帯の流れ） */}
      <svg aria-hidden className="pointer-events-none absolute inset-0 -z-10 h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="none">
        <path d="M0 420 C 320 300, 620 520, 980 380 S 1440 260, 1440 260 L1440 900 L0 900 Z" fill="var(--color-fv-mint)" opacity="0.55" />
        <path d="M0 560 C 380 470, 760 640, 1100 520 S 1440 470, 1440 470 L1440 900 L0 900 Z" fill="var(--color-fv-blush)" opacity="0.5" />
      </svg>

      <div className="mx-auto max-w-[1360px] px-4 pt-12 sm:px-6 sm:pt-14 lg:pt-16">
        <motion.h1
          id="fv-heading"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="fv-heading text-center text-[28px] font-bold text-ink sm:text-[40px] lg:text-[52px]"
        >
          行政のしごとを
          <br />
          ナレッジのちからでデザインする
        </motion.h1>
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
          className="mx-auto mt-4 max-w-2xl text-center text-[14px] text-ink-2 sm:text-[15px]"
        >
          制度・ほかの自治体の事例・企業のサービスを、出典と種類を分けて探せる行政ナレッジポータル
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.15, ease: EASE }}
          className="relative mx-auto mt-6 max-w-[1240px] sm:mt-8"
        >
          <motion.div style={{ y: illoY }}>
          <div className={reduce ? undefined : "fv-float"}>
            <Image
              src={asset("/brand/portal-fv.webp")}
              alt="自治体庁舎、住民相談の窓口、データ活用、連携・共創、Qommons ONE のアプリがPolimillを中心につながるまちのイラスト"
              width={1672}
              height={941}
              priority
              className="fv-illo h-auto w-full"
            />
          </div>
          </motion.div>
        </motion.div>
      </div>

      {/* 左下：お知らせ（PC幅より狭いときはイラストの下に置く） */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7, ease: EASE }}
        className="relative mx-4 mb-8 mt-2 sm:mx-6 sm:max-w-[340px] lg:absolute lg:bottom-10 lg:left-10 lg:m-0 lg:w-[300px]"
      >
        <span aria-hidden className="absolute -top-4 left-3 h-9 w-6 -rotate-[24deg] rounded-[2px] bg-fv-tape" />
        <Link
          href="/policy/"
          className="group relative block rounded-card bg-surface px-5 py-4 shadow-raised transition-transform duration-200 hover:-translate-y-0.5"
        >
          <span className="flex items-center gap-1.5 text-[13px] font-bold text-case">
            <Info aria-hidden className="size-4" />
            お知らせ
          </span>
          <span className="mt-1.5 flex items-end justify-between gap-3">
            <span className="text-[14px] leading-relaxed text-ink-2">このサイトはデモです。掲載内容はすべてサンプルです</span>
            <span className="grid h-7 w-11 shrink-0 place-items-center rounded-full bg-surface-2 text-case transition-colors group-hover:bg-case group-hover:text-white">
              <ArrowRight aria-hidden className="size-4" />
            </span>
          </span>
        </Link>
      </motion.div>

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
