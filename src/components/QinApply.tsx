"use client";

import { useState } from "react";
// avoid-ai-design-ignore: I3 -- Check は申し込み完了の状態表示に使う
import { Check, Info } from "lucide-react";

// Qommons IN の利用申し込み（デモ）。本番では申し込み先が決まってから送信先をつなぐ。
// いまは入力の確認だけ行い、どこにも送らない。
export function QinApply() {
  const [sent, setSent] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");

  if (sent) {
    return (
      <div className="rounded-card border border-qin/30 bg-qin-soft p-6" role="status">
        <span className="grid size-11 place-items-center rounded-full bg-qin text-white">
          <Check aria-hidden className="size-5" />
        </span>
        <p className="mt-4 text-[17px] font-bold text-qin-deep">申し込みを受け付けました（デモ）</p>
        <p className="mt-1 text-[14px] text-ink-2">
          デモのため、実際には送信していません。本番では、所属の確認のあと、アカウントの発行についてメールでお知らせする流れを想定しています。
        </p>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const email = String(f.get("email") ?? "").trim();
        if (!f.get("org") || !f.get("dept") || !f.get("name") || !email) {
          setError("すべての項目を入力してください。");
          return;
        }
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
          setError("メールアドレスの形が正しくありません。所属先で使っているアドレスを入力してください。");
          return;
        }
        if (!agree) {
          setError("利用目的への同意にチェックを入れてください。");
          return;
        }
        setError("");
        setSent(true);
      }}
      className="grid gap-4 rounded-card border border-line bg-surface p-5 sm:p-6"
    >
      {[
        { id: "org", label: "自治体名", ph: "例：〇〇市", type: "text", auto: "organization" },
        { id: "dept", label: "所属", ph: "例：防災危機管理課", type: "text", auto: "organization-title" },
        { id: "name", label: "氏名", ph: "例：山田 花子", type: "text", auto: "name" },
        { id: "email", label: "メールアドレス（所属先のもの）", ph: "例：hanako.yamada@city.example.lg.jp", type: "email", auto: "email" },
      ].map((f) => (
        <div key={f.id} className="grid gap-1.5">
          <label htmlFor={`qin-${f.id}`} className="text-[13px] font-bold text-ink">
            {f.label}
            <span className="ml-1 text-qin" aria-hidden>
              *
            </span>
          </label>
          <input
            id={`qin-${f.id}`}
            name={f.id}
            type={f.type}
            autoComplete={f.auto}
            placeholder={f.ph}
            required
            className="h-11 rounded-control border border-line-strong bg-surface px-3 text-[16px] text-ink placeholder:text-ink-3 focus:border-qin focus:outline-none focus:ring-2 focus:ring-qin/25"
          />
        </div>
      ))}
      <label className="flex cursor-pointer items-start gap-3 rounded-control border border-line p-3 text-[14px] hover:border-ink-3">
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 size-4 accent-[#176b52]" />
        <span>入力した情報を、所属の確認と Qommons IN のアカウント発行の連絡に使うことに同意します</span>
      </label>
      {error && (
        <p role="alert" className="text-[13px] font-bold text-brand-strong">
          {error}
        </p>
      )}
      <button type="submit" className="h-12 rounded-control bg-qin px-5 text-[15px] font-bold text-white transition-colors hover:bg-qin-deep">
        利用を申し込む
      </button>
      <p className="flex gap-2 text-[12px] text-ink-3">
        <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
        デモのため送信はしません。本番の申し込み先は、Qommons IN の運用が決まってからつなぎます。
      </p>
    </form>
  );
}
