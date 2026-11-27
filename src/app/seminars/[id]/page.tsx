import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, ChevronRight, Clock, MonitorPlay, Users } from "lucide-react";
import { SEMINARS, formatDate, themeOf } from "@/lib/content";
import { SEMINAR_DETAILS } from "@/lib/seminar-details";
import { ThemeIcon } from "@/components/ThemeIcon";
import { TrainingApply } from "@/components/TrainingApply";

// セミナーの詳細。一覧（/seminars/）のボックスから開く。中身はすべてサンプル。
export function generateStaticParams() {
  return SEMINARS.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const s = SEMINARS.find((x) => x.id === id);
  return { title: s?.title ?? "セミナー" };
}

export default async function SeminarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = SEMINARS.find((x) => x.id === id);
  const d = s && SEMINAR_DETAILS[s.id];
  if (!s || !d) notFound();
  const theme = themeOf(s.theme);
  const others = SEMINARS.filter((x) => x.id !== s.id);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <nav aria-label="パンくず" className="flex flex-wrap items-center gap-1 text-[13px] text-ink-3">
        <Link href="/" className="hover:text-ink">
          トップ
        </Link>
        <ChevronRight aria-hidden className="size-3.5" />
        <Link href="/seminars/" className="hover:text-ink">
          セミナー
        </Link>
        <ChevronRight aria-hidden className="size-3.5" />
        <span className="truncate text-ink-2">{s.title}</span>
      </nav>

      <header className="mt-6">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-ink-3">
          <span className="inline-flex items-center gap-1">
            <ThemeIcon slug={s.theme} className="size-4" />
            {theme.name}
          </span>
          <span>主催：{s.host}</span>
          {s.sponsor && <span className="rounded-chip bg-pr-soft px-1.5 py-0.5 font-bold text-pr">協賛：{s.sponsor}</span>}
        </p>
        <h1 className="mt-2 text-[26px] font-bold leading-snug sm:text-[32px]">{s.title}</h1>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-10">
          <section aria-labelledby="sem-about">
            <h2 id="sem-about" className="text-[20px] font-bold">
              どんなセミナーか
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{d.summary}</p>
            <h3 className="mt-6 text-[15px] font-bold">こんな方におすすめ</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[14px] text-ink-2">
              {d.target.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="sem-agenda">
            <h2 id="sem-agenda" className="text-[20px] font-bold">
              プログラム
            </h2>
            <ol className="mt-4 border-l-2 border-brand-soft">
              {d.agenda.map((a) => (
                <li key={a.time} className="relative grid grid-cols-[4.5em_minmax(0,1fr)] gap-3 py-2.5 pl-5">
                  <span aria-hidden className="absolute -left-[7px] top-[17px] size-3 rounded-full border-2 border-surface bg-brand" />
                  <span className="text-[14px] font-bold text-brand-strong tabular">{a.time}</span>
                  <span className="text-[15px] text-ink">{a.title}</span>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="sem-speakers">
            <h2 id="sem-speakers" className="text-[20px] font-bold">
              登壇者
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {d.speakers.map((p) => (
                <li key={p.name} className="rounded-card border border-line bg-surface p-4">
                  <p className="text-[15px] font-bold text-ink">{p.name}</p>
                  <p className="mt-0.5 text-[13px] text-ink-3">{p.role}</p>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="sem-take">
            <h2 id="sem-take" className="text-[20px] font-bold">
              持ち帰れるもの
            </h2>
            <ul className="mt-3 space-y-2">
              {d.takeaways.map((t) => (
                <li key={t} className="flex gap-2 text-[15px] text-ink-2">
                  <span aria-hidden className="mt-[9px] size-1.5 shrink-0 rounded-full bg-brand" />
                  {t}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* 右：日時と申し込み（スマホでは本文の下） */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-card border border-line bg-surface p-5">
            <dl className="space-y-3 text-[14px]">
              <div className="flex gap-3">
                <dt>
                  <CalendarDays aria-label="日付" className="size-5 text-brand-strong" />
                </dt>
                <dd className="font-bold text-ink tabular">{formatDate(s.date)}</dd>
              </div>
              <div className="flex gap-3">
                <dt>
                  <Clock aria-label="時間" className="size-5 text-brand-strong" />
                </dt>
                <dd className="text-ink-2 tabular">{s.time}</dd>
              </div>
              <div className="flex gap-3">
                <dt>
                  <MonitorPlay aria-label="形式" className="size-5 text-brand-strong" />
                </dt>
                <dd className="text-ink-2">{s.format}</dd>
              </div>
              <div className="flex gap-3">
                <dt>
                  <Users aria-label="定員" className="size-5 text-brand-strong" />
                </dt>
                <dd className="text-ink-2">{d.capacity}</dd>
              </div>
            </dl>
            <p className="mt-4 border-t border-line pt-4 text-[13px] leading-relaxed text-ink-3">{d.howToJoin}</p>
            <div className="mt-4">
              <TrainingApply title={s.title} />
            </div>
          </div>
        </aside>
      </div>

      <section aria-labelledby="sem-others" className="mt-14 border-t border-line pt-8">
        <h2 id="sem-others" className="text-[18px] font-bold">
          ほかのセミナー
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {others.map((o) => (
            <li key={o.id}>
              <Link href={`/seminars/${o.id}/`} className="group block h-full rounded-card border border-line bg-surface p-4 transition-colors hover:border-ink-3">
                <p className="text-[12px] text-ink-3 tabular">
                  {formatDate(o.date)}・{o.format}
                </p>
                <p className="mt-1 text-[14px] font-bold leading-snug text-ink group-hover:underline">{o.title}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
