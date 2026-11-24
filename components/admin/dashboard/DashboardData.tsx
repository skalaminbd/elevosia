import Link from "next/link";
import {
  AlertTriangle,
  CalendarClock,
  Receipt,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Avatar } from "@/components/admin/ui/Avatar";
import { Progress } from "@/components/admin/ui/Progress";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import {
  getTicketCounts,
  listBlueprintRows,
  listCalls,
  listClients,
  listInvoices,
  listProjects,
  listRequirements,
  listTeam,
} from "@/db/queries";
import { connection } from "next/server";

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

/** Dashboard numbers and lists, read from Postgres at request time. */
export async function DashboardData() {
  await connection();
  const [
    clients,
    requirements,
    calls,
    blueprints,
    team,
    projects,
    invoices,
    tickets,
  ] = await Promise.all([
    listClients(),
    listRequirements(),
    listCalls(),
    listBlueprintRows(),
    listTeam(),
    listProjects(),
    listInvoices(),
    getTicketCounts(),
  ]);

  const leads = clients.filter(
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
  const activeProjects = projects.filter(
    (project) =>
      !project.status.includes("warranty") && project.status !== "On hold",
  ).length;
  const paid = invoices
    .filter((invoice) => invoice.status === "Paid")
    .reduce((total, invoice) => total + invoice.amount, 0);
  const overdue = invoices.filter(
    (invoice) => invoice.status === "Overdue",
  ).length;

  return (
    <>
      <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label="Revenue this month"
          value={`$${paid.toLocaleString("en-US")}`}
          note={`${overdue} ${overdue === 1 ? "invoice" : "invoices"} overdue`}
          icon={Receipt}
        />
        <StatCard
          label="Active projects"
          value={activeProjects}
          note={`${projects.filter((project) => project.status === "Building").length} building, ${projects.filter((project) => project.status === "Review").length} review`}
          icon={Users}
        />
        <StatCard
          label="Waiting on clients"
          value={waiting.length}
          note="Blueprints and approvals"
          icon={CalendarClock}
          tone="warning"
        />
        <StatCard
          label="Tickets near SLA"
          value={tickets.open}
          note={`${tickets.breached} breached`}
          icon={AlertTriangle}
          tone="danger"
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <SectionCard
          title="Waiting on clients"
          description="The oldest items first"
          className="xl:col-span-2"
          bodyClassName="divide-y divide-border"
        >
          {waiting.slice(0, 4).map((requirement) => (
            <Link
              key={requirement.id}
              href={`/admin/requirements/${requirement.id}`}
              className="flex flex-wrap items-center gap-3 px-5 py-3.5 transition-colors hover:bg-secondary/40"
            >
              <Avatar initials={initials(requirement.client)} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {requirement.client}
                </p>
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
            </Link>
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
            <div
              key={blueprint.id}
              className="flex items-center justify-between gap-3 px-5 py-4"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {blueprint.client}
                </p>
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
                  <Progress
                    value={ratio}
                    tone={ratio > 100 ? "danger" : "primary"}
                  />
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
                  {lead.status} · {lead.industry}
                </p>
              </div>
              <StatusBadge tone={lead.status === "Lead" ? "accent" : "info"}>
                {lead.status}
              </StatusBadge>
            </div>
          ))}
        </SectionCard>
      </div>
    </>
  );
}
