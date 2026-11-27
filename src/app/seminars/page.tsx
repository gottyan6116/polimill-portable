import type { Metadata } from "next";
import { SeminarList } from "@/components/SeminarList";

export const metadata: Metadata = { title: "セミナー" };

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-[30px] font-bold">セミナー</h1>
      <p className="mt-2 text-[14px] text-ink-2">職員向けのオンラインセミナーです。各回のボックスを開くと、対象・内容・申し込みが見られます。協賛のあるセミナーは、協賛企業名を表示しています（すべてサンプル）。</p>
      <SeminarList />
    </div>
  );
}
