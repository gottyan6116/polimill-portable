import Image from "next/image";
// avoid-ai-design-ignore: I3 -- 外部サイト（PR TIMES）へ移ることを示す矢印
import { ArrowUpRight, MapPin } from "lucide-react";
import { asset } from "@/lib/asset";
import { dotDate } from "@/lib/polimill-news";
import { PRTIMES_LIST_URL, RELEASES, releaseImg, releaseUrl, type Release, type ReleaseKind } from "@/lib/prtimes";

// PR TIMES のリリースを並べる（/polimill/ で使う。CSS は globals.css の .prt）。
// リンクはすべて PR TIMES の元記事へ、新しいタブで開く。

const KIND_CLASS: Record<ReleaseKind, string> = {
  発表: "prt-kind--news",
  協定: "prt-kind--pact",
  セミナー: "prt-kind--seminar",
  研修: "prt-kind--training",
};

function Kind({ kind }: { kind: ReleaseKind }) {
  return <span className={`prt-kind ${KIND_CLASS[kind]}`}>{kind}</span>;
}

function Thumb({ r, sizes, priority }: { r: Release; sizes: string; priority?: boolean }) {
  return (
    <div className="prt-thumb">
      <Image src={asset(releaseImg(r))} alt="" width={960} height={640} sizes={sizes} priority={priority} className="prt-thumb__img" />
    </div>
  );
}

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

// ページ上部の右側に置く、リリース画像の重なり
export function PrTimesMosaic() {
  const picks = [817, 825, 819, 824].map((n) => RELEASES.find((r) => r.no === n)!);
  return (
    <ul className="prt-mosaic" aria-hidden>
      {picks.map((r, i) => (
        <li key={r.no} className={`prt-mosaic__item prt-mosaic__item--${i + 1}`}>
          <Image src={asset(releaseImg(r))} alt="" width={960} height={640} sizes="(min-width: 1024px) 260px, 40vw" priority className="prt-mosaic__img" />
        </li>
      ))}
    </ul>
  );
}

// 主な発表：大きな1本＋右に3本
export function PrTimesHighlights() {
  const main = RELEASES.filter((r) => r.kind !== "研修");
  const [lead, ...rest] = main;
  return (
    <div className="prt-bento">
      <a href={releaseUrl(lead)} {...external} className="prt-card prt-card--lead group">
        <Thumb r={lead} sizes="(min-width: 1024px) 640px, 100vw" priority />
        <div className="prt-card__body">
          <p className="prt-card__meta">
            <Kind kind={lead.kind} />
            <time dateTime={lead.date}>{dotDate(lead.date)}</time>
          </p>
          <h3 className="prt-card__title prt-card__title--lead">{lead.title}</h3>
          {lead.sub && <p className="prt-card__sub">{lead.sub}</p>}
          <span className="prt-card__go">
            PR TIMES で読む <ArrowUpRight aria-hidden className="size-4" />
          </span>
        </div>
      </a>
      <ul className="prt-side">
        {rest.map((r) => (
          <li key={r.no}>
            <a href={releaseUrl(r)} {...external} className="prt-card prt-card--row group">
              <Thumb r={r} sizes="200px" />
              <div className="prt-card__body">
                <p className="prt-card__meta">
                  <Kind kind={r.kind} />
                  <time dateTime={r.date}>{dotDate(r.date)}</time>
                </p>
                <h3 className="prt-card__title">{r.title}</h3>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// 研修の実施レポート：横に流せるカード
export function PrTimesTrainings() {
  const list = RELEASES.filter((r) => r.kind === "研修");
  return (
    <ul className="prt-trainings scroll-row">
      {list.map((r) => (
        <li key={r.no} className="prt-trainings__item">
          <a href={releaseUrl(r)} {...external} className="prt-card prt-card--training group">
            <Thumb r={r} sizes="320px" />
            <div className="prt-card__body">
              <p className="prt-card__place">
                <MapPin aria-hidden className="size-4" />
                {r.place}
              </p>
              {r.sub && <p className="prt-card__quote">{r.sub}</p>}
              <time dateTime={r.date} className="prt-card__date">
                {dotDate(r.date)}
              </time>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function PrTimesAllLink() {
  return (
    <a href={PRTIMES_LIST_URL} {...external} className="prt-all">
      PR TIMES ですべてのリリースを見る <ArrowUpRight aria-hidden className="size-4" />
    </a>
  );
}
