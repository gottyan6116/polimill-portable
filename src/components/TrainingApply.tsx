"use client";

import { useState } from "react";

// 研修の申し込みボタン。デモなので送信せず、その旨をその場で伝える。
export function TrainingApply({ title }: { title: string }) {
  const [done, setDone] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setDone(true)}
        className="inline-flex h-10 items-center rounded-control bg-brand-strong px-4 text-[14px] font-bold text-white transition-colors hover:bg-brand-deep"
      >
        申し込む
      </button>
      <p role="status" className="mt-2 min-h-5 text-[13px] text-ink-3">
        {done ? `デモのため「${title}」の申し込みは送信されません。` : ""}
      </p>
    </div>
  );
}
