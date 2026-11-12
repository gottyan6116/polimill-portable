"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { FileText, Layers, X } from "lucide-react";
import { articleById } from "@/lib/content";
import { KindBadge } from "./KindBadge";

type Ctx = { ids: string[]; has: (id: string) => boolean; toggle: (id: string) => void; remove: (id: string) => void; clear: () => void };
const CompareContext = createContext<Ctx | null>(null);
const KEY = "pp-compare";
const MAX = 4;

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- 保存済みの比較リストを初回だけ復元する
      if (Array.isArray(saved)) setIds(saved.filter((x) => typeof x === "string" && articleById(x)));
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return; // 復元が終わる前に空のリストで上書きしない
    try {
      localStorage.setItem(KEY, JSON.stringify(ids));
    } catch {}
  }, [ids, ready]);
  const toggle = useCallback((id: string) => setIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id].slice(-MAX))), []);
  const remove = useCallback((id: string) => setIds((cur) => cur.filter((x) => x !== id)), []);
  const clear = useCallback(() => setIds([]), []);
  const value = useMemo(() => ({ ids, has: (id: string) => ids.includes(id), toggle, remove, clear }), [ids, toggle, remove, clear]);
  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const c = useContext(CompareContext);
  if (!c) throw new Error("CompareProvider がない");
  return c;
}

export function CompareButton({ id, variant = "solid" }: { id: string; variant?: "solid" | "ghost" }) {
  const { has, toggle } = useCompare();
  const on = has(id);
  return (
    <button
      type="button"
      onClick={() => toggle(id)}
      aria-pressed={on}
      className={
        variant === "solid"
          ? `inline-flex h-11 items-center justify-center gap-2 rounded-control px-4 text-[14px] font-bold transition-colors duration-150 ${
              on ? "bg-ink text-white hover:bg-ink-2" : "bg-brand-strong text-white hover:bg-brand-deep"
            }`
          : `inline-flex h-9 items-center gap-1.5 rounded-control border px-3 text-[13px] font-bold transition-colors duration-150 ${
              on ? "border-ink bg-ink text-white" : "border-line-strong bg-surface text-ink-2 hover:border-brand-strong hover:text-brand-strong"
            }`
      }
    >
      <Layers aria-hidden className="size-4" />
      {on ? "比較に追加済み" : "比較に追加"}
    </button>
  );
}

// 画面下の比較トレイ。追加した記事が付箋のように並ぶ
export function CompareDock() {
  const { ids, remove, clear } = useCompare();
  const path = usePathname();
  const items = ids.map(articleById).filter(Boolean);
  const hidden = path?.startsWith("/compare"); // 比較ページでは表そのものが見えているので出さない
  return (
    <AnimatePresence>
      {items.length > 0 && !hidden && (
        <motion.aside
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 34 }}
          aria-label="比較トレイ"
          className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-5xl rounded-card border border-line bg-surface p-3 shadow-[var(--shadow-raised)] sm:inset-x-6"
        >
          <div className="flex items-center gap-3">
            <p className="shrink-0 text-[13px] font-bold text-ink-2">
              比較トレイ <span className="tabular text-brand-strong">{items.length}</span>
              <span className="text-ink-3">／{MAX}件</span>
            </p>
            <ul className="hidden min-w-0 flex-1 gap-2 overflow-x-auto [scrollbar-width:none] md:flex">
              <AnimatePresence initial={false}>
                {items.map((a) => (
                  <motion.li
                    key={a!.id}
                    layout
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="flex w-56 shrink-0 items-start gap-2 rounded-control border border-line bg-canvas p-2"
                  >
                    <div className="min-w-0 flex-1">
                      <KindBadge kind={a!.kind} />
                      <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-ink">{a!.title}</p>
                    </div>
                    <button type="button" onClick={() => remove(a!.id)} className="rounded p-1 text-ink-3 hover:bg-surface-2 hover:text-ink" aria-label={`${a!.title} を比較から外す`}>
                      <X aria-hidden className="size-4" />
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
            <div className="ml-auto flex shrink-0 gap-2">
              <button type="button" onClick={clear} className="hidden h-10 rounded-control px-3 text-[13px] text-ink-3 hover:bg-surface-2 sm:block">
                すべて外す
              </button>
              <Link href="/compare/" className="inline-flex h-10 items-center gap-1.5 rounded-control bg-brand-strong px-4 text-[14px] font-bold text-white hover:bg-brand-deep">
                <FileText aria-hidden className="size-4" />
                比べて下書きを作る
              </Link>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
