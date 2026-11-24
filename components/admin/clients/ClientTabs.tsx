"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, ChevronRight, FolderKanban, Mail, MapPin, ShieldCheck } from "lucide-react";
import { Progress } from "@/components/admin/ui/Progress";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import type {
  AdminClient,
  AdminProject,
  AdminInvoice,
  Requirement,
  Ticket,
} from "@/lib/admin-data";
import { cn } from "@/lib/utils";

type ClientTabsProps = {
  client: AdminClient;
  projects: AdminProject[];
  requirements: Requirement[];
  invoices: AdminInvoice[];
  tickets: Ticket[];
  activity: { id: string; title: string; detail: string; time: string }[];
};

const TABS = [
  "overview",
  "projects",
  "requirements",
  "invoices",
  "tickets",
  "activity",
] as const;
type Tab = (typeof TABS)[number];

const LABELS: Record<Tab, string> = {
  overview: "Overview",
  projects: "Projects",
  requirements: "Requirements",
  invoices: "Invoices",
  tickets: "Tickets",
  activity: "Activity",
};

export function ClientTabs({
  client,
  projects,
  requirements: reqs,
  invoices,
  tickets: clientTickets,
  activity: clientActivity,
}: ClientTabsProps) {
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
        ? `/admin/clients/${client.id}`
        : `/admin/clients/${client.id}?tab=${next}`,
    );
  }

  const projectsByCompany = client.companies.map((company) => ({
    company: company.name,
    items: projects.filter((project) => project.client === company.name),
  }));

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
        <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold">Company</p>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Industry</dt>
                <dd>{client.industry}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Source</dt>
                <dd>{client.source}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Client since</dt>
                <dd>{client.since}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Time zone</dt>
                <dd className="font-mono text-xs">{client.timezone}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold">Contacts</p>
            <div className="mt-3 space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <Mail className="size-3.5 text-muted-foreground" aria-hidden="true" />
                {client.contact}
              </p>
              <p className="text-xs text-muted-foreground">{client.email}</p>
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="size-3.5" aria-hidden="true" />
                Billing and portal email
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold">Access and flags</p>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Portal access</span>
                <StatusBadge tone={client.status === "Former" ? "neutral" : "success"}>
                  {client.status === "Former" ? "Revoked" : "Active"}
                </StatusBadge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">HIPAA mode</span>
                <StatusBadge tone={client.industry === "Care" ? "warning" : "neutral"}>
                  {client.industry === "Care" ? "On" : "Off"}
                </StatusBadge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Assigned PM</span>
                <span>{client.pm}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border p-4 md:col-span-2">
            <p className="text-xs font-semibold">Notes and tags</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Prefers calls before 11 am CT. Uses QuickBooks for accounting. One
              spreadsheet still holds the on-call rota; we are replacing it in week 4.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["Home care", "HIPAA", inventoryTag(client.source), "Weekly calls"].map((tag) => (
                <span key={tag} className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border p-4 md:col-span-2 xl:col-span-1">
            <p className="text-xs font-semibold">Recent activity</p>
            <ul className="mt-2 space-y-2">
              {(clientActivity.length > 0 ? clientActivity : []).map((item) => (
                <li key={item.id} className="text-sm">
                  <span className="block">{item.title}</span>
                  <span className="text-[10px] text-muted-foreground">{item.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {tab === "projects" ? (
        projects.length === 0 ? (
          <EmptyRow text="No projects yet." />
        ) : (
          <div className="divide-y divide-border">
            {projectsByCompany.map(({ company, items }) => (
              <div key={company} className="py-3">
                <div className="flex items-center gap-2 px-5 pb-2">
                  <Building2
                    className="size-3.5 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <p className="text-xs font-semibold">{company}</p>
                  <span className="rounded-full bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                    {items.length}
                  </span>
                </div>
                {items.length === 0 ? (
                  <p className="px-5 py-2 text-xs text-muted-foreground">
                    No projects under this company yet.
                  </p>
                ) : (
                  <ul className="space-y-1 px-2">
                    {items.map((project) => (
                      <li key={project.id}>
                        <Link
                          href={`/admin/projects/${project.id}`}
                          className="group flex flex-wrap items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-secondary/40"
                        >
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors group-hover:text-foreground">
                            <FolderKanban className="size-4" aria-hidden="true" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium group-hover:underline">
                              {project.name}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {project.status} · {project.modules} modules · due{" "}
                              {project.due}
                            </p>
                          </div>
                          <div className="hidden w-32 sm:block">
                            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                              <span>Progress</span>
                              <span className="font-mono tabular-nums">
                                {project.progress}%
                              </span>
                            </div>
                            <div className="mt-1">
                              <Progress value={project.progress} />
                            </div>
                          </div>
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
                          <ChevronRight
                            className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
                            aria-hidden="true"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )
      ) : null}

      {tab === "requirements" ? (
        <SimpleList
          rows={reqs.map((requirement) => ({
            id: requirement.id,
            title: requirement.title,
            meta: `${requirement.submitted} · ${requirement.status}`,
            href: `/admin/requirements/${requirement.id}`,
            badge: requirement.status,
          }))}
          empty="No requirements from this client."
        />
      ) : null}

      {tab === "invoices" ? (
        <SimpleList
          rows={invoices.map((invoice) => ({
            id: invoice.id,
            title: `${invoice.id} · $${invoice.amount.toLocaleString("en-US")}`,
            meta: `${invoice.kind} · ${invoice.due}`,
            href: `/admin/invoices/${invoice.id}`,
            badge: invoice.status,
          }))}
          empty="No invoices for this client."
        />
      ) : null}

      {tab === "tickets" ? (
        <SimpleList
          rows={clientTickets.map((ticket) => ({
            id: ticket.id,
            title: ticket.subject,
            meta: `${ticket.priority} · ${ticket.sla}`,
            href: `/admin/tickets/${ticket.id}`,
            badge: ticket.status,
          }))}
          empty="No tickets from this client."
        />
      ) : null}

      {tab === "activity" ? (
        <ul className="divide-y divide-border">
          {(clientActivity.length > 0 ? clientActivity : []).map((item) => (
            <li key={item.id} className="flex items-start gap-3 px-5 py-3.5">
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                <ShieldCheck className="size-3" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.detail}</p>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">{item.time}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function inventoryTag(source: string) {
  return source === "Referral" ? "Founding client" : "Website lead";
}

function EmptyRow({ text }: { text: string }) {
  return (
    <li className="px-5 py-10 text-center text-sm text-muted-foreground">{text}</li>
  );
}

function SimpleList({
  rows,
  empty,
}: {
  rows: { id: string; title: string; meta: string; href: string; badge?: string }[];
  empty: string;
}) {
  return (
    <ul className="divide-y divide-border">
      {rows.length === 0 ? (
        <EmptyRow text={empty} />
      ) : (
        rows.map((row) => (
          <li key={row.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
            <div className="min-w-0 flex-1">
              <Link href={row.href} className="text-sm font-medium hover:underline">
                {row.title}
              </Link>
              <p className="text-xs text-muted-foreground">{row.meta}</p>
            </div>
            {row.badge ? <StatusBadge tone="neutral">{row.badge}</StatusBadge> : null}
            <ChevronRight className="size-4 text-muted-foreground" aria-hidden="true" />
          </li>
        ))
      )}
    </ul>
  );
}
