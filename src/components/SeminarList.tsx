"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { SEMINARS, formatDate, themeOf, type Seminar } from "@/lib/content";
import { ThemeIcon } from "./ThemeIcon";
import { TrainingApply } from "./TrainingApply";

const WD = ["日", "月", "火", "水", "木", "金", "土"];

function parts(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return { m, d, wd: WD[wd] };
}

function seminarFromHash() {
  const id = window.location.hash.replace(/^#/, "");
  return SEMINARS.some((s) => s.id === id) ? id : null;
}

export function SeminarList() {
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setOpenId(seminarFromHash());
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const toggle = (id: string) => {
    const next = openId === id ? "" : id;
    const url = `${window.location.pathname}${window.location.search}${next ? `#${next}` : ""}`;
    window.history.replaceState(null, "", url);
    setOpenId(next || null);
  };

  return (
    <ol className="mt-8 space-y-3">
      {SEMINARS.map((s) => (
        <SeminarCard key={s.id} seminar={s} open={openId === s.id} onToggle={() => toggle(s.id)} />
      ))}
    </ol>
  );
}

function SeminarCard({ seminar: s, open, onToggle }: { seminar: Seminar; open: boolean; onToggle: () => void }) {
  const p = parts(s.date);
  const panelId = `seminar-detail-${s.id}`;
  const titleId = `seminar-title-${s.id}`;
  return (
    <li id={s.id} className="scroll-mt-24 rounded-card border border-line bg-surface">
      <h2 id={titleId}>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="grid w-full grid-cols-[72px_minmax(0,1fr)] items-center gap-4 p-4 text-left font-normal sm:grid-cols-[88px_minmax(0,1fr)_auto]"
        >
          <span className="rounded-control bg-brand-soft py-2 text-center text-brand-strong">
            <span className="block text-[12px] font-bold tabular">{p.m}月</span>
            <span className="font-heading block text-[28px] font-bold leading-none tabular">{p.d}</span>
            <span className="block text-[12px]">（{p.wd}）</span>
          </span>
          <span className="min-w-0">
            <span className="flex flex-wrap items-center gap-x-3 text-[12px] font-normal text-ink-3">
              <span className="inline-flex items-center gap-1">
                <ThemeIcon slug={s.theme} className="size-3.5" />
                {themeOf(s.theme).name}
              </span>
              <span className="tabular">
                {formatDate(s.date)} {s.time}
              </span>
              <span>{s.format}</span>
            </span>
            <span className="mt-1 block text-[18px] font-bold text-ink">{s.title}</span>
            <span className="mt-1 block text-[13px] font-normal text-ink-3">
              主催：{s.host}
              {s.sponsor && <span className="ml-2 rounded-chip bg-pr-soft px-1.5 py-0.5 font-bold text-pr">協賛：{s.sponsor}</span>}
            </span>
          </span>
          <span className="col-span-2 inline-flex items-center justify-end gap-1 text-[13px] font-bold text-brand-strong sm:col-span-1 sm:justify-start">
            {open ? "閉じる" : "詳細を見る"}
            <ChevronDown aria-hidden className={`size-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
          </span>
        </button>
      </h2>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={titleId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-line px-4 py-5 sm:px-6">
              <p className="text-[15px] text-ink">{s.summary}</p>
              <dl className="mt-4 grid gap-4 text-[14px] sm:grid-cols-2">
                <div>
                  <dt className="text-[12px] font-bold text-ink-3">対象</dt>
                  <dd className="mt-1 text-ink">{s.audience}</dd>
                </div>
                <div>
                  <dt className="text-[12px] font-bold text-ink-3">参加の方法</dt>
                  <dd className="mt-1 text-ink">{s.place}</dd>
                </div>
              </dl>
              <div className="mt-4">
                <p className="text-[12px] font-bold text-ink-3">内容</p>
                <ol className="mt-1 list-decimal space-y-1 pl-5 text-[14px] text-ink">
                  {s.agenda.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              </div>
              <div className="mt-5">
                <TrainingApply title={s.title} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
