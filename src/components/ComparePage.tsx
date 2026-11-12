"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { articleById, formatDate, type Article } from "@/lib/content";
import { useCompare } from "./compare";
import { KindBadge } from "./KindBadge";
import { DraftView } from "./dialogs";

const ROWS: [string, (a: Article) => string][] = [
  ["人口規模", (a) => a.conditions.population],
  ["費用", (a) => a.conditions.cost],
  ["個人情報", (a) => a.conditions.personalData],
  ["必要な体制", (a) => a.conditions.staffing],
  ["出典", (a) => a.source],
  ["更新日", (a) => formatDate(a.updated)],
];

export function ComparePage() {
  const { ids, remove } = useCompare();
  const items = ids.map(articleById).filter(Boolean) as Article[];
  if (items.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-line-strong bg-surface p-10 text-center">
        <p className="text-[16px] font-bold">比較トレイは空です</p>
        <p className="mt-2 text-[14px] text-ink-3">記事の「比較に追加」を押すと、ここで条件を並べて比べられます。</p>
        <Link href="/themes/bousai/" className="mt-5 inline-flex h-11 items-center rounded-control bg-brand-strong px-5 text-[14px] font-bold text-white hover:bg-brand-deep">
          テーマから探す
        </Link>
      </div>
    );
  }
  return (
    <div className="space-y-10">
      <div className="overflow-x-auto rounded-card border border-line bg-surface">
        <table className="w-full min-w-[640px] border-collapse text-left text-[14px]">
          <thead>
            <tr>
              <th scope="col" className="w-32 border-b border-line bg-surface-2 px-4 py-3 text-[13px] text-ink-3">
                比べる条件
              </th>
              {items.map((a) => (
                <th key={a.id} scope="col" className="border-b border-l border-line px-4 py-3 align-top font-normal">
                  <div className="flex items-start justify-between gap-2">
                    <KindBadge kind={a.kind} company={a.company} />
                    <button type="button" onClick={() => remove(a.id)} className="rounded p-1 text-ink-3 hover:bg-surface-2" aria-label={`${a.title} を外す`}>
                      <X aria-hidden className="size-4" />
                    </button>
                  </div>
                  <Link href={`/articles/${a.id}/`} className="mt-2 block font-heading text-[15px] font-bold leading-snug text-ink hover:underline">
                    {a.title}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([label, get]) => (
              <tr key={label}>
                <th scope="row" className="border-b border-line bg-surface-2 px-4 py-3 text-[13px] font-bold text-ink-2">
                  {label}
                </th>
                {items.map((a) => (
                  <td key={a.id} className="border-b border-l border-line px-4 py-3 align-top text-ink">
                    {get(a)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <section className="rounded-card border border-line bg-surface p-5">
        <DraftView items={items} />
      </section>
    </div>
  );
}
