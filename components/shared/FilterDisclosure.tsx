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
}: {
  values: string[];
  options: FilterOption[];
  onChange: (values: string[]) => void;
  label?: string;
  className?: string;
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
        className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
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
            className="absolute right-0 z-50 mt-2 flex w-64 flex-col gap-2 overflow-hidden rounded-[16px] border border-border bg-popover p-2 text-popover-foreground shadow-md"
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
                    "flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left transition-colors",
                    selected
                      ? "bg-secondary/70 text-foreground"
                      : "text-foreground hover:bg-secondary/50",
                  )}
                >
                  <Icon
                    className="size-5 shrink-0 text-muted-foreground"
                    strokeWidth={1.9}
                    aria-hidden="true"
                  />
                  <span className="flex-1 truncate text-sm font-medium">
                    {option.label}
                  </span>
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                      selected
                        ? "border-success bg-success text-success-foreground"
                        : "border-muted-foreground/40 bg-transparent",
                    )}
                  >
                    {selected ? (
                      <Check
                        className="size-3.5"
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
