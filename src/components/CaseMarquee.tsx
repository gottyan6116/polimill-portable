import Link from "next/link";
import { type Article, formatDate, themeOf } from "@/lib/content";
import { Photo } from "./Photo";
import { KindBadge } from "./KindBadge";

// 自治体事例を2段で流す（上段は右から左、下段は左から右）。
// CSS だけで動かす（JS がなくても動く）。マウスを乗せる・キーボードで選ぶと止まる。
// 動きを減らす設定では止めて、横にスクロールできる一覧にする。
// 継ぎ目なく回すため、同じ並びを2回描き、2回目は読み上げ・Tab 移動の対象から外す。

function Card({ a, hidden }: { a: Article; hidden?: boolean }) {
  return (
    <article className="group w-[260px] shrink-0 sm:w-[300px]">
      <Link href={`/articles/${a.id}/`} tabIndex={hidden ? -1 : undefined} className="block">
        <Photo id={a.id} alt="" sizes="300px" className="aspect-[3/2] rounded-card" />
        <div className="mt-3 flex flex-col gap-1.5">
          <KindBadge kind={a.kind} />
          <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-ink decoration-brand decoration-2 underline-offset-4 group-hover:underline">{a.title}</h3>
          <p className="text-[12px] text-ink-3 tabular">
            {themeOf(a.theme).name}・更新 {formatDate(a.updated)}
          </p>
        </div>
      </Link>
    </article>
  );
}

function Row({ items, dir, label }: { items: Article[]; dir: "left" | "right"; label: string }) {
  return (
    <div className="case-marquee" data-dir={dir} role="group" aria-label={label}>
      <div className="case-marquee__track">
        <ul className="case-marquee__set">
          {items.map((a) => (
            <li key={a.id}>
              <Card a={a} />
            </li>
          ))}
        </ul>
        <ul className="case-marquee__set case-marquee__set--copy" aria-hidden>
          {items.map((a) => (
            <li key={a.id}>
              <Card a={a} hidden />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function CaseMarquee({ cases }: { cases: Article[] }) {
  // 下段は並びをずらして、上下で同じ写真が縦に並ばないようにする
  const shift = Math.ceil(cases.length / 2);
  const lower = [...cases.slice(shift), ...cases.slice(0, shift)];
  return (
    <div className="flex flex-col gap-8">
      <Row items={cases} dir="left" label="自治体事例（上段）" />
      <Row items={lower} dir="right" label="自治体事例（下段）" />
    </div>
  );
}
