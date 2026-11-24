"use client";

import { Fragment, useMemo } from "react";
import {
  TimelineItem,
  dayLabel,
  type TimelineEntry,
} from "@/components/admin/tickets/TimelineItem";
import {
  TicketComposer,
  type ComposerPayload,
  type SendOption,
} from "@/components/admin/tickets/TicketComposer";
import type { TicketRecord } from "@/lib/tickets/types";

/** Plain conversation timeline with the composer underneath. */
export function TicketConversation({
  ticket,
  onPatch,
}: {
  ticket: TicketRecord;
  onPatch: (patch: Partial<TicketRecord>) => void;
}) {
  const entries = useMemo<TimelineEntry[]>(
    () =>
      [
        ...ticket.messages.map((message) => ({
          kind: "message" as const,
          at: message.at,
          message,
        })),
        ...ticket.events.map((event) => ({
          kind: "event" as const,
          at: event.at,
          event,
        })),
      ].sort((a, b) => a.at.localeCompare(b.at)),
    [ticket],
  );

  const firstUnread = entries.findIndex(
    (entry) => entry.kind === "message" && entry.message.unread,
  );

  function send(payload: ComposerPayload, option: SendOption): string {
    const at = new Date().toISOString();
    const message = {
      id: `m-${Date.now()}`,
      author: payload.author,
      sender: "Staff" as const,
      channel: payload.channel,
      internal: payload.internal,
      body: payload.body,
      at,
      attachments:
        payload.attachments.length > 0 ? payload.attachments : undefined,
    };
    const sla = {
      ...ticket.sla,
      ...(!payload.internal && !ticket.sla.firstRespondedAt
        ? { firstRespondedAt: at }
        : {}),
      ...(option === "resolve" ? { resolvedAt: at } : {}),
    };
    onPatch({
      messages: [...ticket.messages, message],
      updatedAt: at,
      unread: 0,
      sla,
      ...(option === "waiting" ? { status: "Waiting on client" as const } : {}),
      ...(option === "resolve" ? { status: "Resolved" as const } : {}),
    });
    return message.id;
  }

  function undo(id: string) {
    onPatch({ messages: ticket.messages.filter((item) => item.id !== id) });
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ul className="flex min-h-72 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4 max-lg:max-h-[55vh] lg:min-h-0">
        {entries.map((entry, index) => {
          const previous = entries[index - 1];
          const showDay =
            !previous || previous.at.slice(0, 10) !== entry.at.slice(0, 10);
          const showNew = index === firstUnread;
          const key =
            entry.kind === "message" ? entry.message.id : entry.event.id;
          return (
            <Fragment key={key}>
              {showDay ? (
                <li className="flex items-center gap-2 py-1">
                  <span className="h-px flex-1 bg-border" />
                  <span className="text-xs font-medium text-muted-foreground">
                    {dayLabel(entry.at)}
                  </span>
                  <span className="h-px flex-1 bg-border" />
                </li>
              ) : null}
              {showNew ? (
                <li className="flex items-center gap-2 py-1">
                  <span className="h-px flex-1 bg-primary/40" />
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    New
                  </span>
                  <span className="h-px flex-1 bg-primary/40" />
                </li>
              ) : null}
              <TimelineItem entry={entry} requester={ticket.requester} />
            </Fragment>
          );
        })}
      </ul>

      <TicketComposer
        ticket={ticket}
        onSend={send}
        onUndo={undo}
      />
    </div>
  );
}
