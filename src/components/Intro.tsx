"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { asset } from "@/lib/asset";

// オープニング演出（トップに最初に来たときだけ。同じタブでは2回目以降は出さない）
// 1. 散らばった粒子が奥行きのある空間から集まり、Polimill のロゴになる（Three.js）
// 2. 粒子がくっきりしたロゴに置き換わり、上へ移る
// 3. Surfvote → QommonsAI → Qommons ONE のロゴが時間差で現れる
// 4. 「のこしたいみらいをつくる」が1文字ずつ浮かび、ゆっくり漂う
// 5. 白い幕が上がってサイトが現れる
const KEY = "pp-intro-seen";
const TAGLINE = "のこしたいみらいをつくる";
const LOGO_W = 0.62; // ロゴの幅（画面幅に対する割合の上限）
const T = { gather: 0, crisp: 2300, lift: 3100, products: 3500, tagline: 5200, out: 8400 };

type Phase = "gather" | "crisp" | "lift" | "products" | "tagline" | "out";

export function Intro() {
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState<Phase>("gather");
  const [reduced, setReduced] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
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
    if (reduced) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- 動きを減らす設定では粒子を省き、くっきりしたロゴから始める
      setPhase("crisp");
    }
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

  // 粒子（Three.js は必要なときだけ読み込む）
  useEffect(() => {
    if (!show || reduced || !canvasRef.current) return;
    let disposed = false;
    let cleanup = () => {};
    (async () => {
      const THREE = await import("three");
      const img = new window.Image();
      img.src = asset("/brand/polimill-logo-large.png");
      await img.decode().catch(() => {});
      if (disposed || !canvasRef.current) return;

      const host = canvasRef.current;
      const W = host.clientWidth;
      const H = host.clientHeight;
      const logoW = Math.min(560, W * LOGO_W);
      const logoH = (logoW * img.naturalHeight) / img.naturalWidth;

      // ロゴの画素を読み、粒子の着地点にする
      const sw = 240;
      const sh = Math.round((sw * img.naturalHeight) / img.naturalWidth);
      const c = document.createElement("canvas");
      c.width = sw;
      c.height = sh;
      const ctx = c.getContext("2d", { willReadFrequently: true })!;
      ctx.drawImage(img, 0, 0, sw, sh);
      const data = ctx.getImageData(0, 0, sw, sh).data;
      const targets: number[] = [];
      const colors: number[] = [];
      for (let y = 0; y < sh; y++) {
        for (let x = 0; x < sw; x++) {
          const i = (y * sw + x) * 4;
          if (data[i + 3] < 140) continue;
          targets.push(((x / sw) - 0.5) * logoW, (0.5 - y / sh) * logoH, 0);
          colors.push(data[i] / 255, data[i + 1] / 255, data[i + 2] / 255);
        }
      }
      const n = targets.length / 3;
      const start = new Float32Array(n * 3);
      const delay = new Float32Array(n);
      for (let k = 0; k < n; k++) {
        const r = Math.max(W, H) * (0.6 + Math.random() * 0.8);
        const th = Math.random() * Math.PI * 2;
        start[k * 3] = Math.cos(th) * r;
        start[k * 3 + 1] = Math.sin(th) * r * 0.7;
        start[k * 3 + 2] = -900 + Math.random() * 1500;
        // 左から右へ少しずつ遅れて集まる
        delay[k] = ((targets[k * 3] / logoW + 0.5) * 0.35 + Math.random() * 0.25) * 1000;
      }

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      host.appendChild(renderer.domElement);
      const scene = new THREE.Scene();
      const fov = 35;
      const camera = new THREE.PerspectiveCamera(fov, W / H, 1, 5000);
      camera.position.z = H / 2 / Math.tan((fov * Math.PI) / 360); // z=0 の面で 1単位=1px
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(start);
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
      const mat = new THREE.PointsMaterial({ size: Math.max(2.2, logoW / sw) * 1.05, vertexColors: true, transparent: true, opacity: 1, sizeAttenuation: true });
      const points = new THREE.Points(geo, mat);
      scene.add(points);

      const t0 = performance.now();
      const dur = 1700;
      const easeOut = (x: number) => 1 - Math.pow(1 - x, 4);
      let raf = 0;
      const tick = () => {
        const t = performance.now() - t0;
        for (let k = 0; k < n; k++) {
          const p = easeOut(Math.min(1, Math.max(0, (t - delay[k]) / dur)));
          const j = k * 3;
          pos[j] = start[j] + (targets[j] - start[j]) * p;
          pos[j + 1] = start[j + 1] + (targets[j + 1] - start[j + 1]) * p;
          pos[j + 2] = start[j + 2] + (targets[j + 2] - start[j + 2]) * p;
        }
        geo.attributes.position.needsUpdate = true;
        const settle = easeOut(Math.min(1, t / 2300));
        points.rotation.y = (1 - settle) * 0.9;
        points.rotation.x = (1 - settle) * -0.25;
        // くっきりしたロゴに置き換わるところで粒子を消す
        if (t > T.crisp) mat.opacity = Math.max(0, 1 - (t - T.crisp) / 500);
        renderer.render(scene, camera);
        if (t < T.crisp + 600) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      timers.current.push(window.setTimeout(() => setPhase((p) => (p === "gather" ? "crisp" : p)), T.crisp));
      cleanup = () => {
        cancelAnimationFrame(raf);
        geo.dispose();
        mat.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();
    return () => {
      disposed = true;
      cleanup();
    };
  }, [show, reduced]);

  const lifted = phase === "lift" || phase === "products" || phase === "tagline" || phase === "out";
  const crisp = phase !== "gather";
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
          <div ref={canvasRef} className="absolute inset-0" aria-hidden />

          <div className="relative flex h-full flex-col items-center justify-center px-6">
            {/* ロゴ：粒子が集まった位置にそのまま重ねる */}
            <motion.div
              initial={false}
              animate={{ y: lifted ? "-14vh" : 0, scale: lifted ? 0.72 : 1, opacity: crisp ? 1 : 0, filter: crisp ? "blur(0px)" : "blur(6px)" }}
              transition={{ duration: lifted ? 0.9 : 0.5, ease: [0.16, 1, 0.3, 1] }}
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
              animate={phase === "tagline" && !reduced ? { y: [0, -8, 0] } : { y: 0 }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
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
