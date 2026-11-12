import type { Metadata } from "next";

export const metadata: Metadata = { title: "広告と編集の方針" };

const RULES: [string, string][] = [
  ["PRの表示", "企業が提供した記事・資料には、一覧と本文の先頭に「PR」と企業名を必ず表示します。AIで要約したときも、企業提供の情報であることを示します。"],
  ["AIの回答と広告", "掲載料によって、QommonsAI の回答・検索の順位・サービスの推薦・Qommons ONE の機能の呼び出しを変えることはありません。PR記事は、通常のAIの回答・検索・推薦の対象から外します。"],
  ["比較に入れる情報", "職員が自分で選んだときだけ、PRの資料を比較や下書きに入れます。その場合も「企業提供」と明示します。"],
  ["資料請求と個人情報", "資料請求のときだけ、提供先・項目・目的を示して同意を取り、同意の記録を残します。チャットの内容・閲覧履歴・庁内資料は企業に渡しません。"],
  ["並び順", "一覧と検索結果は更新日の新しい順です。掲載料で順位を上げたり、スポンサーでない企業を外したりしません。"],
  ["行政の推奨との区別", "PR記事は行政の推奨や採用の約束ではありません。公的資料・自治体事例・編集部の解説とは、ラベルの形と色で区別します。"],
];

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-[30px] font-bold">広告と編集の方針</h1>
      <p className="mt-2 text-[15px] text-ink-2">このポータルは、職員が安心して調べものに使えることを優先します。広告と編集を次のように分けています。</p>
      <dl className="mt-8 divide-y divide-line rounded-card border border-line bg-surface">
        {RULES.map(([k, v]) => (
          <div key={k} className="grid gap-2 p-5 sm:grid-cols-[180px_minmax(0,1fr)]">
            <dt className="font-heading text-[17px] font-bold text-ink">{k}</dt>
            <dd className="text-[15px] leading-[1.9] text-ink-2">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 text-[13px] text-ink-3">デモのため、実際の運用ルールは試行の中で法務と自治体の確認を経て決めます。</p>
    </div>
  );
}
