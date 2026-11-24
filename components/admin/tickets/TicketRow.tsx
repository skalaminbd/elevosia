"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { StatusBadge, type BadgeTone } from "@/components/admin/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ticketSlaState, type SlaTimer } from "@/lib/tickets/sla";
import type {
  TicketPriority,
  TicketRecord,
  TicketStatus,
} from "@/lib/tickets/types";
import { cn } from "@/lib/utils";

const PRIORITY_CLASS: Record<TicketPriority, string> = {
  P1: "bg-destructive/10 text-destructive",
  P2: "bg-warning/10 text-warning",
  P3: "bg-muted text-muted-foreground",
};

const STATUS_TONE: Record<TicketStatus, BadgeTone> = {
  New: "info",
  Open: "neutral",
  "Waiting on client": "warning",
  "Waiting on development": "accent",
  Snoozed: "neutral",
  Resolved: "success",
  Closed: "neutral",
};

/** The most urgent running timer for this ticket. */
export function slaChip(ticket: TicketRecord, now: Date): SlaTimer {
  const state = ticketSlaState(ticket, now);
  return state.firstResponse.state === "met"
    ? state.resolution
    : state.firstResponse;
}

/** One simple queue row. */
export function TicketRow({
  ticket,
  now,
  onClaim,
}: {
  ticket: TicketRecord;
  now: Date;
  onClaim: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const timer = slaChip(ticket, now);

  return (
    <li className="grid grid-cols-[minmax(0,1fr)_52px_76px] items-center gap-3 border-t border-border px-4 py-3 transition-colors first:border-t-0 hover:bg-secondary/30 sm:grid-cols-[minmax(0,1fr)_56px_150px_110px_90px]">
      <div className="min-w-0">
        <Link
          href={`/admin/tickets/${ticket.id}`}
          className="block truncate text-sm font-medium hover:underline"
        >
          {ticket.subject}
        </Link>
        <p className="truncate font-mono text-xs text-muted-foreground">
          {ticket.id}
        </p>
      </div>

      <span
        className={cn(
          "inline-flex w-fit whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold",
          PRIORITY_CLASS[ticket.priority],
        )}
      >
        {ticket.priority}
      </span>

      <span
        className={cn(
          "hidden w-fit items-center gap-1.5 whitespace-nowrap rounded-full border border-border px-2 py-0.5 font-mono text-xs sm:inline-flex",
          timer.state === "breached"
            ? "border-destructive/30 text-destructive"
            : timer.state === "warning"
              ? "text-warning"
              : "text-muted-foreground",
        )}
      >
        {timer.state === "breached" ? (
          <span className="relative flex size-1.5">
            <motion.span
              className="absolute inline-flex size-full rounded-full bg-destructive"
              animate={
                reduceMotion
                  ? undefined
                  : { opacity: [0.35, 1, 0.35], scale: [1, 1.6, 1] }
              }
              transition={
                reduceMotion
                  ? undefined
                  : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
              }
            />
            <span className="relative inline-flex size-1.5 rounded-full bg-destructive" />
          </span>
        ) : null}
        {timer.label}
      </span>

      <span className="hidden sm:inline-flex">
        <StatusBadge tone={STATUS_TONE[ticket.status]}>
          {ticket.status}
        </StatusBadge>
      </span>

      <div className="justify-self-end">
        {ticket.assignee ? (
          <span className="block max-w-24 truncate text-right text-xs text-muted-foreground">
            {ticket.assignee}
          </span>
        ) : (
          <Button variant="outline" size="sm" onClick={onClaim}>
            Claim
          </Button>
        )}
      </div>
    </li>
  );
}
