import Image from "next/image";
import clsx from "clsx";
import { photo } from "@/lib/photos";

// 写真の枠。親に aspect-ratio を与え、写真は object-cover で埋める。
// hover で少しだけ寄る（親に group を付けたとき）。
export function Photo({
  id,
  alt,
  className,
  sizes = "(min-width: 1024px) 33vw, 100vw",
  priority,
  zoom = true,
}: {
  id: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  zoom?: boolean;
}) {
  const p = photo(id);
  return (
    <div className={clsx("relative overflow-hidden bg-surface-2", className)}>
      {p && (
        <Image
          src={p.src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={clsx("object-cover", zoom && "transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.04]")}
        />
      )}
    </div>
  );
}

export function PhotoCredit({ id, className }: { id: string; className?: string }) {
  const p = photo(id);
  if (!p) return null;
  return (
    <p className={clsx("text-[11px] leading-relaxed text-ink-3", className)}>
      写真はイメージです。{p.credit.artist ? `撮影：${p.credit.artist}、` : ""}
      <a href={p.credit.page} target="_blank" rel="noreferrer" className="underline decoration-line-strong underline-offset-2 hover:text-ink">
        Wikimedia Commons
      </a>
      （{p.credit.license}）
    </p>
  );
}
