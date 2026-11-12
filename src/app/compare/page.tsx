import type { Metadata } from "next";
import { ComparePage } from "@/components/ComparePage";

export const metadata: Metadata = { title: "比べて下書きを作る" };

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-[30px] font-bold">比べて下書きを作る</h1>
      <p className="mt-2 max-w-2xl text-[14px] text-ink-2">選んだ情報の条件を並べ、庁内説明の論点表の下書きを作ります。企業提供の情報は「企業提供」と明示して扱います。</p>
      <div className="mt-8">
        <ComparePage />
      </div>
    </div>
  );
}
