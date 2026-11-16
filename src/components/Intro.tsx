"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { asset } from "@/lib/asset";

// オープニング演出「立ちのぼる光」（トップに最初に来たときだけ。同じタブでは2回目以降は出さない）
// 1. 斜め上から見た日本列島が、1,741の点（全国の市区町村の数）で浮かぶ
// 2. 北から南へ、点からオレンジの光の柱が立ちのぼる
// 3. 柱が沈み、視点が真上へ移りながら、列島は薄い背景になる
// 4. Polimill のロゴ → Surfvote・QommonsAI・Qommons ONE → 「のこしたいみらいをつくる」（最後は止まる）
// 5. 白い幕が上がってサイトが現れる
// 点の位置は列島の形から均等に置いたもので、実際の導入自治体の場所ではない（データは src/lib/japan-dots.json）。
const KEY = "pp-intro-seen";
const TAGLINE = "のこしたいみらいをつくる";
const T = { logo: 5200, products: 6100, tagline: 7000, out: 9600 };
const ORANGE = [255, 111, 34];
const GRAY = [201, 206, 216];
const OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Dots = { w: number; h: number; p: [number, number][] };

const clamp = (x: number) => Math.max(0, Math.min(1, x));
const easeOut = (x: number) => 1 - Math.pow(1 - clamp(x), 3);
const easeInOut = (x: number) => {
  x = clamp(x);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
const rgba = (c: number[], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

function drawFrame(ctx: CanvasRenderingContext2D, W: number, H: number, dots: Dots, R: number[], t: number) {
  ctx.clearRect(0, 0, W, H);
  const asp = dots.w / dots.h;
  let mh = H * 0.94;
  let mw = mh * asp;
  if (mw > W * 0.9) {
    mw = W * 0.9;
    mh = mw / asp;
  }
  const r = Math.max(1.3, Math.min(W, H) / 330);
  const s = Math.min(mw, mh);
  const pitch = ((32 + 58 * easeInOut((t - 3600) / 1800)) * Math.PI) / 180;
  const yaw = ((-18 + 18 * easeInOut((t - 300) / 5000)) * Math.PI) / 180;
  const zoom = 1.25 - 0.25 * easeInOut((t - 3600) / 1800);
  const D = s * 2.4;
  const cx = W / 2;
  const cy = H * 0.52;
  const fade = 1 - 0.82 * easeInOut((t - 5000) / 900); // ロゴが出るとき、文字が読めるよう地図を薄くする
  const cosP = Math.cos(pitch), sinP = Math.sin(pitch), cosY = Math.cos(yaw), sinY = Math.sin(yaw);
  const proj = (X: number, Y: number, Z: number): [number, number, number] => {
    const x1 = X * cosY - Z * sinY;
    const z1 = X * sinY + Z * cosY;
    const y2 = Y * cosP - z1 * sinP;
    const z2 = Y * sinP + z1 * cosP;
    const k = (D / (D + z2)) * zoom;
    return [cx + x1 * k, cy - y2 * k, k];
  };
  for (let i = 0; i < dots.p.length; i++) {
    const [nx, ny] = dots.p[i];
    const X = (nx - 0.5) * mw;
    const Z = (ny - 0.5) * mh;
    const appear = easeOut((t - 100 - R[i] * 600) / 500);
    if (appear <= 0) continue;
    const start = 800 + ny * 2000 + R[i] * 250; // 北から南へ
    const rise = easeOut((t - start) / 700) * (1 - easeInOut((t - 3500) / 1400));
    const h = s * (0.03 + 0.11 * R[(i * 7) % R.length]) * rise;
    const [bx, by, k] = proj(X, 0, Z);
    if (h > 0.5) {
      const [tx, ty] = proj(X, h, Z);
      const g = ctx.createLinearGradient(bx, by, tx, ty);
      g.addColorStop(0, rgba(ORANGE, 0.05 * fade));
      g.addColorStop(1, rgba(ORANGE, 0.85 * fade));
      ctx.strokeStyle = g;
      ctx.lineWidth = Math.max(0.8, r * 0.7 * k);
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(tx, ty);
      ctx.stroke();
      ctx.fillStyle = rgba(ORANGE, 0.95 * fade);
      ctx.beginPath();
      ctx.arc(tx, ty, r * 0.9 * k, 0, 7);
      ctx.fill();
    }
    const lit = clamp((t - start) / 700);
    ctx.fillStyle = rgba(lit > 0 ? ORANGE : GRAY, (lit > 0 ? 0.55 + 0.3 * lit : 0.85) * appear * fade);
    ctx.beginPath();
    ctx.arc(bx, by, r * k * 0.95, 0, 7);
    ctx.fill();
  }
}

export function Intro() {
  const [show, setShow] = useState(false);
  const [out, setOut] = useState(false);
  const [reduced, setReduced] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timers = useRef<number[]>([]);

  const finish = useCallback(() => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
    setOut(true);
    document.documentElement.style.overflow = "";
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

  // 進行（幕を上げる時刻・Esc・スクロール止め）
  useEffect(() => {
    if (!show) return;
    document.documentElement.style.overflow = "hidden";
    timers.current.push(window.setTimeout(finish, reduced ? 2800 : T.out));
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && finish();
    window.addEventListener("keydown", onKey);
    return () => {
      timers.current.forEach((t) => clearTimeout(t));
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [show, reduced, finish]);

  // 列島の絵（2D canvas）
  useEffect(() => {
    if (!show || !canvasRef.current) return;
    let raf = 0;
    let disposed = false;
    let cleanup = () => {};
    const cv = canvasRef.current;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    (async () => {
      const dots = (await import("@/lib/japan-dots.json")).default as Dots;
      if (disposed) return;
      let seed = 11;
      const R = dots.p.map(() => (seed = (seed * 16807) % 2147483647) / 2147483647);
      let W = 0, H = 0;
      const size = () => {
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        W = cv.clientWidth;
        H = cv.clientHeight;
        cv.width = Math.round(W * dpr);
        cv.height = Math.round(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      size();
      const t0 = performance.now();
      const END = T.out;
      const tick = (now: number) => {
        const t = reduced ? END : now - t0;
        drawFrame(ctx, W, H, dots, R, t);
        if (t < END && !reduced) raf = requestAnimationFrame(tick);
      };
      const onResize = () => {
        size();
        if (reduced) drawFrame(ctx, W, H, dots, R, END);
      };
      window.addEventListener("resize", onResize);
      raf = requestAnimationFrame(tick);
      cleanup = () => window.removeEventListener("resize", onResize);
    })();
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cleanup();
    };
  }, [show, reduced]);

  // 動きを減らす設定では、最後の画面に近い形を短く見せる
  const d = (ms: number) => (reduced ? 0 : ms / 1000);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          role="dialog"
          aria-modal="true"
          aria-label="Polimill のオープニング"
          className="fixed inset-0 z-[100] overflow-hidden bg-white"
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          animate={out ? { clipPath: "inset(0 0 100% 0)" } : { clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <canvas ref={canvasRef} className="absolute inset-0 size-full" aria-hidden />

          <div className="relative h-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: d(T.logo), ease: OUT }}
              className="absolute left-1/2 top-[36%] w-[min(420px,66vw)] -translate-x-1/2 -translate-y-1/2 sm:top-[40%] sm:w-[min(420px,40vw)]"
            >
              <Image src={asset("/brand/polimill-logo-large.png")} alt="Polimill" width={1020} height={312} priority className="h-auto w-full" />
            </motion.div>

            <ul className="absolute left-1/2 top-[46%] flex w-[92%] -translate-x-1/2 flex-col items-center justify-center gap-5 sm:top-[56%] sm:flex-row sm:gap-[5vw]" aria-label="Polimill のサービス">
              {[
                { src: "/brand/surfvote-logo.png", alt: "Surfvote", w: 744, h: 168 },
                { src: "/brand/qommonsai-logo.png", alt: "QommonsAI", w: 776, h: 136 },
                { src: "/brand/qommonsone-logo.png", alt: "Qommons ONE", w: 843, h: 127 },
              ].map((l, i) => (
                <motion.li
                  key={l.alt}
                  // 左から光が差すように、マスクで横に開いて現れる
                  initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
                  animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
                  transition={{ duration: 0.85, delay: d(T.products + i * 380), ease: [0.65, 0, 0.35, 1] }}
                  className="flex h-8 items-center sm:h-[clamp(20px,3.2vw,36px)]"
                >
                  <Image src={asset(l.src)} alt={l.alt} width={l.w} height={l.h} className="h-full w-auto" />
                </motion.li>
              ))}
            </ul>

            {/* キャッチコピー：1文字ずつ浮かび、そのまま止まる */}
            <p
              className="absolute inset-x-0 top-[78%] m-0 whitespace-nowrap text-center font-heading text-[clamp(20px,6.2vw,42px)] font-bold tracking-[0.08em] text-ink sm:top-[72%] sm:text-[clamp(22px,3.8vw,42px)] sm:tracking-[0.12em]"
              aria-label={TAGLINE}
            >
              {TAGLINE.split("").map((ch, i) => (
                <motion.span
                  key={i}
                  aria-hidden
                  className="inline-block"
                  initial={{ opacity: 0, y: "0.6em", filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.9, delay: d(T.tagline + i * 75), ease: OUT }}
                >
                  {ch}
                </motion.span>
              ))}
            </p>
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
