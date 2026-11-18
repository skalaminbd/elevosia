"use client";

import { useState } from "react";
import { NativeSelect } from "@/components/shared/NativeSelect";
import Link from "next/link";
import { Check, Send, ShieldCheck } from "lucide-react";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { Ticket } from "@/lib/admin-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Message = {
  id: string;
  from: string;
  self: boolean;
  internal: boolean;
  body: string;
  time: string;
};

export function TicketConversation({ ticket }: { ticket: Ticket }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      from: ticket.client,
      self: false,
      internal: false,
      body: "We saw this twice today. It only happens when the invoice is already paid.",
      time: "9:12 am",
    },
    {
      id: "m2",
      from: "Rafi",
      self: true,
      internal: false,
      body: "Thanks, we can reproduce it. Checking the reminder job now.",
      time: "9:30 am",
    },
    {
      id: "m3",
      from: "Rafi",
      self: true,
      internal: true,
      body: "Internal: duplicate job likely from a retry after the payment webhook. Pairing with Sam.",
      time: "9:34 am",
    },
  ]);
  const [draft, setDraft] = useState("");
  const [internal, setInternal] = useState(false);
  const [priority, setPriority] = useState(ticket.priority);
  const [assignee, setAssignee] = useState(ticket.assignee ?? "Unassigned");
  const [status, setStatus] = useState(ticket.status);
  const [escalated, setEscalated] = useState(false);

  function send(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.trim()) return;
    setMessages((current) => [
      ...current,
      {
        id: `new-${Date.now()}`,
        from: internal ? "Rafi" : "Rafi · to client",
        self: true,
        internal,
        body: draft.trim(),
        time: "Just now",
      },
    ]);
    setDraft("");
  }

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <div className="overflow-hidden rounded-lg border border-border bg-card xl:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3.5">
          <div>
            <p className="text-sm font-semibold">Conversation</p>
            <p className="text-xs text-muted-foreground">
              Client replies and internal notes
            </p>
          </div>
          <StatusBadge tone={status === "Resolved" ? "success" : status === "Waiting on client" ? "warning" : "accent"}>
            {status}
          </StatusBadge>
        </div>

        <div className="flex max-h-[460px] flex-col gap-3 overflow-y-auto p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "max-w-[90%] rounded-lg px-3.5 py-2.5 text-sm",
                message.internal
                  ? "self-start border border-warning/30 bg-warning/5"
                  : message.self
                    ? "self-end rounded-br-sm bg-primary text-primary-foreground"
                    : "self-start rounded-bl-sm bg-secondary",
              )}
            >
              <p
                className={cn(
                  "text-[11px] font-semibold",
                  message.self && !message.internal
                    ? "text-primary-foreground/75"
                    : "text-muted-foreground",
                )}
              >
                {message.from}
                {message.internal ? " · internal" : ""}
              </p>
              <p className="mt-0.5 leading-relaxed">{message.body}</p>
              <p
                className={cn(
                  "mt-1 text-right font-mono text-[9px]",
                  message.self && !message.internal
                    ? "text-primary-foreground/60"
                    : "text-muted-foreground",
                )}
              >
                {message.time}
              </p>
            </div>
          ))}
        </div>

        <form onSubmit={send} className="border-t border-border p-3">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={3}
            placeholder={internal ? "Internal note (never shown to the client)" : "Reply to the client"}
            className="w-full resize-none rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="internal-note"
                checked={internal}
                onCheckedChange={(value) => setInternal(value === true)}
              />
              <Label htmlFor="internal-note" className="text-xs">
                Internal note
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/admin/tickets/canned-replies"
                className="text-xs font-medium text-primary hover:underline"
              >
                Canned replies
              </Link>
              <Button type="submit" disabled={!draft.trim()}>
                <Send className="size-4" aria-hidden="true" />
                Send
              </Button>
            </div>
          </div>
        </form>
      </div>

      <div className="space-y-3">
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="text-xs font-semibold">Ticket</p>
          <div className="mt-3 space-y-3">
            <div>
              <Label htmlFor="priority" className="text-[10px] text-muted-foreground">
                Priority
              </Label>
              <NativeSelect
                id="priority"
                value={priority}
                onChange={(event) => setPriority(event.target.value as typeof priority)}
                className="mt-1 h-9 w-full rounded-md border border-input bg-card px-2.5 text-xs outline-none focus-visible:border-ring"
              >
                <option value="P1">P1 · 1 hour</option>
                <option value="P2">P2 · 4 hours</option>
                <option value="P3">P3 · 1 business day</option>
              </NativeSelect>
            </div>
            <div>
              <Label htmlFor="assignee" className="text-[10px] text-muted-foreground">
                Assignee
              </Label>
              <NativeSelect
                id="assignee"
                value={assignee}
                onChange={(event) => setAssignee(event.target.value)}
                className="mt-1 h-9 w-full rounded-md border border-input bg-card px-2.5 text-xs outline-none focus-visible:border-ring"
              >
                {["Unassigned", "Rafi", "Maya", "Alamin"].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </NativeSelect>
            </div>
            <div>
              <Label htmlFor="status" className="text-[10px] text-muted-foreground">
                Status
              </Label>
              <NativeSelect
                id="status"
                value={status}
                onChange={(event) => setStatus(event.target.value as typeof status)}
                className="mt-1 h-9 w-full rounded-md border border-input bg-card px-2.5 text-xs outline-none focus-visible:border-ring"
              >
                {["New", "Open", "Waiting on client", "Resolved"].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </NativeSelect>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5 border-t border-border pt-3">
            <StatusBadge tone="neutral">{ticket.care}</StatusBadge>
            {ticket.warranty ? <StatusBadge tone="accent">Warranty</StatusBadge> : null}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <p className="text-xs font-semibold">Escalate</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Creates a linked task in the project. The client sees “Waiting on development”.
          </p>
          {escalated ? (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-success">
              <Check className="size-3.5" aria-hidden="true" />
              Linked task created in this sample.
            </p>
          ) : (
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => setEscalated(true)}
            >
              Escalate to developer
            </Button>
          )}
        </div>

        <p className="flex items-start gap-2 px-1 text-[10px] text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          Internal notes are never shown to the client.
        </p>
      </div>
    </div>
  );
}
