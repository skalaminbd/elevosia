"use client";

import { industries } from "@/content/home";
import { CountUp } from "@/components/home/who-previews/CountUp";
import { cn } from "@/lib/utils";

export function NonprofitsPreview({ animated }: { animated: boolean }) {
  const { nonprofits } = industries.previews;
  const lastBar = nonprofits.bars.length - 1;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground">{nonprofits.label}</p>
          <p className="mt-1 font-heading text-4xl font-bold text-foreground">
            <CountUp value={nonprofits.members} />
          </p>
        </div>
        <p className="max-w-44 text-right text-xs text-muted-foreground">
          {nonprofits.chartLabel}
        </p>
      </div>

      <div className="mt-6 flex h-[120px] items-end gap-2">
        {nonprofits.bars.map((bar, index) => (
          <div key={bar.month} className="flex h-full flex-1 items-end">
            <div
              className={cn(
                "w-full origin-bottom rounded-t-sm bg-primary",
                animated && "animate-[who-grow-y_4500ms_ease-out_infinite]",
              )}
              style={{
                height: `${bar.pct}%`,
                opacity: 0.4 + (index / lastBar) * 0.6,
                animationDelay: `${index * 80}ms`,
              }}
            />
          </div>
        ))}
      </div>

      <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
        {nonprofits.bars.map((bar) => (
          <span key={bar.month} className="flex-1 text-center">
            {bar.month}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
        <p className="text-xs text-muted-foreground">
          {nonprofits.volunteersLabel}
        </p>
        <div className="flex items-center">
          {nonprofits.volunteers.map((initials, index) => (
            <span
              key={initials}
              className={cn(
                "flex size-7 items-center justify-center rounded-full border-2 border-card bg-muted text-[10px] font-semibold text-muted-foreground",
                index > 0 && "-ml-2",
                animated && "animate-[who-pop-in_4500ms_ease-out_infinite]",
              )}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {initials}
            </span>
          ))}
          <span className="ml-2 text-xs font-medium text-foreground">
            {nonprofits.volunteerExtra}
          </span>
        </div>
      </div>
    </div>
  );
}
