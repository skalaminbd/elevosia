"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowLeft, Search, Send } from "lucide-react";
import { portalClient, portalThreads } from "@/lib/portal-data";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type ExtraMessage = { id: string; from: string; self: boolean; body: string; time: string };

export function PortalMessages() {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState(portalThreads[0].id);
  const [extra, setExtra] = useState<Record<string, ExtraMessage[]>>({});
  const [draft, setDraft] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const threads = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return portalThreads;
    return portalThreads.filter(
      (thread) =>
        thread.title.toLowerCase().includes(needle) ||
        thread.preview.toLowerCase().includes(needle),
    );
  }, [query]);

  const active = portalThreads.find((thread) => thread.id === activeId) ?? portalThreads[0];
  const messages = [...active.messages, ...(extra[active.id] ?? [])];

  function send(event: React.FormEvent) {
    event.preventDefault();
    const body = draft.trim();
    if (!body) return;
    setExtra((current) => ({
      ...current,
      [active.id]: [
        ...(current[active.id] ?? []),
        { id: `new-${Date.now()}`, from: portalClient.user, self: true, body, time: "Just now" },
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
        <div className={cn("border-border md:block md:border-r", mobileOpen && "hidden")}>
          <div className="border-b border-border p-3">
            <div className="relative">
              <Search
                className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search messages"
                aria-label="Search messages"
                className="h-9 pl-8 text-sm"
              />
            </div>
          </div>
          <ul className="max-h-[520px] overflow-y-auto">
            {threads.length === 0 ? (
              <li className="px-4 py-8 text-center text-sm text-muted-foreground">
                Nothing matches that search.
              </li>
            ) : (
              threads.map((thread, index) => (
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
                      thread.id === active.id ? "bg-secondary/60" : "hover:bg-secondary/30",
                    )}
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-[10px] font-semibold text-primary">
                      {thread.title.slice(0, 2).toUpperCase()}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium">{thread.title}</span>
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
              ))
            )}
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
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{active.title}</p>
              <p className="text-xs text-muted-foreground">
                {active.with} · replies within one business day
              </p>
            </div>
          </div>

          <div className="flex max-h-[460px] flex-col gap-3 overflow-y-auto p-4">
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
                  <p className="text-[11px] font-semibold opacity-80">{message.from}</p>
                ) : null}
                <p className="mt-0.5 leading-relaxed">{message.body}</p>
                <p
                  className={cn(
                    "mt-1 text-right font-mono text-[9px]",
                    message.self ? "text-primary-foreground/60" : "text-muted-foreground",
                  )}
                >
                  {message.time}
                </p>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <form onSubmit={send} className="flex items-center gap-2 border-t border-border p-3">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={`Message ${active.with.split(" · ")[0]}`}
              aria-label={`Message ${active.with.split(" · ")[0]}`}
              className="h-10 min-w-0 flex-1 rounded-lg border border-input bg-card px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!draft.trim()}
              aria-label="Send message"
            >
              <Send className="size-4" aria-hidden="true" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
