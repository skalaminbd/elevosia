"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Progress } from "@/components/admin/ui/Progress";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { portalProjects } from "@/lib/portal-data";
import { cn } from "@/lib/utils";

const FILTERS = ["Active", "Completed", "On hold"] as const;

export function PortalProjectsList() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Active");
  const rows = portalProjects.filter((project) => project.status === filter);

  return (
    <div>
      <div className="flex items-center gap-1 rounded-lg bg-secondary p-1 w-fit">
        {FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            aria-pressed={filter === item}
            className={cn(
              "h-8 rounded-md px-3 text-xs font-medium transition-colors",
              filter === item
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {rows.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-10 text-center md:col-span-2">
            <p className="text-sm font-medium">No {filter.toLowerCase()} projects.</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Everything else is in the other tabs.
            </p>
          </div>
        ) : (
          rows.map((project) => (
            <Link
              key={project.id}
              href={`/portal/projects/${project.id}`}
              className="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/30"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{project.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{project.phase}</p>
                </div>
                <StatusBadge tone={project.health === "On track" ? "success" : "warning"}>
                  {project.health}
                </StatusBadge>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <Progress
                  className="flex-1"
                  value={project.progress}
                  tone={project.progress === 100 ? "success" : "primary"}
                />
                <span className="w-9 shrink-0 text-right font-mono text-[10px] text-muted-foreground">
                  {project.progress}%
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>
                  {project.start} → {project.end}
                </span>
                <span className="inline-flex items-center gap-1 font-medium text-primary">
                  Open project
                  <ArrowUpRight className="size-3" aria-hidden="true" />
                </span>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                {project.nextMilestone}
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
