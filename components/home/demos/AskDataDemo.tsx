"use client";

import { motion } from "motion/react";
import { Search } from "lucide-react";
import { ai } from "@/content/home";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { useLoopStep } from "@/hooks/use-in-view-loop";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * The question types itself, then the bars grow and the winner is highlighted.
 * The whole card replays on a slow loop.
 */
export function AskDataDemo({
  active,
  reduceMotion,
}: {
  active: boolean;
  reduceMotion: boolean;
}) {
  const round = useLoopStep(2, { active: active && !reduceMotion, intervalMs: 11000 });

  return (
    <div key={round} className="flex flex-col gap-4">
      <div className="flex items-start gap-2">
        <Search className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <p className="text-sm text-foreground">
          {reduceMotion ? (
            ai.data.question
          ) : (
            <TypingAnimation duration={38} showCursor blinkCursor>
              {ai.data.question}
            </TypingAnimation>
          )}
        </p>
      </div>

      <ul className="flex flex-col gap-2">
        {ai.data.bars.map((bar, index) => {
          const isHighlight = bar.label === ai.data.highlight;

          return (
            <li
              key={bar.label}
              className="grid grid-cols-[6rem_1fr_2.5rem] items-center gap-2 text-xs"
            >
              <span
                className={cn(
                  "truncate",
                  isHighlight ? "font-medium text-foreground" : "text-muted-foreground",
                )}
              >
                {bar.label}
              </span>
              <span className="h-2 overflow-hidden rounded-full bg-muted">
                <motion.span
                  className={cn(
                    "block h-full origin-left rounded-full",
                    isHighlight ? "bg-highlight" : "bg-success/70",
                  )}
                  style={{ width: `${bar.value}%` }}
                  initial={reduceMotion ? false : { scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: 0.55,
                    ease: EASE,
                    delay: reduceMotion ? 0 : 1.4 + index * 0.1,
                  }}
                />
              </span>
              <span
                className={cn(
                  "text-right font-mono",
                  isHighlight ? "font-medium text-foreground" : "text-muted-foreground",
                )}
              >
                {bar.display}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
