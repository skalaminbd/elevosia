"use client";

import { motion } from "motion/react";
import { useTokenColor } from "@/hooks/use-token-color";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { FlickeringGrid } from "@/components/ui/flickering-grid";

/**
 * A small dashboard card drifting in the background of the 404. Faint grid on
 * desktop only; both stop for reduced motion.
 */
export function NotFoundArt() {
  const reduceMotion = useReducedMotion();
  const gridColor = useTokenColor("--primary");

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {!reduceMotion && gridColor ? (
        <div className="absolute -inset-x-10 top-0 bottom-0 opacity-10 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]">
          <FlickeringGrid
            color={gridColor}
            squareSize={3}
            gridGap={7}
            flickerChance={0.22}
            maxOpacity={0.5}
            className="size-full"
          />
        </div>
      ) : null}

      <motion.div
        className="absolute top-[18%] left-[6%] hidden w-40 rounded-lg border border-border bg-card p-3 shadow-sm lg:block"
        animate={
          reduceMotion
            ? undefined
            : { y: [0, -10, 0], rotate: [-2, 1.5, -2] }
        }
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      >
        <p className="text-[9px] text-muted-foreground">Open shifts</p>
        <p className="font-mono text-xl font-semibold">3</p>
        <div className="mt-2 flex h-8 items-end gap-1">
          {[40, 65, 50, 80, 60, 90].map((height, index) => (
            <span
              key={index}
              className="flex-1 rounded-t-sm bg-primary/30"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </motion.div>

      <motion.div
        className="absolute right-[7%] bottom-[14%] hidden w-36 rounded-lg border border-border bg-card p-3 shadow-sm lg:block"
        animate={
          reduceMotion
            ? undefined
            : { y: [0, 12, 0], rotate: [2, -1.5, 2] }
        }
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      >
        <p className="text-[9px] text-muted-foreground">This week</p>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="font-mono text-sm font-semibold">2/5</span>
          <span className="size-2 rounded-full bg-success" />
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-secondary">
          <span className="block h-full w-2/5 rounded-full bg-primary" />
        </div>
      </motion.div>
    </div>
  );
}
