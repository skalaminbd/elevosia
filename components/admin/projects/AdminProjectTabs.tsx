"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Check,
  ChevronRight,
  FileText,
  RotateCcw,
  UserMinus,
  Video,
} from "lucide-react";
import { Avatar } from "@/components/admin/ui/Avatar";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/shared/NativeSelect";
import { useProjectTeams } from "@/hooks/use-project-teams";
import { DEFAULT_TEAM, setProjectTeam } from "@/lib/team-store";
import { Progress } from "@/components/admin/ui/Progress";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import {
  files as seedFiles,
  team,
  timesheet as seedTimesheet,
} from "@/lib/admin-data";
import type {
  AdminProject,
  AdminTask,
  CallRecord,
  Thread,
} from "@/lib/admin-data";
import { cn } from "@/lib/utils";
import type { ProjectScope, StoredMilestone } from "@/lib/project-store";
import { AddMilestoneDialog } from "@/components/admin/projects/AddMilestoneDialog";
import { AddProjectTaskDialog } from "@/components/admin/projects/AddProjectTaskDialog";
import { ScopeRecord } from "@/components/admin/projects/ScopeRecord";

const TABS = [
  "overview",
  "board",
  "milestones",
  "tasks",
  "files",
  "messages",
  "calls",
  "time",
  "changes",
  "access",
  "settings",
] as const;
type Tab = (typeof TABS)[number];

const LABELS: Record<Tab, string> = {
  overview: "Overview",
  board: "Weekly board",
  milestones: "Milestones",
  tasks: "Tasks",
  files: "Files",
  messages: "Messages",
  calls: "Calls",
  time: "Time and budget",
  changes: "Changes",
  access: "Access",
  settings: "Settings",
};

export type AdminProjectWorkspace = {
  project: AdminProject;
  board?: {
    id: string;
    label: string;
    dates: string;
    current?: boolean;
    tasks: {
      id: string;
      title: string;
      state: string;
      owner: string;
      visible: boolean;
    }[];
  }[];
  tasks?: AdminTask[];
  files?: (typeof seedFiles)[number][];
  threads?: Thread[];
  calls?: CallRecord[];
  changes?: { id: string; title: string; scope: string; price: number; days: number; status: string }[];
  access?: { name: string; owner: string; status: string }[];
  time?: (typeof seedTimesheet)[number][];
  activity?: { id: string; title: string; detail: string; time: string; kind: string }[];
};

export function AdminProjectTabs({
  projectId,
  storedMilestones = [],
  blueprintLabel,
  projectName,
  client,
  onMilestonesChange,
  scope,
  workspace,
}: {
  projectId: string;
  storedMilestones?: StoredMilestone[];
  blueprintLabel?: string;
  projectName?: string;
  client?: string;
  onMilestonesChange?: (milestones: StoredMilestone[]) => void;
  scope?: ProjectScope;
  workspace: AdminProjectWorkspace;
}) {
  const project = workspace.project;
  // A converted project opens on its milestones, where the approved scope sits.
  const [tab, setTab] = useState<Tab>(scope ? "milestones" : "overview");
  const [storedList, setStoredList] =
    useState<StoredMilestone[]>(storedMilestones);
  const [collapsedStored, setCollapsedStored] = useState<
    Record<string, boolean>
  >({});
  const teams = useProjectTeams();
  const members = teams[projectId] ?? DEFAULT_TEAM;

  function addMember(name: string) {
    if (!name) return;
    setProjectTeam(
      projectId,
      members.includes(name) ? members : [...members, name],
    );
  }

  function removeMember(name: string) {
    setProjectTeam(
      projectId,
      members.filter((member) => member !== name),
    );
  }

  function addStoredTasks(
    milestoneId: string,
    tasks: Omit<import("@/lib/project-store").StoredTask, "id" | "done">[],
  ) {
    const next = storedList.map((milestone) =>
      milestone.id === milestoneId
        ? {
            ...milestone,
            tasks: [
              ...milestone.tasks,
              ...tasks.map((task, index) => ({
                ...task,
                id: `${milestoneId}-task-${Date.now()}-${index}`,
                done: false,
              })),
            ],
          }
        : milestone,
    );
    setStoredList(next);
    onMilestonesChange?.(next);
  }

  function toggleStoredTask(milestoneId: string, taskId: string) {
    const next = storedList.map((milestone) =>
      milestone.id === milestoneId
        ? {
            ...milestone,
            tasks: milestone.tasks.map((task) =>
              task.id === taskId ? { ...task, done: !task.done } : task,
            ),
          }
        : milestone,
    );
    setStoredList(next);
    onMilestonesChange?.(next);
  }

  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("tab");
    if (!wanted || !TABS.includes(wanted as Tab)) return;
    const frame = window.requestAnimationFrame(() => setTab(wanted as Tab));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function choose(next: Tab) {
    setTab(next);
    window.history.replaceState(
      null,
      "",
      next === "overview"
        ? `/admin/projects/${project.id}`
        : `/admin/projects/${project.id}?tab=${next}`,
    );
  }

  const board = workspace.board ?? [];
  const changes = workspace.changes ?? [];
  const access = workspace.access ?? [];
  const timeRows = workspace.time ?? [];
  const tasks = workspace.tasks ?? [];
  const projectFiles = workspace.files ?? [];
  const clientThreads = workspace.threads ?? [];
  const projectCalls = workspace.calls ?? [];
  const projectActivity = workspace.activity ?? [];

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex gap-1 overflow-x-auto border-b border-border px-3 py-2.5">
        {TABS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => choose(item)}
            aria-pressed={tab === item}
            className={cn(
              "h-8 shrink-0 rounded-md px-3 text-xs font-medium transition-colors",
              tab === item
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {LABELS[item]}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold">Dates</p>
            <p className="mt-2 text-sm">{project.due}</p>
            <p className="text-xs text-muted-foreground">Launch target</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Warranty ends 30 days after launch.
            </p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold">Budget</p>
            <p className="mt-2 font-mono text-sm">
              ${project.used.toLocaleString("en-US")} / $
              {project.price.toLocaleString("en-US")}
            </p>
            <div className="mt-2">
              <Progress value={(project.used / project.price) * 100} />
            </div>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold">Team</p>
            <div className="mt-2 flex items-center gap-2">
              <Avatar initials={project.pm === "Maya" ? "MC" : "A"} />
              <span className="text-sm">{project.pm} · PM</span>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">Sam, Ava · developers</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold">Health</p>
            <div className="mt-2">
              <StatusBadge
                tone={
                  project.health === "On track"
                    ? "success"
                    : project.health === "At risk"
                      ? "warning"
                      : "danger"
                }
              >
                {project.health}
              </StatusBadge>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{project.status}</p>
          </div>

          <div className="rounded-lg border border-border p-4 md:col-span-2 xl:col-span-4">
            <p className="text-xs font-semibold">Recent activity</p>
            <ul className="mt-2 divide-y divide-border">
              {projectActivity.slice(0, 3).map((item) => (
                <li key={item.id} className="flex items-center gap-3 py-2.5">
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm">{item.title}</span>
                    <span className="block text-xs text-muted-foreground">{item.detail}</span>
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">{item.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {tab === "board" ? (
        <div className="space-y-3 p-4">
          {board.map((week) => (
            <div
              key={week.id}
              className={cn(
                "rounded-lg border p-4",
                week.current ? "border-primary/30 bg-primary/[0.03]" : "border-border",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">
                  {week.label} <span className="font-normal text-muted-foreground">· {week.dates}</span>
                </p>
                <StatusBadge tone={week.current ? "accent" : "neutral"}>
                  {week.current ? "This week" : "Done"}
                </StatusBadge>
              </div>
              <ul className="mt-3 space-y-2">
                {week.tasks.map((task) => (
                  <li key={task.id} className="flex flex-wrap items-center gap-2.5 text-sm">
                    <span
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded-full",
                        task.state === "done" && "bg-success text-success-foreground",
                        task.state === "progress" && "border border-primary/40",
                        task.state === "next" && "border border-border",
                      )}
                    >
                      {task.state === "done" ? (
                        <Check className="size-2.5" strokeWidth={3} aria-hidden="true" />
                      ) : task.state === "progress" ? (
                        <span className="size-1 rounded-full bg-primary" />
                      ) : null}
                    </span>
                    <span className="min-w-0 flex-1">{task.title}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{task.owner}</span>
                    <StatusBadge tone={task.visible ? "accent" : "neutral"}>
                      {task.visible ? "Client" : "Internal"}
                    </StatusBadge>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "milestones" ? (
        <div className="space-y-4">
          {scope ? (
            <ScopeRecord
              scope={scope}
              projectId={projectId}
              projectName={projectName ?? "Project"}
              client={client ?? ""}
            />
          ) : null}
          {storedList.length > 0 ? (
          <div>
          <ul className="divide-y divide-border">
            <li className="flex items-center gap-3 px-5 py-4">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Blueprint</p>
                <p className="text-xs text-muted-foreground">
                  {blueprintLabel
                    ? `${blueprintLabel} · approved and locked`
                    : "Approved and locked"}
                </p>
              </div>
              <StatusBadge tone="success">Done</StatusBadge>
            </li>
            {storedList.map((milestone, index) => {
              const hours = milestone.tasks.reduce(
                (total, task) => total + task.hours,
                0,
              );
              const done = milestone.tasks.filter((task) => task.done).length;
              const complete =
                milestone.tasks.length > 0 && done === milestone.tasks.length;
              const started = milestone.tasks.some(
                (task) =>
                  task.done ||
                  task.status === "progress" ||
                  task.status === "review",
              );
              const isCollapsed = collapsedStored[milestone.id] ?? false;

              return (
                <li key={milestone.id} className="px-5 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={
                        isCollapsed
                          ? "Expand milestone"
                          : "Collapse milestone"
                      }
                      aria-expanded={!isCollapsed}
                      onClick={() =>
                        setCollapsedStored((current) => ({
                          ...current,
                          [milestone.id]: !isCollapsed,
                        }))
                      }
                      className="shrink-0 text-muted-foreground"
                    >
                      <ChevronRight
                        className={cn(
                          "size-4 transition-transform",
                          !isCollapsed && "rotate-90",
                        )}
                        aria-hidden="true"
                      />
                    </Button>
                    <span
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-full",
                        complete
                          ? "bg-success/10 text-success"
                          : "border border-border text-muted-foreground",
                      )}
                    >
                      {complete ? (
                        <Check
                          className="size-3.5"
                          strokeWidth={3}
                          aria-hidden="true"
                        />
                      ) : (
                        <span className="size-1.5 rounded-full bg-current opacity-40" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          complete && "text-muted-foreground line-through",
                        )}
                      >
                        {milestone.title || `Milestone ${index + 1}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {done}/{milestone.tasks.length} done · {hours} h
                        {milestone.due ? ` · due ${milestone.due}` : ""}
                      </p>
                    </div>
                    <AddProjectTaskDialog
                      onAdd={(tasks) => addStoredTasks(milestone.id, tasks)}
                    />
                    <StatusBadge
                      tone={
                        complete
                          ? "success"
                          : started
                            ? "accent"
                            : "neutral"
                      }
                    >
                      {complete
                        ? "Complete"
                        : started
                          ? "In progress"
                          : "Planned"}
                    </StatusBadge>
                  </div>
                  {isCollapsed ? null : milestone.tasks.length > 0 ? (
                    <ul className="mt-3 space-y-1.5 border-l border-border pl-4">
                      {milestone.tasks.map((task) => (
                        <li
                          key={task.id}
                          className="flex items-center gap-2 text-sm"
                        >
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked={Boolean(task.done)}
                            aria-label={`Mark ${task.name} ${
                              task.done ? "not done" : "done"
                            }`}
                            onClick={() =>
                              toggleStoredTask(milestone.id, task.id)
                            }
                            className={cn(
                              "flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                              task.done
                                ? "border-success bg-success/15 text-success"
                                : "border-input text-transparent hover:border-muted-foreground",
                            )}
                          >
                            <Check
                              className="size-3"
                              strokeWidth={3}
                              aria-hidden="true"
                            />
                          </button>
                          <Link
                            href={`/admin/tasks/${task.id}?project=${projectId}`}
                            className={cn(
                              "min-w-0 flex-1 truncate text-sm hover:underline",
                              task.done &&
                                "text-muted-foreground line-through",
                            )}
                          >
                            {task.name}
                          </Link>
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {task.hours} h
                          </span>
                          {task.visible ? (
                            <StatusBadge tone="accent">Client</StatusBadge>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 pl-4 text-xs text-muted-foreground">
                      No tasks yet.
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="border-t border-border p-4">
            <AddMilestoneDialog
              projectId={projectId}
              onAdd={(milestone) => {
                const next = [...storedList, milestone];
                setStoredList(next);
                onMilestonesChange?.(next);
              }}
            />
          </div>
          </div>
        ) : (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">
            No milestones yet. Add a Blueprint or create the first milestone.
          </p>
        )}
        </div>
      ) : null}

      {tab === "tasks" ? (
        <ul className="divide-y divide-border">
          {tasks.length === 0 ? (
            <li className="px-5 py-10 text-center text-sm text-muted-foreground">
              No tasks on this project yet.
            </li>
          ) : (
            tasks.map((task) => (
              <li key={task.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                <span className="font-mono text-[10px] text-muted-foreground">{task.id}</span>
                <div className="min-w-0 flex-1">
                  <Link href={`/admin/tasks/${task.id}`} className="text-sm font-medium hover:underline">
                    {task.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {task.assignee} · {task.due}
                  </p>
                </div>
                <StatusBadge tone={task.clientVisible ? "accent" : "neutral"}>
                  {task.clientVisible ? "Client" : "Internal"}
                </StatusBadge>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {task.logged}/{task.estimate} h
                </span>
              </li>
            ))
          )}
        </ul>
      ) : null}

      {tab === "files" ? (
        <ul className="divide-y divide-border">
          {projectFiles.length === 0 ? (
            <li className="px-5 py-10 text-center text-sm text-muted-foreground">
              No files for this project.
            </li>
          ) : (
            projectFiles.map((file) => (
              <li key={file.id} className="flex items-center gap-3 px-5 py-3.5">
                <FileText className="size-4 text-muted-foreground" aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate text-sm">{file.name}</span>
                <StatusBadge tone={file.visible ? "success" : "neutral"}>
                  {file.visible ? "Client-visible" : "Internal"}
                </StatusBadge>
              </li>
            ))
          )}
        </ul>
      ) : null}

      {tab === "messages" ? (
        <div className="space-y-3 p-5">
          {clientThreads.map((thread) => (
            <div key={thread.id} className="rounded-md border border-border p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium">{thread.client} · client thread</p>
                <span className="font-mono text-[10px] text-muted-foreground">{thread.time}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{thread.preview}</p>
              <Link href="/admin/messages" className="mt-2 inline-flex text-xs font-medium text-primary hover:underline">
                Open in Messages
              </Link>
            </div>
          ))}
          <div className="rounded-md border border-dashed border-border bg-secondary/40 p-4">
            <p className="text-sm font-medium">Internal thread</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Staff only. Decide the rollback plan before the Friday demo.
            </p>
          </div>
        </div>
      ) : null}

      {tab === "calls" ? (
        <ul className="divide-y divide-border">
          {projectCalls.length === 0 ? (
            <li className="px-5 py-10 text-center text-sm text-muted-foreground">
              No calls booked.
            </li>
          ) : (
            projectCalls.map((call) => (
              <li key={call.id} className="flex items-center gap-3 px-5 py-3.5">
                <Video className="size-4 text-muted-foreground" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{call.title}</p>
                  <p className="text-xs text-muted-foreground">{call.day} · {call.time}</p>
                </div>
                <StatusBadge tone="neutral">{call.kind}</StatusBadge>
              </li>
            ))
          )}
        </ul>
      ) : null}

      {tab === "time" ? (
        <div className="grid gap-4 p-4 lg:grid-cols-2">
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold">Hours logged</p>
            <ul className="mt-3 space-y-2">
              {timeRows.slice(0, 4).map((row) => (
                <li key={row.id} className="flex items-center gap-2 text-sm">
                  <span className="min-w-0 flex-1 truncate">{row.member} · {row.task}</span>
                  <span className="font-mono text-xs text-muted-foreground">{row.hours} h</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold">Budget</p>
            <p className="mt-2 font-mono text-2xl tabular-nums">
              ${project.used.toLocaleString("en-US")}
            </p>
            <p className="text-xs text-muted-foreground">
              of ${project.price.toLocaleString("en-US")} fixed price
            </p>
            <div className="mt-2">
              <Progress value={(project.used / project.price) * 100} />
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              {Math.round((project.used / project.price) * 100)}% used at {project.progress}% built.
            </p>
          </div>
        </div>
      ) : null}

      {tab === "changes" ? (
        <div className="space-y-3 p-4">
          {changes.map((change) => (
            <Link
              key={change.id}
              href={`/admin/projects/${project.id}/changes/${change.id}`}
              className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:border-primary/30"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{change.title}</p>
                <p className="text-xs text-muted-foreground">{change.scope}</p>
              </div>
              <span className="font-mono text-xs">+${change.price.toLocaleString("en-US")}</span>
              <span className="font-mono text-[10px] text-muted-foreground">+{change.days} days</span>
              <StatusBadge tone="warning">{change.status}</StatusBadge>
              <ChevronRight className="size-4 text-muted-foreground" aria-hidden="true" />
            </Link>
          ))}
        </div>
      ) : null}

      {tab === "access" ? (
        <div>
          <ul className="divide-y divide-border">
            {access.map((account) => (
              <li key={account.name} className="flex items-center gap-3 px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{account.name}</p>
                  <p className="text-xs text-muted-foreground">Owner: {account.owner}</p>
                </div>
                <StatusBadge tone={account.status === "Handed over" ? "success" : account.status === "Pending" ? "warning" : "info"}>
                  {account.status}
                </StatusBadge>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between border-t border-border px-5 py-3">
            <p className="text-xs text-muted-foreground">
              Handover must be complete before a project can close.
            </p>
            <Link
              href={`/admin/projects/${project.id}/handover`}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              Handover checklist
              <ChevronRight className="size-3" aria-hidden="true" />
            </Link>
          </div>
        </div>
      ) : null}

      {tab === "settings" ? (
        <div className="grid gap-4 p-4 md:grid-cols-2">
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold">Project</p>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Status</span>
                <span>{project.status}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">PM</span>
                <span>{project.pm}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Care plan</span>
                <span>Growth · $699/mo</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Warranty</span>
                <span>30 days after launch</span>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold">Team members</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  Only this team can be assigned tasks here.
                </p>
              </div>
              <NativeSelect
                aria-label="Add member"
                value=""
                onChange={(event) => addMember(event.target.value)}
                className="h-8 rounded-md border border-input bg-card px-2 text-xs"
              >
                <option value="">Add member…</option>
                {team
                  .filter((member) => !members.includes(member.name))
                  .map((member) => (
                    <option key={member.id} value={member.name}>
                      {member.name}
                    </option>
                  ))}
              </NativeSelect>
            </div>
            <ul className="mt-3 divide-y divide-border">
              {members.map((name) => {
                const member = team.find(
                  (item) =>
                    item.name === name || item.name.split(" ")[0] === name,
                );
                return (
                  <li key={name} className="flex items-center gap-2.5 py-2">
                    <Avatar
                      initials={member?.initials ?? name.slice(0, 1)}
                      className="size-7 text-[9px]"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">
                        {member?.name ?? name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {member?.role ?? "Team member"}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Remove ${member?.name ?? name} from the project`}
                      onClick={() => removeMember(name)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <UserMinus className="size-3.5" aria-hidden="true" />
                    </Button>
                  </li>
                );
              })}
              {members.length === 0 ? (
                <li className="py-3 text-xs text-muted-foreground">
                  No one on this project yet.
                </li>
              ) : null}
            </ul>
          </div>
          <div className="rounded-lg border border-dashed border-border p-4">
            <p className="text-xs font-semibold">Close project</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Needs the handover checklist complete, all milestones approved and the
              final invoice paid. This keeps the data and archives the project.
            </p>
            <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
              <RotateCcw className="size-3.5" aria-hidden="true" />
              Not available yet
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
