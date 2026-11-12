import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-[26px] font-bold">ページが見つかりません</h1>
      <Link href="/" className="mt-6 inline-block font-bold text-brand-strong hover:underline">
        トップへ戻る
      </Link>
    </div>
  );
}
