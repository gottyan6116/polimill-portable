import type { Metadata } from "next";
import { SEMINARS, formatDate, themeOf } from "@/lib/content";
import { ThemeIcon } from "@/components/ThemeIcon";

export const metadata: Metadata = { title: "セミナー" };

const WD = ["日", "月", "火", "水", "木", "金", "土"];

function parts(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return { m, d, wd: WD[wd] };
}

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-[30px] font-bold">セミナー</h1>
      <p className="mt-2 text-[14px] text-ink-2">職員向けのオンラインセミナーです。協賛のあるセミナーは、協賛企業名を表示しています（すべてサンプル）。</p>
      <ol className="mt-8 space-y-3">
        {SEMINARS.map((s) => {
          const p = parts(s.date);
          return (
            <li key={s.id} className="grid grid-cols-[72px_minmax(0,1fr)] gap-4 rounded-card border border-line bg-surface p-4 sm:grid-cols-[88px_minmax(0,1fr)]">
              <div className="rounded-control bg-brand-soft py-2 text-center text-brand-strong">
                <p className="text-[12px] font-bold tabular">{p.m}月</p>
                <p className="font-heading text-[28px] font-bold leading-none tabular">{p.d}</p>
                <p className="text-[12px]">（{p.wd}）</p>
              </div>
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-x-3 text-[12px] text-ink-3">
                  <span className="inline-flex items-center gap-1">
                    <ThemeIcon slug={s.theme} className="size-3.5" />
                    {themeOf(s.theme).name}
                  </span>
                  <span className="tabular">
                    {formatDate(s.date)} {s.time}
                  </span>
                  <span>{s.format}</span>
                </p>
                <h2 className="mt-1 text-[18px] font-bold">{s.title}</h2>
                <p className="mt-1 text-[13px] text-ink-3">
                  主催：{s.host}
                  {s.sponsor && <span className="ml-2 rounded-chip bg-pr-soft px-1.5 py-0.5 font-bold text-pr">協賛：{s.sponsor}</span>}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
