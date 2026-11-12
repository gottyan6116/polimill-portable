"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Pause, Play, Search } from "lucide-react";
import { ARTICLES, KIND_LABEL, TRENDING, byUpdated, formatDate, themeOf, type Article, type Kind } from "@/lib/content";
import { Photo } from "./Photo";
import { ArticleRow } from "./ArticleCard";
import { KindBadge } from "./KindBadge";
import { useOpenSearch } from "./SiteChrome";

const EXAMPLES = ["避難所 受付", "生成AI ルール", "保育所 オンライン申請", "空き家 相談", "公共施設 省エネ"];

export function HeroSearch() {
  const open = useOpenSearch();
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % EXAMPLES.length), 2800);
    return () => clearInterval(t);
  }, []);
  return (
    <div>
      <button
        type="button"
        onClick={() => open()}
        className="group flex h-16 w-full items-center gap-3 rounded-card border-2 border-ink bg-surface px-4 text-left shadow-[0_4px_0_0_var(--color-ink)] transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_1px_0_0_var(--color-ink)]"
        aria-label="ポータル内を検索"
      >
        <Search aria-hidden className="size-6 shrink-0 text-brand-strong" />
        <span className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden text-[17px] text-ink-3">
          <span className="shrink-0">例：</span>
          <motion.span
            key={i}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
            className="truncate"
          >
            {EXAMPLES[i]}
          </motion.span>
        </span>
        <span className="hidden rounded-control bg-brand-strong px-4 py-2 text-[14px] font-bold text-white sm:inline">探す</span>
      </button>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-[12px] font-bold text-ink-3">よく探されている言葉</span>
        {TRENDING.slice(0, 6).map((t) => (
          <button key={t} type="button" onClick={() => open(t)} className="rounded-full border border-line bg-surface px-3 py-1 text-[13px] text-ink-2 hover:border-brand-strong hover:text-brand-strong">
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

export function FeatureCarousel({ items }: { items: Article[] }) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setI((x) => (x + 1) % items.length), 6000);
    return () => clearInterval(t);
  }, [playing, items.length]);
  const a = items[i];
  return (
    <div className="overflow-hidden rounded-card border border-line bg-surface shadow-[var(--shadow-card)]" aria-roledescription="カルーセル" aria-label="特集">
      <div className="grid md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[320px]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div key={a.id} initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="absolute inset-0">
              <Photo id={a.id} alt="" zoom={false} sizes="(min-width: 768px) 55vw, 100vw" className="size-full" />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex flex-col p-6 md:p-8">
          <p className="text-[13px] font-bold text-brand-strong">特集 {i + 1}／{items.length}</p>
          <AnimatePresence mode="wait">
            <motion.div key={a.id} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -6, opacity: 0 }} transition={{ duration: 0.3 }} className="mt-3">
              <KindBadge kind={a.kind} company={a.company} size="md" />
              <h3 className="mt-3 text-[22px] font-bold leading-snug text-ink">
                <Link href={`/articles/${a.id}/`} className="hover:underline hover:decoration-brand hover:decoration-2 hover:underline-offset-4">
                  {a.title}
                </Link>
              </h3>
              <p className="mt-2 text-[14px] text-ink-2">{a.lead}</p>
              <p className="mt-3 text-[12px] text-ink-3">
                {themeOf(a.theme).name}・更新 {formatDate(a.updated)}
              </p>
            </motion.div>
          </AnimatePresence>
          <div className="mt-auto flex items-center gap-2 pt-6">
            <button type="button" onClick={() => setI((i - 1 + items.length) % items.length)} className="grid size-10 place-items-center rounded-full border border-line-strong hover:border-ink" aria-label="前の特集">
              <ChevronLeft aria-hidden className="size-5" />
            </button>
            <button type="button" onClick={() => setI((i + 1) % items.length)} className="grid size-10 place-items-center rounded-full border border-line-strong hover:border-ink" aria-label="次の特集">
              <ChevronRight aria-hidden className="size-5" />
            </button>
            <button type="button" onClick={() => setPlaying((p) => !p)} className="grid size-10 place-items-center rounded-full text-ink-3 hover:bg-surface-2" aria-label={playing ? "自動切り替えを止める" : "自動切り替えを再開する"}>
              {playing ? <Pause aria-hidden className="size-4" /> : <Play aria-hidden className="size-4" />}
            </button>
            <div className="ml-auto flex gap-1.5">
              {items.map((x, k) => (
                <button key={x.id} type="button" onClick={() => setI(k)} aria-label={`特集${k + 1}を表示`} aria-current={k === i} className="h-2 rounded-full bg-line-strong transition-all" style={{ width: k === i ? 24 : 8, background: k === i ? "#ff6f22" : undefined }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const TABS: ("all" | Kind)[] = ["all", "public", "case", "editorial", "pr"];

export function LatestTabs() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("all");
  const list = byUpdated(ARTICLES).filter((a) => tab === "all" || a.kind === tab || (tab === "editorial" && (a.kind === "training" || a.kind === "template")));
  return (
    <div>
      <div role="tablist" aria-label="種類で絞り込む" className="flex gap-1 overflow-x-auto overflow-y-hidden border-b border-line [scrollbar-width:none]">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            type="button"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`relative shrink-0 px-3 py-2.5 text-[14px] font-bold ${tab === t ? "text-ink" : "text-ink-3 hover:text-ink-2"}`}
          >
            {t === "all" ? "すべて" : t === "editorial" ? "編集部・研修・テンプレート" : KIND_LABEL[t]}
            {tab === t && <motion.span layoutId="latest-tab" className="absolute inset-x-2 bottom-0 h-[3px] rounded-full bg-brand" />}
          </button>
        ))}
      </div>
      <motion.div layout className="mt-1">
        <AnimatePresence mode="popLayout" initial={false}>
          {list.slice(0, 8).map((a) => (
            <motion.div key={a.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <ArticleRow a={a} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {tab === "pr" && <p className="mt-3 rounded-control bg-pr-soft px-3 py-2 text-[13px] text-pr">PR記事は企業が提供した情報です。Talk の回答・検索・推薦の対象には入りません。</p>}
    </div>
  );
}
