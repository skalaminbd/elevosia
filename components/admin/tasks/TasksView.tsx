"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Check,
  Circle,
  GripVertical,
  ListChecks,
  ListFilter,
  SquareKanban,
  User,
} from "lucide-react";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import type { AdminTask, TaskStatus } from "@/lib/admin-data";
import { NativeSelect } from "@/components/shared/NativeSelect";
import { AssigneePicker } from "@/components/admin/tasks/AssigneePicker";
import { FilterDisclosure, type FilterOption } from "@/components/shared/FilterDisclosure";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTeamOptions } from "@/hooks/use-team-options";
import { projectTeamForName } from "@/lib/team-store";
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
export function TasksView({ tasks: initialTasks }: { tasks: AdminTask[] }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("mine");
  const [done, setDone] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(initialTasks.filter((task) => task.status === "done").map((task) => [task.id, true])),
  );
  const [tasks, setTasks] = useState<AdminTask[]>(initialTasks);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overColumn, setOverColumn] = useState<TaskStatus | null>(null);
  const [personFilter, setPersonFilter] = useState<string[]>([]);
  const [weekFilter, setWeekFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const team = useTeamOptions();

  const personOptions: FilterOption[] = team.map((member) => ({
    id: member.name.split(" ")[0],
    label: member.name,
    icon: User,
  }));
  const weekOptions: FilterOption[] = [
    ...new Set(tasks.map((task) => task.week)),
  ].map((week) => ({ id: week, label: week, icon: CalendarDays }));
  const statusOptions: FilterOption[] = COLUMNS.map((column) => ({
    id: column.id,
    label: column.label,
    icon: ListFilter,
  }));

  const hasFilters =
    personFilter.length > 0 ||
    weekFilter.length > 0 ||
    statusFilter.length > 0;

  function matchesFilters(task: AdminTask, includePerson: boolean) {
    const personOk =
      !includePerson ||
      personFilter.length === 0 ||
      personFilter.includes(task.assignee);
    const weekOk =
      weekFilter.length === 0 || weekFilter.includes(task.week);
    const statusOk =
      statusFilter.length === 0 || statusFilter.includes(task.status);
    return personOk && weekOk && statusOk;
  }

  function clearFilters() {
    setPersonFilter([]);
    setWeekFilter([]);
    setStatusFilter([]);
  }

  function applyToSelected(patch: Partial<AdminTask>) {
    setTasks((current) =>
      current.map((task) =>
        selected.includes(task.id) ? { ...task, ...patch } : task,
      ),
    );
  }

  function toggleSelected(id: string) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  const mine = useMemo(
    () =>
      tasks.filter(
        (task) =>
          task.assignee === "Alamin" &&
          matchesFilters(task, false),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tasks, weekFilter, statusFilter],
  );
  const openCount =
    tab === "mine"
      ? mine.filter((task) => task.status !== "done").length
      : tasks.filter((task) => task.status !== "done").length;

  function assignTask(id: string, name: string) {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, assignee: name } : task)),
    );
  }

  function moveTask(id: string, status: TaskStatus) {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, status } : task)),
    );
    if (status === "done") {
      setDone((current) => ({ ...current, [id]: true }));
    }
  }

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

      <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-2.5">
        <FilterDisclosure
          label="Person"
          values={personFilter}
          options={personOptions}
          onChange={setPersonFilter}
        />
        <FilterDisclosure
          label="Week"
          values={weekFilter}
          options={weekOptions}
          onChange={setWeekFilter}
        />
        <FilterDisclosure
          label="Status"
          values={statusFilter}
          options={statusOptions}
          onChange={setStatusFilter}
        />
        {hasFilters ? (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear
          </Button>
        ) : null}
      </div>

      {selected.length > 0 ? (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border bg-secondary/40 px-4 py-2.5">
          <span className="text-xs font-medium">
            {selected.length} selected
          </span>
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            Assign
            <AssigneePicker
              compact
              label="Bulk assignee"
              value=""
              onChange={(name) => applyToSelected({ assignee: name })}
            />
          </span>
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            Reviewer
            <AssigneePicker
              compact
              label="Bulk reviewer"
              value=""
              onChange={(name) => applyToSelected({ reviewer: name })}
            />
          </span>
          <NativeSelect
            aria-label="Move selected tasks to week"
            defaultValue=""
            onChange={(event) => {
              if (event.target.value) {
                applyToSelected({ week: event.target.value });
              }
            }}
            className="h-8 rounded-md border border-input bg-card px-2 text-xs"
          >
            <option value="">Move to week…</option>
            {weekOptions.map((week) => (
              <option key={week.id} value={week.id}>
                {week.label}
              </option>
            ))}
          </NativeSelect>
          <Input
            type="date"
            aria-label="Set due date for selected tasks"
            onChange={(event) => {
              if (event.target.value) {
                applyToSelected({ due: event.target.value });
              }
            }}
            className="h-8 w-36 text-xs"
          />
          <Button variant="ghost" size="sm" onClick={() => setSelected([])}>
            Clear
          </Button>
        </div>
      ) : null}

      {tab === "mine" ? (
        <ul>
          {mine.length === 0 ? (
            <li className="px-5 py-10 text-center text-sm text-muted-foreground">
              Nothing assigned to you this week.
            </li>
          ) : (
            mine.map((task, index) => {
              const checked = task.status === "done" || Boolean(done[task.id]);
              return (
                <li
                  key={task.id}
                  className={cn(
                    "flex items-start gap-3 px-5 py-3.5",
                    index > 0 && "border-t border-border",
                  )}
                >
                  <Checkbox
                    checked={selected.includes(task.id)}
                    onCheckedChange={() => toggleSelected(task.id)}
                    aria-label={`Select ${task.title}`}
                    className="mt-0.5"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const next = !checked;
                      setDone((current) => ({ ...current, [task.id]: next }));
                      moveTask(task.id, next ? "done" : "progress");
                    }}
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
              const items = tasks.filter(
                (task) =>
                  task.status === column.id && matchesFilters(task, true),
              );
              return (
                <div
                  key={column.id}
                  onDragOver={(event) => {
                    event.preventDefault();
                    event.dataTransfer.dropEffect = "move";
                    setOverColumn(column.id);
                  }}
                  onDragLeave={(event) => {
                    if (
                      !event.currentTarget.contains(event.relatedTarget as Node)
                    ) {
                      setOverColumn(null);
                    }
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    const id =
                      event.dataTransfer.getData("text/plain") || dragId;
                    if (id) moveTask(id, column.id);
                    setDragId(null);
                    setOverColumn(null);
                  }}
                  className={cn(
                    "w-64 shrink-0 rounded-lg border bg-background transition-colors",
                    overColumn === column.id
                      ? "border-primary/50 bg-primary/[0.03]"
                      : "border-border",
                  )}
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
                          draggable
                          onDragStart={(event) => {
                            event.dataTransfer.setData("text/plain", task.id);
                            event.dataTransfer.effectAllowed = "move";
                            setDragId(task.id);
                          }}
                          onDragEnd={() => {
                            setDragId(null);
                            setOverColumn(null);
                          }}
                          className={cn(
                            "cursor-grab rounded-md border border-border bg-card p-3 transition-colors hover:border-primary/30 active:cursor-grabbing",
                            dragId === task.id && "opacity-60",
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="flex items-center gap-1.5 font-mono text-[9px] text-muted-foreground">
                              <GripVertical className="size-3" aria-hidden="true" />
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
                          <div className="mt-2.5 flex items-center justify-between gap-2 text-[10px] text-muted-foreground">
                            <AssigneePicker
                              compact
                              value={task.assignee}
                              onChange={(name) => assignTask(task.id, name)}
                              label="Assignee"
                              members={projectTeamForName(task.project)}
                            />
                            <span className="shrink-0 font-mono">
                              {task.due}
                            </span>
                          </div>
                          <div className="mt-2 md:hidden">
                            <NativeSelect
                              aria-label={`Move ${task.title}`}
                              value={task.status}
                              onChange={(event) =>
                                moveTask(task.id, event.target.value as TaskStatus)
                              }
                              className="h-8 text-[10px]"
                            >
                              {COLUMNS.map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.label}
                                </option>
                              ))}
                            </NativeSelect>
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
