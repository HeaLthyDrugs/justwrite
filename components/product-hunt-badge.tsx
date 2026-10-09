import { cn } from "@/lib/utils";

const PRODUCT_HUNT_BADGE_HREF =
  "https://www.producthunt.com/products/justwrite?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-justwrite";

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
      <span className="absolute inset-0 flex items-center justify-center bg-white/90 px-3 text-[10px] font-semibold dark:bg-white/90">
        Featured on Product Hunt
      </span>
    </a>
  );
}
