"use client";

import { cn } from "@/lib/utils";

const CARDS = [
  {
    id: "saas",
    name: "SaaS that almost fits",
    note: "Priced per seat, forever",
    animation: "animate-[about-option-left_6000ms_ease-out_infinite]",
  },
  {
    id: "agency",
    name: "A big agency build",
    note: "Priced for companies 10x your size",
    animation: "animate-[about-option-right_6000ms_ease-out_infinite]",
  },
];

/**
 * Chapter 2 item: the two bad options pull apart and a third option appears
 * between them, on a loop.
 */
export function ThreeOptions({
  active,
  reduceMotion,
}: {
  active: boolean;
  reduceMotion: boolean;
}) {
  const looping = active && !reduceMotion;

  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-3">
      <div
        className={cn(
          "w-full rounded-lg border border-border bg-background px-4 py-3",
          looping && CARDS[0].animation,
        )}
      >
        <p className="text-sm font-medium text-muted-foreground">
          {CARDS[0].name}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">{CARDS[0].note}</p>
      </div>

      <div
        className={cn(
          "w-full rounded-lg border border-primary bg-primary px-4 py-3 text-primary-foreground shadow-sm",
          looping && "animate-[about-option-mid_6000ms_ease-out_infinite]",
          reduceMotion && "opacity-100",
        )}
      >
        <p className="text-sm font-semibold">Elevosia</p>
        <p className="mt-0.5 text-xs text-primary-foreground/80">
          Built from proven modules, fixed price
        </p>
      </div>

      <div
        className={cn(
          "w-full rounded-lg border border-border bg-background px-4 py-3",
          looping && CARDS[1].animation,
        )}
      >
        <p className="text-sm font-medium text-muted-foreground">
          {CARDS[1].name}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">{CARDS[1].note}</p>
      </div>
    </div>
  );
}
