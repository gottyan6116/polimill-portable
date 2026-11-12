import { BookOpenText, FileText, GraduationCap, Landmark, MapPin, PenLine } from "lucide-react";
import { KIND_LABEL, type Kind } from "@/lib/content";
import clsx from "clsx";

// 種類ごとに色だけでなく形とアイコンも変える（色だけに頼らない）
const STYLE: Record<Kind, string> = {
  public: "bg-public-soft text-public",
  case: "bg-case-soft text-case",
  editorial: "bg-surface-2 text-ink-2",
  training: "bg-surface-2 text-ink-2",
  template: "bg-surface-2 text-ink-2",
  pr: "bg-pr-soft text-pr ring-1 ring-pr-line",
};
const ICON = { public: Landmark, case: MapPin, editorial: PenLine, training: GraduationCap, template: FileText, pr: BookOpenText };

export function KindBadge({ kind, company, size = "sm" }: { kind: Kind; company?: string; size?: "sm" | "md" }) {
  const Icon = ICON[kind];
  return (
    <span
      className={clsx(
        "inline-flex max-w-full items-center gap-1.5 rounded-chip font-bold",
        size === "sm" ? "px-2 py-0.5 text-[12px]" : "px-2.5 py-1 text-[13px]",
        STYLE[kind],
      )}
    >
      <Icon aria-hidden className={size === "sm" ? "size-3.5 shrink-0" : "size-4 shrink-0"} />
      <span className="truncate">{kind === "pr" && company ? `PR・${company}` : KIND_LABEL[kind]}</span>
    </span>
  );
}
