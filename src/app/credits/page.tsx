import type { Metadata } from "next";
import { allCredits } from "@/lib/photos";
import { Photo } from "@/components/Photo";

export const metadata: Metadata = { title: "写真のクレジット" };

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-[30px] font-bold">写真のクレジット</h1>
      <p className="mt-2 text-[14px] text-ink-2">
        このデモの写真は、Wikimedia Commons で自由ライセンスのもとに公開されている写真です。記事に出てくる自治体・企業を写したものではなく、イメージとして使っています。
      </p>
      <ul className="mt-8 divide-y divide-line rounded-card border border-line bg-surface">
        {allCredits().map(([key, c]) => (
          <li key={key} className="grid grid-cols-[96px_minmax(0,1fr)] gap-4 p-4">
            <Photo id={key} alt="" sizes="96px" zoom={false} className="aspect-[4/3] rounded-control" />
            <div className="min-w-0 text-[13px]">
              <p className="truncate font-bold text-ink">{c.title}</p>
              <p className="text-ink-2">撮影：{c.artist || "不明"}</p>
              <p className="text-ink-3">
                ライセンス：{c.license}・
                <a href={c.page} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-ink">
                  Wikimedia Commons の掲載ページ
                </a>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
