// PR TIMES で Polimill が実際に出したプレスリリース（2026-11-27 時点の一覧から9本を手で選んだもの）。
// サイトのほかの中身はデモ用のサンプルだが、ここだけは実在のリリース。タイトルと日付は PR TIMES の表記のまま。
// 画像は各リリースのメイン画像を public/prtimes/<番号>.webp に保存した。増やすときはここと画像を足す。
export const PRTIMES_LIST_URL = "https://prtimes.jp/main/html/searchrlp/company_id/88829";

export type ReleaseKind = "発表" | "協定" | "セミナー" | "研修";

export type Release = {
  no: number; // PR TIMES の通し番号（URL の 000000xxx）
  date: string; // YYYY-MM-DD（PR TIMES の公開日）
  kind: ReleaseKind;
  title: string; // 「—」より前
  sub?: string; // 「—」より後
  place?: string; // 研修の実施先
};

export const RELEASES: Release[] = [
  { no: 824, date: "2026-11-27", kind: "研修", place: "群馬県千代田町", title: "QommonsAI活用研修を群馬県千代田町で実施", sub: "「次回の研修を早く実施してほしい」実務活用への期待が広がる初級編" },
  { no: 823, date: "2026-11-26", kind: "研修", place: "北海道鷹栖町", title: "QommonsAI活用研修を北海道鷹栖町で実施", sub: "「これから使っていきたい」実践を通じて広がる生成AI活用" },
  { no: 821, date: "2026-11-26", kind: "研修", place: "群馬県館林市", title: "QommonsAI活用研修を群馬県館林市で実施", sub: "生成AIでPowerPoint資料を作成。「こんなこともできるんだ」と驚きの声" },
  { no: 822, date: "2026-11-26", kind: "研修", place: "山梨県市町村総合事務組合", title: "QommonsAI活用研修を山梨県市町村総合事務組合で実施", sub: "初級・中級編に延べ約180名が参加、広がる生成AIの実務活用" },
  { no: 825, date: "2026-11-25", kind: "セミナー", title: "Polimill、大阪にてアマゾン ウェブ サービス（AWS）と共催セミナー開催", sub: "大阪・兵庫の自治体職員がQommonsAIの活用事例を紹介" },
  { no: 819, date: "2026-11-25", kind: "協定", title: "Polimill、大分県日田市と「生成AIの活用に関する連携協定」を締結", sub: "九州地方の自治体との初の協定、行政実務に即したAI活用と業務改善を推進" },
  { no: 817, date: "2026-11-20", kind: "発表", title: "QommonsAI、OpenAI「GPT-6 Luna」による国内推論に対応", sub: "全国約1200自治体、65万人に提供開始" },
  { no: 816, date: "2026-11-19", kind: "研修", place: "宮崎県新富町", title: "QommonsAI活用研修を宮崎県新富町で実施", sub: "「これ、すぐ使えますよ！」実務での活用イメージが広がる初級編" },
  { no: 813, date: "2026-11-16", kind: "発表", title: "Polimill、「QommonsAI 3.0 エージェント版 導入効果シミュレーター」を全国約1,200の自治体に公開" },
];

export const releaseUrl = (r: Release) => `https://prtimes.jp/main/html/rd/p/${String(r.no).padStart(9, "0")}.000088829.html`;
export const releaseImg = (r: Release) => `/prtimes/${r.no}.webp`;
