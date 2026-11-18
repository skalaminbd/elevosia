"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Avatar } from "@/components/admin/ui/Avatar";
import { StatusBadge, type BadgeTone } from "@/components/admin/ui/StatusBadge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/admin/ui/Table";
import { tickets, type Ticket, type TicketPriority } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

const TABS = ["All", "Unassigned", "Mine"] as const;
type Tab = (typeof TABS)[number];

const PRIORITY: Record<TicketPriority, BadgeTone> = {
  P1: "danger",
  P2: "warning",
  P3: "neutral",
};

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

/** Ticket queue: filter, claim unassigned work. */
export function TicketsQueue() {
  const [tab, setTab] = useState<Tab>("All");
  const [claimed, setClaimed] = useState<Record<string, boolean>>({});

  const rows = useMemo(() => {
    return tickets.filter((ticket) => {
      if (tab === "Unassigned") return ticket.assignee === null && !claimed[ticket.id];
      if (tab === "Mine") return ticket.assignee === "Alamin" || claimed[ticket.id];
      return true;
    });
  }, [tab, claimed]);

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex items-center gap-1 rounded-lg bg-secondary p-1">
          {TABS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              aria-pressed={tab === item}
              className={cn(
                "h-8 rounded-md px-3 text-xs font-medium transition-colors",
                tab === item
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">{rows.length} tickets · sample data</p>
      </div>

      <Table minWidth bare>
        <THead>
          <tr>
            <TH>Ticket</TH>
            <TH>Client</TH>
            <TH>Priority</TH>
            <TH>SLA</TH>
            <TH>Status</TH>
            <TH>Care plan</TH>
            <TH>Assignee</TH>
          </tr>
        </THead>
        <TBody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-5 py-10 text-center text-sm text-muted-foreground">
                Nothing in this queue.
              </td>
            </tr>
          ) : (
            rows.map((ticket) => {
              const assignee = claimed[ticket.id] ? "Alamin" : ticket.assignee;
              return (
                <TicketRow
                  key={ticket.id}
                  ticket={ticket}
                  assignee={assignee}
                  onClaim={() =>
                    setClaimed((current) => ({ ...current, [ticket.id]: true }))
                  }
                />
              );
            })
          )}
        </TBody>
      </Table>
    </div>
  );
}

function TicketRow({
  ticket,
  assignee,
  onClaim,
}: {
  ticket: Ticket;
  assignee: string | null;
  onClaim: () => void;
}) {
  return (
    <TR>
      <TD>
        <Link href={`/admin/tickets/${ticket.id}`} className="font-medium hover:underline">
          {ticket.subject}
        </Link>
        <p className="font-mono text-[10px] text-muted-foreground">{ticket.id}</p>
      </TD>
      <TD className="text-xs text-muted-foreground">{ticket.client}</TD>
      <TD>
        <StatusBadge tone={PRIORITY[ticket.priority]}>{ticket.priority}</StatusBadge>
      </TD>
      <TD>
        <span
          className={cn(
            "font-mono text-xs",
            ticket.close || ticket.sla === "Breached"
              ? "font-semibold text-destructive"
              : "text-muted-foreground",
          )}
        >
          {ticket.sla}
        </span>
      </TD>
      <TD>
        <div className="flex flex-wrap gap-1.5">
          <StatusBadge
            tone={
              ticket.status === "New"
                ? "info"
                : ticket.status === "Resolved"
                  ? "success"
                  : ticket.status === "Waiting on client"
                    ? "warning"
                    : "neutral"
            }
          >
            {ticket.status}
          </StatusBadge>
          {ticket.warranty ? <StatusBadge tone="accent">Warranty</StatusBadge> : null}
        </div>
      </TD>
      <TD className="text-xs text-muted-foreground">{ticket.care}</TD>
      <TD>
        {assignee ? (
          <div className="flex items-center gap-2">
            <Avatar initials={initials(assignee)} muted />
            <span className="text-xs text-muted-foreground">{assignee}</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={onClaim}
            className="h-7 rounded-md border border-border px-2.5 text-xs font-medium transition-colors hover:border-primary/40 hover:bg-primary/5"
          >
            Claim
          </button>
        )}
      </TD>
    </TR>
  );
}
