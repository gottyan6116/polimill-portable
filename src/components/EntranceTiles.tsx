import Link from "next/link";
// avoid-ai-design-ignore: I3 -- 入口カードの丸い矢印ボタン（CEO が試作から選んだ形）
import { ArrowRight } from "lucide-react";
import { THEMES } from "@/lib/content";
import { Photo } from "./Photo";

// 上が丸いアーチ型の入口4枚と、テーマの丸ボタン（CSS は globals.css の .entrance）。
const TILES = [
  { href: "/themes/bousai/", ja: "テーマから探す", en: "THEMES", photo: "banner-city" },
  { href: "/services/", ja: "サービスを比べる", en: "SERVICES", photo: "pr-uketsuke-system" },
  { href: "/seminars/", ja: "セミナーで学ぶ", en: "SEMINARS", photo: "banner-seminar" },
  { href: "/compare/", ja: "下書きをつくる", en: "DRAFT", photo: "banner-work" },
];

export function EntranceTiles() {
  return (
    <section className="entrance" aria-labelledby="entrance-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 id="entrance-heading" className="sr-only">
          ポータルの入口
        </h2>
        <ul className="entrance__tiles">
          {TILES.map((t) => (
            <li key={t.href}>
              <Link href={t.href} className="entrance__tile">
                <Photo id={t.photo} alt="" sizes="(min-width: 900px) 25vw, 50vw" className="entrance__ph" />
                <span className="entrance__en" aria-hidden>
                  {t.en}
                </span>
                <span className="entrance__ja">{t.ja}</span>
                <span className="entrance__go" aria-hidden>
                  <ArrowRight className="size-4" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <ul className="entrance__themes" aria-label="テーマ">
          {THEMES.map((t) => (
            <li key={t.slug}>
              <Link href={`/themes/${t.slug}/`}>{t.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
