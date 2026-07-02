import { cn } from "@/lib/utils";

const PRODUCT_HUNT_BADGE_HREF =
  "https://www.producthunt.com/products/justwrite?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-justwrite";

const PRODUCT_HUNT_BADGE_SRC =
  "https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1183546&theme=light&t=1783007555870";

export function ProductHuntBadge({
  className,
}: {
  className?: string;
}) {
  return (
    <a
      href={PRODUCT_HUNT_BADGE_HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="View Justwrite on Product Hunt"
      className={cn(
        "relative inline-flex h-8 w-[148px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-[10px] font-semibold text-zinc-800 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(15,15,15,0.08)] transition-transform duration-200 ease-out hover:translate-y-[-1px] dark:bg-white",
        className
      )}
    >
      <span className="pointer-events-none">Featured on Product Hunt</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt="Justwrite - A private, local-first writing space that works offline | Product Hunt"
        width="250"
        height="54"
        src={PRODUCT_HUNT_BADGE_SRC}
        className="absolute -inset-px block h-[calc(100%+2px)] w-[calc(100%+2px)] max-w-none rounded-full object-cover"
      />
    </a>
  );
}
