"use client";

import { useEffect, useState } from "react";
import { CheckCheck } from "lucide-react";
import { ai } from "@/content/home";

type Phase = "waiting" | "writing" | "sent";

/**
 * A lead gets a personal reply: the bubble types itself, sends, holds, resets.
 */
export function LeadReplyDemo({
  active,
  reduceMotion,
}: {
  active: boolean;
  reduceMotion: boolean;
}) {
  const [phase, setPhase] = useState<Phase>("waiting");
  const [typed, setTyped] = useState(0);
  const reply = ai.lead.reply;

  useEffect(() => {
    if (reduceMotion || !active) return;

    if (phase === "waiting") {
      const timer = window.setTimeout(() => setPhase("writing"), 1200);
      return () => window.clearTimeout(timer);
    }

    if (phase === "writing") {
      if (typed < reply.length) {
        const timer = window.setTimeout(() => setTyped((count) => count + 1), 24);
        return () => window.clearTimeout(timer);
      }
      const timer = window.setTimeout(() => setPhase("sent"), 400);
      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => {
      setTyped(0);
      setPhase("waiting");
    }, 4200);
    return () => window.clearTimeout(timer);
  }, [active, phase, typed, reply, reduceMotion]);

  const shown = reduceMotion ? reply : reply.slice(0, typed);
  const sent = reduceMotion || phase === "sent";
  const waiting = !reduceMotion && phase === "waiting";

  return (
    <div className="flex h-full flex-col justify-center gap-3">
      <div className="flex items-start gap-2">
        <span
          aria-hidden="true"
          className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground"
        >
          P
        </span>
        <p className="max-w-[85%] rounded-lg rounded-tl-sm bg-muted px-3 py-2 text-sm text-foreground">
          {ai.lead.incoming}
        </p>
      </div>

      <div className="flex flex-col items-end gap-1">
        <div className="max-w-[85%] rounded-lg rounded-tr-sm bg-primary px-3 py-2 text-sm text-primary-foreground">
          {waiting ? (
            <span className="flex items-center gap-1">
              <span className="sr-only">Ana is typing a reply</span>
              <span className="size-1.5 rounded-full bg-primary-foreground/60 motion-safe:animate-pulse" />
              <span className="size-1.5 rounded-full bg-primary-foreground/60 motion-safe:animate-pulse [animation-delay:150ms]" />
              <span className="size-1.5 rounded-full bg-primary-foreground/60 motion-safe:animate-pulse [animation-delay:300ms]" />
            </span>
          ) : (
            <>
              {shown}
              {!sent ? (
                <span aria-hidden="true" className="animate-blink-cursor">
                  |
                </span>
              ) : null}
            </>
          )}
        </div>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          {sent ? (
            <CheckCheck className="size-3 text-success" aria-hidden="true" />
          ) : null}
          {sent ? "Sent" : "Replying now"}
          <span aria-hidden="true">·</span>
          {ai.lead.sender}
        </span>
      </div>
    </div>
  );
}
