import credits from "./photo-credits.json";
import { asset } from "./asset";

// 写真はすべて Wikimedia Commons の自由ライセンス素材（作者・ライセンスは photo-credits.json）。
// 記事の内容とは別の場所で撮られた写真で、記事の自治体・企業を写したものではない（イメージ）。
export type Credit = { title: string; artist: string; license: string; page: string };

const CREDITS = credits as Record<string, Credit>;

export function photo(key: string) {
  const c = CREDITS[key];
  if (!c) return null;
  return { src: asset(`/photos/${key}.webp`), credit: c };
}

export function allCredits() {
  return Object.entries(CREDITS);
}
