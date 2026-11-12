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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${zen.variable} ${biz.variable}`}>
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
