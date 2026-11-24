"use client";

import { Lock, Paperclip, Sparkles } from "lucide-react";
import { Avatar } from "@/components/admin/ui/Avatar";
import type {
  TicketEvent,
  TicketMessage,
  TicketPerson,
} from "@/lib/tickets/types";

export type TimelineEntry =
  | { kind: "message"; at: string; message: TicketMessage }
  | { kind: "event"; at: string; event: TicketEvent };

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function dayLabel(iso: string): string {
  const month = MONTHS[Number(iso.slice(5, 7)) - 1] ?? "";
  return `${Number(iso.slice(8, 10))} ${month} ${iso.slice(0, 4)}`;
}

function shortTime(iso: string): string {
  return iso.slice(11, 16);
}

function Attachments({ message }: { message: TicketMessage }) {
  if (!message.attachments?.length) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {message.attachments.map((attachment) => (
        <span
          key={attachment.id}
          className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary/40 px-2 py-0.5 text-xs"
        >
          <Paperclip className="size-2.5" aria-hidden="true" />
          {attachment.name} · {attachment.size}
        </span>
      ))}
    </div>
  );
}

/** One item in the conversation: message, note, AI draft or event. */
export function TimelineItem({
  entry,
  requester,
}: {
  entry: TimelineEntry;
  requester: TicketPerson;
}) {
  if (entry.kind === "event") {
    return (
      <li className="flex items-center justify-center gap-1.5 py-0.5 text-xs text-muted-foreground">
        <span className="size-1 rounded-full bg-muted-foreground/60" />
        {entry.event.text} · {shortTime(entry.event.at)}
      </li>
    );
  }

  const message = entry.message;

  if (message.internal) {
    return (
      <li className="group rounded-lg border border-warning/30 bg-warning/10 px-3.5 py-2.5">
        <p className="flex items-center gap-1.5 text-xs font-medium text-warning">
          <Lock className="size-3" aria-hidden="true" />
          Internal note · never shown to the client · {message.author} ·{" "}
          {shortTime(message.at)}
        </p>
        <p className="mt-1 text-sm">{message.body}</p>
        <Attachments message={message} />
      </li>
    );
  }

  if (message.aiDraft) {
    return (
      <li className="group rounded-lg border border-dashed border-primary/40 bg-primary/5 px-3.5 py-2.5">
        <p className="flex items-center gap-1.5 text-xs font-medium text-primary">
          <Sparkles className="size-3" aria-hidden="true" />
          AI draft · only staff see it until someone edits or sends it
        </p>
        <p className="mt-1 text-sm">{message.body}</p>
      </li>
    );
  }

  if (message.sender === "Client") {
    const initials =
      requester.initials ??
      requester.name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("");
    return (
      <li className="group max-w-[92%] self-start rounded-lg border border-border bg-card px-3.5 py-2.5">
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Avatar initials={initials} className="size-6 text-xs" />
          {message.author} · {shortTime(message.at)} · via {message.channel}
        </p>
        <p className="mt-1.5 text-sm">{message.body}</p>
        <Attachments message={message} />
      </li>
    );
  }

  return (
    <li className="group max-w-[92%] self-end rounded-lg bg-primary/10 px-3.5 py-2.5">
      <p className="text-right text-xs text-muted-foreground">
        {message.author} · {shortTime(message.at)} · sent via {message.channel}
      </p>
      <p className="mt-1.5 text-sm">{message.body}</p>
      <Attachments message={message} />
    </li>
  );
}
