import {
  Baby,
  Building2,
  Cpu,
  Factory,
  HandHeart,
  HeartPulse,
  Landmark,
  Leaf,
  Megaphone,
  MapPinned,
  ShieldAlert,
  Users,
  type LucideProps,
} from "lucide-react";
import type { ThemeSlug } from "@/lib/content";

const MAP: Record<ThemeSlug, React.ComponentType<LucideProps>> = {
  bousai: ShieldAlert,
  dx: Cpu,
  kosodate: Baby,
  fukushi: HandHeart,
  kenko: HeartPulse,
  kanko: MapPinned,
  sangyo: Factory,
  machi: Building2,
  kankyo: Leaf,
  zaisei: Landmark,
  jinji: Users,
  koho: Megaphone,
};

export function ThemeIcon({ slug, ...props }: { slug: ThemeSlug } & LucideProps) {
  const Icon = MAP[slug];
  return <Icon aria-hidden {...props} />;
}
