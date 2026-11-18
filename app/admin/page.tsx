import type { Metadata } from "next";
import {
  AlertTriangle,
  CalendarClock,
  Receipt,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Avatar } from "@/components/admin/ui/Avatar";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Progress } from "@/components/admin/ui/Progress";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { adminClients, blueprints, calls, requirements, team } from "@/lib/admin-data";

export const metadata: Metadata = {
  title: "Overview | Elevosia Admin",
};

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

export default function AdminDashboardPage() {
  const leads = adminClients.filter(
    (client) => client.status === "Lead" || client.status === "Onboarding",
  );
  const waiting = requirements.filter(
    (requirement) =>
      requirement.status !== "Converted" && requirement.status !== "Declined",
  );
  const today = calls.filter((call) => call.day === "Today");
  const dueBlueprints = blueprints.filter(
    (blueprint) =>
      blueprint.status === "Waiting for approval" || blueprint.status === "Draft",
  );

  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="Good morning, Alamin"
        meta="Wednesday 19 November"
        description="Three things need you today, and two calls sit before lunch."
      />

      <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-5">
        <div className="flex items-start gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold">AI briefing</p>
            <p className="mt-1 max-w-3xl text-sm text-foreground/80">
              Two Blueprints are waiting for a client answer, and Lumen Studio
              has been waiting a day on a change request. Northwind launches
              this week — the checklist is still unsent. Nothing else needs you
              before the 9:30 call.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="Revenue this month" value="$42,800" note="3 invoices overdue" icon={Receipt} />
        <StatCard label="Active projects" value={4} note="2 building, 1 review" icon={Users} />
        <StatCard label="Waiting on clients" value={waiting.length} note="Blueprints and approvals" icon={CalendarClock} tone="warning" />
        <StatCard label="Tickets near SLA" value={2} note="1 breached" icon={AlertTriangle} tone="danger" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <SectionCard
          title="Waiting on clients"
          description="The oldest items first"
          className="xl:col-span-2"
          bodyClassName="divide-y divide-border"
        >
          {waiting
            .slice(0, 4)
            .map((requirement) => (
              <div
                key={requirement.id}
                className="flex flex-wrap items-center gap-3 px-5 py-3.5"
              >
                <Avatar initials={initials(requirement.client)} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{requirement.client}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {requirement.title}
                  </p>
                </div>
                <StatusBadge
                  tone={
                    requirement.overdue
                      ? "danger"
                      : requirement.status === "In review"
                        ? "warning"
                        : "neutral"
                  }
                >
                  {requirement.overdue ? "Overdue" : requirement.status}
                </StatusBadge>
                <span className="w-16 shrink-0 text-right font-mono text-[10px] text-muted-foreground">
                  {requirement.due}
                </span>
              </div>
            ))}
        </SectionCard>

        <SectionCard
          title="Today"
          description={`${today.length} calls · US Eastern`}
          bodyClassName="p-2"
        >
          <ul>
            {today.map((call) => (
              <li
                key={call.id}
                className="flex gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-secondary/50"
              >
                <span className="w-14 shrink-0 font-mono text-[11px] text-muted-foreground">
                  {call.time}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{call.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {call.client} · {call.owner}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <SectionCard
          title="Blueprints due"
          description="Draft and waiting on approval"
          bodyClassName="divide-y divide-border"
        >
          {dueBlueprints.map((blueprint) => (
            <div key={blueprint.id} className="flex items-center justify-between gap-3 px-5 py-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{blueprint.client}</p>
                <p className="text-xs text-muted-foreground">
                  {blueprint.title} · {blueprint.version}
                </p>
              </div>
              <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                {blueprint.validUntil}
              </span>
            </div>
          ))}
        </SectionCard>

        <SectionCard
          title="Team workload"
          description="Planned vs capacity this week"
          bodyClassName="divide-y divide-border"
        >
          {team.slice(0, 4).map((member) => {
            const ratio = Math.round((member.planned / member.capacity) * 100);
            return (
              <div key={member.id} className="px-5 py-3">
                <div className="flex items-center gap-2.5">
                  <Avatar initials={member.initials} />
                  <p className="min-w-0 flex-1 truncate text-sm font-medium">
                    {member.name}
                  </p>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {member.planned} h
                  </span>
                </div>
                <div className="mt-2">
                  <Progress value={ratio} tone={ratio > 100 ? "danger" : "primary"} />
                </div>
              </div>
            );
          })}
        </SectionCard>

        <SectionCard
          title="Needs attention"
          description="Deadlines and new leads"
          bodyClassName="divide-y divide-border"
        >
          <div className="flex items-start gap-3 px-5 py-4">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-warning/10 text-warning">
              <ShieldCheck className="size-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-medium">Warranty ends 18 Dec</p>
              <p className="text-xs text-muted-foreground">
                Harbor Therapy · ask about the Growth care plan.
              </p>
            </div>
          </div>
          {leads.map((lead) => (
            <div key={lead.id} className="flex items-center gap-3 px-5 py-4">
              <Avatar initials={lead.initials} muted />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{lead.name}</p>
                <p className="text-xs text-muted-foreground">
                  New lead · {lead.industry}
                </p>
              </div>
              <StatusBadge tone={lead.status === "Lead" ? "accent" : "info"}>
                {lead.status}
              </StatusBadge>
            </div>
          ))}
        </SectionCard>
      </div>
    </div>
  );
}
