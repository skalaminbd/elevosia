"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, LifeBuoy, Send } from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { TICKET_SLA, type PortalTicketRecord } from "@/lib/ticket-store";
import {
  portalTicketReply,
  portalTicketStatus,
} from "@/app/admin/tickets/actions";
import { cn } from "@/lib/utils";

const STATUS_TONE: Record<
  PortalTicketRecord["status"],
  "success" | "warning" | "accent" | "neutral"
> = {
  Open: "accent",
  "In progress": "accent",
  "Waiting on you": "warning",
  Resolved: "success",
};

/** Client-side ticket page: thread, reply and status actions. */
export function PortalTicketDetail({
  initialTicket,
}: {
  initialTicket: PortalTicketRecord;
}) {
  const [ticket, setTicket] = useState(initialTicket);
  const [reply, setReply] = useState("");

  async function send() {
    if (!reply.trim()) return;
    const body = reply.trim();
    const result = await portalTicketReply({ ticketId: ticket.id, body });
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setTicket((current) => ({
      ...current,
      status: "Open",
      messages: [
        ...current.messages,
        { id: `local-${Date.now()}`, from: "Client", body, at: "Just now" },
      ],
    }));
    setReply("");
    toast.success("Reply sent", {
      description: "Your PM is notified and will answer here.",
    });
  }

  async function changeStatus(status: PortalTicketRecord["status"]) {
    const result = await portalTicketStatus({ ticketId: ticket.id, status });
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setTicket((current) => ({ ...current, status }));
    toast.success(status === "Resolved" ? "Marked resolved" : "Ticket reopened");
  }

  return (
    <div className="mx-auto w-full max-w-[900px]">
      <Link
        href="/portal/tickets"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        All tickets
      </Link>

      <div className="mt-3 rounded-lg border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-secondary px-2 py-0.5 font-mono text-xs text-muted-foreground">
              {ticket.id}
            </span>
            <StatusBadge tone={STATUS_TONE[ticket.status]}>
              {ticket.status}
            </StatusBadge>
            {ticket.warranty ? (
              <StatusBadge tone="success">Under warranty</StatusBadge>
            ) : null}
            <div className="ml-auto flex items-center gap-2">
              {ticket.status === "Resolved" ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    void changeStatus("Open");
                  }}
                >
                  Reopen
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    void changeStatus("Resolved");
                  }}
                >
                  <Check className="size-3.5" aria-hidden="true" />
                  Mark resolved
                </Button>
              )}
            </div>
          </div>
          <h1 className="mt-2 text-lg font-semibold tracking-tight">
            {ticket.subject}
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            {ticket.project ?? "Not project specific"} · {ticket.category} ·{" "}
            {ticket.priority} · response target{" "}
            {TICKET_SLA[ticket.priority]}
          </p>
        </div>

        {ticket.status === "Waiting on you" ? (
          <p className="border-b border-border bg-warning/10 px-5 py-2.5 text-sm text-warning">
            Your PM asked you something. Reply below and the clock restarts.
          </p>
        ) : null}

        <ul className="flex flex-col gap-3 px-5 py-5">
          {ticket.messages.map((message) => (
            <li
              key={message.id}
              className={cn(
                "max-w-[92%] rounded-lg border px-3.5 py-2.5",
                message.from === "Client"
                  ? "self-end border-primary/20 bg-primary/10"
                  : "self-start border-border bg-background",
              )}
            >
              <p className="text-xs text-muted-foreground">
                {message.from === "Client" ? "You" : "Elevosia support"} ·{" "}
                {message.at}
              </p>
              <p className="mt-1 text-sm">{message.body}</p>
            </li>
          ))}
        </ul>

        <div className="border-t border-border px-5 py-3">
          <textarea
            value={reply}
            onChange={(event) => setReply(event.target.value)}
            rows={3}
            placeholder="Write a reply"
            aria-label="Reply"
            className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <LifeBuoy className="size-3.5" aria-hidden="true" />
              Support sees this right away
            </span>
            <Button size="sm" onClick={send} disabled={!reply.trim()}>
              <Send className="size-3.5" aria-hidden="true" />
              Send reply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
