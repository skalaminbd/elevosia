"use client";

import { motion } from "motion/react";
import { PageClosing } from "@/components/shared/PageClosing";
import { aiClosing } from "@/content/ai-automation";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/** Closing band with the hourglass flipping on a slow loop. */
export function AiClosing() {
  return (
    <PageClosing
      title={aiClosing.title}
      body={aiClosing.body}
      primary={aiClosing.primary}
      secondary={aiClosing.secondary}
      visual={<Hourglass />}
    />
  );
}

function Hourglass() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="mx-auto flex w-full max-w-[220px] items-center justify-center">
      <motion.svg
        viewBox="0 0 100 130"
        className="h-44 w-full"
        role="img"
        aria-label="An hourglass"
        animate={reduceMotion ? undefined : { rotate: [0, 0, 180, 180, 0] }}
        transition={
          reduceMotion
            ? undefined
            : {
                duration: 10,
                times: [0, 0.4, 0.5, 0.9, 1],
                repeat: Infinity,
                ease: "easeInOut",
              }
        }
      >
        <path
          d="M22 10h56M22 120h56"
          stroke="var(--color-highlight)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M28 10c0 24 22 34 22 55 0-21 22-31 22-55"
          fill="none"
          stroke="var(--color-highlight)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M28 120c0-24 22-34 22-55 0 21 22 31 22 55"
          fill="none"
          stroke="var(--color-highlight)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M38 111c0-10 8-14 12-20 4 6 12 10 12 20z"
          fill="var(--color-highlight)"
          opacity="0.9"
        />
        <circle cx="50" cy="93" r="1.6" fill="var(--color-highlight)" />
        <circle cx="50" cy="100" r="1.2" fill="var(--color-highlight)" opacity="0.7" />
      </motion.svg>
    </div>
  );
}
