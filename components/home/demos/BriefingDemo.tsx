"use client";

import { useEffect, useState } from "react";
import { CalendarClock, MessageSquare, Receipt } from "lucide-react";
import { ai } from "@/content/home";
import { AnimatedList } from "@/components/ui/animated-list";

const ICONS = {
  invoices: Receipt,
  shift: CalendarClock,
  leads: MessageSquare,
} as const;

type BriefingItemId = keyof typeof ICONS;

function isBriefingItemId(value: string): value is BriefingItemId {
  return value in ICONS;
}

function BriefingRow({
  id,
  text,
  meta,
}: {
  id: string;
  text: string;
  meta: string;
}) {
  const Icon = isBriefingItemId(id) ? ICONS[id] : Receipt;

  return (
    <div className="flex w-full items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-highlight/20 text-highlight-foreground">
        <Icon className="size-3.5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-foreground">
          {text}
        </span>
        <span className="block text-xs text-muted-foreground">{meta}</span>
      </span>
    </div>
  );
}

/**
 * Briefing items keep arriving, then the queue starts over.
 */
export function BriefingDemo({
  active,
  reduceMotion,
}: {
  active: boolean;
  reduceMotion: boolean;
}) {
  const [round, setRound] = useState(0);
  const items = ai.briefing.items;

  useEffect(() => {
    if (!active || reduceMotion) return;
    const id = window.setInterval(
      () => setRound((current) => current + 1),
      items.length * 1000 + 2600,
    );
    return () => window.clearInterval(id);
  }, [active, reduceMotion, items.length]);

  if (reduceMotion) {
    return (
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <BriefingRow key={item.id} {...item} />
        ))}
      </div>
    );
  }

  return (
    <AnimatedList key={round} delay={1000} className="gap-2">
      {items.map((item) => (
        <BriefingRow key={item.id} {...item} />
      ))}
    </AnimatedList>
  );
}
