import Image from "next/image";
// avoid-ai-design-ignore: I3 -- 外部サイト（PR TIMES）へ移ることを示す矢印
import { ArrowUpRight, MapPin } from "lucide-react";
import { asset } from "@/lib/asset";
import { dotDate } from "@/lib/polimill-news";
import { PRTIMES_LIST_URL, RELEASES, releaseImg, releaseUrl, type Release, type ReleaseKind } from "@/lib/prtimes";

// PR TIMES のリリースを並べる（/polimill/ で使う。CSS は src/app/prtimes.css の .prt-）。上部の送り表示は PrTimesStage.tsx。
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

// 研修の実施レポート：右から左へ流れ続ける帯（ホバー・フォーカスで止まる。動きを減らす設定では横スクロール）。
// ループのため同じ並びを2組置き、2組目は読み上げ・Tab移動から外す。
export function PrTimesTrainings() {
  const list = RELEASES.filter((r) => r.kind === "研修").sort((a, b) => (a.date < b.date ? 1 : -1));
  return (
    <div className="prt-marquee">
      <div className="prt-marquee__track" style={{ animationDuration: `${list.length * 6}s` }}>
        <TrainingSet list={list} />
        <TrainingSet list={list} copy />
      </div>
    </div>
  );
}

function TrainingSet({ list, copy = false }: { list: Release[]; copy?: boolean }) {
  return (
    <ul className="prt-marquee__set" aria-hidden={copy || undefined}>
      {list.map((r) => (
        <li key={r.no} className="prt-trainings__item">
          <a href={releaseUrl(r)} {...external} tabIndex={copy ? -1 : undefined} className="prt-card prt-card--training group">
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
