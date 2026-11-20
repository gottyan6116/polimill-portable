import Link from "next/link";
import { THEMES, type ThemeSlug } from "@/lib/content";
import { Photo } from "./Photo";

// 業務テーマの大きな文字と写真が、上下2段で逆向きに流れる帯（CSS は globals.css の .theme-band）。
// 文字はテーマのページへのリンク。ループ用に複製した2組目は読み上げ・Tab移動の対象から外す。
const PHOTO: Record<ThemeSlug, string> = {
  bousai: "a-city-hinanjo-qr",
  dx: "b-town-shinsei-dx",
  kosodate: "c-city-gakudo",
  fukushi: "mimamori-training",
  kenko: "kenshin-juushin",
  kanko: "kanko-kankeijinko",
  sangyo: "g-city-sougyou",
  machi: "d-town-akiya",
  kankyo: "pr-ene-mieruka",
  zaisei: "yosan-hensei-ai",
  jinji: "saiyo-shokuin",
  koho: "pubcom-tsuika",
};

function Row({ slugs, dir }: { slugs: ThemeSlug[]; dir: "left" | "right" }) {
  const themes = slugs.map((s) => THEMES.find((t) => t.slug === s)!);
  const set = (copy: boolean) => (
    <ul className="theme-band__set" aria-hidden={copy || undefined}>
      {themes.map((t) => (
        <li key={t.slug} className="theme-band__item">
          <Link href={`/themes/${t.slug}/`} className="theme-band__word" tabIndex={copy ? -1 : undefined}>
            {t.name}
          </Link>
          <Photo id={PHOTO[t.slug]} alt="" sizes="160px" zoom={false} className="theme-band__photo" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="theme-band__row" data-dir={dir}>
      <div className="theme-band__track">
        {set(false)}
        {set(true)}
      </div>
    </div>
  );
}

export function ThemeBand() {
  const slugs = THEMES.map((t) => t.slug);
  return (
    <section className="theme-band" aria-label="業務のテーマ">
      <Row slugs={slugs.slice(0, 6)} dir="left" />
      <Row slugs={slugs.slice(6)} dir="right" />
    </section>
  );
}
