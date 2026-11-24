import Link from "next/link";
import { connection } from "next/server";
import {
  ArrowUpRight,
  CalendarClock,
  Check,
  ClipboardCheck,
  FileText,
  LifeBuoy,
  MessageSquare,
  Plus,
  Receipt,
  Sparkles,
  Video,
} from "lucide-react";
import { NewRequestDialog } from "@/components/portal/NewRequestDialog";
import { PortalHomeHeader } from "@/components/portal/PortalHomeHeader";
import { Progress } from "@/components/admin/ui/Progress";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { ButtonLink } from "@/components/shared/ButtonLink";
import {
  listActivities,
  listPortalApprovals,
  listPortalCalls,
  listPortalContracts,
  listPortalInvoices,
  listPortalProjects,
  getPortalRetainer,
} from "@/db/queries";
import { requirePortalClientId } from "@/lib/portal-session";

const QUICK_ACTIONS = [
  { id: "new-project", label: "Start a new project", href: "/portal/requirements/new", icon: Plus },
  { id: "ticket", label: "Open a ticket", href: "/portal/tickets", icon: MessageSquare },
  { id: "call", label: "Book a call", href: "/portal/calls", icon: Video },
  { id: "request", label: "Request new work", href: "/portal/requests/new", icon: Sparkles },
];

/** Portal home, pulled from Postgres at request time. */
export async function PortalHomeData() {
  await connection();
  const clientId = await requirePortalClientId();
  const [projects, approvals, invoices, calls, activities, contracts, plan] =
    await Promise.all([
      listPortalProjects(clientId),
      listPortalApprovals(clientId),
      listPortalInvoices(clientId),
      listPortalCalls(clientId),
      listActivities(),
      listPortalContracts(clientId),
      getPortalRetainer(clientId),
    ]);
  const retainer = plan ?? {
    plan: "Care plan",
    price: 0,
    hours: 1,
    used: 0,
    next: "—",
    sla: "",
    work: [],
  };

  const project = projects.find((item) => item.status === "Active") ?? projects[0];
  const openInvoices = invoices.filter((invoice) => invoice.status !== "Paid");
  const pendingContract = contracts.find(
    (contract) => contract.status !== "Signed",
  );

  const waiting = [
    ...approvals.slice(0, 2).map((approval) => ({
      id: approval.id,
      title: approval.title,
      detail: approval.detail,
      href: "/portal/approvals",
      badge: approval.due,
      tone: "warning" as const,
      icon: ClipboardCheck,
    })),
    ...openInvoices.slice(0, 1).map((invoice) => ({
      id: invoice.id,
      title: `Invoice ${invoice.id}`,
      detail: `$${invoice.amount.toLocaleString("en-US")} due ${invoice.due}`,
      href: "/portal/invoices",
      badge: "Due",
      tone: "warning" as const,
      icon: Receipt,
    })),
    ...(pendingContract
      ? [
          {
            id: pendingContract.id,
            title: pendingContract.name,
            detail: "Waiting for your signature.",
            href: "/portal/files?tab=contracts",
            badge: "Sign",
            tone: "accent" as const,
            icon: FileText,
          },
        ]
      : []),
  ];

  const updates = activities
    .filter((item) => item.detail.includes("Brightline"))
    .slice(0, 5);

  if (!project) {
    return (
      <div className="mt-6 rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        No project yet. Your build appears here once it starts.
      </div>
    );
  }

  return (
    <>
      <PortalHomeHeader
        meta="Client portal"
        projectName={project.name}
        phase={project.phase}
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
                <span>Progress across the plan</span>
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
                href="/portal/tickets"
                className="inline-flex h-9 items-center rounded-lg px-3 text-xs font-medium text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10 dark:text-foreground/80 dark:hover:bg-foreground/10"
              >
                Open a ticket
              </Link>
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <SectionCard
              title="Waiting for you"
              description="Two minutes, no calls needed"
              action={
                <span className="font-mono text-[10px] text-muted-foreground">
                  {waiting.length}
                </span>
              }
              bodyClassName="divide-y divide-border"
            >
              {waiting.map((item) => {
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

                if (action.id === "request") {
                  return (
                    <NewRequestDialog key={action.id} retainer={retainer}>
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
          <SectionCard title="Upcoming call" description="This week">
            <div className="p-5">
              <p className="text-sm font-medium">
                {calls.upcoming?.title ?? "No call booked"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {calls.upcoming
                  ? `${calls.upcoming.when} · ${calls.upcoming.with}`
                  : "Book one whenever you need it."}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <ButtonLink href="/portal/calls">Call details</ButtonLink>
                <span className="text-[10px] text-muted-foreground">
                  {calls.upcoming?.join ?? ""}
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
            {updates.length === 0 ? (
              <p className="px-5 py-4 text-sm text-muted-foreground">
                Nothing new yet.
              </p>
            ) : (
              updates.map((update) => (
                <div key={update.id} className="flex items-start gap-3 px-5 py-3">
                  <span className="mt-1 flex size-4 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                    <Check
                      className="size-2.5"
                      strokeWidth={3}
                      aria-hidden="true"
                    />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm">{update.title}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {update.detail} · {update.time}
                    </p>
                  </div>
                </div>
              ))
            )}
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
            <span className="font-mono text-[10px] text-muted-foreground">
              {openInvoices[0]?.id ?? "None open"}
            </span>
          </div>
          <p className="mt-2 text-sm font-medium">
            {openInvoices[0]
              ? `$${openInvoices[0].amount.toLocaleString("en-US")} due ${openInvoices[0].due}`
              : "Everything is paid"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Every invoice lives under Billing.
          </p>
        </Link>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <CalendarClock className="size-4 text-primary" aria-hidden="true" />
            <p className="text-sm font-medium">Next milestone</p>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {project.nextMilestone}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Approval unlocks billing.
          </p>
        </div>
        <Link
          href="/portal/tickets"
          className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30"
        >
          <div className="flex items-center gap-2">
            <LifeBuoy className="size-4 text-primary" aria-hidden="true" />
            <p className="text-sm font-medium">Support tickets</p>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Open one and your PM replies in one business day
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Send a message from the portal.
          </p>
        </Link>
      </div>
    </>
  );
}
