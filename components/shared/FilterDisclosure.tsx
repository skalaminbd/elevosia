"use client";

/**
 * Source: https://ui.watermelon.sh/r/filter-disclosure.json
 * (adapted to Elevosia tokens, lucide icons, motion/react and multi-select)
 */

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown, Funnel, type LucideIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

export type FilterOption = {
  id: string;
  label: string;
  icon: LucideIcon;
};

export function FilterDisclosure({
  values,
  options,
  onChange,
  label = "Filter",
  className,
  compact = false,
}: {
  values: string[];
  options: FilterOption[];
  onChange: (values: string[]) => void;
  label?: string;
  className?: string;
  /** Toolbar-sized trigger with a tighter popover. */
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const count = values.length;

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function toggle(id: string) {
    onChange(
      values.includes(id)
        ? values.filter((value) => value !== id)
        : [...values, id],
    );
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((current) => !current)}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "gap-2",
          compact && "h-8 px-3 text-sm",
        )}
      >
        <Funnel className="size-4 text-muted-foreground" aria-hidden="true" />
        <span>{label}</span>
        {count > 0 ? (
          <span className="flex size-5 items-center justify-center rounded-full bg-primary font-mono text-[10px] font-semibold text-primary-foreground">
            {count}
          </span>
        ) : null}
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            role="listbox"
            aria-multiselectable="true"
            aria-label={label}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.97, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.97, y: -6 }}
            transition={{ duration: reduceMotion ? 0 : 0.18, ease: "easeOut" }}
            className={cn(
              "absolute right-0 z-50 mt-1 flex flex-col overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-md",
              compact ? "w-52 gap-0.5 p-1.5" : "w-64 gap-2 rounded-[16px] p-2",
            )}
          >
            {options.map((option, index) => {
              const Icon = option.icon;
              const selected = values.includes(option.id);
              return (
                <motion.button
                  key={option.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => toggle(option.id)}
                  initial={reduceMotion ? false : { opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.16,
                    delay: reduceMotion ? 0 : index * 0.03,
                  }}
                  className={cn(
                    "flex w-full items-center rounded-[10px] text-left transition-colors",
                    compact ? "gap-2 px-2 py-1.5" : "gap-3 px-3 py-2.5",
                    selected
                      ? "bg-secondary/70 text-foreground"
                      : "text-foreground hover:bg-secondary/50",
                  )}
                >
                  <Icon
                    className={cn(
                      "shrink-0 text-muted-foreground",
                      compact ? "size-4" : "size-5",
                    )}
                    strokeWidth={1.9}
                    aria-hidden="true"
                  />
                  <span
                    className={cn(
                      "flex-1 truncate font-medium",
                      compact ? "text-xs" : "text-sm",
                    )}
                  >
                    {option.label}
                  </span>
                  <span
                    className={cn(
                      "flex shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                      compact ? "size-5" : "size-6",
                      selected
                        ? "border-success bg-success text-success-foreground"
                        : "border-muted-foreground/40 bg-transparent",
                    )}
                  >
                    {selected ? (
                      <Check
                        className={compact ? "size-3" : "size-3.5"}
                        strokeWidth={3.5}
                        aria-hidden="true"
                      />
                    ) : null}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
