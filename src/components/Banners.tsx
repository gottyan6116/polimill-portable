import Link from "next/link";
import { Photo } from "./Photo";

// トップのバナー。左に色面と文字、右に写真。文字を写真に重ねないので読みやすさが落ちない
const BANNERS = [
  { href: "/themes/bousai/", photo: "banner-city", bg: "bg-brand-strong", kicker: "特集", title: "避難所の受付を見直す", body: "国の考え方・自治体事例・サービスを1か所で" },
  { href: "/seminars/", photo: "banner-seminar", bg: "bg-ink", kicker: "セミナー", title: "12月のオンライン講座", body: "生成AIの庁内ルール、省エネの進め方ほか" },
  { href: "/compare/", photo: "banner-work", bg: "bg-case", kicker: "使い方", title: "比べて、下書きにする", body: "条件をそろえて並べ、論点表を作る" },
];

export function Banners() {
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {BANNERS.map((b) => (
        <li key={b.title}>
          <Link href={b.href} className={`group grid h-full grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] overflow-hidden rounded-card text-white ${b.bg}`}>
            <span className="flex flex-col justify-center p-5">
              <span className="text-[12px] font-bold opacity-85">{b.kicker}</span>
              <span className="font-heading mt-1 block text-[18px] font-bold leading-snug">{b.title}</span>
              <span className="mt-1.5 block text-[12px] leading-relaxed opacity-90">{b.body}</span>
            </span>
            <Photo id={b.photo} alt="" sizes="(min-width: 768px) 16vw, 45vw" className="min-h-36" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
