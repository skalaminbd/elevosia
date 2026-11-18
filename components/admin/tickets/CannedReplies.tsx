"use client";

import { useState } from "react";
import { NativeSelect } from "@/components/shared/NativeSelect";
import { Check, Copy, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cannedReplies } from "@/lib/admin-data";

export function CannedReplies() {
  const [replies, setReplies] = useState(cannedReplies);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Acknowledgment");
  const [body, setBody] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  function add(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setReplies((current) => [
      { id: `CR-${current.length + 1}`, title, category, body },
      ...current,
    ]);
    setTitle("");
    setBody("");
  }

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <div className="space-y-3 xl:col-span-2">
        {replies.map((reply) => (
          <div key={reply.id} className="rounded-lg border border-border bg-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold">{reply.title}</p>
                <p className="text-xs text-muted-foreground">{reply.category}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard?.writeText(reply.body);
                  setCopied(reply.id);
                }}
              >
                {copied === reply.id ? (
                  <Check className="size-3.5 text-success" aria-hidden="true" />
                ) : (
                  <Copy className="size-3.5" aria-hidden="true" />
                )}
                {copied === reply.id ? "Copied" : "Copy"}
              </Button>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{reply.body}</p>
          </div>
        ))}
      </div>

      <form onSubmit={add} className="rounded-lg border border-border bg-card p-5">
        <h2 className="text-sm font-semibold">New canned reply</h2>
        <p className="text-xs text-muted-foreground">Saved for everyone on support.</p>
        <div className="mt-3 space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="reply-title" className="text-xs font-medium">Title</Label>
            <input id="reply-title" value={title} onChange={(e) => setTitle(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="reply-category" className="text-xs font-medium">Category</Label>
            <NativeSelect id="reply-category" value={category} onChange={(e) => setCategory(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring">
              {["Acknowledgment", "Information", "Resolution", "Billing"].map((item) => <option key={item}>{item}</option>)}
            </NativeSelect>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="reply-body" className="text-xs font-medium">Message</Label>
            <textarea id="reply-body" value={body} onChange={(e) => setBody(e.target.value)} rows={4} className="w-full resize-none rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus-visible:border-ring" />
          </div>
        </div>
        <Button type="submit" className="mt-3 w-full" disabled={!title.trim() || !body.trim()}>
          <Plus className="size-4" aria-hidden="true" />
          Add reply
        </Button>
      </form>
    </div>
  );
}
