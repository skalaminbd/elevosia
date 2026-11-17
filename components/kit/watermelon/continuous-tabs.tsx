// Source: https://ui.watermelon.sh (adapted to Elevosia tokens)
"use client";

import { useState } from "react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type ContinuousTab = {
  id: string;
  label: string;
};

type ContinuousTabsProps = {
  tabs: readonly ContinuousTab[];
  activeId?: string;
  defaultActiveId?: string;
  onChange?: (id: string) => void;
  className?: string;
};

/**
 * Sliding-pill tab switch. Layout animation only, so the row never shifts.
 */
export function ContinuousTabs({
  tabs,
  activeId,
  defaultActiveId,
  onChange,
  className,
}: ContinuousTabsProps) {
  const reduceMotion = useReducedMotion();
  const [internalId, setInternalId] = useState(defaultActiveId ?? tabs[0]?.id);
  const active = activeId ?? internalId;

  const handleChange = (id: string) => {
    setInternalId(id);
    onChange?.(id);
  };

  return (
    <LayoutGroup>
      <div
        role="group"
        className={cn(
          "inline-flex items-center gap-1 rounded-full border border-border bg-card p-1 shadow-sm",
          className,
        )}
      >
        {tabs.map((tab) => {
          const isActive = active === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => handleChange(tab.id)}
              className="relative rounded-full px-3 py-1.5 text-sm font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {isActive ? (
                <motion.span
                  layoutId="continuous-tabs-pill"
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 380, damping: 30, mass: 0.9 }
                  }
                />
              ) : null}
              <span
                className={cn(
                  "relative z-10",
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
