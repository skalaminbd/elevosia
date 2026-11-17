"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const ROWS = [
  { client: "Sample Co.", due: "12 Mar", owner: "A", sent: "yes" },
  { client: "Sample Ltd.", due: "14 Mar", owner: "—", sent: "no" },
  { client: "Sample LLC", due: "14 Mar", owner: "B", sent: "yes" },
  { client: "Sample Inc.", due: "??", owner: "—", sent: "no" },
  { client: "Sample Group", due: "21 Mar", owner: "A", sent: "no" },
];

/**
 * The hero item: one browser window that flips between the polished website and
 * the spreadsheet behind it. Sample data.
 */
export function BrowserFlip({
  active,
  reduceMotion,
}: {
  active: boolean;
  reduceMotion: boolean;
}) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (!active || reduceMotion) return;
    const timer = window.setInterval(() => setFlipped((value) => !value), 4200);
    return () => window.clearInterval(timer);
  }, [active, reduceMotion]);

  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-sm">
      <div className="flex items-center gap-1.5 border-b border-border pb-2.5">
        <span className="size-2 rounded-full bg-muted-foreground/25" />
        <span className="size-2 rounded-full bg-muted-foreground/25" />
        <span className="size-2 rounded-full bg-muted-foreground/25" />
        <span className="mx-2 flex h-5 flex-1 items-center rounded-full bg-muted px-2 font-mono text-[10px] text-muted-foreground">
          elevosia.com
        </span>
      </div>

      <div className="relative mt-3 h-64 [perspective:1200px] sm:h-72">
        <div
          className={cn(
            "relative h-full w-full transition-transform duration-700 ease-out [transform-style:preserve-3d]",
            flipped && "[transform:rotateY(180deg)]",
          )}
        >
          {/* Front: what customers see */}
          <div className="absolute inset-0 flex flex-col justify-between rounded-lg border border-border bg-background p-4 [backface-visibility:hidden]">
            <div className="flex items-center justify-between">
              <span className="font-heading text-sm font-bold text-foreground">
                Your business
              </span>
              <span className="h-6 w-16 rounded-full bg-primary" />
            </div>
            <div>
              <p className="font-heading text-xl font-bold text-foreground sm:text-2xl">
                Book a visit in 30 seconds.
              </p>
              <p className="mt-2 max-w-xs text-xs text-muted-foreground">
                Clean pages and clear calls to action. Every form lands in the
                dashboard.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((cell) => (
                <span key={cell} className="h-10 rounded-md bg-muted" />
              ))}
            </div>
          </div>

          {/* Back: what was actually running things */}
          <div className="absolute inset-0 overflow-hidden rounded-lg border border-border bg-card [transform:rotateY(180deg)] [backface-visibility:hidden]">
            <div className="grid grid-cols-4 gap-2 border-b border-border bg-muted/70 px-3 py-2 text-[10px] font-medium text-muted-foreground">
              <span>Client</span>
              <span>Due</span>
              <span>Owner</span>
              <span>Sent</span>
            </div>
            {ROWS.map((row) => (
              <div
                key={row.client}
                className="grid grid-cols-4 gap-2 border-b border-border/60 px-3 py-2 font-mono text-[10px] text-foreground/70"
              >
                <span className="truncate">{row.client}</span>
                <span className={cn(row.due === "??" && "text-warning")}>
                  {row.due}
                </span>
                <span className={cn(row.owner === "—" && "text-warning")}>
                  {row.owner}
                </span>
                <span className={cn(row.sent === "no" && "text-warning")}>
                  {row.sent}
                </span>
              </div>
            ))}
            <p className="px-3 py-2 text-[10px] text-muted-foreground">
              v7 (final) · last edited 3 weeks ago
            </p>
          </div>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        The site your customers see, and what sits behind it. Sample data.
      </p>
    </div>
  );
}
