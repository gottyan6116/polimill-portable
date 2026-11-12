import type { Metadata } from "next";
import { Info } from "lucide-react";
import { ARTICLES } from "@/lib/content";
import { KindFilterList } from "@/components/KindFilterList";

export const metadata: Metadata = { title: "サービス比較（PR）" };

export default function Page() {
  const items = ARTICLES.filter((a) => a.kind === "pr");
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-[30px] font-bold">サービス比較</h1>
      <p className="mt-2 max-w-2xl text-[14px] text-ink-2">企業が提供する自治体向けサービスの一覧です。すべてPR（企業提供）の情報です。</p>
      <p className="mt-4 flex max-w-3xl gap-2 rounded-control bg-pr-soft px-4 py-3 text-[13px] text-pr">
        <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
        並び順は更新日の新しい順です。掲載料によって順位を上げたり、ほかの企業を外したりはしません。掲載している企業はすべて架空です。
      </p>
      <div className="mt-8">
        <KindFilterList items={items} />
      </div>
    </div>
  );
}
