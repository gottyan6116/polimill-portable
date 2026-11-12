"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { CalendarDays, CornerDownLeft, Search, X } from "lucide-react";
import { ARTICLES, SEMINARS, THEMES, TRENDING, byUpdated, formatDate } from "@/lib/content";
import { KindBadge } from "./KindBadge";
import { ThemeIcon } from "./ThemeIcon";

type Hit = { href: string; key: string; node: React.ReactNode };

function norm(s: string) {
  return s.toLowerCase().replace(/\s+/g, "");
}

export function useSearchHits(q: string) {
  return useMemo(() => {
    const n = norm(q);
    if (!n) return { articles: byUpdated(ARTICLES).slice(0, 5), themes: [], seminars: [] };
    const words = q.split(/\s+/).filter(Boolean).map(norm);
    const match = (text: string) => words.every((w) => norm(text).includes(w));
    return {
      // 並びは更新日順。PR を上に固定しない
      articles: byUpdated(ARTICLES.filter((a) => match(a.title + a.lead + a.tags.join("") + (a.company ?? "")))),
      themes: THEMES.filter((t) => match(t.name + t.desc)),
      seminars: SEMINARS.filter((s) => match(s.title)),
    };
  }, [q]);
}

export function SearchPalette({ open, onClose, initial = "" }: { open: boolean; onClose: () => void; initial?: string }) {
  const [q, setQ] = useState(initial);
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const hits = useSearchHits(q);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- 開いたときに入力欄を初期化する
      setQ(initial);
      setCursor(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open, initial]);

  const flat: Hit[] = [
    ...hits.themes.map((t) => ({
      href: `/themes/${t.slug}/`,
      key: t.slug,
      node: (
        <span className="flex items-center gap-3">
          <ThemeIcon slug={t.slug} className="size-5 text-brand-strong" />
          <span className="font-bold">{t.name}</span>
          <span className="truncate text-[13px] text-ink-3">{t.desc}</span>
        </span>
      ),
    })),
    ...hits.articles.map((a) => ({
      href: `/articles/${a.id}/`,
      key: a.id,
      node: (
        <span className="flex min-w-0 flex-col gap-1">
          <span className="flex items-center gap-2">
            <KindBadge kind={a.kind} company={a.company} />
            <span className="tabular text-[12px] text-ink-3">{formatDate(a.updated)}</span>
          </span>
          <span className="line-clamp-1 font-bold text-ink">{a.title}</span>
        </span>
      ),
    })),
    ...hits.seminars.map((s) => ({
      href: `/seminars/`,
      key: s.id,
      node: (
        <span className="flex items-center gap-3">
          <CalendarDays aria-hidden className="size-5 text-ink-3" />
          <span className="tabular text-[13px] text-ink-3">{formatDate(s.date)}</span>
          <span className="truncate font-bold">{s.title}</span>
        </span>
      ),
    })),
  ];

  const go = (h: Hit) => {
    onClose();
    router.push(h.href);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center bg-ink/35 px-3 pt-[10vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="ポータル内を検索"
            initial={{ y: -12, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
            className="w-full max-w-2xl overflow-hidden rounded-card border border-line bg-surface shadow-[var(--shadow-raised)]"
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setCursor((c) => Math.min(c + 1, flat.length - 1));
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setCursor((c) => Math.max(c - 1, 0));
              }
              if (e.key === "Enter" && flat[cursor]) go(flat[cursor]);
            }}
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search aria-hidden className="size-5 text-ink-3" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setCursor(0);
                }}
                placeholder="課題・制度・キーワードで探す（例：避難所 受付）"
                className="h-14 w-full bg-transparent text-[16px] outline-none placeholder:text-ink-3"
                aria-label="検索語"
              />
              <button type="button" onClick={onClose} className="rounded p-1.5 text-ink-3 hover:bg-surface-2" aria-label="閉じる">
                <X aria-hidden className="size-5" />
              </button>
            </div>
            {!q && (
              <div className="flex flex-wrap gap-2 border-b border-line px-4 py-3">
                <span className="text-[12px] font-bold text-ink-3">よく探されている言葉</span>
                {TRENDING.map((t) => (
                  <button key={t} type="button" onClick={() => setQ(t)} className="rounded-full bg-surface-2 px-2.5 py-0.5 text-[12px] text-ink-2 hover:bg-brand-soft hover:text-brand-strong">
                    {t}
                  </button>
                ))}
              </div>
            )}
            <ul className="max-h-[52vh] overflow-y-auto p-2" role="listbox" aria-label="検索結果">
              {flat.length === 0 && <li className="px-3 py-8 text-center text-[14px] text-ink-3">見つかりませんでした。言葉を短くするか、テーマから探してください。</li>}
              {flat.map((h, i) => (
                <li key={h.key + i} role="option" aria-selected={i === cursor}>
                  <button
                    type="button"
                    onMouseEnter={() => setCursor(i)}
                    onClick={() => go(h)}
                    className={`flex w-full items-center justify-between gap-3 rounded-control px-3 py-2.5 text-left text-[14px] ${i === cursor ? "bg-brand-soft" : ""}`}
                  >
                    <span className="min-w-0">{h.node}</span>
                    {i === cursor && <CornerDownLeft aria-hidden className="size-4 shrink-0 text-brand-strong" />}
                  </button>
                </li>
              ))}
            </ul>
            <p className="border-t border-line bg-canvas px-4 py-2 text-[12px] text-ink-3">検索結果は更新日の新しい順です。掲載料で順位は変わりません。</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
