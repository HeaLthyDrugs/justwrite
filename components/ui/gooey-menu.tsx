"use client";

import React, { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import {
  MotionProps,
  MotionConfig,
  motion,
  AnimatePresence,
  Transition,
} from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Menu01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

const blurAni: MotionProps = {
  variants: {
    ini: { filter: "blur(4px)" },
    ani: { filter: "blur(0px)" },
    exit: { filter: "blur(4px)", opacity: 0 },
  },
  initial: "ini",
  animate: "ani",
  exit: "exit",
};

export interface MenuItem {
  icon: React.ReactElement;
  name: string;
  onClick?: () => void;
  pressed?: boolean;
}

interface GooeyMenuProps {
  items: MenuItem[];
  className?: string;
  filterId?: string;
  transition?: Transition;
  direction?: "left" | "right" | "top" | "bottom";
  triggerIcon?: React.ReactElement;
}

export function GooeyMenu({
  items,
  className,
  transition = { type: "spring", duration: 0.45, bounce: 0.2 },
  filterId: _fi = "gooey-menu-filter",
  direction = "top",
  triggerIcon,
}: GooeyMenuProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const id = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleClick(item: MenuItem) {
    setOpen(false);
    item.onClick?.();
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const axis = direction === "left" || direction === "right" ? "x" : "y";
  const dir = direction === "left" || direction === "top" ? -1 : 1;

  const fId = _fi || `gooey-menu-filter-${id}`;
  const mId = `${fId}-menu`;

  return (
    <MotionConfig transition={transition}>
      {/* Portal: Full Page Backdrop Blur Overlay rendered directly to body */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
                className="fixed inset-0 z-30 bg-black/30 dark:bg-black/55 backdrop-blur-md cursor-pointer"
              />
            )}
          </AnimatePresence>,
          document.body
        )}

      <div className="relative inline-block z-50">
        {/* Layer 1: Gooey SVG Filtered Buttons (No shadows) */}
        <div style={{ filter: `url(#${fId})` }}>
          <div
            id={mId}
            role="menu"
            aria-hidden={!open}
            className="absolute top-0 left-0 pointer-events-none"
          >
            <div className="relative size-9">
              {items.map((i, idx) => (
                <motion.button
                  key={idx}
                  type="button"
                  aria-label={i.name}
                  tabIndex={open ? 0 : -1}
                  role="menuitem"
                  custom={idx}
                  animate={{
                    [axis]: open
                      ? `calc(${100 * dir * (idx + 1)}% + ${dir * (idx + 1) * 10 + dir * 16}px)`
                      : 0,
                  }}
                  className={cn(
                    "absolute inset-0 flex size-9 cursor-pointer items-center justify-center rounded-full pointer-events-auto",
                    "border border-black/5 bg-transparent text-zinc-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] transition-all duration-300 ease-out hover:bg-black/5 hover:text-zinc-900 active:scale-95 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.18)] transform-gpu dark:border-white/10 dark:text-zinc-200 dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.18)] dark:hover:bg-white/10 dark:hover:text-white dark:active:shadow-[inset_0_1px_4px_rgba(255,255,255,0.22)]",
                    i.pressed ? "bg-black/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.18)] dark:bg-white/10 dark:shadow-[inset_0_2px_4px_rgba(255,255,255,0.22)]" : ""
                  )}
                  onClick={() => handleClick(i)}
                >
                  {i.icon}
                  <span className="sr-only">{i.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className={cn(
              "relative z-10 flex size-9 cursor-pointer items-center justify-center rounded-full border border-black/5 bg-transparent text-zinc-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] transition-all duration-300 ease-out hover:bg-black/5 hover:text-zinc-900 active:scale-95 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.18)] transform-gpu dark:border-white/10 dark:text-zinc-200 dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.18)] dark:hover:bg-white/10 dark:hover:text-white dark:active:shadow-[inset_0_1px_4px_rgba(255,255,255,0.22)]",
              className
            )}
            onClick={() => setOpen(!open)}
            aria-haspopup="true"
            aria-expanded={open}
            aria-controls={mId}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span {...blurAni} key={open ? "open" : "close"}>
                {open ? (
                  <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={1.6} />
                ) : (
                  triggerIcon || <HugeiconsIcon icon={Menu01Icon} size={16} strokeWidth={1.6} />
                )}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>

        {/* Layer 2: Crisp Animated Text Labels (Synchronized Motion) */}
        <div className="absolute top-0 left-0 pointer-events-none z-50">
          {items.map((i, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -8 }}
              animate={{
                [axis]: open
                  ? `calc(${100 * dir * (idx + 1)}% + ${dir * (idx + 1) * 10 + dir * 16}px)`
                  : 0,
                opacity: open ? 1 : 0,
                x: open ? 0 : -8,
              }}
              className="absolute top-0 left-11 flex items-center h-9 whitespace-nowrap pointer-events-none"
            >
              <span className="px-3 py-1 text-xs font-semibold text-zinc-800 dark:text-zinc-200 bg-white/95 dark:bg-zinc-900/95 border border-black/10 dark:border-white/15 rounded-full shadow-md backdrop-blur-md">
                {i.name}
              </span>
            </motion.div>
          ))}
        </div>

        <SvgFilter id={fId} />
      </div>
    </MotionConfig>
  );
}

function SvgFilter({ id }: { id: string }) {
  return (
    <svg
      style={{ position: "absolute", width: 0, height: 0 }}
      className="pointer-events-none"
    >
      <defs>
        <filter id={id}>
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation="3"
            result="blur-sm"
          />
          <feColorMatrix
            in="blur-sm"
            mode="matrix"
            values="
                  1 0 0 0 0  
                  0 1 0 0 0  
                  0 0 1 0 0  
                  0 0 0 18 -7
                "
            result="goo"
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
    </svg>
  );
}
