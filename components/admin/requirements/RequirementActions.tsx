"use client";

import { useState } from "react";
import Link from "next/link";
import { CornerUpLeft, FileText, XCircle } from "lucide-react";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Button } from "@/components/ui/button";

export function RequirementActions({
  requirementId,
  status,
}: {
  requirementId: string;
  status: string;
}) {
  const [stage, setStage] = useState<"idle" | "changes" | "declined" | "assigned">("idle");
  const [open, setOpen] = useState<"changes" | "decline" | null>(null);
  const [note, setNote] = useState("");

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-sm font-semibold">Actions</h2>
        <p className="text-xs text-muted-foreground">
          {stage === "idle" ? `Status: ${status}` : "Updated in this sample"}
        </p>
      </div>
      <div className="space-y-3 p-5">
        <Button asChild className="w-full">
          <Link href={`/admin/blueprints/new?requirement=${requirementId}`}>
            <FileText className="size-4" aria-hidden="true" />
            Create Blueprint
          </Link>
        </Button>

        {stage === "idle" ? (
          <>
            <button
              type="button"
              onClick={() => setOpen(open === "changes" ? null : "changes")}
              className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-border text-xs font-medium hover:bg-secondary"
            >
              <CornerUpLeft className="size-3.5" aria-hidden="true" />
              Send back for changes
            </button>
            <button
              type="button"
              onClick={() => setOpen(open === "decline" ? null : "decline")}
              className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-border text-xs font-medium text-destructive hover:bg-destructive/5"
            >
              <XCircle className="size-3.5" aria-hidden="true" />
              Decline
            </button>
          </>
        ) : null}

        {open ? (
          <form
            className="rounded-md border border-border bg-background p-3"
            onSubmit={(event) => {
              event.preventDefault();
              if (!note.trim()) return;
              setStage(open === "changes" ? "changes" : "declined");
              setOpen(null);
            }}
          >
            <label htmlFor="action-note" className="text-xs font-medium">
              {open === "changes" ? "What should the client clarify?" : "Reason for declining"}
            </label>
            <textarea
              id="action-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              required
              className="mt-1.5 w-full resize-none rounded-md border border-input bg-card px-2.5 py-2 text-xs outline-none focus-visible:border-ring"
            />
            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(null)}
                className="h-7 rounded-md px-2 text-xs text-muted-foreground hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!note.trim()}
                className="h-7 rounded-md bg-primary px-2.5 text-xs font-medium text-primary-foreground disabled:opacity-40"
              >
                Confirm
              </button>
            </div>
          </form>
        ) : null}

        {stage === "changes" ? (
          <StatusBadge tone="warning">Sent back · client can edit</StatusBadge>
        ) : null}
        {stage === "declined" ? (
          <StatusBadge tone="danger">Declined · client notified</StatusBadge>
        ) : null}

        <div className="border-t border-border pt-3">
          <label htmlFor="assign-pm" className="text-xs font-medium text-muted-foreground">
            Assigned PM
          </label>
          <select
            id="assign-pm"
            defaultValue="Alamin"
            onChange={() => setStage("assigned")}
            className="mt-1.5 h-9 w-full rounded-md border border-input bg-card px-2.5 text-xs outline-none focus-visible:border-ring"
          >
            <option>Alamin</option>
            <option>Maya</option>
          </select>
          {stage === "assigned" ? (
            <p className="mt-1.5 text-[11px] text-success">Assigned in this sample.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
