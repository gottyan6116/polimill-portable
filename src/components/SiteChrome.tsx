"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Search, X } from "lucide-react";
import { asset } from "@/lib/asset";
import { SearchPalette } from "./SearchPalette";
import { CompareDock, CompareProvider } from "./compare";

const NAV = [
  { href: "/themes/bousai/", label: "テーマから探す", match: "/themes" },
  { href: "/services/", label: "サービス比較", match: "/services" },
  { href: "/seminars/", label: "セミナー", match: "/seminars" },
  { href: "/policy/", label: "広告と編集の方針", match: "/policy" },
];

const SearchCtx = createContext<(q?: string) => void>(() => {});
export const useOpenSearch = () => useContext(SearchCtx);

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [initial, setInitial] = useState("");
  const [menu, setMenu] = useState(false);
  const [talkBar, setTalkBar] = useState(true);
  const path = usePathname();

  const openSearch = (q = "") => {
    setInitial(q);
    setSearchOpen(true);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setInitial("");
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- ページを移ったらメニューを閉じる
    setMenu(false);
  }, [path]);

  return (
    <CompareProvider>
      <SearchCtx.Provider value={openSearch}>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded focus:bg-surface focus:px-3 focus:py-2">
          本文へ移動
        </a>
        <header className="sticky top-0 z-30 border-b border-line bg-surface/95 supports-[backdrop-filter]:bg-surface/90">
          <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
            <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Polimill Portable トップへ">
              <Image src={asset("/brand/polimill-logo.png")} alt="Polimill" width={98} height={30} priority className="h-[26px] w-auto" />
              <span className="flex flex-col leading-none">
                <span className="font-heading text-[15px] font-bold text-ink">Portable</span>
                <span className="hidden text-[10px] text-ink-3 sm:block">行政ナレッジポータル</span>
              </span>
            </Link>
            <span className="shrink-0 whitespace-nowrap rounded-chip border border-line-strong px-1.5 py-0.5 text-[11px] font-bold text-ink-3">デモ</span>
            <nav aria-label="メイン" className="ml-auto hidden items-center gap-1 lg:flex">
              {NAV.map((n) => {
                const on = path?.startsWith(n.match);
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    aria-current={on ? "page" : undefined}
                    className={`relative rounded-control px-3 py-2 text-[14px] font-bold transition-colors ${on ? "text-brand-strong" : "text-ink-2 hover:text-ink"}`}
                  >
                    {n.label}
                    {on && <motion.span layoutId="nav-underline" className="absolute inset-x-3 -bottom-[13px] h-[3px] rounded-full bg-brand" />}
                  </Link>
                );
              })}
            </nav>
            <button
              type="button"
              onClick={() => openSearch()}
              className="ml-auto inline-flex h-10 items-center gap-2 rounded-control border border-line-strong bg-canvas px-3 text-[14px] text-ink-3 hover:border-ink-3 lg:ml-2 lg:w-56"
            >
              <Search aria-hidden className="size-4" />
              <span className="hidden sm:inline">検索</span>
              <kbd className="ml-auto hidden rounded border border-line bg-surface px-1.5 text-[11px] text-ink-3 lg:inline">Ctrl K</kbd>
            </button>
            <button type="button" onClick={() => setMenu((m) => !m)} className="rounded-control p-2 text-ink-2 lg:hidden" aria-expanded={menu} aria-label="メニュー">
              {menu ? <X aria-hidden className="size-6" /> : <Menu aria-hidden className="size-6" />}
            </button>
          </div>
          <AnimatePresence>
            {menu && (
              <motion.nav
                aria-label="メイン（スマートフォン）"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-line lg:hidden"
              >
                <ul className="mx-auto max-w-6xl px-4 py-2">
                  {NAV.map((n) => (
                    <li key={n.href}>
                      <Link href={n.href} className="block rounded-control px-2 py-3 text-[15px] font-bold text-ink">
                        {n.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.nav>
            )}
          </AnimatePresence>
          <AnimatePresence initial={false}>
            {talkBar && (
              <motion.div initial={false} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden border-t border-line bg-canvas">
                <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2 text-[13px] sm:px-6">
                  <Image src={asset("/brand/qommonsai-logo.png")} alt="QommonsAI" width={84} height={15} className="h-[14px] w-auto shrink-0" />
                  <p className="min-w-0 text-ink-2">
                    <span className="font-bold">Talk から開いています。</span>
                    <span className="hidden sm:inline">このポータルの広告や掲載料は、Talk の回答・順位・推薦には使われません。</span>
                  </p>
                  <button type="button" onClick={() => setTalkBar(false)} className="ml-auto shrink-0 rounded p-1 text-ink-3 hover:bg-surface-2" aria-label="この案内を閉じる">
                    <X aria-hidden className="size-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>
        <main id="main" className="pb-24">
          {children}
        </main>
        <Footer />
        <CompareDock />
        <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} initial={initial} />
      </SearchCtx.Provider>
    </CompareProvider>
  );
}

function Footer() {
  const links = [
    ["/themes/bousai/", "テーマから探す"],
    ["/compare/", "比べて下書きを作る"],
    ["/services/", "サービス比較（PR）"],
    ["/seminars/", "セミナー"],
    ["/policy/", "広告と編集の方針"],
    ["/credits/", "写真のクレジット"],
  ];
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-md">
          <Image src={asset("/brand/polimill-logo.png")} alt="Polimill" width={98} height={30} className="h-7 w-auto" />
          <p className="mt-3 text-[13px] text-ink-3">
            役員会での検討用に作ったデモです。記事・自治体・企業・数値はすべてサンプルで、写真はイメージです。
          </p>
        </div>
        <nav aria-label="フッター">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-ink-2 md:max-w-md md:justify-end">
            {links.map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="hover:text-brand-strong hover:underline">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="border-t border-line py-4 text-center text-[12px] text-ink-3">© Polimill, Inc.・Polimill Portable（デモ）</p>
    </footer>
  );
}
