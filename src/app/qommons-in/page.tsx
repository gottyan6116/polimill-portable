import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck, MessagesSquare, Search } from "lucide-react";
import { asset } from "@/lib/asset";
import { QIN_URL } from "@/lib/qommons-in";
import { QinApply } from "@/components/QinApply";

export const metadata: Metadata = { title: "Qommons IN" };

export default function Page() {
  return (
    <>
      {/* 見出し：Qommons IN の画面と同じ深い緑の帯 */}
      <section className="bg-qin-deep text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-end">
          <div>
            <p className="text-[14px] font-bold text-white/75">行政職員のための職員コミュニティ</p>
            {/* avoid-ai-design-ignore: SD5 -- IN の色分けは Qommons IN のロゴ表記に合わせたもの */}
            <h1 className="mt-2 font-heading text-[36px] font-bold leading-tight sm:text-[48px]">
              Qommons <span className="text-[#8fd1b0]">IN</span>
            </h1>
            <p className="mt-4 font-heading text-[22px] font-bold sm:text-[26px]">行政の知恵を、つなぐ。</p>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/85">
              このポータルで見つけた制度や事例の先にある、職員どうしの対話の場です。認証された行政職員だけが参加できます。
            </p>
          </div>
          <div className="grid gap-3 rounded-card bg-white/8 p-5 ring-1 ring-white/15">
            <p className="text-[13px] font-bold text-white/80">すでにアカウントをお持ちの方</p>
            <a
              href={QIN_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-control bg-white px-5 text-[15px] font-bold text-qin-deep transition-colors hover:bg-qin-soft"
            >
              Qommons IN にログイン
              <ArrowUpRight aria-hidden className="size-4" />
            </a>
            <p className="text-[13px] font-bold text-white/80">まだお持ちでない方</p>
            <a href="#apply" className="inline-flex h-12 items-center justify-center rounded-control border border-white/50 px-5 text-[15px] font-bold text-white transition-colors hover:bg-white/10">
              利用を申し込む
            </a>
          </div>
        </div>
      </section>

      {/* ポータルと IN の関係 */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="text-[24px] font-bold">ポータルで探して、Qommons IN でつながる</h2>
        <p className="mt-2 max-w-3xl text-[15px] text-ink-2">
          ポータルは、誰でも読める公開情報を探して比べる場所です。Qommons IN は、認証された職員だけが集まり、対話から知恵を持ち寄る場所です。
        </p>
        <dl className="mt-8 grid gap-px overflow-hidden rounded-card border border-line bg-line md:grid-cols-3">
          {[
            { icon: Search, k: "このポータル", v: "制度・自治体事例・サービスを、出典と種類を分けて探し、比べる。誰でも読める。" },
            { icon: MessagesSquare, k: "Qommons IN", v: "行政職員どうしが対話する、職員コミュニティ。参加には認証されたアカウントが要る。" },
            { icon: BadgeCheck, k: "参加できる人", v: "Polimill が確認した行政職員。許可されたアカウントでログインする。" },
          ].map(({ icon: Icon, k, v }) => (
            <div key={k} className="bg-surface p-6">
              <dt className="flex items-center gap-2 font-heading text-[17px] font-bold text-ink">
                <Icon aria-hidden className="size-5 text-qin" strokeWidth={1.8} />
                {k}
              </dt>
              <dd className="mt-2 text-[14px] leading-relaxed text-ink-2">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 申し込み */}
      <section id="apply" className="scroll-mt-28 border-t border-line bg-surface">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)]">
          <div>
            <h2 className="text-[24px] font-bold">アカウントをお持ちでない方</h2>
            <p className="mt-2 text-[15px] text-ink-2">
              Qommons IN は、許可されたアカウントでのみ使えます。所属の自治体と連絡先を入力して、利用を申し込んでください。
            </p>
            <ol className="mt-6 divide-y divide-line border-y border-line">
              {[
                ["申し込む", "自治体名・所属・氏名・所属先のメールアドレスを入力する"],
                ["所属を確かめる", "Polimill が、行政職員であることを確かめる"],
                ["ログインする", "発行されたアカウントで Qommons IN にログインする"],
              ].map(([k, v], i) => (
                <li key={k} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3 py-4">
                  <span className="grid size-8 place-items-center rounded-full bg-qin-soft font-heading text-[15px] font-bold text-qin" aria-hidden>
                    {i + 1}
                  </span>
                  <span>
                    <span className="block text-[15px] font-bold text-ink">{k}</span>
                    <span className="block text-[13px] text-ink-3">{v}</span>
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-[12px] text-ink-3">手順は想定です。確認の方法と連絡までの日数は、運用が決まってから載せます。</p>
            <div className="mt-8 flex items-center gap-3">
              <Image src={asset("/brand/polimill-logo.png")} alt="Polimill" width={98} height={30} className="h-6 w-auto" />
              <span className="text-[12px] text-ink-3">Qommons IN は Polimill が運営しています。</span>
            </div>
          </div>
          <QinApply />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-[14px] text-ink-2">
          まずは公開情報から探す場合は
          <Link href="/themes/bousai/" className="mx-1 font-bold text-brand-strong underline underline-offset-4">
            テーマから探す
          </Link>
          をご覧ください。
        </p>
      </section>
    </>
  );
}
