"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react";
import {
  Bold,
  ChevronDown,
  Code,
  Italic,
  Link2,
  List,
  Lock,
  Paperclip,
  Send,
  Smile,
  Sparkles,
  Undo2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { AppDialog } from "@/components/ui/app-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/shared/NativeSelect";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CANNED_CATEGORIES,
  applyVariables,
  cannedReplySeeds,
} from "@/lib/tickets/canned-replies";
import type {
  TicketAttachment,
  TicketChannel,
  TicketRecord,
} from "@/lib/tickets/types";
import { cn } from "@/lib/utils";

export type SendOption = "send" | "waiting" | "resolve";

export type ComposerPayload = {
  body: string;
  internal: boolean;
  channel: TicketChannel;
  author: string;
  attachments: TicketAttachment[];
};

const DRAFT_EVENT = "elevosia:ticket-draft";

function subscribeDrafts(onChange: () => void) {
  window.addEventListener(DRAFT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(DRAFT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function writeDraft(key: string, value: string) {
  window.localStorage.setItem(key, value);
  window.dispatchEvent(new Event(DRAFT_EVENT));
}

/** Reply and note composer with drafts, canned replies, variables and undo. */
export function TicketComposer({
  ticket,
  onSend,
  onUndo,
}: {
  ticket: TicketRecord;
  onSend: (payload: ComposerPayload, option: SendOption) => string;
  onUndo: (messageId: string) => void;
}) {
  const draftKey = `elevosia.ticket-draft.${ticket.id}`;
  const draft = useSyncExternalStore(
    subscribeDrafts,
    () => window.localStorage.getItem(draftKey) ?? "",
    () => "",
  );
  const textRef = useRef<HTMLTextAreaElement | null>(null);
  const undoTimer = useRef<number | null>(null);

  const [mode, setMode] = useState<"reply" | "note">("reply");
  const [email, setEmail] = useState(false);
  const [from, setFrom] = useState("Alamin");
  const [attachments, setAttachments] = useState<TicketAttachment[]>([]);
  const [cannedOpen, setCannedOpen] = useState(false);
  const [cannedQuery, setCannedQuery] = useState("");
  const [undo, setUndo] = useState<{ id: string; body: string } | null>(null);

  useEffect(() => {
    return () => {
      if (undoTimer.current) window.clearTimeout(undoTimer.current);
    };
  }, []);

  useEffect(() => {
    function onKey(event: globalThis.KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable=true]")) {
        return;
      }
      if (event.key === "r" || event.key === "R") setMode("reply");
      if (event.key === "n" || event.key === "N") setMode("note");
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const variables = {
    first_name: ticket.requester.name.split(" ")[0],
    project: ticket.project ?? "your project",
    pm_name: "Alamin",
  };

  function insert(prefix: string, suffix = "", placeholder = "text") {
    const el = textRef.current;
    const start = el?.selectionStart ?? draft.length;
    const end = el?.selectionEnd ?? draft.length;
    const selected = draft.slice(start, end) || placeholder;
    const next =
      draft.slice(0, start) + prefix + selected + suffix + draft.slice(end);
    writeDraft(draftKey, next);
    window.requestAnimationFrame(() => {
      if (!el) return;
      el.focus();
      el.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selected.length,
      );
    });
  }

  function insertCanned(body: string) {
    const el = textRef.current;
    const start = el?.selectionStart ?? draft.length;
    const next = `${draft.slice(0, start)}${body}${draft.slice(start)}`;
    writeDraft(draftKey, next);
    setCannedOpen(false);
    setCannedQuery("");
  }

  function addFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    setAttachments((current) => [
      ...current,
      ...Array.from(fileList).map((file, index) => ({
        id: `a-${Date.now()}-${index}`,
        name: file.name,
        size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
        kind: file.type.startsWith("image/") ? ("image" as const) : ("file" as const),
      })),
    ]);
  }

  function send(option: SendOption) {
    const body = applyVariables(draft, variables).trim();
    if (!body) return;
    const channel: TicketChannel =
      mode === "reply" && email ? "Email" : "Portal";
    const id = onSend(
      {
        body,
        internal: mode === "note",
        channel,
        author: from,
        attachments,
      },
      option,
    );
    writeDraft(draftKey, "");
    setAttachments([]);
    setUndo({ id, body });
    if (undoTimer.current) window.clearTimeout(undoTimer.current);
    undoTimer.current = window.setTimeout(() => setUndo(null), 5000);
    toast.success(
      mode === "note" ? "Internal note saved" : "Reply sent",
      {
        description:
          mode === "note"
            ? "Only staff see it."
            : `Delivered to the client's ${channel === "Email" ? "inbox and portal" : "portal"}.`,
      },
    );
  }

  function undoNow() {
    if (!undo) return;
    onUndo(undo.id);
    writeDraft(draftKey, undo.body);
    setUndo(null);
    if (undoTimer.current) window.clearTimeout(undoTimer.current);
    toast.success("Send undone", { description: "Your draft is back." });
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      send("send");
      return;
    }
    if (event.key === "/" && draft.length === 0) {
      event.preventDefault();
      setCannedOpen(true);
    }
  }

  const cannedRows = cannedReplySeeds.filter((reply) => {
    const needle = cannedQuery.trim().toLowerCase();
    return (
      !needle ||
      reply.title.toLowerCase().includes(needle) ||
      reply.shortcut.toLowerCase().includes(needle) ||
      reply.category.toLowerCase().includes(needle)
    );
  });

  return (
    <div className="border-t border-border bg-card px-4 py-3 max-lg:sticky max-lg:bottom-0 max-lg:z-20">
      {undo ? (
        <div className="mb-2 flex items-center justify-between gap-2 rounded-md border border-success/30 bg-success/10 px-3 py-1.5">
          <span className="text-xs text-success">
            Message sent. Undo for a few seconds.
          </span>
          <Button variant="ghost" size="sm" onClick={undoNow}>
            <Undo2 className="size-3.5" aria-hidden="true" />
            Undo
          </Button>
        </div>
      ) : null}

      <div className="mb-2 flex flex-wrap items-center gap-1">
        <button
          type="button"
          onClick={() => setMode("reply")}
          aria-pressed={mode === "reply"}
          className={cn(
            "h-7 rounded-md px-2.5 text-xs font-medium transition-colors",
            mode === "reply"
              ? "bg-secondary text-foreground"
              : "text-muted-foreground",
          )}
        >
          Reply to client
        </button>
        <button
          type="button"
          onClick={() => setMode("note")}
          aria-pressed={mode === "note"}
          className={cn(
            "flex h-7 items-center gap-1 rounded-md px-2.5 text-xs font-medium transition-colors",
            mode === "note"
              ? "bg-warning/10 text-warning"
              : "text-muted-foreground",
          )}
        >
          <Lock className="size-3" aria-hidden="true" />
          Internal note
        </button>

        <span className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground">From</span>
          <div className="w-36">
            <NativeSelect
              aria-label="Sender identity"
              value={from}
              onChange={(event) => setFrom(event.target.value)}
              className="h-7 rounded-md border border-input bg-card px-1.5 text-xs"
            >
              <option>Alamin</option>
              <option>Elevosia Support</option>
            </NativeSelect>
          </div>
          <span className="text-xs text-muted-foreground">
            {mode === "note" ? "Staff only" : "Portal"}
          </span>
        </span>
      </div>

      <div
        className={cn(
          "rounded-lg border p-2",
          mode === "note"
            ? "border-warning/30 bg-warning/5"
            : "border-input bg-background",
        )}
      >
        <div className="flex flex-wrap items-center gap-0.5 border-b border-border/60 pb-1.5">
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Bold"
            onClick={() => insert("**", "**")}
            className="text-muted-foreground"
          >
            <Bold className="size-3.5" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Italic"
            onClick={() => insert("_", "_")}
            className="text-muted-foreground"
          >
            <Italic className="size-3.5" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Bullet list"
            onClick={() => insert("- ")}
            className="text-muted-foreground"
          >
            <List className="size-3.5" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Link"
            onClick={() => insert("[", "](https://)", "link text")}
            className="text-muted-foreground"
          >
            <Link2 className="size-3.5" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Inline code"
            onClick={() => insert("`", "`")}
            className="text-muted-foreground"
          >
            <Code className="size-3.5" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Insert emoji"
            onClick={() => insert("🙂", "")}
            className="text-muted-foreground"
          >
            <Smile className="size-3.5" aria-hidden="true" />
          </Button>

          <span className="mx-1 h-4 w-px bg-border" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCannedOpen(true)}
            className="h-6 text-xs text-muted-foreground"
          >
            <Sparkles className="size-3" aria-hidden="true" />
            Canned reply
          </Button>
          <div className="w-32">
            <NativeSelect
              aria-label="Insert variable"
              value=""
              onChange={(event) => {
                if (!event.target.value) return;
                insert(`{${event.target.value}}`, "", "");
              }}
              className="h-6 rounded-md border border-input bg-card px-1.5 text-xs"
            >
              <option value="">Variable…</option>
              <option value="first_name">First name</option>
              <option value="project">Project</option>
              <option value="pm_name">PM name</option>
            </NativeSelect>
          </div>

          <label className="ml-auto flex h-6 cursor-pointer items-center gap-1 rounded-md px-1.5 text-xs text-muted-foreground hover:bg-secondary">
            <Paperclip className="size-3" aria-hidden="true" />
            Attach
            <input
              type="file"
              multiple
              className="sr-only"
              aria-label="Attach files"
              onChange={(event) => addFiles(event.target.files)}
            />
          </label>
        </div>

        <textarea
          ref={textRef}
          value={draft}
          onChange={(event) => writeDraft(draftKey, event.target.value)}
          onKeyDown={onKeyDown}
          onPaste={(event) => {
            const files = event.clipboardData?.files;
            if (files?.length) {
              event.preventDefault();
              addFiles(files);
            }
          }}
          rows={3}
          placeholder={
            mode === "note"
              ? "Internal note for the team. The client never sees it."
              : `Reply to ${variables.first_name} in the portal`
          }
          aria-label={mode === "note" ? "Internal note" : "Reply to client"}
          className="mt-1.5 w-full resize-none bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground"
        />

        {attachments.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 border-t border-border/60 pt-1.5">
            {attachments.map((attachment) => (
              <span
                key={attachment.id}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary/40 px-2 py-0.5 text-xs"
              >
                <Paperclip className="size-2.5" aria-hidden="true" />
                {attachment.name} · {attachment.size}
                <button
                  type="button"
                  aria-label={`Remove ${attachment.name}`}
                  onClick={() =>
                    setAttachments((current) =>
                      current.filter((item) => item.id !== attachment.id),
                    )
                  }
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="size-2.5" aria-hidden="true" />
                </button>
              </span>
            ))}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-2">
          {mode === "reply" ? (
            <label className="flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground">
              <Checkbox
                checked={email}
                onCheckedChange={(value) => setEmail(value === true)}
                aria-label="Also email the client"
              />
              Also email
            </label>
          ) : null}
          <span className="text-xs text-muted-foreground">
            ⌘/Ctrl + Enter sends · / for canned replies
          </span>
          <div className="ml-auto flex items-center gap-1">
            <Button size="sm" onClick={() => send("send")} disabled={!draft.trim()}>
              <Send className="size-3.5" aria-hidden="true" />
              {mode === "note" ? "Save note" : "Send"}
            </Button>
            {mode === "reply" ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    aria-label="More send options"
                  >
                    <ChevronDown className="size-3.5" aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuItem
                    onClick={() => send("waiting")}
                    disabled={!draft.trim()}
                  >
                    Send and set Waiting on client
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => send("resolve")}
                    disabled={!draft.trim()}
                  >
                    Send and resolve
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        </div>
      </div>

      <AppDialog open={cannedOpen} onOpenChange={setCannedOpen} size="md">
        <AppDialog.Header
          icon={Sparkles}
          title="Insert a canned reply"
          subtitle="Variables are filled with this ticket's values when you send."
        />
        <AppDialog.Body>
          <Input
            autoFocus
            value={cannedQuery}
            onChange={(event) => setCannedQuery(event.target.value)}
            placeholder="Search title, shortcut or category"
            aria-label="Search canned replies"
            className="h-9 text-sm"
          />
          <ul className="max-h-72 divide-y divide-border overflow-y-auto rounded-lg border border-border">
            {cannedRows.length === 0 ? (
              <li className="px-3 py-6 text-center text-xs text-muted-foreground">
                No canned reply matches.
              </li>
            ) : (
              cannedRows.map((reply) => (
                <li key={reply.id}>
                  <button
                    type="button"
                    onClick={() => insertCanned(reply.body)}
                    className="block w-full px-3 py-2.5 text-left transition-colors hover:bg-secondary/40"
                  >
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium">{reply.title}</span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {reply.shortcut}
                      </span>
                      <span className="rounded-full bg-secondary px-1.5 py-0.5 text-xs text-muted-foreground">
                        {reply.category}
                      </span>
                    </span>
                    <span className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                      {reply.body}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
          <p className="text-xs text-muted-foreground">
            {CANNED_CATEGORIES.join(" · ")}
          </p>
        </AppDialog.Body>
        <AppDialog.Footer secondary={{ label: "Close" }} />
      </AppDialog>
    </div>
  );
}
