"use client";

import { Check } from "lucide-react";
import { industries } from "@/content/home";
import { cn } from "@/lib/utils";

export function CarePreview({ animated }: { animated: boolean }) {
  const { care } = industries.previews;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3 text-xs">
        <p className="font-medium text-foreground">{care.heading}</p>
        <p className="text-muted-foreground">{care.caregivers}</p>
      </div>

      <ul className="mt-4 flex flex-col gap-2">
        {care.visits.map((visit, index) => (
          <li
            key={visit.id}
            className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2.5"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
              {visit.initials}
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {visit.name}
              </p>
              <p className="text-xs text-muted-foreground">{visit.time}</p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <span className="relative flex size-2 items-center justify-center">
                {animated ? (
                  <span
                    className="absolute inset-0 animate-[who-status-ring_4500ms_ease-out_infinite] rounded-full bg-success"
                    style={{ animationDelay: `${index * 0.6}s` }}
                  />
                ) : null}
                <span
                  className={cn(
                    "size-2 rounded-full",
                    animated
                      ? "animate-[who-status-dot_4500ms_ease-in-out_infinite]"
                      : "bg-success",
                  )}
                  style={{ animationDelay: `${index * 0.6}s` }}
                />
              </span>
              <span
                className={cn(
                  "text-xs font-medium text-success",
                  animated &&
                    "animate-[who-checked_4500ms_ease-in-out_infinite]",
                )}
                style={{ animationDelay: `${index * 0.6}s` }}
              >
                {care.statusLabel}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <span
        className={cn(
          "mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-success px-3 py-1.5 text-xs font-medium text-success-foreground",
          animated && "animate-[who-pop_4500ms_ease-out_infinite]",
        )}
      >
        <Check className="size-3.5" aria-hidden="true" />
        {care.banner}
      </span>
    </div>
  );
}
