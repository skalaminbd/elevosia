"use client";

import { motion } from "motion/react";
import {
  CalendarDays,
  Check,
  Search,
  Send,
  Sparkles,
} from "lucide-react";
import {
  demoAiQuestions,
  demoBriefing,
  demoCaregivers,
  demoClients,
  demoInvoices,
  demoJobs,
  demoKpis,
  demoPortalTasks,
  demoShifts,
  demoWeek,
} from "@/content/demo";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type DemoViewProps = {
  filled: boolean;
  filling: boolean;
  reminded: boolean;
  sending: boolean;
  approved: boolean;
  portalPaid: boolean;
  query: string;
  aiId: string | null;
  aiText: string;
  onQuery: (value: string) => void;
  onAutoFill: () => void;
  onRemind: () => void;
  onAsk: (id: string) => void;
  onApprove: () => void;
  onPay: () => void;
  onGoAsk: () => void;
};

const STATUS: Record<string, string> = {
  paid: "bg-success/10 text-success",
  late: "bg-destructive/10 text-destructive",
  open: "bg-secondary text-muted-foreground",
};

export function OverviewView({
  filled,
  reminded,
  onGoAsk,
}: Pick<DemoViewProps, "filled" | "reminded" | "onGoAsk">) {
  const briefing = filled
    ? reminded
      ? demoBriefing.both
      : demoBriefing.filled
    : reminded
      ? demoBriefing.reminders
      : demoBriefing.base;

  const shifts = filled ? 0 : 3;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="font-heading text-xl font-semibold tracking-tight">
            Good morning, Sarah
          </h3>
          <p className="text-xs text-muted-foreground">
            Monday 18 November · 6 visits on the board
          </p>
        </div>
        <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] text-muted-foreground">
          Monday
        </span>
      </div>

      <div className="rounded-lg border border-primary/20 bg-primary/5 p-3.5">
        <div className="flex items-center gap-2">
          <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
          <p className="text-xs font-semibold">AI briefing</p>
        </div>
        <p className="mt-1.5 text-sm text-foreground/80">{briefing}</p>
        <button
          type="button"
          onClick={onGoAsk}
          className="mt-2 text-xs font-medium text-primary hover:underline"
        >
          Ask a follow-up
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {demoKpis.map((kpi) => (
          <div
            key={kpi.id}
            className="rounded-lg border border-border bg-background p-3"
          >
            <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
            <p className="mt-1 font-mono text-lg font-semibold tabular-nums">
              {kpi.id === "shifts" ? (
                shifts
              ) : kpi.prefix ? (
                <>
                  {kpi.prefix}
                  <NumberTicker value={kpi.value} />
                </>
              ) : (
                <NumberTicker value={kpi.value} />
              )}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-5">
        <div className="rounded-lg border border-border bg-background p-3.5 lg:col-span-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold">Visits this week</p>
            <span className="font-mono text-[10px] text-muted-foreground">
              425 total
            </span>
          </div>
          <div className="mt-4 flex h-24 items-end gap-1.5">
            {demoWeek.map((day, index) => (
              <div
                key={day.day}
                className="flex h-full flex-1 flex-col items-center justify-end gap-1"
              >
                <span
                  className={cn(
                    "w-full origin-bottom rounded-t-sm",
                    index === 3 ? "bg-primary" : "bg-primary/25",
                  )}
                  style={{ height: `${day.value}%` }}
                />
                <span className="text-[9px] text-muted-foreground">
                  {day.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-background p-3.5 lg:col-span-2">
          <p className="text-xs font-semibold">Today&apos;s jobs</p>
          <ul className="mt-2.5 space-y-1.5">
            {demoJobs.map((job, index) => (
              <li
                key={job.id}
                className="flex items-center justify-between gap-2 rounded-md border border-border px-2 py-1.5"
              >
                <span className="min-w-0">
                  <span className="block truncate text-[10px] font-medium">
                    {job.title}
                  </span>
                  <span className="block truncate text-[9px] text-muted-foreground">
                    {filled && !job.done
                      ? job.meta.replace("Unassigned", demoCaregivers[index % 3])
                      : job.meta}
                  </span>
                </span>
                <span
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded-full",
                    job.done || filled
                      ? "bg-success text-success-foreground"
                      : "border border-muted-foreground/40",
                  )}
                >
                  {job.done || filled ? (
                    <Check className="size-2.5" strokeWidth={3} aria-hidden="true" />
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function ScheduleView({
  filled,
  filling,
  onAutoFill,
}: Pick<DemoViewProps, "filled" | "filling" | "onAutoFill">) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-heading text-lg font-semibold tracking-tight">
            Next 7 days
          </h3>
          <p className="text-xs text-muted-foreground">
            {filled ? "All shifts covered" : "3 open shifts need a caregiver"}
          </p>
        </div>
        <button
          type="button"
          onClick={onAutoFill}
          disabled={filling || filled}
          className={cn(
            "inline-flex min-h-9 items-center gap-2 rounded-md px-3 text-xs font-medium transition-colors",
            autoFillClass(filled),
          )}
        >
          <Sparkles className="size-3.5" aria-hidden="true" />
          {filling ? "Matching…" : filled ? "All covered" : "Auto-fill open shifts"}
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        {demoShifts.map((shift, index) => {
          const showSkeleton = filling && shift.open;
          const showCaregiver = shift.caregiver || filled;
          const caregiver =
            shift.caregiver ?? demoCaregivers[index % demoCaregivers.length];

          return (
            <div
              key={shift.id}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5",
                index > 0 && "border-t border-border",
                shift.open && "bg-primary/[0.03]",
              )}
            >
              <div className="w-12 shrink-0">
                <p className="text-[10px] font-semibold">{shift.day}</p>
                <p className="text-[9px] text-muted-foreground">{shift.date}</p>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">{shift.client}</p>
                <p className="text-[10px] text-muted-foreground">{shift.time}</p>
              </div>

              {showSkeleton ? (
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-16 animate-pulse rounded-full bg-primary/20" />
                  <span className="text-[9px] text-muted-foreground">matching</span>
                </span>
              ) : showCaregiver ? (
                <motion.span
                  key={`${shift.id}-${filled}`}
                  initial={filled ? { opacity: 0, x: 8 } : false}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 font-mono text-[8px] font-semibold text-primary">
                    {initials(caregiver)}
                  </span>
                  <span className="hidden text-[10px] text-muted-foreground sm:block">
                    {caregiver}
                  </span>
                </motion.span>
              ) : (
                <span className="rounded-full bg-warning/10 px-2 py-0.5 text-[9px] font-medium text-warning">
                  Open
                </span>
              )}
            </div>
          );
        })}
      </div>

      {filled ? (
        <p className="flex items-center gap-1.5 text-[11px] text-success">
          <Check className="size-3.5" aria-hidden="true" />
          Matched by skill, travel time and hours this week. You can swap anyone.
        </p>
      ) : null}
    </div>
  );
}

function autoFillClass(filled: boolean) {
  return filled
    ? "cursor-default bg-success/10 text-success"
    : "bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60";
}

export function ClientsView({
  query,
  onQuery,
  filled,
}: Pick<DemoViewProps, "query" | "onQuery" | "filled">) {
  const needle = query.trim().toLowerCase();
  const clients = demoClients.filter(
    (client) =>
      client.name.toLowerCase().includes(needle) ||
      client.area.toLowerCase().includes(needle),
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-heading text-lg font-semibold tracking-tight">
            Clients
          </h3>
          <p className="text-xs text-muted-foreground">
            {demoClients.length} active care plans
          </p>
        </div>
        <div className="relative w-full sm:w-56">
          <Search
            className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            placeholder="Search clients"
            aria-label="Search clients"
            className="h-9 pl-8 text-xs"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        {clients.length === 0 ? (
          <p className="p-6 text-center text-xs text-muted-foreground">
            No client matches “{query}”. Try a name or an area.
          </p>
        ) : (
          clients.map((client, index) => (
            <div
              key={client.id}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5",
                index > 0 && "border-t border-border",
              )}
            >
              <span className="flex size-7 items-center justify-center rounded-full bg-secondary font-mono text-[9px] font-semibold text-muted-foreground">
                {initials(client.name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">{client.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {client.area} · {client.visits}
                  {filled ? " visits this week" : " visits due"}
                </p>
              </div>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[9px] font-medium",
                  client.status === "Active"
                    ? "bg-success/10 text-success"
                    : client.status === "New"
                      ? "bg-info/10 text-info"
                      : "bg-warning/10 text-warning",
                )}
              >
                {client.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function InvoicesView({
  reminded,
  sending,
  onRemind,
}: Pick<DemoViewProps, "reminded" | "sending" | "onRemind">) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-heading text-lg font-semibold tracking-tight">
            Invoices
          </h3>
          <p className="text-xs text-muted-foreground">
            {reminded ? "Reminders sent to both late clients" : "2 late invoices"}
          </p>
        </div>
        <button
          type="button"
          onClick={onRemind}
          disabled={sending || reminded}
          className={cn(
            "inline-flex min-h-9 items-center gap-2 rounded-md px-3 text-xs font-medium transition-colors",
            reminded
              ? "cursor-default bg-success/10 text-success"
              : "bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60",
          )}
        >
          <Send className="size-3.5" aria-hidden="true" />
          {sending ? "Sending…" : reminded ? "Reminders sent" : "Send reminders to late clients"}
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        {demoInvoices.map((invoice, index) => (
          <div
            key={invoice.id}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5",
              index > 0 && "border-t border-border",
            )}
          >
            <span className="w-16 shrink-0 font-mono text-[10px] text-muted-foreground">
              {invoice.id}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{invoice.client}</p>
              <p className="text-[10px] text-muted-foreground">{invoice.due}</p>
            </div>
            <span className="font-mono text-xs tabular-nums">
              ${invoice.amount.toLocaleString("en-US")}
            </span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[9px] font-medium",
                STATUS[invoice.status],
              )}
            >
              {invoice.status === "late" && reminded
                ? "Reminded"
                : invoice.status === "paid"
                  ? "Paid"
                  : invoice.status === "late"
                    ? "Late"
                    : "Open"}
            </span>
          </div>
        ))}
      </div>

      {reminded ? (
        <p className="flex items-center gap-1.5 text-[11px] text-success">
          <Check className="size-3.5" aria-hidden="true" />
          Polite reminders sent. They stop automatically when a client pays.
        </p>
      ) : null}
    </div>
  );
}

export function AiView({
  aiId,
  aiText,
  onAsk,
}: Pick<DemoViewProps, "aiId" | "aiText" | "onAsk">) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-heading text-lg font-semibold tracking-tight">
          Ask your data
        </h3>
        <p className="text-xs text-muted-foreground">
          Four questions clients ask most. Answers come from this dashboard.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {demoAiQuestions.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onAsk(item.id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-[11px] transition-colors",
              aiId === item.id
                ? "border-primary bg-primary/5 font-medium text-primary"
                : "border-border text-muted-foreground hover:bg-secondary/60",
            )}
          >
            {item.question}
          </button>
        ))}
      </div>

      <div className="min-h-[210px] rounded-lg border border-border bg-background p-4">
        {aiId ? (
          <div className="flex gap-2.5">
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Sparkles className="size-3" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-medium">
                {demoAiQuestions.find((item) => item.id === aiId)?.question}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                {aiText}
                <span className="ml-0.5 inline-block h-4 w-px translate-y-0.5 animate-[blink-cursor_1s_steps(1)_infinite] bg-primary" />
              </p>
            </div>
          </div>
        ) : (
          <div className="flex h-[180px] flex-col items-center justify-center text-center">
            <Sparkles className="size-5 text-muted-foreground" aria-hidden="true" />
            <p className="mt-2 text-xs text-muted-foreground">
              Pick a question to see how it answers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function PortalView({
  approved,
  portalPaid,
  onApprove,
  onPay,
}: Pick<DemoViewProps, "approved" | "portalPaid" | "onApprove" | "onPay">) {
  const done = demoPortalTasks.filter((task) => task.state === "done").length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-md bg-primary text-[9px] font-bold text-primary-foreground">
            B
          </span>
          <div>
            <p className="text-xs font-semibold">Brightline Care · client portal</p>
            <p className="text-[9px] text-muted-foreground">
              What your client sees during the build
            </p>
          </div>
        </div>
        <span className="rounded-full bg-secondary px-2 py-0.5 text-[9px] text-muted-foreground">
          Week 3 of 6
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-background p-3.5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold">This week</p>
            <span className="font-mono text-[10px] text-muted-foreground">
              {done}/5
            </span>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-secondary">
            <span
              className="block h-full rounded-full bg-primary transition-[width] duration-500"
              style={{ width: `${(done / 5) * 100}%` }}
            />
          </div>
          <ul className="mt-3 space-y-1.5">
            {demoPortalTasks.map((task) => (
              <li key={task.id} className="flex items-center gap-2 text-[11px]">
                <span
                  className={cn(
                    "flex size-3.5 shrink-0 items-center justify-center rounded-full",
                    task.state === "done"
                      ? "bg-success text-success-foreground"
                      : task.state === "progress"
                        ? "border border-primary/40"
                        : "border border-border",
                  )}
                >
                  {task.state === "done" ? (
                    <Check className="size-2" strokeWidth={3} aria-hidden="true" />
                  ) : task.state === "progress" ? (
                    <span className="size-1 rounded-full bg-primary" />
                  ) : null}
                </span>
                <span
                  className={cn(
                    task.state === "done"
                      ? "text-muted-foreground line-through"
                      : "text-foreground",
                  )}
                >
                  {task.title}
                </span>
                <span className="ml-auto text-[9px] text-muted-foreground">
                  {task.state === "done"
                    ? "Done"
                    : task.state === "progress"
                      ? "In progress"
                      : "Next"}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <div className="rounded-lg border border-border bg-background p-3.5">
            <p className="text-xs font-semibold">Waiting for you</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Approve week 3 so the build can start on invoices.
            </p>
            <button
              type="button"
              onClick={onApprove}
              disabled={approved}
              className={cn(
                "mt-2.5 inline-flex min-h-8 items-center gap-1.5 rounded-md px-2.5 text-[11px] font-medium",
                approved
                  ? "cursor-default bg-success/10 text-success"
                  : "bg-primary text-primary-foreground hover:bg-primary/90",
              )}
            >
              {approved ? (
                <>
                  <Check className="size-3" aria-hidden="true" /> Approved
                </>
              ) : (
                "Approve this week"
              )}
            </button>
          </div>

          <div className="rounded-lg border border-border bg-background p-3.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold">Invoice</p>
              <span className="font-mono text-[10px] text-muted-foreground">
                INV-1045
              </span>
            </div>
            <p className="mt-1 font-mono text-lg font-semibold tabular-nums">
              $640
            </p>
            <button
              type="button"
              onClick={onPay}
              disabled={portalPaid}
              className={cn(
                "mt-2 inline-flex min-h-8 items-center gap-1.5 rounded-md px-2.5 text-[11px] font-medium",
                portalPaid
                  ? "cursor-default bg-success/10 text-success"
                  : "bg-primary text-primary-foreground hover:bg-primary/90",
              )}
            >
              {portalPaid ? (
                <>
                  <Check className="size-3" aria-hidden="true" /> Paid
                </>
              ) : (
                "Pay invoice"
              )}
            </button>
          </div>

          <p className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <CalendarDays className="size-3" aria-hidden="true" />
            Next demo: Friday 22 Nov
          </p>
        </div>
      </div>
    </div>
  );
}

function initials(name: string) {
  return name
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
