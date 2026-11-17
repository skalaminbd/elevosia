"use client";

import { industries } from "@/content/home";
import { CountUp } from "@/components/home/who-previews/CountUp";
import { cn } from "@/lib/utils";

export function AgenciesPreview({ animated }: { animated: boolean }) {
  const { agencies } = industries.previews;

  return (
    <div className="flex h-full flex-col gap-6">
      <div>
        <p className="text-xs text-muted-foreground">{agencies.label}</p>
        <p className="mt-1 flex flex-wrap items-baseline gap-2">
          <span className="font-heading text-4xl font-bold text-foreground">
            <CountUp value={agencies.hours} />
          </span>
          <span className="text-sm text-muted-foreground">
            {agencies.suffix}
          </span>
        </p>
      </div>

      <ul className="flex flex-col gap-4">
        {agencies.projects.map((project, index) => (
          <li key={project.id}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-medium text-foreground">{project.name}</span>
              <span className="flex items-center gap-2">
                {project.chip ? (
                  <span
                    className={cn(
                      "rounded-full bg-success px-2 py-0.5 text-xs font-medium text-success-foreground",
                      animated && "animate-[who-pop_4500ms_ease-out_infinite]",
                    )}
                  >
                    {project.chip}
                  </span>
                ) : null}
                <span className="text-xs tabular-nums text-muted-foreground">
                  {project.pct}%
                </span>
              </span>
            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full origin-left rounded-full bg-primary",
                  animated && "animate-[who-grow-x_4500ms_ease-out_infinite]",
                )}
                style={{
                  width: `${project.pct}%`,
                  opacity: 1 - index * 0.18,
                  animationDelay: `${index * 150}ms`,
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
