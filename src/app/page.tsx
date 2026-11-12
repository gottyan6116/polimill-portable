import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ShieldCheck } from "lucide-react";
import { ARTICLES, SEMINARS, THEMES, formatDate, themeOf } from "@/lib/content";
import { asset } from "@/lib/asset";
import { ThemeIcon } from "@/components/ThemeIcon";
import { FeatureCarousel, FlowSteps, HeroSearch, LatestTabs } from "@/components/home";
import { Banners } from "@/components/Banners";

export default function Home() {
  const featured = ARTICLES.filter((a) => a.featured);
  const counts = Object.fromEntries(THEMES.map((t) => [t.slug, ARTICLES.filter((a) => a.theme === t.slug).length]));
  return (
    <>
      {/* ヒーロー：検索が主役。右に使い方の流れ */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-center">
          <div>
            <p className="text-[14px] font-bold text-brand-strong">自治体職員のための行政ナレッジポータル</p>
            <h1 className="mt-3 text-[30px] font-bold leading-[1.35] text-ink sm:text-[38px]">
              業務の課題から、
              <br />
              制度・事例・サービスを探せます
            </h1>
            <p className="mt-4 max-w-xl text-[15px] text-ink-2">
              国の資料、他の自治体の取り組み、企業のサービスを、出典と種類を分けて並べます。気になったものは比べて、庁内説明の下書きにできます。
            </p>
            <div className="mt-8 max-w-xl">
              <HeroSearch />
            </div>
          </div>
          <div className="rounded-card bg-canvas p-5">
            <p className="mb-3 text-[13px] font-bold text-ink-3">このポータルでできること</p>
            <FlowSteps />
          </div>
        </div>
      </section>

      {/* バナー */}
      <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6" aria-label="おすすめ">
        <Banners />
      </section>

      {/* テーマ */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-[24px] font-bold">担当している業務から探す</h2>
          <p className="hidden text-[13px] text-ink-3 sm:block">12のテーマ</p>
        </div>
        <ul className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-3 lg:grid-cols-4">
          {THEMES.map((t) => (
            <li key={t.slug} className="bg-surface">
              <Link href={`/themes/${t.slug}/`} className="group flex h-full items-start gap-3 p-4 transition-colors hover:bg-brand-soft">
                <ThemeIcon slug={t.slug} className="mt-0.5 size-6 shrink-0 text-brand-strong transition-transform duration-200 group-hover:-translate-y-0.5" strokeWidth={1.8} />
                <span className="min-w-0">
                  <span className="block text-[15px] font-bold text-ink">{t.name}</span>
                  <span className="mt-0.5 block text-[12px] leading-relaxed text-ink-3">{t.desc}</span>
                  <span className="mt-1 block text-[12px] text-ink-3 tabular">{counts[t.slug]}件</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 特集 */}
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <h2 className="text-[24px] font-bold">今週の特集</h2>
        <div className="mt-5">
          <FeatureCarousel items={featured} />
        </div>
      </section>

      {/* 新着と右カラム */}
      <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <h2 className="text-[24px] font-bold">新着</h2>
          <p className="mt-1 text-[13px] text-ink-3">更新日の新しい順。掲載料で並び順は変わりません。</p>
          <div className="mt-4">
            <LatestTabs />
          </div>
        </div>
        <aside className="space-y-6">
          <div className="rounded-card border border-line bg-surface p-5">
            <h2 className="flex items-center gap-2 text-[18px] font-bold">
              <CalendarDays aria-hidden className="size-5 text-brand-strong" />
              これからのセミナー
            </h2>
            <ul className="mt-3 divide-y divide-line">
              {SEMINARS.slice(0, 3).map((s) => (
                <li key={s.id} className="py-3">
                  <p className="text-[12px] text-ink-3 tabular">
                    {formatDate(s.date)} {s.time}・{s.format}
                  </p>
                  <p className="mt-0.5 text-[14px] font-bold text-ink">{s.title}</p>
                  <p className="text-[12px] text-ink-3">
                    {themeOf(s.theme).name}
                    {s.sponsor && <span className="ml-2 rounded-chip bg-pr-soft px-1.5 text-pr">協賛：{s.sponsor}</span>}
                  </p>
                </li>
              ))}
            </ul>
            <Link href="/seminars/" className="mt-2 inline-block text-[13px] font-bold text-brand-strong hover:underline">
              セミナーの一覧を見る
            </Link>
          </div>
          <div className="rounded-card bg-ink p-5 text-white">
            <ShieldCheck aria-hidden className="size-6 text-brand" />
            <h2 className="mt-2 text-[18px] font-bold">広告と編集を分けています</h2>
            <ul className="mt-2 space-y-1.5 text-[13px] text-white/85">
              <li>PR記事には「PR」と企業名を必ず表示</li>
              <li>掲載料で検索順位・推薦・AIの回答は変えない</li>
              <li>資料請求は、提供先と項目を示して同意を得てから</li>
            </ul>
            <Link href="/policy/" className="mt-3 inline-block text-[13px] font-bold text-brand hover:underline">
              広告と編集の方針
            </Link>
          </div>
        </aside>
      </section>

      {/* Talk / ポータル / ONE の関係 */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
          <div className="relative overflow-hidden rounded-card">
            <Image src={asset("/brand/qommonsai-visual.png")} alt="QommonsAI のチャット画面" width={1024} height={1024} className="aspect-[4/3] w-full object-cover" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-brand-strong">QommonsAI とのつながり</p>
            <h2 className="mt-2 text-[26px] font-bold leading-snug">
              ふだん使う Talk から、
              <br />
              調べものの続きをこのポータルで
            </h2>
            <dl className="mt-6 divide-y divide-line border-y border-line">
              {[
                ["QommonsAI Talk", "日々の質問と文書作成。必要なときだけポータルへの入口を開く"],
                ["Polimill Portable", "制度・事例・サービスを見つけ、条件をそろえて比べる"],
                ["Qommons ONE", "必要なときに、審査済みの機能で業務を進める"],
              ].map(([k, v]) => (
                <div key={k} className="grid gap-1 py-3 sm:grid-cols-[160px_minmax(0,1fr)]">
                  <dt className="font-heading text-[15px] font-bold text-ink">{k}</dt>
                  <dd className="text-[14px] text-ink-2">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
