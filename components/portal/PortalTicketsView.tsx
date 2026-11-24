"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, Clock, LifeBuoy, Plus, ShieldCheck } from "lucide-react";
import {
  FilterDisclosure,
  type FilterOption,
} from "@/components/shared/FilterDisclosure";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import type { PortalTicketRecord } from "@/lib/ticket-store";

const STATUSES: PortalTicketRecord["status"][] = [
  "Open",
  "In progress",
  "Waiting on you",
  "Resolved",
];
const PRIORITIES = ["Low", "Normal", "High", "Urgent"] as const;

const STATUS_TONE: Record<
  PortalTicketRecord["status"],
  "success" | "warning" | "accent" | "neutral"
> = {
  Open: "accent",
  "In progress": "accent",
  "Waiting on you": "warning",
  Resolved: "success",
};

const statusOptions: FilterOption[] = STATUSES.map((status) => ({
  id: status,
  label: status,
  icon: LifeBuoy,
}));
const priorityOptions: FilterOption[] = PRIORITIES.map((priority) => ({
  id: priority,
  label: priority,
  icon: Clock,
}));

/** Portal ticket list. Opening a ticket is a page, not a popup. */
export function PortalTicketsView({
  tickets,
}: {
  tickets: PortalTicketRecord[];
}) {
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);

  const rows = tickets.filter(
    (ticket) =>
      (statusFilter.length === 0 || statusFilter.includes(ticket.status)) &&
      (priorityFilter.length === 0 ||
        priorityFilter.includes(ticket.priority)),
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <FilterDisclosure
          label="Status"
          values={statusFilter}
          options={statusOptions}
          onChange={setStatusFilter}
        />
        <FilterDisclosure
          label="Priority"
          values={priorityFilter}
          options={priorityOptions}
          onChange={setPriorityFilter}
        />
        <Button asChild className="ml-auto">
          <Link href="/portal/tickets/new">
            <Plus className="size-4" aria-hidden="true" />
            New ticket
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3.5">
          <h2 className="text-sm font-semibold">Your tickets</h2>
          <span className="font-mono text-xs text-muted-foreground">
            {rows.length} of {tickets.length}
          </span>
        </div>
        <ul className="divide-y divide-border">
          {rows.length === 0 ? (
            <li className="px-5 py-12 text-center text-sm text-muted-foreground">
              No tickets match those filters.
            </li>
          ) : (
            rows.map((ticket) => (
              <li key={ticket.id}>
                <Link
                  href={`/portal/tickets/${ticket.id}`}
                  className="flex flex-wrap items-center gap-3 px-5 py-3.5 transition-colors hover:bg-secondary/40"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {ticket.subject}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {ticket.id} · {ticket.category}
                      {ticket.project ? ` · ${ticket.project}` : ""} · updated{" "}
                      {ticket.updated}
                    </p>
                  </div>
                  {ticket.warranty ? (
                    <StatusBadge tone="success">
                      <ShieldCheck className="size-3" aria-hidden="true" />
                      Warranty
                    </StatusBadge>
                  ) : null}
                  <StatusBadge tone={STATUS_TONE[ticket.status]}>
                    {ticket.status}
                  </StatusBadge>
                  <span className="hidden w-16 text-right text-xs text-muted-foreground sm:block">
                    {ticket.priority}
                  </span>
                  <ChevronRight
                    className="size-4 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
