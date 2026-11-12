import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLES, THEMES, byUpdated, type ThemeSlug } from "@/lib/content";
import { Photo } from "@/components/Photo";
import { ThemeIcon } from "@/components/ThemeIcon";
import { KindFilterList } from "@/components/KindFilterList";

export function generateStaticParams() {
  return THEMES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = THEMES.find((x) => x.slug === slug);
  return { title: t?.name ?? "テーマ" };
}

export default async function ThemePage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug as ThemeSlug;
  const theme = THEMES.find((t) => t.slug === slug);
  if (!theme) notFound();
  const items = ARTICLES.filter((a) => a.theme === slug);
  const cover = byUpdated(items.filter((a) => a.kind !== "pr"))[0] ?? items[0];
  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,380px)] md:items-center">
            <div>
              <p className="flex items-center gap-1.5 text-[13px] font-bold text-brand-strong">
                <ThemeIcon slug={slug} className="size-4" strokeWidth={2} />
                テーマ
              </p>
              <h1 className="mt-1 text-[32px] font-bold">{theme.name}</h1>
              <p className="mt-1 text-[14px] text-ink-2">{theme.desc}</p>
              <p className="mt-3 text-[13px] text-ink-3">
                <span className="tabular font-bold text-ink">{items.length}</span>件の情報
              </p>
            </div>
            {cover && <Photo id={cover.id} alt="" priority zoom={false} sizes="380px" className="aspect-[16/9] rounded-card" />}
          </div>
          <nav aria-label="ほかのテーマ" className="scroll-row mt-6 flex gap-2 overflow-x-auto pb-1">
            {THEMES.map((t) => (
              <Link
                key={t.slug}
                href={`/themes/${t.slug}/`}
                aria-current={t.slug === slug ? "page" : undefined}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-bold ${t.slug === slug ? "border-brand-strong bg-brand-soft text-brand-strong" : "border-line bg-surface text-ink-2 hover:border-ink-3"}`}
              >
                <ThemeIcon slug={t.slug} className="size-4" />
                {t.short}
              </Link>
            ))}
          </nav>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <KindFilterList items={items} />
      </div>
    </>
  );
}
