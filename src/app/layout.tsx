import type { Metadata, Viewport } from "next";
import { BIZ_UDPGothic, Zen_Maru_Gothic } from "next/font/google";
import { SiteChrome } from "@/components/SiteChrome";
import "./globals.css";

const zen = Zen_Maru_Gothic({ variable: "--font-zen", weight: ["500", "700"], display: "swap", preload: false });
const biz = BIZ_UDPGothic({ variable: "--font-biz", weight: ["400", "700"], display: "swap", preload: false });

export const metadata: Metadata = {
  title: { default: "Polimill Portable｜行政ナレッジポータル（デモ）", template: "%s｜Polimill Portable（デモ）" },
  description: "自治体職員が、制度・事例・サービスを探し、比べ、庁内資料の下書きまで進めるための行政ナレッジポータルのデモ。掲載内容はすべてサンプル。",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#ffffff" };

// オープニングを出す日は、最初の描画の前に白で隠す（一瞬サイトが見えてから演出が始まるのを防ぐ）。
// 条件は Intro.tsx と同じ：トップで、同じタブで未表示か ?intro=1。JS が止まっても 12 秒で外す。
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const INTRO_GATE = `try{var p=location.pathname;while(p.slice(-1)==="/")p=p.slice(0,-1);if(p===${JSON.stringify(BASE)}&&(sessionStorage.getItem("pp-intro-seen")!=="1"||new URLSearchParams(location.search).get("intro")==="1")){var d=document.documentElement;d.classList.add("pp-intro-pending");setTimeout(function(){d.classList.remove("pp-intro-pending")},12000)}}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${zen.variable} ${biz.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_GATE }} />
      </head>
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
