import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarClock,
  Check,
  ClipboardCheck,
  FileText,
  MessageSquare,
  Plus,
  Receipt,
  Sparkles,
  Video,
} from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { NewRequirementDialog } from "@/components/portal/NewRequirementDialog";
import { NewRequestDialog } from "@/components/portal/NewRequestDialog";
import { Progress } from "@/components/admin/ui/Progress";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import {
  boardWeeks,
  portalCalls,
  portalClient,
  portalProjects,
  retainer,
} from "@/lib/portal-data";

export const metadata: Metadata = {
  title: "Home | Elevosia client portal",
};

const WAITING = [
  {
    id: "w1",
    title: "Week 3 plan",
    detail: "Clients and portal screens, ready to start Monday.",
    href: "/portal/approvals",
    badge: "Due today",
    tone: "warning" as const,
    icon: ClipboardCheck,
  },
  {
    id: "w2",
    title: "Invoice INV-1048",
    detail: "$4,800 due 2 December.",
    href: "/portal/invoices",
    badge: "Due",
    tone: "warning" as const,
    icon: Receipt,
  },
  {
    id: "w3",
    title: "Growth care agreement",
    detail: "Waiting for your signature.",
    href: "/portal/files?tab=contracts",
    badge: "Sign",
    tone: "accent" as const,
    icon: FileText,
  },
  {
    id: "w4",
    title: "Change request · family access",
    detail: "Add a second family contact. +$900, +3 days.",
    href: "/portal/approvals",
    badge: "Review",
    tone: "neutral" as const,
    icon: ClipboardCheck,
  },
];

const UPDATES = [
  { id: "u1", title: "Week 3 plan sent for approval", meta: "Care dashboard · Today", tone: "accent" as const },
  { id: "u2", title: "Visit history imported", meta: "Care dashboard · Yesterday", tone: "success" as const },
  { id: "u3", title: "Weekly call notes published", meta: "Care dashboard · 15 Nov", tone: "neutral" as const },
  { id: "u4", title: "October report published", meta: "Reports · 1 Nov", tone: "neutral" as const },
  { id: "u5", title: "Scheduling designs approved", meta: "Care dashboard · 6 Nov", tone: "success" as const },
];

const QUICK_ACTIONS = [
  { id: "new-project", label: "Start a new project", href: "/portal/requirements/new", icon: Plus },
  { id: "ticket", label: "Open a ticket", href: "/portal/tickets", icon: MessageSquare },
  { id: "call", label: "Book a call", href: "/portal/calls", icon: Video },
  { id: "request", label: "Request new work", href: "/portal/requests/new", icon: Sparkles },
];

export default function PortalHomePage() {
  const project = portalProjects[0];
  const week = boardWeeks[0];
  const done = week.tasks.filter((task) => task.state === "done").length;

  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title={`Welcome back, ${portalClient.firstName}`}
        meta="Wednesday 19 November"
        description={`${portalClient.company} · ${project.name}, ${project.phase}.`}
      />

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <div className="rounded-lg bg-primary p-6 text-primary-foreground dark:bg-secondary dark:text-foreground">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs text-primary-foreground/60 dark:text-foreground/60">
                  Active project
                </p>
                <h2 className="mt-1 font-heading text-xl font-semibold tracking-tight sm:text-2xl">
                  {project.name}
                </h2>
                <p className="mt-1 text-sm text-primary-foreground/70 dark:text-foreground/70">
                  {project.phase} · next milestone {project.nextMilestone}
                </p>
              </div>
              <StatusBadge tone="success">{project.health}</StatusBadge>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between text-xs text-primary-foreground/70 dark:text-foreground/70">
                <span>{done} of {week.tasks.length} tasks done this week</span>
                <span className="font-mono">{project.progress}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-primary-foreground/15 dark:bg-foreground/15">
                <span
                  className="block h-full rounded-full bg-highlight"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                href={`/portal/projects/${project.id}`}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-background px-3.5 text-xs font-medium text-foreground transition-colors hover:bg-background/90"
              >
                Open project
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </Link>
              <Link
                href="/portal/messages"
                className="inline-flex h-9 items-center rounded-lg px-3 text-xs font-medium text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10 dark:text-foreground/80 dark:hover:bg-foreground/10"
              >
                Message your PM
              </Link>
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <SectionCard
              title="Waiting for you"
              description="Two minutes, no calls needed"
              action={
                <span className="font-mono text-[10px] text-muted-foreground">
                  {WAITING.length}
                </span>
              }
              bodyClassName="divide-y divide-border"
            >
              {WAITING.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-secondary/40"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                      <Icon className="size-3.5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {item.detail}
                      </span>
                    </span>
                    <StatusBadge tone={item.tone}>{item.badge}</StatusBadge>
                  </Link>
                );
              })}
            </SectionCard>

            <SectionCard
              title="Quick actions"
              description="Everything starts here"
              bodyClassName="grid grid-cols-2 gap-2 p-3"
            >
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                const className =
                  "flex w-full flex-col items-start gap-2 rounded-md border border-border p-3 text-left text-xs font-medium transition-colors hover:border-primary/30 hover:bg-secondary/40";
                const content = (
                  <>
                    <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="size-3.5" aria-hidden="true" />
                    </span>
                    {action.label}
                  </>
                );

                if (action.id === "new-project") {
                  return (
                    <NewRequirementDialog key={action.id}>
                      <button type="button" className={className}>
                        {content}
                      </button>
                    </NewRequirementDialog>
                  );
                }
                if (action.id === "request") {
                  return (
                    <NewRequestDialog key={action.id}>
                      <button type="button" className={className}>
                        {content}
                      </button>
                    </NewRequestDialog>
                  );
                }
                return (
                  <Link key={action.id} href={action.href} className={className}>
                    {content}
                  </Link>
                );
              })}
            </SectionCard>
          </div>
        </div>

        <div className="space-y-4">
          <SectionCard title="Upcoming call" description="Friday 22 Nov">
            <div className="p-5">
              <p className="text-sm font-medium">{portalCalls.upcoming.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {portalCalls.upcoming.when} · {portalCalls.upcoming.with}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <Link
                  href="/portal/calls"
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Call details
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </Link>
                <span className="text-[10px] text-muted-foreground">
                  {portalCalls.upcoming.join}
                </span>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Your care plan" description={retainer.plan}>
            <div className="p-5">
              <div className="flex items-baseline justify-between">
                <p className="font-mono text-2xl font-semibold tabular-nums">
                  {retainer.used} h
                </p>
                <p className="text-xs text-muted-foreground">
                  of {retainer.hours} h this month
                </p>
              </div>
              <div className="mt-2">
                <Progress value={(retainer.used / retainer.hours) * 100} />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {retainer.sla} · renews {retainer.next}
              </p>
            </div>
          </SectionCard>

          <SectionCard
            title="Latest updates"
            description="Across your projects"
            bodyClassName="divide-y divide-border"
          >
            {UPDATES.map((update) => (
              <div key={update.id} className="flex items-start gap-3 px-5 py-3">
                <span className="mt-1 flex size-4 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                  <Check className="size-2.5" strokeWidth={3} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm">{update.title}</p>
                  <p className="text-[10px] text-muted-foreground">{update.meta}</p>
                </div>
              </div>
            ))}
          </SectionCard>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Link
          href="/portal/invoices"
          className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30"
        >
          <div className="flex items-center justify-between gap-2">
            <StatusBadge tone="warning">Invoice</StatusBadge>
            <span className="font-mono text-[10px] text-muted-foreground">INV-1048</span>
          </div>
          <p className="mt-2 text-sm font-medium">$4,800 due 2 December</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Last milestone invoice for the care dashboard.
          </p>
        </Link>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <CalendarClock className="size-4 text-primary" aria-hidden="true" />
            <p className="text-sm font-medium">Next milestone</p>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{project.nextMilestone}</p>
          <p className="mt-1 text-xs text-muted-foreground">Approval unlocks billing.</p>
        </div>
        <Link
          href="/portal/messages"
          className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30"
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="size-4 text-primary" aria-hidden="true" />
            <p className="text-sm font-medium">Your PM</p>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Alamin · replies in one business day</p>
          <p className="mt-1 text-xs text-muted-foreground">Send a message from the portal.</p>
        </Link>
      </div>
    </div>
  );
}
