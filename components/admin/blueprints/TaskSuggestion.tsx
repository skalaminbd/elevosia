"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronDown,
  MessageSquareWarning,
  Pencil,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { AppDialog } from "@/components/ui/app-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormTextarea } from "@/components/ui/form-field";
import { resolveBlueprintSuggestion } from "@/app/admin/blueprints/actions";
import type { BlueprintSuggestionRow } from "@/db/queries";
import { cn } from "@/lib/utils";

/** Collapsible client suggestion shown inline under its task. */
export function TaskSuggestion({
  suggestion,
}: {
  suggestion: BlueprintSuggestionRow;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const pending = suggestion.status === "pending";
  const approved = suggestion.status === "approved";

  async function approveAsIs() {
    setBusy(true);
    const result = await resolveBlueprintSuggestion({
      id: suggestion.id,
      action: "approve",
    });
    setBusy(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Task updated", {
      description: "The client's suggested title and description are now live.",
    });
    router.refresh();
  }

  return (
    <div className="border-t border-border bg-secondary/30 px-5 py-3">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        className="flex w-full flex-wrap items-center gap-2 text-left"
      >
        <MessageSquareWarning
          className="size-3.5 shrink-0 text-warning"
          aria-hidden="true"
        />
        <span className="text-xs font-medium">
          Client suggestion · {suggestion.by}
        </span>
        <StatusBadge
          tone={pending ? "warning" : approved ? "success" : "neutral"}
        >
          {pending ? "Pending" : approved ? "Approved" : "Declined"}
        </StatusBadge>
        <ChevronDown
          className={cn(
            "ml-auto size-4 shrink-0 text-muted-foreground transition-transform",
            expanded && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {expanded ? (
        suggestion.status === "dismissed" ? (
          <p className="mt-3 text-xs text-destructive">
            Declined by PM. Reason:{" "}
            {suggestion.decisionNote || "No reason was written."}
          </p>
        ) : (
          <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-2">
              <div className="rounded-md bg-card p-3">
                <p className="text-[10px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                  Client suggests
                </p>
                <p className="mt-1 whitespace-pre-wrap text-sm font-medium">
                  {suggestion.name}
                </p>
                <ExpandableDescription value={suggestion.description} />
                <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                  {suggestion.hours} h
                </p>
                {suggestion.note ? (
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    “{suggestion.note}”
                  </p>
                ) : null}
              </div>
              {approved ? (
                <p className="text-xs text-success">
                  Approved — the task now uses the client&apos;s title and
                  description.
                </p>
              ) : null}
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {pending ? (
                <>
                  <Button
                    size="sm"
                    onClick={() => void approveAsIs()}
                    disabled={busy}
                  >
                    <Check className="size-3.5" aria-hidden="true" />
                    Approve
                  </Button>
                  <EditApproveDialog
                    suggestion={suggestion}
                    disabled={busy}
                    onDone={() => router.refresh()}
                  />
                  <DismissDialog
                    suggestion={suggestion}
                    disabled={busy}
                    onDone={() => router.refresh()}
                  />
                </>
              ) : null}
            </div>
          </div>
        )
      ) : null}
    </div>
  );
}

function EditApproveDialog({
  suggestion,
  disabled,
  onDone,
}: {
  suggestion: BlueprintSuggestionRow;
  disabled: boolean;
  onDone: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: suggestion.name,
    description: suggestion.description,
    hours: String(suggestion.hours),
    visible: suggestion.visible,
  });
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!form.name.trim() || saving) return;
    setSaving(true);
    const result = await resolveBlueprintSuggestion({
      id: suggestion.id,
      action: "approve",
      final: {
        name: form.name.trim(),
        description: form.description,
        hours: Number(form.hours) || 0,
        visible: form.visible,
      },
    });
    setSaving(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Task updated", {
      description: "Your edited version is now the task.",
    });
    setOpen(false);
    onDone();
  }

  return (
    <AppDialog
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button variant="outline" size="sm" disabled={disabled}>
          <Pencil className="size-3.5" aria-hidden="true" />
          Edit &amp; approve
        </Button>
      }
      size="md"
    >
      <AppDialog.Header
        icon={Pencil}
        title="Edit and approve"
        subtitle="Adjust the client's suggestion before it becomes the task."
      />
      <AppDialog.Body>
        <form
          id={`approve-suggestion-${suggestion.id}`}
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
          className="flex flex-col gap-[18px]"
        >
          <FormField
            id={`final-name-${suggestion.id}`}
            label="Task name"
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
            disabled={saving}
          />
          <FormTextarea
            id={`final-description-${suggestion.id}`}
            label="Task description"
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            disabled={saving}
          />
          <FormField
            id={`final-hours-${suggestion.id}`}
            label="Estimated hours"
            type="number"
            min={0}
            step={0.5}
            value={form.hours}
            onChange={(event) =>
              setForm((current) => ({ ...current, hours: event.target.value }))
            }
            inputClassName="font-mono"
            disabled={saving}
          />
          <label className="flex cursor-pointer items-start gap-3">
            <Checkbox
              id={`final-visible-${suggestion.id}`}
              checked={form.visible}
              onCheckedChange={(value) =>
                setForm((current) => ({ ...current, visible: value === true }))
              }
              className="mt-0.5"
              disabled={saving}
            />
            <span className="text-sm">Client-visible</span>
          </label>
        </form>
      </AppDialog.Body>
      <AppDialog.Footer
        secondary={{ label: "Cancel" }}
        primary={{
          label: "Approve",
          onClick: () => void submit(),
          disabled: !form.name.trim() || saving,
          loading: saving,
        }}
      />
    </AppDialog>
  );
}

function DismissDialog({
  suggestion,
  disabled,
  onDone,
}: {
  suggestion: BlueprintSuggestionRow;
  disabled: boolean;
  onDone: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!note.trim() || saving) return;
    setSaving(true);
    const result = await resolveBlueprintSuggestion({
      id: suggestion.id,
      action: "dismiss",
      note: note.trim(),
    });
    setSaving(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Suggestion declined", {
      description: "The client sees your reason in their portal.",
    });
    setOpen(false);
    onDone();
  }

  return (
    <AppDialog
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button variant="outline" size="sm" disabled={disabled}>
          <X className="size-3.5" aria-hidden="true" />
          Decline
        </Button>
      }
      size="md"
    >
      <AppDialog.Header
        icon={X}
        title="Decline the suggestion"
        subtitle="Tell the client why. The task stays exactly as it is now."
      />
      <AppDialog.Body>
        <form
          id={`dismiss-suggestion-${suggestion.id}`}
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
        >
          <FormTextarea
            id={`dismiss-note-${suggestion.id}`}
            label="Message to the client"
            hint="This appears next to the task in their portal."
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Why this change is not going into the plan"
            disabled={saving}
          />
        </form>
      </AppDialog.Body>
      <AppDialog.Footer
        secondary={{ label: "Cancel" }}
        primary={{
          label: "Decline suggestion",
          onClick: () => void submit(),
          disabled: note.trim().length < 3 || saving,
          loading: saving,
        }}
      />
    </AppDialog>
  );
}


function ExpandableDescription({ value }: { value: string }) {
  const [expanded, setExpanded] = useState(false);
  const text = value || "No description";

  return (
    <div className="mt-1">
      <textarea
        readOnly
        rows={expanded ? 8 : 3}
        value={text}
        aria-label="Suggested description"
        className="w-full resize-none rounded-md border border-input bg-background px-2 py-1.5 text-xs text-muted-foreground outline-none"
      />
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        className="mt-1 text-[11px] font-medium text-primary hover:underline"
      >
        {expanded ? "Collapse description" : "Expand description"}
      </button>
    </div>
  );
}
