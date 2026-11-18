"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, Circle, ListChecks, SquareKanban } from "lucide-react";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { adminTasks, type TaskStatus } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "mine", label: "My tasks", icon: ListChecks },
  { id: "board", label: "Board", icon: SquareKanban },
] as const;

const COLUMNS: { id: TaskStatus; label: string }[] = [
  { id: "todo", label: "To do" },
  { id: "progress", label: "In progress" },
  { id: "review", label: "In review" },
  { id: "done", label: "Done" },
];

/** My tasks (checkable) and the four-column board. */
export function TasksView() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("mine");
  const [done, setDone] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(adminTasks.filter((task) => task.status === "done").map((task) => [task.id, true])),
  );

  const mine = useMemo(
    () => adminTasks.filter((task) => task.assignee === "Alamin"),
    [],
  );
  const openCount =
    tab === "mine"
      ? mine.filter((task) => !done[task.id]).length
      : adminTasks.filter((task) => !done[task.id]).length;

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex items-center gap-1 rounded-lg bg-secondary p-1">
          {TABS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                aria-pressed={tab === item.id}
                className={cn(
                  "flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-medium transition-colors",
                  tab === item.id
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
          {openCount} open · sample data
        </p>
      </div>

      {tab === "mine" ? (
        <ul>
          {mine.length === 0 ? (
            <li className="px-5 py-10 text-center text-sm text-muted-foreground">
              Nothing assigned to you this week.
            </li>
          ) : (
            mine.map((task, index) => {
              const checked = Boolean(done[task.id]);
              return (
                <li
                  key={task.id}
                  className={cn(
                    "flex items-start gap-3 px-5 py-3.5",
                    index > 0 && "border-t border-border",
                  )}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setDone((current) => ({ ...current, [task.id]: !checked }))
                    }
                    aria-label={
                      checked
                        ? `Reopen ${task.title}`
                        : `Mark ${task.title} done`
                    }
                    aria-pressed={checked}
                    className={cn(
                      "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                      checked
                        ? "border-success bg-success text-success-foreground"
                        : "border-muted-foreground/40 text-transparent hover:border-primary",
                    )}
                  >
                    <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                  </button>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/tasks/${task.id}`}
                      className={cn(
                        "text-sm font-medium hover:underline",
                        checked && "text-muted-foreground line-through",
                      )}
                    >
                      {task.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {task.client} · {task.project}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {task.priority === "High" ? (
                      <StatusBadge tone="warning">High</StatusBadge>
                    ) : null}
                    <span className="hidden font-mono text-[10px] text-muted-foreground sm:block">
                      {task.due}
                    </span>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      ) : (
        <div className="overflow-x-auto p-3">
          <div className="flex min-w-max gap-3">
            {COLUMNS.map((column) => {
              const items = adminTasks.filter((task) => task.status === column.id);
              return (
                <div
                  key={column.id}
                  className="w-64 shrink-0 rounded-lg border border-border bg-background"
                >
                  <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
                    <p className="text-xs font-semibold">{column.label}</p>
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
                      items.map((task) => (
                        <div
                          key={task.id}
                          className="rounded-md border border-border bg-card p-3 transition-colors hover:border-primary/30"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-[9px] text-muted-foreground">
                              {task.id}
                            </span>
                            {task.clientVisible ? (
                              <StatusBadge tone="accent">Client</StatusBadge>
                            ) : (
                              <StatusBadge tone="neutral">
                                <Circle className="size-2" aria-hidden="true" />
                                Internal
                              </StatusBadge>
                            )}
                          </div>
                          <Link
                            href={`/admin/tasks/${task.id}`}
                            className="mt-2 block text-xs font-medium hover:underline"
                          >
                            {task.title}
                          </Link>
                          <p className="mt-0.5 text-[10px] text-muted-foreground">
                            {task.client}
                          </p>
                          <div className="mt-2.5 flex items-center justify-between text-[10px] text-muted-foreground">
                            <span>{task.assignee}</span>
                            <span className="font-mono">{task.due}</span>
                          </div>
                          <div className="mt-2 h-1 overflow-hidden rounded-full bg-secondary">
                            <span
                              className="block h-full rounded-full bg-primary"
                              style={{
                                width: `${Math.min(100, (task.logged / Math.max(1, task.estimate)) * 100)}%`,
                              }}
                            />
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
      )}
    </div>
  );
}
