"use client";

import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/shared/NativeSelect";
import { slaChip } from "@/components/admin/tickets/TicketRow";
import {
  TICKET_STATUSES,
  type TicketPriority,
  type TicketRecord,
  type TicketStatus,
} from "@/lib/tickets/types";
import { cn } from "@/lib/utils";

const NOW = new Date("2026-11-20T10:20:00");

const PRIORITY_CLASS: Record<TicketPriority, string> = {
  P1: "bg-destructive/10 text-destructive",
  P2: "bg-warning/10 text-warning",
  P3: "bg-muted text-muted-foreground",
};

/** Minimal ticket header: identity, status, priority and Resolve. */
export function TicketHeader({
  ticket,
  onPatch,
}: {
  ticket: TicketRecord;
  onPatch: (patch: Partial<TicketRecord>) => void;
}) {
  const timer = slaChip(ticket, NOW);

  function resolve() {
    onPatch({
      status: "Resolved",
      updatedAt: new Date().toISOString(),
      sla: { ...ticket.sla, resolvedAt: new Date().toISOString() },
    });
    toast.success("Resolved", {
      description: "The client is asked to confirm.",
    });
  }

  return (
    <div className="space-y-2 border-b border-border px-4 py-3">
      <div className="flex items-center gap-2">
        <Link
          href="/admin/tickets"
          aria-label="Back to tickets"
          className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="line-clamp-2 font-heading text-base font-semibold tracking-tight sm:text-lg">
            {ticket.subject}
          </h1>
        </div>
        <span className="shrink-0 rounded-md bg-secondary px-2 py-0.5 font-mono text-xs text-muted-foreground">
          {ticket.id}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <p className="w-full min-w-0 truncate text-xs text-muted-foreground sm:w-auto sm:flex-1">
          {ticket.project ?? "Not project specific"} ·{" "}
          {ticket.requester.name} · {ticket.client.company} · via{" "}
          {ticket.channel}
        </p>
        <span
          className={cn(
            "whitespace-nowrap rounded-full border border-border px-2 py-0.5 font-mono text-xs",
            timer.state === "breached"
              ? "border-destructive/30 text-destructive"
              : timer.state === "warning"
                ? "text-warning"
                : "text-muted-foreground",
          )}
        >
          {timer.label}
        </span>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs font-semibold",
            PRIORITY_CLASS[ticket.priority],
          )}
        >
          {ticket.priority}
        </span>
        <div className="w-40">
          <NativeSelect
            aria-label="Ticket status"
            value={ticket.status}
            onChange={(event) =>
              onPatch({
                status: event.target.value as TicketStatus,
                updatedAt: new Date().toISOString(),
              })
            }
            className="h-8 rounded-md border border-input bg-card px-2 text-xs"
          >
            {TICKET_STATUSES.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </NativeSelect>
        </div>
        <Button size="sm" onClick={resolve}>
          <Check className="size-3.5" aria-hidden="true" />
          Resolve
        </Button>
      </div>
    </div>
  );
}
