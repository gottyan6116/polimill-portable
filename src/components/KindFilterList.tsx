"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { KIND_LABEL, byUpdated, type Article, type Kind } from "@/lib/content";
import { ArticleRow } from "./ArticleCard";

export function KindFilterList({ items }: { items: Article[] }) {
  const kinds = Array.from(new Set(items.map((a) => a.kind))) as Kind[];
  const [on, setOn] = useState<Kind[]>([]);
  const list = byUpdated(items).filter((a) => on.length === 0 || on.includes(a.kind));
  const toggle = (k: Kind) => setOn((cur) => (cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k]));
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="種類で絞り込む">
        <span className="text-[13px] font-bold text-ink-3">種類</span>
        {kinds.map((k) => (
          <button
            key={k}
            type="button"
            aria-pressed={on.includes(k)}
            onClick={() => toggle(k)}
            className={`rounded-full border px-3 py-1 text-[13px] font-bold transition-colors ${on.includes(k) ? "border-ink bg-ink text-white" : "border-line-strong bg-surface text-ink-2 hover:border-ink-3"}`}
          >
            {KIND_LABEL[k]}
            <span className="ml-1 tabular opacity-70">{items.filter((a) => a.kind === k).length}</span>
          </button>
        ))}
        {on.length > 0 && (
          <button type="button" onClick={() => setOn([])} className="text-[13px] text-brand-strong hover:underline">
            条件を外す
          </button>
        )}
      </div>
      <p className="mt-3 text-[13px] text-ink-3" aria-live="polite">
        <span className="tabular font-bold text-ink">{list.length}</span>件・更新日の新しい順
      </p>
      <div className="mt-2 rounded-card border border-line bg-surface px-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {list.map((a) => (
            <motion.div key={a.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <ArticleRow a={a} />
            </motion.div>
          ))}
        </AnimatePresence>
        {list.length === 0 && <p className="py-10 text-center text-[14px] text-ink-3">このテーマの情報はまだありません。</p>}
      </div>
    </div>
  );
}
