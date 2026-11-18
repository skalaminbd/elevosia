"use client";

import { Check, FileText, MessageSquare, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { NumberTicker } from "@/components/ui/number-ticker";
import { cn } from "@/lib/utils";

/**
 * The small live signal beside each milestone. It only starts animating once
 * you have reached that step, and stays static under reduced motion.
 */
export function MilestoneGlyph({
  id,
  active,
  reduceMotion,
}: {
  id: string;
  active: boolean;
  reduceMotion: boolean;
}) {
  const live = active && !reduceMotion;

  if (id === "day-1") {
    return (
      <span className="flex h-8 items-center gap-1.5 rounded-full bg-accent px-2.5 text-accent-foreground">
        <FileText className="size-3.5" aria-hidden="true" />
        <motion.span
          className="block h-3 w-0.5 rounded-full bg-current"
          animate={live ? { opacity: [1, 0, 1] } : { opacity: 0.7 }}
          transition={{ duration: 1.4, repeat: live ? Infinity : 0 }}
        />
      </span>
    );
  }

  if (id === "day-2-5") {
    return (
      <span className="relative flex size-8 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <MessageSquare className="size-3.5" aria-hidden="true" />
        <motion.span
          className="absolute -top-1 -right-1 flex size-3.5 items-center justify-center rounded-full bg-highlight text-[8px] font-bold text-highlight-foreground"
          animate={live ? { scale: [0.6, 1.15, 1], opacity: [0.3, 1, 1] } : { scale: 1, opacity: 1 }}
          transition={{ duration: 2.4, repeat: live ? Infinity : 0 }}
        >
          2
        </motion.span>
      </span>
    );
  }

  if (id === "day-5") {
    return (
      <span className="flex h-8 items-center rounded-full bg-accent px-2 font-mono text-[10px] font-semibold text-accent-foreground">
        $
        {live ? (
          <NumberTicker value={16000} className="text-[10px] font-semibold" />
        ) : (
          "16,000"
        )}
      </span>
    );
  }

  if (id === "week-1") {
    return (
      <span className="flex size-8 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <svg viewBox="0 0 24 10" className="h-2.5 w-4" aria-hidden="true">
          <path
            d="M1 7c3-5 5-5 7 0s4 3 6-1 4-3 5 1"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={100}
            className={cn(live && "animate-[hiw-sign_4000ms_ease-in-out_infinite]")}
            style={{ strokeDashoffset: live ? undefined : 0 }}
          />
        </svg>
      </span>
    );
  }

  if (id === "week-2-9") {
    return (
      <span className="flex size-8 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <span className="flex flex-col gap-1">
          {[0, 1, 2].map((line) => (
            <motion.span
              key={line}
              className="block h-0.5 w-3.5 origin-left rounded-full bg-current"
              animate={live ? { scaleX: [0.3, 1, 1] } : { scaleX: 1 }}
              transition={{
                duration: 2.8,
                repeat: live ? Infinity : 0,
                delay: line * 0.35,
              }}
            />
          ))}
        </span>
      </span>
    );
  }

  if (id === "week-10") {
    return (
      <span className="flex h-8 items-center gap-1.5 rounded-full bg-accent px-2.5 text-[10px] font-medium text-accent-foreground">
        <span
          className={cn(
            "size-1.5 rounded-full bg-success",
            live && "animate-[who-blink_1600ms_ease-in-out_infinite]",
          )}
        />
        Live
      </span>
    );
  }

  return (
    <span className="relative flex size-8 items-center justify-center rounded-full bg-accent text-accent-foreground">
      <ShieldCheck
        className={cn("size-3.5", live && "motion-safe:animate-pulse-soft")}
        aria-hidden="true"
      />
      <Check
        className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full bg-success text-success-foreground"
        aria-hidden="true"
      />
    </span>
  );
}
