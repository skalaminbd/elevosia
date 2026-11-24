"use client";

import { useState } from "react";
import { Check, Copy, Hash, Plus } from "lucide-react";
import { FilterDisclosure, type FilterOption } from "@/components/shared/FilterDisclosure";
import { NativeSelect } from "@/components/shared/NativeSelect";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { FormField, FormTextarea } from "@/components/ui/form-field";
import {
  CANNED_CATEGORIES,
  cannedReplySeeds,
  type CannedReply,
  type CannedScope,
} from "@/lib/tickets/canned-replies";

const categoryOptions: FilterOption[] = CANNED_CATEGORIES.map((category) => ({
  id: category,
  label: category,
  icon: Hash,
}));

/** Canned replies: variables, categories, shortcuts, scope and usage. */
export function CannedReplies() {
  const [replies, setReplies] = useState<CannedReply[]>(cannedReplySeeds);
  const [categories, setCategories] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CANNED_CATEGORIES[0]);
  const [shortcut, setShortcut] = useState("/");
  const [scope, setScope] = useState<CannedScope>("Team");
  const [body, setBody] = useState("");

  const rows =
    categories.length === 0
      ? replies
      : replies.filter((reply) => categories.includes(reply.category));

  function copy(reply: CannedReply) {
    void navigator.clipboard?.writeText(reply.body);
    setCopied(reply.id);
    setReplies((current) =>
      current.map((item) =>
        item.id === reply.id ? { ...item, uses: item.uses + 1 } : item,
      ),
    );
  }

  function add(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setReplies((current) => [
      {
        id: `CR-${Date.now()}`,
        title: title.trim(),
        category,
        shortcut: shortcut.startsWith("/") ? shortcut.trim() : `/${shortcut.trim()}`,
        scope,
        uses: 0,
        body: body.trim(),
      },
      ...current,
    ]);
    setTitle("");
    setShortcut("/");
    setBody("");
  }

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <div className="space-y-3 xl:col-span-2">
        <div className="flex flex-wrap items-center gap-2">
          <FilterDisclosure
            label="Category"
            values={categories}
            options={categoryOptions}
            onChange={setCategories}
          />
          <span className="text-[11px] text-muted-foreground">
            {rows.length} replies · variables fill with the ticket&apos;s values
          </span>
        </div>

        {rows.map((reply) => (
          <div
            key={reply.id}
            className="rounded-lg border border-border bg-card p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-semibold">{reply.title}</p>
                <p className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-mono text-[10px]">{reply.shortcut}</span>
                  <span>{reply.category}</span>
                  <StatusBadge tone={reply.scope === "Team" ? "accent" : "neutral"}>
                    {reply.scope}
                  </StatusBadge>
                  <span className="font-mono text-[10px]">
                    {reply.uses} uses
                  </span>
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => copy(reply)}>
                {copied === reply.id ? (
                  <Check className="size-3.5 text-success" aria-hidden="true" />
                ) : (
                  <Copy className="size-3.5" aria-hidden="true" />
                )}
                {copied === reply.id ? "Copied" : "Copy"}
              </Button>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">
              {reply.body}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={add} className="rounded-lg border border-border bg-card p-5">
        <h2 className="text-sm font-semibold">New canned reply</h2>
        <p className="text-xs text-muted-foreground">
          Use {"{first_name}"}, {"{project}"} and {"{pm_name}"} as variables.
        </p>
        <div className="mt-3 space-y-3">
          <FormField
            id="reply-title"
            label="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <p className="text-[13px] font-medium">Category</p>
              <NativeSelect
                aria-label="Category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="h-11.5 w-full"
              >
                {CANNED_CATEGORIES.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </NativeSelect>
            </div>
            <div className="space-y-2">
              <p className="text-[13px] font-medium">Scope</p>
              <NativeSelect
                aria-label="Scope"
                value={scope}
                onChange={(event) =>
                  setScope(event.target.value as CannedScope)
                }
                className="h-11.5 w-full"
              >
                <option value="Team">Team</option>
                <option value="Personal">Personal</option>
              </NativeSelect>
            </div>
          </div>
          <FormField
            id="reply-shortcut"
            label="Shortcut"
            value={shortcut}
            onChange={(event) => setShortcut(event.target.value)}
            inputClassName="font-mono"
            placeholder="/shortcut"
          />
          <FormTextarea
            id="reply-body"
            label="Message"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Hi {first_name}, …"
          />
        </div>
        <Button
          type="submit"
          className="mt-3 w-full"
          disabled={!title.trim() || !body.trim()}
        >
          <Plus className="size-4" aria-hidden="true" />
          Add reply
        </Button>
      </form>
    </div>
  );
}
