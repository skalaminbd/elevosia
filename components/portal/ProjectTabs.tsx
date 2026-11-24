"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronRight, Circle, FileText, RotateCcw } from "lucide-react";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { cn } from "@/lib/utils";

const TABS = ["Weekly board", "Milestones", "Files", "Invoices", "Calls"] as const;
type Tab = (typeof TABS)[number];

type BoardState = "done" | "progress" | "carried" | "next";

type BoardWeek = {
  id: string;
  label: string;
  dates: string;
  tasks: { id: string; title: string; state: BoardState }[];
  demo?: { note: string };
};

type Milestone = {
  id: string;
  label: string;
  due: string;
  state: "done" | "current" | "next";
  tasks: number;
};

type FileRow = {
  id: string;
  name: string;
  folder: string;
  version: string;
  updated: string;
  size: string;
};

type InvoiceRow = {
  id: string;
  kind: string;
  due: string;
  amount: number;
  status: string;
};

type CallsData = {
  upcoming: {
    id: string;
    title: string;
    when: string;
    with: string;
    join: string;
  } | null;
  past: {
    id: string;
    title: string;
    when: string;
    notes: string;
    actions: string[];
  }[];
};

const TASK_STATE: Record<
  BoardState,
  { label: string; tone: "success" | "neutral" | "warning" | "accent" }
> = {
  done: { label: "Completed", tone: "success" },
  progress: { label: "In progress", tone: "accent" },
  carried: { label: "Carried over", tone: "warning" },
  next: { label: "Next week", tone: "neutral" },
};

export function ProjectTabs({
  boardWeeks,
  milestones,
  files,
  invoices,
  calls,
}: {
  boardWeeks: BoardWeek[];
  milestones: Milestone[];
  files: FileRow[];
  invoices: InvoiceRow[];
  calls: CallsData;
}) {
  const [tab, setTab] = useState<Tab>("Weekly board");

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex gap-1 overflow-x-auto border-b border-border px-3 py-2.5">
        {TABS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            aria-pressed={tab === item}
            className={cn(
              "h-8 shrink-0 rounded-md px-3 text-xs font-medium transition-colors",
              tab === item
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === "Weekly board" ? (
        <div className="space-y-3 p-4">
          {boardWeeks.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              The weekly board appears once work starts.
            </p>
          ) : (
            boardWeeks.map((week, index) => (
              <div
                key={week.id}
                className={cn(
                  "rounded-lg border p-4",
                  index === 0
                    ? "border-primary/30 bg-primary/[0.03]"
                    : "border-border bg-background",
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">
                      {week.label}{" "}
                      <span className="font-normal text-muted-foreground">
                        · {week.dates}
                      </span>
                    </p>
                    {index === 0 ? (
                      <p className="text-[10px] text-primary">This week</p>
                    ) : null}
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {week.tasks.filter((task) => task.state === "done").length}/
                    {week.tasks.length} done
                  </span>
                </div>

                <ul className="mt-3 space-y-2">
                  {week.tasks.map((task) => {
                    const state = TASK_STATE[task.state];
                    return (
                      <li key={task.id} className="flex items-center gap-2.5">
                        <span
                          className={cn(
                            "flex size-4 shrink-0 items-center justify-center rounded-full",
                            task.state === "done" &&
                              "bg-success text-success-foreground",
                            task.state === "progress" &&
                              "border border-primary/40",
                            task.state === "carried" &&
                              "bg-warning/15 text-warning",
                            task.state === "next" && "border border-border",
                          )}
                        >
                          {task.state === "done" ? (
                            <Check
                              className="size-2.5"
                              strokeWidth={3}
                              aria-hidden="true"
                            />
                          ) : task.state === "progress" ? (
                            <span className="size-1 rounded-full bg-primary" />
                          ) : task.state === "carried" ? (
                            <RotateCcw className="size-2" aria-hidden="true" />
                          ) : (
                            <Circle
                              className="size-1.5 text-transparent"
                              aria-hidden="true"
                            />
                          )}
                        </span>
                        <span className="flex-1 text-sm">{task.title}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {state.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                {week.demo ? (
                  <div className="mt-3 flex items-start gap-2 rounded-md border border-border bg-card px-3 py-2.5">
                    <FileText
                      className="mt-0.5 size-3.5 text-primary"
                      aria-hidden="true"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      {week.demo.note}
                    </p>
                  </div>
                ) : null}
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "Milestones" ? (
        <ul className="divide-y divide-border">
          {milestones.length === 0 ? (
            <li className="px-5 py-8 text-center text-sm text-muted-foreground">
              Milestones appear once the plan is locked.
            </li>
          ) : (
            milestones.map((milestone) => (
              <li
                key={milestone.id}
                className="flex flex-wrap items-center gap-3 px-5 py-4"
              >
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-semibold",
                    milestone.state === "done" && "bg-success/10 text-success",
                    milestone.state === "current" &&
                      "bg-primary text-primary-foreground",
                    milestone.state === "next" &&
                      "bg-secondary text-muted-foreground",
                  )}
                >
                  {milestone.state === "done" ? (
                    <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                  ) : (
                    <Circle className="size-2" aria-hidden="true" />
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
            ))
          )}
        </ul>
      ) : null}

      {tab === "Files" ? (
        <ul className="divide-y divide-border">
          {files.length === 0 ? (
            <li className="px-5 py-8 text-center text-sm text-muted-foreground">
              No files shared yet.
            </li>
          ) : (
            files.map((file) => (
              <li
                key={file.id}
                className="flex flex-wrap items-center gap-3 px-5 py-3.5"
              >
                <span className="flex size-8 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                  <FileText className="size-3.5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {file.folder} · {file.version} · updated {file.updated}
                  </p>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {file.size}
                </span>
              </li>
            ))
          )}
          <li className="px-5 py-3">
            <Link
              href="/portal/files"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              All files and contracts
              <ChevronRight className="size-3" aria-hidden="true" />
            </Link>
          </li>
        </ul>
      ) : null}

      {tab === "Invoices" ? (
        <ul className="divide-y divide-border">
          {invoices.length === 0 ? (
            <li className="px-5 py-8 text-center text-sm text-muted-foreground">
              No invoices for this project yet.
            </li>
          ) : (
            invoices.map((invoice) => (
              <li
                key={invoice.id}
                className="flex flex-wrap items-center gap-3 px-5 py-3.5"
              >
                <span className="font-mono text-xs">{invoice.id}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{invoice.kind}</p>
                  <p className="text-xs text-muted-foreground">{invoice.due}</p>
                </div>
                <span className="font-mono text-xs font-semibold">
                  ${invoice.amount.toLocaleString("en-US")}
                </span>
                <StatusBadge
                  tone={invoice.status === "Paid" ? "success" : "warning"}
                >
                  {invoice.status}
                </StatusBadge>
              </li>
            ))
          )}
          <li className="px-5 py-3">
            <Link
              href="/portal/invoices"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              Go to invoices
              <ChevronRight className="size-3" aria-hidden="true" />
            </Link>
          </li>
        </ul>
      ) : null}

      {tab === "Calls" ? (
        <div className="divide-y divide-border">
          <div className="px-5 py-4">
            <p className="text-xs font-semibold text-muted-foreground">
              Upcoming
            </p>
            {calls.upcoming ? (
              <>
                <p className="mt-1 text-sm font-medium">
                  {calls.upcoming.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {calls.upcoming.when} · {calls.upcoming.join}
                </p>
              </>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">
                No call booked.
              </p>
            )}
          </div>
          {calls.past.map((call) => (
            <div key={call.id} className="px-5 py-4">
              <p className="text-sm font-medium">{call.title}</p>
              <p className="text-xs text-muted-foreground">{call.when}</p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {call.notes}
              </p>
              <ul className="mt-2 space-y-1">
                {call.actions.map((action) => (
                  <li
                    key={action}
                    className="flex items-start gap-1.5 text-xs text-muted-foreground"
                  >
                    <Check
                      className="mt-0.5 size-3 shrink-0 text-success"
                      aria-hidden="true"
                    />
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
