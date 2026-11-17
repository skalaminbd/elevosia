"use client";

import { industries } from "@/content/home";
import { cn } from "@/lib/utils";

const PINS = [
  { x: 17, y: 75, delay: 0 },
  { x: 50, y: 30, delay: 0.6 },
  { x: 82, y: 60, delay: 1.2 },
];

export function FieldServicesPreview({ animated }: { animated: boolean }) {
  const { field } = industries.previews;

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="relative h-[196px] overflow-hidden rounded-lg border border-border bg-background">
        <div
          aria-hidden="true"
          className="line-grid absolute inset-0 opacity-70"
        />
        <p className="absolute top-3 left-3 text-xs text-muted-foreground">
          {field.routeLabel}
        </p>

        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 size-full"
        >
          <path
            d="M17 75 C 28 74 38 34 50 30 C 62 26 72 66 82 60"
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeDasharray={100}
            pathLength={100}
            vectorEffect="non-scaling-stroke"
            className={cn(
              "opacity-70",
              animated && "animate-[who-route_4500ms_ease-out_infinite]",
            )}
          />
        </svg>

        {PINS.map((pin) => (
          <span
            key={`${pin.x}-${pin.y}`}
            aria-hidden="true"
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          >
            <span
              className={cn(
                "absolute inset-0 rounded-full bg-primary/25",
                animated && "animate-[who-pin_1800ms_ease-out_infinite]",
              )}
              style={{ animationDelay: `${pin.delay}s` }}
            />
            <span className="relative block size-2 rounded-full bg-primary ring-2 ring-background" />
          </span>
        ))}
      </div>

      <ul className="flex flex-col gap-2">
        {field.jobs.map((job) => (
          <li
            key={job.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2.5"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {job.title}
              </p>
              <p className="text-xs text-muted-foreground">{job.meta}</p>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
                job.tone === "success"
                  ? "bg-success text-success-foreground"
                  : "bg-muted text-muted-foreground",
                job.tone === "success" &&
                  animated &&
                  "animate-[who-pop_4500ms_ease-out_infinite]",
              )}
            >
              {job.chip}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
