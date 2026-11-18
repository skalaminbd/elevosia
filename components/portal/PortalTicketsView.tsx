"use client";

import { useState } from "react";
import { NativeSelect } from "@/components/shared/NativeSelect";
import { Check, LifeBuoy, MessageSquare } from "lucide-react";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { portalTickets } from "@/lib/portal-data";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Ticket = (typeof portalTickets)[number];

export function PortalTicketsView() {
  const [tickets, setTickets] = useState<Ticket[]>(portalTickets);
  const [subject, setSubject] = useState("");
  const [project, setProject] = useState("Care dashboard and client portal");
  const [detail, setDetail] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [submitted, setSubmitted] = useState<string | null>(null);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!subject.trim() || !detail.trim()) return;
    const id = `TKT-${813 + tickets.length}`;
    setTickets((current) => [
      {
        id,
        subject: subject.trim(),
        status: "Submitted",
        updated: "Just now",
        warranty: false,
        messages: 0,
      },
      ...current,
    ]);
    setSubmitted(id);
    setSubject("");
    setDetail("");
  }

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <div className="space-y-3 xl:col-span-2">
        {submitted ? (
          <div className="flex items-start gap-2 rounded-lg border border-success/30 bg-success/5 p-4">
            <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
            <p className="text-sm text-success">
              {submitted} submitted. Your PM is notified and the response target is one
              business day.
            </p>
          </div>
        ) : null}

        <div className="rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold">Your tickets</h2>
              <p className="text-xs text-muted-foreground">Open and closed</p>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">
              {tickets.length}
            </span>
          </div>
          <ul className="divide-y divide-border">
            {tickets.map((ticket) => (
              <li key={ticket.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                  <LifeBuoy className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{ticket.subject}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {ticket.id} · updated {ticket.updated}
                  </p>
                </div>
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <MessageSquare className="size-3" aria-hidden="true" />
                  {ticket.messages}
                </span>
                {ticket.warranty ? (
                  <StatusBadge tone="accent">Warranty</StatusBadge>
                ) : null}
                <StatusBadge
                  tone={
                    ticket.status === "Resolved"
                      ? "success"
                      : ticket.status === "Submitted"
                        ? "info"
                        : "accent"
                  }
                >
                  {ticket.status}
                </StatusBadge>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <form onSubmit={submit} className="rounded-lg border border-border bg-card p-5">
        <h2 className="text-sm font-semibold">New ticket</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Something broken or a small question.
        </p>

        <div className="mt-4 space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="ticket-subject" className="text-xs font-medium">
              Subject
            </Label>
            <input
              id="ticket-subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="What is happening?"
              className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ticket-project" className="text-xs font-medium">
              Project
            </Label>
            <NativeSelect
              id="ticket-project"
              value={project}
              onChange={(event) => setProject(event.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option>Care dashboard and client portal</option>
              <option>Online booking</option>
              <option>Not project specific</option>
            </NativeSelect>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ticket-detail" className="text-xs font-medium">
              What happened?
            </Label>
            <textarea
              id="ticket-detail"
              value={detail}
              onChange={(event) => setDetail(event.target.value)}
              rows={4}
              className="w-full resize-none rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ticket-priority" className="text-xs font-medium">
              Priority
            </Label>
            <NativeSelect
              id="ticket-priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option>Normal</option>
              <option>Urgent</option>
              <option>Low</option>
            </NativeSelect>
            <p className="text-[10px] text-muted-foreground">
              Your care plan: same-business-day support.
            </p>
          </div>
        </div>

        <Button
          type="submit"
          disabled={!subject.trim() || !detail.trim()}
          className="mt-4 w-full"
        >
          Submit ticket
        </Button>
        <p className="mt-2 text-[10px] text-muted-foreground">
          {project} · {priority.toLowerCase()} priority
        </p>
      </form>
    </div>
  );
}
