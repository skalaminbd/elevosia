"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronRight, FolderKanban, Mail, MapPin, ShieldCheck } from "lucide-react";
import { Progress } from "@/components/admin/ui/Progress";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import {
  activity,
  adminInvoices,
  adminProjects,
  adminClients,
  calls,
  files,
  requirements,
  threads,
  tickets,
} from "@/lib/admin-data";
import { cn } from "@/lib/utils";

const TABS = [
  "overview",
  "projects",
  "requirements",
  "invoices",
  "tickets",
  "files",
  "messages",
  "calls",
  "activity",
] as const;
type Tab = (typeof TABS)[number];

const LABELS: Record<Tab, string> = {
  overview: "Overview",
  projects: "Projects",
  requirements: "Requirements",
  invoices: "Invoices",
  tickets: "Tickets",
  files: "Files",
  messages: "Messages",
  calls: "Calls",
  activity: "Activity",
};

export function ClientTabs({ clientId }: { clientId: string }) {
  const client = adminClients.find((item) => item.id === clientId) ?? adminClients[0];
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

  const projects = adminProjects.filter((project) => project.client === client.name);
  const reqs = requirements.filter((requirement) => requirement.client === client.name);
  const invoices = adminInvoices.filter((invoice) => invoice.client === client.name);
  const clientTickets = tickets.filter((ticket) => ticket.client === client.name);
  const clientFiles = files.filter((file) => file.client === client.name);
  const clientThreads = threads.filter((thread) => thread.client === client.name);
  const clientCalls = calls.filter((call) => call.client === client.name);
  const clientActivity = activity.filter((item) => item.detail.includes(client.name));

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
              {(clientActivity.length > 0 ? clientActivity : activity.slice(0, 3)).map((item) => (
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
        <ul className="divide-y divide-border">
          {projects.length === 0 ? (
            <EmptyRow text="No projects yet." />
          ) : (
            projects.map((project) => (
              <li key={project.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                <span className="flex size-8 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                  <FolderKanban className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="text-sm font-medium hover:underline"
                  >
                    {project.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">{project.status} · {project.modules} modules</p>
                </div>
                <div className="w-32">
                  <Progress value={project.progress} />
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
                <ChevronRight className="size-4 text-muted-foreground" aria-hidden="true" />
              </li>
            ))
          )}
        </ul>
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

      {tab === "files" ? (
        <SimpleList
          rows={clientFiles.map((file) => ({
            id: file.id,
            title: file.name,
            meta: `${file.folder} · ${file.updated} · ${file.size}`,
            href: "/admin/files",
            badge: file.visible ? "Client-visible" : "Internal",
          }))}
          empty="No files shared yet."
        />
      ) : null}

      {tab === "messages" ? (
        <div className="p-5">
          {clientThreads.length === 0 ? (
            <p className="text-sm text-muted-foreground">No messages with this client.</p>
          ) : (
            clientThreads.map((thread) => (
              <div key={thread.id} className="rounded-md border border-border p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{thread.client}</p>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {thread.time}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{thread.preview}</p>
                <Link
                  href="/admin/messages"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  Open thread
                  <ArrowUpRight className="size-3" aria-hidden="true" />
                </Link>
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "calls" ? (
        <SimpleList
          rows={clientCalls.map((call) => ({
            id: call.id,
            title: call.title,
            meta: `${call.day} · ${call.time} · ${call.owner}`,
            href: "/admin/calls",
            badge: call.kind,
          }))}
          empty="No calls booked yet."
        />
      ) : null}

      {tab === "activity" ? (
        <ul className="divide-y divide-border">
          {(clientActivity.length > 0 ? clientActivity : activity).map((item) => (
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
