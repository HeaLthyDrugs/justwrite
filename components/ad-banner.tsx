"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AdBannerProps {
  /** Google AdSense Ad Slot ID (optional, created in AdSense console) */
  slot?: string;
  /** Ad format type */
  format?: "auto" | "fluid" | "horizontal" | "rectangle" | "vertical";
  /** Whether ad is responsive */
  responsive?: boolean;
  /** Layout key for in-feed / native ads */
  layoutKey?: string;
  /** Custom CSS classes */
  className?: string;
  /** Whether to show a subtle "Advertisement" label above the ad */
  showLabel?: boolean;
}

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export function AdBanner({
  slot,
  format = "auto",
  responsive = true,
  layoutKey,
  className,
  showLabel = true,
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement | null>(null);
  const isPushedRef = useRef(false);

  useEffect(() => {
    // Only attempt to push if the ad unit hasn't been initialized yet
    if (isPushedRef.current) return;

    try {
      if (adRef.current && !adRef.current.getAttribute("data-adsbygoogle-status")) {
        isPushedRef.current = true;
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      // AdSense push may fail gracefully if an ad blocker is running or during fast navigation
      if (process.env.NODE_ENV === "development") {
        console.debug("AdSense push:", err);
      }
    }
  }, []);

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-2xl border border-black/8 bg-black/[0.02] p-3 text-center dark:border-white/10 dark:bg-white/[0.02]",
        className
      )}
    >
      {showLabel && (
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-600 dark:text-zinc-300">
          Advertisement
        </div>
      )}
      <div className="flex min-h-[90px] max-h-[300px] w-full items-center justify-center overflow-hidden">
        <ins
          ref={adRef}
          className="adsbygoogle block w-full text-center"
          style={{ display: "block" }}
          data-ad-client="ca-pub-3459385721774517"
          {...(slot ? { "data-ad-slot": slot } : {})}
          data-ad-format={format}
          data-full-width-responsive={responsive ? "true" : "false"}
          {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
        />
      </div>
    </div>
  );
}
