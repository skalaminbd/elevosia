"use client";

import { useMemo, useState } from "react";
import { FilterDisclosure } from "@/components/shared/FilterDisclosure";
import Link from "next/link";
import {
  Archive,
  CheckCircle2,
  ChevronRight,
  Download,
  PauseCircle,
  Search,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { Avatar } from "@/components/admin/ui/Avatar";
import { StatusBadge, type BadgeTone } from "@/components/admin/ui/StatusBadge";
import { Input } from "@/components/ui/input";
import {
  type AdminClient,
  type ClientStatus,
} from "@/lib/admin-data";
import { Button } from "@/components/ui/button";

const STATUS_OPTIONS = [
  { id: "Active", label: "Active", icon: CheckCircle2 },
  { id: "Onboarding", label: "Onboarding", icon: UserPlus },
  { id: "Lead", label: "Lead", icon: Sparkles },
  { id: "Paused", label: "Paused", icon: PauseCircle },
  { id: "Former", label: "Former", icon: Archive },
];

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

const TONE: Record<ClientStatus, BadgeTone> = {
  Active: "success",
  Onboarding: "info",
  Lead: "accent",
  Paused: "warning",
  Former: "neutral",
};

/** Clients table with live search and status filters. */
export function ClientsTable({ clients }: { clients: AdminClient[] }) {
  const [query, setQuery] = useState("");
  const [statuses, setStatuses] = useState<string[]>([]);

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return clients.filter((client) => {
      const matchesStatus =
        statuses.length === 0 || statuses.includes(client.status);
      const matchesQuery =
        needle.length === 0 ||
        client.name.toLowerCase().includes(needle) ||
        client.contact.toLowerCase().includes(needle) ||
        client.industry.toLowerCase().includes(needle);
      return matchesStatus && matchesQuery;
    });
  }, [query, statuses, clients]);

  function exportCsv() {
    const header = [
      "Company",
      "Status",
      "PM",
      "Projects",
      "Plan",
      "Balance",
      "Contact",
      "Email",
      "Industry",
      "Time zone",
    ];
    const csv = [
      header.join(","),
      ...rows.map((client) =>
        [
          client.name,
          client.status,
          client.pm,
          client.projects,
          client.plan,
          client.balance,
          client.contact,
          client.email,
          client.industry,
          client.timezone,
        ]
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(","),
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "elevosia-clients.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div className="relative w-full sm:w-64">
          <Search
            className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search clients"
            aria-label="Search clients"
            className="h-9 pl-8 text-sm"
          />
        </div>
                <div className="flex flex-wrap items-center gap-2">
          <FilterDisclosure
            label="Filter"
            values={statuses}
            options={STATUS_OPTIONS}
            onChange={setStatuses}
          />
          <Button variant="outline" onClick={exportCsv}>
            <Download className="size-3.5" aria-hidden="true" />
            CSV
          </Button>
        </div>
      </div>

      <ul className="divide-y divide-border md:hidden">
        {rows.length === 0 ? (
          <li className="px-5 py-10 text-center text-sm text-muted-foreground">
            No clients match that search.
          </li>
        ) : (
          rows.map((client) => (
            <li key={client.id} className="px-4 py-3.5">
              <div className="flex items-start gap-3">
                <Avatar initials={initials(client.contact)} />
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/clients/${client.id}`}
                    className="truncate text-sm font-medium hover:underline"
                  >
                    {client.contact}
                  </Link>
                  <p className="truncate text-xs text-muted-foreground">
                    {client.name} · {client.industry}
                  </p>
                </div>
                <StatusBadge tone={TONE[client.status]}>{client.status}</StatusBadge>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              </div>
              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 pl-11 text-xs">
                <span className="text-muted-foreground">
                  {client.pm} · {client.plan}
                </span>
                <span className="font-mono font-semibold tabular-nums">
                  {client.balance > 0
                    ? `$${client.balance.toLocaleString("en-US")} due`
                    : "No balance"}
                </span>
              </div>
            </li>
          ))
        )}
      </ul>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-secondary/40 text-xs text-muted-foreground">
            <tr>
              <th className="px-5 py-2.5 font-medium">Client</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 font-medium">PM</th>
              <th className="px-4 py-2.5 font-medium">Projects</th>
              <th className="px-4 py-2.5 font-medium">Plan</th>
              <th className="px-4 py-2.5 text-right font-medium">Balance</th>
              <th className="w-10 px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr className="border-t border-border">
                <td colSpan={7} className="px-5 py-10 text-center text-sm text-muted-foreground">
                  No clients match that search.
                </td>
              </tr>
            ) : (
              rows.map((client) => (
                <tr
                  key={client.id}
                  className="border-t border-border transition-colors hover:bg-secondary/30"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar initials={initials(client.contact)} />
                      <div className="min-w-0">
                        <Link
                          href={`/admin/clients/${client.id}`}
                          className="truncate font-medium hover:underline"
                        >
                          {client.contact}
                        </Link>
                        <p className="truncate text-xs text-muted-foreground">
                          {client.name} · {client.industry}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge tone={TONE[client.status]}>{client.status}</StatusBadge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{client.pm}</td>
                  <td className="px-4 py-3 font-mono text-xs tabular-nums">
                    {client.projects}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {client.plan}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs tabular-nums">
                    {client.balance > 0 ? (
                      <span className="font-semibold text-foreground">
                        ${client.balance.toLocaleString("en-US")}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/clients/${client.id}`}
                      aria-label={`Open ${client.name}`}
                      className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
                    >
                      <ChevronRight className="size-4" aria-hidden="true" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
        {rows.length} of {clients.length} clients · live data
      </p>
    </div>
  );
}
