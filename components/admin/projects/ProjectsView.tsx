"use client";

import { useState } from "react";
import Link from "next/link";
import { GanttChartSquare, GripVertical, LayoutList, Columns3 } from "lucide-react";
import { Avatar } from "@/components/admin/ui/Avatar";
import { Progress } from "@/components/admin/ui/Progress";
import { StatusBadge, type BadgeTone } from "@/components/admin/ui/StatusBadge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/admin/ui/Table";
import type { AdminProject, ProjectHealth } from "@/lib/admin-data";
import { NativeSelect } from "@/components/shared/NativeSelect";
import { cn } from "@/lib/utils";

const VIEWS = [
  { id: "list", label: "List", icon: LayoutList },
  { id: "board", label: "Board", icon: Columns3 },
  { id: "timeline", label: "Timeline", icon: GanttChartSquare },
] as const;

type View = (typeof VIEWS)[number]["id"];

const HEALTH: Record<ProjectHealth, BadgeTone> = {
  "On track": "success",
  "At risk": "warning",
  Late: "danger",
};

const COLUMNS = ["Planning", "Building", "Review", "Live", "On hold"];

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

/** Projects with list, board and timeline views. */
export function ProjectsView({ projects: initialProjects }: { projects: AdminProject[] }) {
  const [view, setView] = useState<View>("list");
  const [projects, setProjects] = useState<AdminProject[]>(initialProjects);

  const rows = projects;

  function moveProject(id: string, status: string) {
    setProjects((current) =>
      current.map((project) =>
        project.id === id ? { ...project, status } : project,
      ),
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex items-center gap-1 rounded-lg bg-secondary p-1">
          {VIEWS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setView(item.id)}
                aria-pressed={view === item.id}
                className={cn(
                  "flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-medium transition-colors",
                  view === item.id
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-3.5" aria-hidden="true" />
                {item.label}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          {rows.length} projects · live data
        </p>
      </div>

      {view === "list" ? <ListView projects={rows} /> : null}
      {view === "board" ? (
        <BoardView projects={rows} onMove={moveProject} />
      ) : null}
      {view === "timeline" ? <TimelineView projects={rows} /> : null}
    </div>
  );
}

function ListView({ projects }: { projects: AdminProject[] }) {
  return (
    <>
      <ul className="divide-y divide-border md:hidden">
        {projects.map((project) => (
          <li key={project.id} className="px-4 py-3.5">
            <div className="flex items-start gap-3">
              <Avatar initials={initials(project.client)} />
              <div className="min-w-0 flex-1">
                <Link
                  href={`/admin/projects/${project.id}`}
                  className="truncate text-sm font-medium hover:underline"
                >
                  {project.name}
                </Link>
                <p className="truncate text-xs text-muted-foreground">
                  {project.client}
                </p>
              </div>
              <StatusBadge tone={HEALTH[project.health]}>
                {project.health}
              </StatusBadge>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Progress
                className="flex-1"
                value={project.progress}
                tone={
                  project.health === "Late"
                    ? "danger"
                    : project.health === "At risk"
                      ? "warning"
                      : "success"
                }
              />
              <span className="w-8 shrink-0 text-right font-mono text-[10px] text-muted-foreground">
                {project.progress}%
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 pl-11 text-xs text-muted-foreground">
              <span className="font-mono">
                ${project.used.toLocaleString("en-US")} / $
                {project.price.toLocaleString("en-US")}
              </span>
              <span>{project.due}</span>
            </div>
          </li>
        ))}
      </ul>

      <div className="hidden md:block">
        <Table minWidth bare>
      <THead>
        <tr>
          <TH>Project</TH>
          <TH>Status</TH>
          <TH>Health</TH>
          <TH>Progress</TH>
          <TH>PM</TH>
          <TH>Budget used</TH>
          <TH>Due</TH>
        </tr>
      </THead>
      <TBody>
        {projects.map((project) => (
          <TR key={project.id}>
            <TD>
              <div className="flex items-center gap-2.5">
                <Avatar initials={initials(project.client)} />
                <div>
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="font-medium hover:underline"
                  >
                    {project.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">{project.client}</p>
                </div>
              </div>
            </TD>
            <TD>
              <StatusBadge tone={project.status === "On hold" ? "warning" : "neutral"}>
                {project.status}
              </StatusBadge>
            </TD>
            <TD>
              <StatusBadge tone={HEALTH[project.health]}>{project.health}</StatusBadge>
            </TD>
            <TD>
              <div className="flex w-36 items-center gap-2">
                <Progress
                  value={project.progress}
                  tone={
                    project.health === "Late"
                      ? "danger"
                      : project.health === "At risk"
                        ? "warning"
                        : "success"
                  }
                />
                <span className="font-mono text-[10px] text-muted-foreground">
                  {project.progress}%
                </span>
              </div>
            </TD>
            <TD className="text-xs text-muted-foreground">{project.pm}</TD>
            <TD className="font-mono text-xs tabular-nums">
              ${project.used.toLocaleString("en-US")}
              <span className="text-muted-foreground">
                {" "}
                / ${project.price.toLocaleString("en-US")}
              </span>
            </TD>
            <TD className="text-xs text-muted-foreground">{project.due}</TD>
          </TR>
        ))}
      </TBody>
        </Table>
      </div>
    </>
  );
}

function BoardView({
  projects,
  onMove,
}: {
  projects: AdminProject[];
  onMove: (id: string, status: string) => void;
}) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [overColumn, setOverColumn] = useState<string | null>(null);

  return (
    <div className="overflow-x-auto p-3">
      <div className="flex min-w-max gap-3">
        {COLUMNS.map((column) => {
          const items = projects.filter((project) =>
            project.status.startsWith(column),
          );
          return (
            <div
              key={column}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
                setOverColumn(column);
              }}
              onDragLeave={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                  setOverColumn(null);
                }
              }}
              onDrop={(event) => {
                event.preventDefault();
                const id = event.dataTransfer.getData("text/plain") || dragId;
                if (id) onMove(id, column);
                setDragId(null);
                setOverColumn(null);
              }}
              className={cn(
                "w-64 shrink-0 rounded-lg border bg-background transition-colors",
                overColumn === column
                  ? "border-primary/50 bg-primary/[0.03]"
                  : "border-border",
              )}
            >
              <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
                <p className="text-xs font-semibold">{column}</p>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {items.length}
                </span>
              </div>
              <div className="space-y-2 p-2">
                {items.length === 0 ? (
                  <p className="rounded-md border border-dashed border-border px-3 py-6 text-center text-[11px] text-muted-foreground">
                    Nothing here
                  </p>
                ) : (
                  items.map((project) => (
                    <div
                      key={project.id}
                      draggable
                      onDragStart={(event) => {
                        event.dataTransfer.setData("text/plain", project.id);
                        event.dataTransfer.effectAllowed = "move";
                        setDragId(project.id);
                      }}
                      onDragEnd={() => {
                        setDragId(null);
                        setOverColumn(null);
                      }}
                      className={cn(
                        "cursor-grab rounded-md border border-border bg-card p-3 transition-colors hover:border-primary/30 active:cursor-grabbing",
                        dragId === project.id && "opacity-60",
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex min-w-0 items-center gap-1.5">
                          <GripVertical className="size-3 shrink-0 text-muted-foreground" aria-hidden="true" />
                          <Link
                            href={`/admin/projects/${project.id}`}
                            className="truncate text-sm font-medium hover:underline"
                          >
                            {project.client}
                          </Link>
                        </span>
                        <StatusBadge tone={HEALTH[project.health]}>
                          {project.health}
                        </StatusBadge>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {project.name}
                      </p>
                      <div className="mt-3">
                        <Progress value={project.progress} />
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                        <span className="font-mono">{project.progress}%</span>
                        <span>{project.due}</span>
                      </div>
                      <div className="mt-2 md:hidden">
                        <NativeSelect
                          aria-label={`Move ${project.name}`}
                          value={
                            COLUMNS.find((option) =>
                              project.status.startsWith(option),
                            ) ?? COLUMNS[0]
                          }
                          onChange={(event) => onMove(project.id, event.target.value)}
                          className="h-8 text-[10px]"
                        >
                          {COLUMNS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </NativeSelect>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TimelineView({ projects }: { projects: AdminProject[] }) {
  return (
    <div className="overflow-x-auto p-4">
      <div className="min-w-[760px]">
        <div className="mb-2 grid grid-cols-[220px_1fr] gap-4">
          <span />
          <div className="grid grid-cols-6 font-mono text-[10px] text-muted-foreground">
            {["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"].map((month) => (
              <span key={month} className="border-l border-border pl-2">
                {month}
              </span>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          {projects.map((project) => (
            <div
              key={project.id}
              className="grid grid-cols-[220px_1fr] items-center gap-4 rounded-md py-1.5"
            >
              <div className="min-w-0">
                <Link
                  href={`/admin/projects/${project.id}`}
                  className="truncate text-xs font-medium hover:underline"
                >
                  {project.name}
                </Link>
                <p className="truncate text-[10px] text-muted-foreground">
                  {project.client}
                </p>
              </div>
              <div className="relative h-8 rounded-sm bg-secondary/60">
                <span
                  className={cn(
                    "absolute top-1.5 bottom-1.5 left-0 rounded-sm",
                    project.health === "On track" && "bg-primary/70",
                    project.health === "At risk" && "bg-warning/60",
                    project.health === "Late" && "bg-destructive/40",
                  )}
                  style={{ width: `${Math.max(6, project.progress)}%` }}
                />
                <span className="absolute top-1/2 right-2 -translate-y-1/2 font-mono text-[9px] text-muted-foreground">
                  {project.due}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
