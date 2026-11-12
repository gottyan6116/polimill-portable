"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
// avoid-ai-design-ignore: I3 -- Check は送信完了とコピー完了の状態表示に使う
import { Check, ClipboardCopy, FileText, Info, Send, X } from "lucide-react";
import type { Article } from "@/lib/content";
import { buildDraft } from "@/lib/draft";

function Modal({ open, onClose, label, children, wide }: { open: boolean; onClose: () => void; label: string; children: React.ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);
  // 固定配置の親（サイドバーなど）の重なり順に閉じ込められないよう、body 直下に出す
  if (typeof document === "undefined") return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={label}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
            className={`max-h-[90dvh] w-full overflow-y-auto rounded-card bg-surface shadow-[var(--shadow-raised)] ${wide ? "max-w-3xl" : "max-w-lg"}`}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

// 資料請求：提供先・項目・目的を示し、同意してから送る（デモでは送信しない）
export function ConsentDialog({ article }: { article: Article }) {
  const [open, setOpen] = useState(false);
  const [agree, setAgree] = useState(false);
  const [sent, setSent] = useState(false);
  const close = () => {
    setOpen(false);
    setTimeout(() => {
      setAgree(false);
      setSent(false);
    }, 250);
  };
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-control border-2 border-pr-line bg-pr-soft px-4 text-[14px] font-bold text-pr hover:bg-[#ffecb8]">
        <Send aria-hidden className="size-4" />
        この企業に資料を請求する
      </button>
      <Modal open={open} onClose={close} label="資料請求の確認">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-[18px] font-bold">{sent ? "資料請求を受け付けました（デモ）" : "資料請求の前に確認してください"}</h2>
          <button type="button" onClick={close} className="rounded p-1 text-ink-3 hover:bg-surface-2" aria-label="閉じる">
            <X aria-hidden className="size-5" />
          </button>
        </div>
        {sent ? (
          <div className="px-5 py-6">
            <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="grid size-12 place-items-center rounded-full bg-case text-white">
              <Check aria-hidden className="size-6" />
            </motion.div>
            <p className="mt-4 text-[14px] text-ink-2">デモのため、実際には送信していません。本番では、同意した項目だけが {article.company} に届き、同意の記録が残ります。</p>
          </div>
        ) : (
          <div className="space-y-4 px-5 py-5 text-[14px]">
            <dl className="divide-y divide-line rounded-control border border-line">
              {[
                ["提供先", article.company ?? ""],
                ["渡す項目", "自治体名・所属・氏名・メールアドレス"],
                ["利用目的", "資料の送付と、この件に関する連絡"],
                ["渡さないもの", "チャットの内容・閲覧履歴・庁内資料"],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[96px_minmax(0,1fr)] gap-3 px-3 py-2.5">
                  <dt className="font-bold text-ink-3">{k}</dt>
                  <dd className="text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="flex gap-2 rounded-control bg-canvas p-3 text-[13px] text-ink-2">
              <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-ink-3" />
              資料請求をしなくても、この記事と他の情報はすべて読めます。営業の連絡を受けるかどうかは、企業とのやりとりの中で選べます。
            </p>
            <label className="flex cursor-pointer items-start gap-3 rounded-control border border-line p-3 hover:border-ink-3">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 size-4 accent-[#c2470a]" />
              <span>上の提供先・項目・目的を確認し、{article.company} に情報を渡すことに同意します</span>
            </label>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={close} className="h-11 rounded-control px-4 text-ink-2 hover:bg-surface-2">
                やめる
              </button>
              <button type="button" disabled={!agree} onClick={() => setSent(true)} className="h-11 rounded-control bg-brand-strong px-5 font-bold text-white enabled:hover:bg-brand-deep disabled:cursor-not-allowed disabled:bg-line-strong">
                同意して請求する
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

// 下書き：1文字ずつ現れる。文面は選んだ記事から組み立てたもの
export function DraftView({ items, autoStart = true }: { items: Article[]; autoStart?: boolean }) {
  const draft = useMemo(() => buildDraft(items), [items]);
  const full = useMemo(() => [draft.title, ...draft.blocks.flatMap((b) => [b.h, ...b.lines.map((l) => `・${l}`)]), "出典", ...draft.refs].join("\n"), [draft]);
  const [n, setN] = useState(0);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 対象が変わったら書き出しを最初からやり直す
    setN(0);
    if (!autoStart) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setN(full.length);
      return;
    }
    const t = setInterval(() => setN((x) => (x >= full.length ? x : x + 4)), 16);
    return () => clearInterval(t);
  }, [full, autoStart]);
  const shown = full.slice(0, n);
  const done = n >= full.length;
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-[13px] font-bold text-ink-2">
          <FileText aria-hidden className="size-4 text-brand-strong" />
          庁内説明の論点表（下書き）
        </p>
        <button
          type="button"
          disabled={!done}
          onClick={() => {
            navigator.clipboard?.writeText(full).catch(() => {});
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
          }}
          className="inline-flex h-9 items-center gap-1.5 rounded-control border border-line-strong px-3 text-[13px] font-bold text-ink-2 enabled:hover:border-ink disabled:opacity-40"
        >
          {copied ? <Check aria-hidden className="size-4" /> : <ClipboardCopy aria-hidden className="size-4" />}
          {copied ? "コピーしました" : "コピー"}
        </button>
      </div>
      <pre aria-live="polite" className="mt-3 min-h-64 whitespace-pre-wrap rounded-control border border-line bg-canvas p-4 font-[family-name:var(--font-body)] text-[14px] leading-[1.9] text-ink">
        {shown}
        {!done && <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-pulse bg-brand-strong" />}
      </pre>
      <p className="mt-2 text-[12px] text-ink-3">デモ：生成AIではなく、選んだ記事の内容から組み立てた文例です。本番では、職員が出典の原文を確かめてから使います。</p>
    </div>
  );
}

export function DraftDialog({ items, label = "この記事で下書きを作る" }: { items: Article[]; label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-control border-2 border-ink bg-surface px-4 text-[14px] font-bold text-ink hover:bg-surface-2">
        <FileText aria-hidden className="size-4" />
        {label}
      </button>
      <Modal open={open} onClose={() => setOpen(false)} label="下書き" wide>
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-[18px] font-bold">下書きを作る</h2>
          <button type="button" onClick={() => setOpen(false)} className="rounded p-1 text-ink-3 hover:bg-surface-2" aria-label="閉じる">
            <X aria-hidden className="size-5" />
          </button>
        </div>
        <div className="px-5 py-5">{open && <DraftView items={items} />}</div>
      </Modal>
    </>
  );
}
