// 運営元 Polimill からのお知らせと研修（デモ用のサンプル。実在の告知・研修ではない）。
// 編集部の記事・PR とは別の出どころとして扱い、サービス比較の一覧には入れない。

export type NewsKind = "研修" | "機能" | "メンテナンス" | "お知らせ";

export type News = {
  id: string;
  date: string; // YYYY-MM-DD
  kind: NewsKind;
  title: string;
  body: string;
  important?: boolean; // ファーストビューのカードに出す
};

export type Training = {
  id: string;
  title: string;
  target: string;
  format: string;
  date: string; // YYYY-MM-DD
  time: string;
  minutes: number;
  summary: string;
};

export const NEWS: News[] = [
  {
    id: "n-2026-11-25-training",
    date: "2026-11-25",
    kind: "研修",
    title: "12月の「QommonsAI 活用研修（初級）」の申し込みを始めました",
    body: "はじめて QommonsAI を使う職員向けの60分の研修です。録画も配信します。",
    important: true,
  },
  {
    id: "n-2026-11-20-talk",
    date: "2026-11-20",
    kind: "機能",
    title: "QommonsAI Talk から、このポータルを開けるようになりました",
    body: "Talk の画面に、行政ナレッジポータルへの入口を追加しました。使うかどうかは職員が選べます。",
  },
  {
    id: "n-2026-11-14-maint",
    date: "2026-11-14",
    kind: "メンテナンス",
    title: "11月30日（日）2:00〜5:00 にメンテナンスを行います",
    body: "この時間は、ポータルと QommonsAI の一部の機能が使えません。",
  },
  {
    id: "n-2026-11-05-qin",
    date: "2026-11-05",
    kind: "お知らせ",
    title: "Qommons IN の利用申し込みを受け付けています",
    body: "行政職員向けの職員コミュニティ Qommons IN の、利用申し込みの受付を始めました。",
  },
];

export const TRAININGS: Training[] = [
  {
    id: "t-basic",
    title: "QommonsAI 活用研修（初級）",
    target: "はじめて使う職員",
    format: "オンライン（録画あり）",
    date: "2026-12-09",
    time: "14:00〜15:00",
    minutes: 60,
    summary: "質問のしかた、文書の下書き、出典の確かめ方までを、実際の画面で一緒に操作します。",
  },
  {
    id: "t-gikai",
    title: "議会答弁の下書きに使う（中級）",
    target: "企画・総務の担当",
    format: "オンライン",
    date: "2026-12-16",
    time: "15:00〜16:30",
    minutes: 90,
    summary: "過去の議事録の探し方と、答弁の論点を整理する使い方を、例題で練習します。",
  },
  {
    id: "t-one",
    title: "Qommons ONE はじめての設定",
    target: "情報政策・DX の担当",
    format: "オンライン",
    date: "2027-01-14",
    time: "14:00〜15:00",
    minutes: 60,
    summary: "アプリを選んで庁内に広げるまでの設定と、権限の考え方を説明します。",
  },
];

export function byDateDesc<T extends { date: string }>(list: T[]) {
  return [...list].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function dotDate(d: string) {
  return d.replaceAll("-", ".");
}
