"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { ai } from "@/content/home";
import { useLoopStep } from "@/hooks/use-in-view-loop";

/**
 * Open shifts, then the right person slides into each slot and snaps.
 */
export function ShiftMatchDemo({
  active,
  reduceMotion,
}: {
  active: boolean;
  reduceMotion: boolean;
}) {
  const step = useLoopStep(4, { active: active && !reduceMotion, intervalMs: 1700 });
  const filled = reduceMotion ? ai.scheduling.slots.length : Math.min(step, 2);

  return (
    <div className="flex flex-col gap-2">
      {ai.scheduling.slots.map((slot, index) => {
        const match = ai.scheduling.matches[index];
        const isFilled = filled > index;

        return (
          <div
            key={slot.id}
            className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5"
          >
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">{slot.label}</p>
              <p className="font-mono text-sm text-foreground">{slot.hours}</p>
            </div>

            <div className="flex w-32 justify-end">
              <AnimatePresence initial={false} mode="wait">
                {isFilled ? (
                  <motion.div
                    key="matched"
                    initial={reduceMotion ? false : { x: -28, opacity: 0, scale: 0.92 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 420, damping: 26 }}
                    className="flex items-center gap-2 rounded-full bg-accent px-2 py-1"
                  >
                    <span
                      aria-hidden="true"
                      className="flex size-6 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground"
                    >
                      {match.initials}
                    </span>
                    <span className="text-xs font-medium text-accent-foreground">
                      {match.name}
                    </span>
                    <Check className="size-3 text-success" aria-hidden="true" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="open"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-8 w-28 rounded-full border border-dashed border-border"
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}
