"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Avatar } from "@/components/admin/ui/Avatar";
import { StatusBadge, type BadgeTone } from "@/components/admin/ui/StatusBadge";
import { Input } from "@/components/ui/input";
import { adminClients, type ClientStatus } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

const FILTERS: (ClientStatus | "All")[] = [
  "All",
  "Active",
  "Onboarding",
  "Lead",
  "Paused",
  "Former",
];

const TONE: Record<ClientStatus, BadgeTone> = {
  Active: "success",
  Onboarding: "info",
  Lead: "accent",
  Paused: "warning",
  Former: "neutral",
};

/** Clients table with live search and status filters. */
export function ClientsTable() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ClientStatus | "All">("All");

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return adminClients.filter((client) => {
      const matchesStatus = filter === "All" || client.status === filter;
      const matchesQuery =
        needle.length === 0 ||
        client.name.toLowerCase().includes(needle) ||
        client.contact.toLowerCase().includes(needle) ||
        client.industry.toLowerCase().includes(needle);
      return matchesStatus && matchesQuery;
    });
  }, [query, filter]);

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
        <div className="flex flex-wrap items-center gap-1.5">
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              aria-pressed={filter === item}
              className={cn(
                "h-8 rounded-full px-3 text-xs font-medium transition-colors",
                filter === item
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground",
              )}
            >
              {item}
            </button>
          ))}
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
                <Avatar initials={client.initials} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{client.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {client.industry} · {client.source}
                  </p>
                </div>
                <StatusBadge tone={TONE[client.status]}>{client.status}</StatusBadge>
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
              <th className="px-5 py-2.5 font-medium">Company</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 font-medium">PM</th>
              <th className="px-4 py-2.5 font-medium">Projects</th>
              <th className="px-4 py-2.5 font-medium">Plan</th>
              <th className="px-4 py-2.5 text-right font-medium">Balance</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr className="border-t border-border">
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-muted-foreground">
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
                      <Avatar initials={client.initials} />
                      <div className="min-w-0">
                        <p className="truncate font-medium">{client.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {client.industry} · {client.source}
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
        {rows.length} of {adminClients.length} clients · sample data
      </p>
    </div>
  );
}
