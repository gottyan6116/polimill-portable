import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLES, THEMES, type ThemeSlug } from "@/lib/content";
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
  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex items-start gap-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-brand-soft">
              <ThemeIcon slug={slug} className="size-7 text-brand-strong" strokeWidth={1.8} />
            </span>
            <div>
              <p className="text-[13px] font-bold text-brand-strong">テーマ</p>
              <h1 className="text-[30px] font-bold">{theme.name}</h1>
              <p className="mt-1 text-[14px] text-ink-2">{theme.desc}</p>
            </div>
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
