"use client";

import { useState } from "react";
import { FilterDisclosure } from "@/components/shared/FilterDisclosure";
import { CheckCircle2, PauseCircle, PlayCircle } from "lucide-react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Progress } from "@/components/admin/ui/Progress";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import type { PortalProject } from "@/lib/portal-data";

const STATUS_OPTIONS = [
  { id: "Active", label: "Active", icon: PlayCircle },
  { id: "Completed", label: "Completed", icon: CheckCircle2 },
  { id: "On hold", label: "On hold", icon: PauseCircle },
];

export function PortalProjectsList({
  projects,
}: {
  projects: PortalProject[];
}) {
  const [statuses, setStatuses] = useState<string[]>([]);

  const rows = projects.filter(
    (project) =>
      statuses.length === 0 || statuses.includes(project.status),
  );

  return (
    <div>
            <div className="w-fit">
        <FilterDisclosure
          label="Filter"
          values={statuses}
          options={STATUS_OPTIONS}
          onChange={setStatuses}
        />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {rows.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-10 text-center md:col-span-2">
            <p className="text-sm font-medium">No projects match that filter.</p>
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
