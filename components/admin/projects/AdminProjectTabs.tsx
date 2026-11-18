"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, ChevronRight, FileText, RotateCcw, Video } from "lucide-react";
import { Avatar } from "@/components/admin/ui/Avatar";
import { Progress } from "@/components/admin/ui/Progress";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import {
  activity,
  adminProjects,
  adminTasks,
  calls,
  files,
  threads,
  timesheet,
} from "@/lib/admin-data";
import { cn } from "@/lib/utils";

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

const BOARD = [
  {
    id: "w3",
    label: "Week 3",
    dates: "18–22 Nov",
    current: true,
    tasks: [
      { id: "b1", title: "Client portal layout", state: "done", owner: "Sam", visible: true },
      { id: "b2", title: "Visit history imported", state: "done", owner: "Maya", visible: true },
      { id: "b3", title: "Caregiver phone view", state: "progress", owner: "Sam", visible: true },
      { id: "b4", title: "Invoice export", state: "progress", owner: "Ava", visible: true },
      { id: "b5", title: "Approval audit log", state: "next", owner: "Maya", visible: false },
    ],
  },
  {
    id: "w2",
    label: "Week 2",
    dates: "11–15 Nov",
    tasks: [
      { id: "b6", title: "Weekly board", state: "done", owner: "Sam", visible: true },
      { id: "b7", title: "Caregiver roles", state: "done", owner: "Ava", visible: true },
      { id: "b8", title: "Auto-fill rules", state: "done", owner: "Sam", visible: true },
      { id: "b9", title: "Scheduling edge cases", state: "done", owner: "Maya", visible: false },
    ],
  },
];

const MILESTONES = [
  { label: "Foundation", due: "4 Nov", state: "done", tasks: 4 },
  { label: "Scheduling", due: "11 Nov", state: "done", tasks: 5 },
  { label: "Clients and portal", due: "22 Nov", state: "current", tasks: 5 },
  { label: "Billing", due: "2 Dec", state: "next", tasks: 4 },
  { label: "Launch", due: "12 Dec", state: "next", tasks: 3 },
];

const CHANGES = [
  {
    id: "CH-18",
    title: "Family access additions",
    scope: "Second family contact, invoice visibility without care notes.",
    price: 900,
    days: 3,
    status: "Waiting for client",
  },
];

const ACCESS = [
  { name: "Hosting", owner: "Client", status: "Handed over" },
  { name: "Domain", owner: "Client", status: "Handed over" },
  { name: "Repository", owner: "Client", status: "Invite sent" },
  { name: "Database", owner: "Client", status: "Pending" },
  { name: "Email delivery", owner: "Client", status: "Handed over" },
];

export function AdminProjectTabs({ projectId }: { projectId: string }) {
  const project = adminProjects.find((item) => item.id === projectId) ?? adminProjects[0];
  const [tab, setTab] = useState<Tab>("overview");

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

  const tasks = adminTasks.filter((task) => task.project === project.name);
  const projectFiles = files.filter((file) => file.client === project.client);
  const clientThreads = threads.filter((thread) => thread.client === project.client);
  const projectCalls = calls.filter((call) => call.client === project.client);
  const projectActivity = activity.filter((item) =>
    item.detail.includes(project.client),
  );

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
              {(projectActivity.length > 0 ? projectActivity : activity.slice(0, 3)).map((item) => (
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
          {BOARD.map((week) => (
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
        <ul className="divide-y divide-border">
          {MILESTONES.map((milestone) => (
            <li key={milestone.label} className="flex flex-wrap items-center gap-3 px-5 py-4">
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-semibold",
                  milestone.state === "done" && "bg-success/10 text-success",
                  milestone.state === "current" && "bg-primary text-primary-foreground",
                  milestone.state === "next" && "bg-secondary text-muted-foreground",
                )}
              >
                {milestone.state === "done" ? (
                  <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                ) : (
                  "·"
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{milestone.label}</p>
                <p className="text-xs text-muted-foreground">
                  {milestone.tasks} tasks · due {milestone.due}
                </p>
              </div>
              <StatusBadge
                tone={
                  milestone.state === "done"
                    ? "success"
                    : milestone.state === "current"
                      ? "accent"
                      : "neutral"
                }
              >
                {milestone.state === "done"
                  ? "Complete"
                  : milestone.state === "current"
                    ? "In progress"
                    : "Upcoming"}
              </StatusBadge>
            </li>
          ))}
        </ul>
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
              {timesheet.slice(0, 4).map((row) => (
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
          {CHANGES.map((change) => (
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
            {ACCESS.map((account) => (
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
