"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { asset } from "@/lib/asset";

// オープニング演出（トップに最初に来たときだけ。同じタブでは2回目以降は出さない）
// 1. 白い画面に Polimill のロゴがそのまま（加工せず）現れる
// 2. ロゴが上へ移る
// 3. Surfvote → QommonsAI → Qommons ONE のロゴが時間差で現れる
// 4. 「のこしたいみらいをつくる」が1文字ずつ浮かび、そのまま止まる
// 5. 白い幕が上がってサイトが現れる
const KEY = "pp-intro-seen";
const TAGLINE = "のこしたいみらいをつくる";
const LOGO_W = 0.62; // ロゴの幅（画面幅に対する割合の上限）
const T = { crisp: 300, lift: 1700, products: 2100, tagline: 3800, out: 7000 };

type Phase = "start" | "crisp" | "lift" | "products" | "tagline" | "out";

export function Intro() {
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState<Phase>("start");
  const [reduced, setReduced] = useState(false);
  const timers = useRef<number[]>([]);

  const finish = useCallback(() => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
    setPhase("out");
    timers.current.push(window.setTimeout(() => setShow(false), 900));
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
  }, []);

  // 表示するかどうか（?intro=1 なら毎回出す）
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
    } catch {}
    const force = new URLSearchParams(location.search).get("intro") === "1";
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 初回表示の判定はブラウザでしかできない
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    if (!seen || force) setShow(true);
  }, []);

  // 進行
  useEffect(() => {
    if (!show) return;
    document.documentElement.style.overflow = "hidden";
    const at = (ms: number, p: Phase) => timers.current.push(window.setTimeout(() => setPhase(p), reduced ? ms * 0.35 : ms));
    at(T.crisp, "crisp");
    at(T.lift, "lift");
    at(T.products, "products");
    at(T.tagline, "tagline");
    timers.current.push(window.setTimeout(finish, reduced ? T.out * 0.45 : T.out));
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && finish();
    window.addEventListener("keydown", onKey);
    return () => {
      timers.current.forEach((t) => clearTimeout(t));
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [show, reduced, finish]);

  useEffect(() => {
    if (phase === "out") document.documentElement.style.overflow = "";
  }, [phase]);

  const lifted = phase === "lift" || phase === "products" || phase === "tagline" || phase === "out";
  const crisp = phase !== "start";
  const showProducts = phase === "products" || phase === "tagline" || phase === "out";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          role="dialog"
          aria-modal="true"
          aria-label="Polimill のオープニング"
          className="fixed inset-0 z-[100] overflow-hidden bg-white"
          initial={{ opacity: 1 }}
          animate={phase === "out" ? { clipPath: "inset(0 0 100% 0)" } : { clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >

          <div className="relative flex h-full flex-col items-center justify-center px-6">
            {/* ロゴ：粒子が集まった位置にそのまま重ねる */}
            <motion.div
              initial={false}
              animate={{ y: lifted ? "-14vh" : 0, scale: lifted ? 0.72 : 1, opacity: crisp ? 1 : 0 }}
              transition={{ duration: lifted ? 0.9 : 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute"
              style={{ width: `min(560px, ${LOGO_W * 100}vw)` }}
            >
              <Image src={asset("/brand/polimill-logo-large.png")} alt="Polimill" width={1020} height={312} priority className="h-auto w-full" />
            </motion.div>

            {/* 3つのサービス */}
            <ul className="absolute top-[52%] flex w-full max-w-4xl flex-col items-center justify-center gap-6 sm:flex-row sm:gap-12" aria-label="Polimill のサービス">
              {[
                { src: "/brand/surfvote-logo.png", alt: "Surfvote", w: 744, h: 168 },
                { src: "/brand/qommonsai-logo.png", alt: "QommonsAI", w: 776, h: 136 },
                { src: "/brand/qommonsone-logo.png", alt: "Qommons ONE", w: 843, h: 127 },
              ].map((l, i) => (
                <motion.li
                  key={l.alt}
                  // 左から光が差すように、マスクで横に開いて現れる
                  initial={{ clipPath: "inset(0 100% 0 0)", scale: 0.94 }}
                  animate={showProducts ? { clipPath: "inset(0 0% 0 0)", scale: 1 } : { clipPath: "inset(0 100% 0 0)", scale: 0.94 }}
                  transition={{ duration: 0.9, delay: showProducts && phase === "products" ? i * 0.45 : 0, ease: [0.65, 0, 0.35, 1] }}
                  className="flex h-9 items-center sm:h-10"
                >
                  <Image src={asset(l.src)} alt={l.alt} width={l.w} height={l.h} className="h-full w-auto" />
                </motion.li>
              ))}
            </ul>

            {/* キャッチコピー：1文字ずつ浮かび、そのあと漂う */}
            <motion.p
              className="absolute bottom-[16vh] font-heading text-[clamp(26px,5.2vw,52px)] font-bold tracking-[0.12em] text-ink"
              aria-label={TAGLINE}
            >
              {TAGLINE.split("").map((ch, i) => (
                <motion.span
                  key={i}
                  aria-hidden
                  className="inline-block"
                  initial={{ opacity: 0, y: 36, filter: "blur(12px)" }}
                  animate={phase === "tagline" || phase === "out" ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 36, filter: "blur(12px)" }}
                  transition={{ duration: 0.9, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] }}
                >
                  {ch}
                </motion.span>
              ))}
            </motion.p>
          </div>

          <button
            type="button"
            onClick={finish}
            className="absolute bottom-5 right-5 rounded-control px-3 py-2 text-[13px] text-ink-3 hover:bg-surface-2 hover:text-ink"
          >
            スキップ
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
