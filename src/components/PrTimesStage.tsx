"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
// avoid-ai-design-ignore: I3 -- 外部サイト（PR TIMES）へ移ることを示す矢印
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { asset } from "@/lib/asset";
import { dotDate } from "@/lib/polimill-news";
import { RELEASES, releaseImg, releaseUrl } from "@/lib/prtimes";

// 「Polimill から」の上部。PR TIMES のリリース画像をカードの束にして、一定の間隔で次の1枚へ送る。
// 最初の1枚は静的HTMLでも見える（JS が遅れても空にならない）。CSS は prtimes.css の .prt-stage。
const PICKS = [817, 825, 819, 813, 824, 821];
const INTERVAL = 4500;

export function PrTimesStage() {
  const items = PICKS.map((n) => RELEASES.find((r) => r.no === n)!);
  const n = items.length;
  const [cur, setCur] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hold, setHold] = useState(false); // ホバー・フォーカス中は止める

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 動きを減らす設定はブラウザでしか分からない
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(false);
  }, []);

  const go = useCallback((d: number) => setCur((c) => (c + d + n) % n), [n]);

  useEffect(() => {
    if (!playing || hold) return;
    const t = window.setTimeout(() => go(1), INTERVAL);
    return () => window.clearTimeout(t);
  }, [cur, playing, hold, go]);

  const r = items[cur];
  return (
    <div className="prt-stage" onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)} onFocus={() => setHold(true)} onBlur={() => setHold(false)}>
      <div className="prt-stage__deck">
        {items.map((it, i) => {
          const pos = (i - cur + n) % n; // 0 が手前、1・2 が後ろに重なる、n-1 は送り出した1枚
          return (
            <a
              key={it.no}
              href={releaseUrl(it)}
              target="_blank"
              rel="noopener noreferrer"
              className="prt-stage__card"
              data-pos={pos === n - 1 ? "out" : Math.min(pos, 3)}
              tabIndex={pos === 0 ? 0 : -1}
              aria-hidden={pos === 0 ? undefined : true}
              aria-label={pos === 0 ? `${it.title}（PR TIMES、新しいタブで開く）` : undefined}
            >
              <Image src={asset(releaseImg(it))} alt="" width={960} height={640} sizes="(min-width: 1024px) 480px, 88vw" priority={i < 3} className="prt-stage__img" />
            </a>
          );
        })}
      </div>

      <div className="prt-stage__caption" aria-live="polite">
        <p className="prt-stage__meta">
          <span className="prt-stage__count tabular">
            {String(cur + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </span>
          <span>{r.kind}</span>
          <time dateTime={r.date}>{dotDate(r.date)}</time>
        </p>
        <a href={releaseUrl(r)} target="_blank" rel="noopener noreferrer" className="prt-stage__title">
          {r.title}
          <ArrowUpRight aria-hidden className="ml-1 inline size-4 align-[-2px]" />
        </a>
      </div>

      <div className="prt-stage__controls">
        <div className="prt-stage__bar" aria-hidden>
          {/* key を変えて、1枚ごとに進み具合を最初から伸ばし直す */}
          <i key={`${cur}-${playing && !hold}`} className={playing && !hold ? "is-running" : ""} style={{ animationDuration: `${INTERVAL}ms` }} />
        </div>
        <button type="button" onClick={() => go(-1)} className="prt-stage__btn" aria-label="前のリリース">
          <ChevronLeft aria-hidden className="size-4" />
        </button>
        <button type="button" onClick={() => setPlaying((p) => !p)} className="prt-stage__btn" aria-label={playing ? "自動で送るのを止める" : "自動で送る"}>
          {playing ? <Pause aria-hidden className="size-4" /> : <Play aria-hidden className="size-4" />}
        </button>
        <button type="button" onClick={() => go(1)} className="prt-stage__btn" aria-label="次のリリース">
          <ChevronRight aria-hidden className="size-4" />
        </button>
      </div>
    </div>
  );
}
