"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { Avatar } from "@/components/admin/ui/Avatar";
import { threads, type Thread } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

type ExtraMessage = { id: string; from: string; self: boolean; body: string; time: string };

/** Two-pane messages: thread list, conversation and a working composer. */
export function MessagesView() {
  const [activeId, setActiveId] = useState(threads[0].id);
  const [extra, setExtra] = useState<Record<string, ExtraMessage[]>>({});
  const [draft, setDraft] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const active: Thread =
    threads.find((thread) => thread.id === activeId) ?? threads[0];
  const messages = useMemo(
    () => [...active.messages, ...(extra[active.id] ?? [])],
    [active, extra],
  );

  function send(event: React.FormEvent) {
    event.preventDefault();
    const body = draft.trim();
    if (!body) return;
    setExtra((current) => ({
      ...current,
      [active.id]: [
        ...(current[active.id] ?? []),
        {
          id: `new-${Date.now()}`,
          from: "Alamin",
          self: true,
          body,
          time: "Just now",
        },
      ],
    }));
    setDraft("");
    window.requestAnimationFrame(() =>
      endRef.current?.scrollIntoView({ block: "end" }),
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="grid md:grid-cols-[300px_1fr]">
        <div
          className={cn(
            "border-border md:block md:border-r",
            mobileOpen && "hidden",
          )}
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-sm font-semibold">Messages</p>
            <span className="rounded-full bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
              2 unread
            </span>
          </div>
          <ul className="max-h-[560px] overflow-y-auto">
            {threads.map((thread, index) => (
              <li key={thread.id}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveId(thread.id);
                    setMobileOpen(true);
                  }}
                  aria-current={thread.id === active.id ? "true" : undefined}
                  className={cn(
                    "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors",
                    index > 0 && "border-t border-border",
                    thread.id === active.id
                      ? "bg-secondary/60"
                      : "hover:bg-secondary/30",
                  )}
                >
                  <Avatar initials={initials(thread.client)} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium">{thread.client}</span>
                      <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                        {thread.time}
                      </span>
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {thread.preview}
                    </span>
                  </span>
                  {thread.unread > 0 && thread.id !== active.id ? (
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-label="Unread" />
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className={cn("min-w-0", !mobileOpen && "hidden md:block")}>
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Back to messages"
              className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary md:hidden"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
            </button>
            <Avatar initials={initials(active.client)} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{active.client}</p>
              <p className="text-xs text-muted-foreground">
                Client thread · visible in the portal
              </p>
            </div>
          </div>

          <div className="flex max-h-[480px] flex-col gap-3 overflow-y-auto p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "max-w-[85%] rounded-lg px-3.5 py-2.5 text-sm",
                  message.self
                    ? "self-end rounded-br-sm bg-primary text-primary-foreground"
                    : "self-start rounded-bl-sm bg-secondary text-foreground",
                )}
              >
                {!message.self ? (
                  <p className="text-[11px] font-semibold opacity-80">
                    {message.from}
                  </p>
                ) : null}
                <p className="mt-0.5 leading-relaxed">{message.body}</p>
                <p
                  className={cn(
                    "mt-1 text-right font-mono text-[9px]",
                    message.self
                      ? "text-primary-foreground/60"
                      : "text-muted-foreground",
                  )}
                >
                  {message.time}
                </p>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={send}
            className="flex items-center gap-2 border-t border-border p-3"
          >
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={`Reply to ${active.client}`}
              aria-label={`Reply to ${active.client}`}
              className="h-10 min-w-0 flex-1 rounded-lg border border-input bg-card px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              aria-label="Send message"
              className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
            >
              <Send className="size-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
