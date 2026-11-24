"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Pencil } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { FormField, FormTextarea } from "@/components/ui/form-field";
import {
  approveBlueprintByClient,
  submitBlueprintSuggestion,
} from "@/app/admin/blueprints/actions";
import type { BlueprintSuggestionRow } from "@/db/queries";
import { PortalSuggestionStatus } from "@/components/portal/PortalSuggestionStatus";

type PortalBlueprintSummary = {
  id: string;
  title: string;
  client: string;
  version: string;
  status: string;
};

type PortalTask = {
  id: string;
  name: string;
  description: string;
  hours: number;
  visible: boolean;
};

type PortalBlueprintMilestone = {
  id: string;
  title: string;
  tasks: PortalTask[];
};

type SelectedTask = {
  milestoneId: string;
  task: PortalTask;
};

export function PortalBlueprintTasks({
  blueprintId,
  blueprint,
  initial,
  suggestions,
}: {
  blueprintId: string;
  blueprint: PortalBlueprintSummary;
  initial: PortalBlueprintMilestone[];
  suggestions: BlueprintSuggestionRow[];
}) {
  const router = useRouter();
  const [approving, setApproving] = useState(false);
  const [selected, setSelected] = useState<SelectedTask | null>(null);
  const status = blueprint.status;

  async function approve() {
    setApproving(true);
    const result = await approveBlueprintByClient({ id: blueprintId });
    setApproving(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Blueprint approved", {
      description: "Your PM can now convert it into a project.",
    });
    router.refresh();
  }

  const selectedSuggestion = selected
    ? (suggestions.find(
        (item) =>
          item.taskId === selected.task.id && item.status === "pending",
      ) ?? suggestions.find((item) => item.taskId === selected.task.id))
    : undefined;

  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <Link
        href="/portal/blueprints"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        All Blueprints
      </Link>

      <PageHeader
        title={blueprint.title}
        meta={`${blueprint.id} · ${blueprint.client} · ${blueprint.version}`}
        description="Open a task to read it, then suggest a change. Your PM approves it before it saves."
        className="mt-3"
      >
        <StatusBadge tone={status === "Approved" ? "success" : "accent"}>
          {status}
        </StatusBadge>
        {status !== "Approved" && status !== "Draft" ? (
          <Button onClick={() => void approve()} disabled={approving}>
            <Check className="size-4" aria-hidden="true" />
            {approving ? "Approving…" : "Approve Blueprint"}
          </Button>
        ) : null}
      </PageHeader>

      <div className="mt-6 space-y-4">
        {initial.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            The plan has no milestones yet. Your PM is still building it.
          </div>
        ) : null}

        {initial.map((milestone, index) => {
          const hours = milestone.tasks.reduce(
            (total, task) => total + task.hours,
            0,
          );

          return (
            <section
              key={milestone.id}
              className="rounded-lg border border-border bg-card"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3.5">
                <div>
                  <h2 className="text-sm font-semibold">
                    {milestone.title || `Milestone ${index + 1}`}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {milestone.tasks.length} tasks · {hours} h
                  </p>
                </div>
              </div>
              <ul className="divide-y divide-border">
                {milestone.tasks.length === 0 ? (
                  <li className="px-5 py-6 text-sm text-muted-foreground">
                    No tasks in this milestone yet.
                  </li>
                ) : null}
                {milestone.tasks.map((task) => {
                  const taskSuggestion = suggestions.find(
                    (item) =>
                      item.taskId === task.id && item.status === "pending",
                  ) ?? suggestions.find((item) => item.taskId === task.id);
                  return (
                    <li key={task.id}>
                      <div className="flex flex-wrap items-center gap-3 px-5 py-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">{task.name}</p>
                          {task.description ? (
                            <p className="mt-0.5 whitespace-pre-wrap text-xs text-muted-foreground">
                              {task.description}
                            </p>
                          ) : null}
                        </div>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {task.hours} h
                        </span>
                        {taskSuggestion?.status === "pending" ? (
                          <StatusBadge tone="warning">Pending review</StatusBadge>
                        ) : taskSuggestion?.status === "approved" ? (
                          <StatusBadge tone="success">Approved</StatusBadge>
                        ) : taskSuggestion?.status === "dismissed" ? (
                          <StatusBadge tone="neutral">Declined</StatusBadge>
                        ) : null}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setSelected({ milestoneId: milestone.id, task })
                          }
                          aria-label={`Edit ${task.name}`}
                        >
                          <Pencil className="size-3.5" aria-hidden="true" />
                          Edit
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      <Sheet
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <SheetContent
          side="right"
          className="w-full overflow-y-auto sm:max-w-lg"
        >
          {selected ? (
            <TaskPanel
              key={selected.task.id}
              blueprintId={blueprintId}
              milestoneId={selected.milestoneId}
              task={selected.task}
              suggestion={selectedSuggestion}
              onClose={() => setSelected(null)}
              onSaved={() => router.refresh()}
            />
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function TaskPanel({
  blueprintId,
  milestoneId,
  task,
  suggestion,
  onClose,
  onSaved,
}: {
  blueprintId: string;
  milestoneId: string;
  task: PortalTask;
  suggestion?: BlueprintSuggestionRow;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    name: task.name,
    description: task.description,
    hours: String(task.hours),
  });
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.name.trim() || saving) return;
    setSaving(true);
    const result = await submitBlueprintSuggestion({
      blueprintId,
      milestoneId,
      taskId: task.id,
      name: form.name.trim(),
      description: form.description,
      hours: Number(form.hours) || 0,
      // Visibility is controlled by the PM, not the client.
      visible: task.visible,
      note: note.trim() || undefined,
    });
    setSaving(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Suggestion sent", {
      description: "Your PM reviews it before it changes the plan.",
    });
    onClose();
    onSaved();
  }

  return (
    <form onSubmit={submit} className="flex h-full flex-col gap-5 px-5 py-4">
      <SheetHeader className="px-0">
        <SheetTitle className="pr-8">{task.name}</SheetTitle>
        <SheetDescription>{task.hours} h estimated</SheetDescription>
      </SheetHeader>


      {suggestion ? (
        <PortalSuggestionStatus suggestion={suggestion} />
      ) : null}

      <div className="space-y-4">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <Pencil className="size-3.5" aria-hidden="true" />
          Suggest a change
        </p>
        <FormField
          id="suggest-name"
          label="Task name"
          value={form.name}
          onChange={(event) =>
            setForm((current) => ({ ...current, name: event.target.value }))
          }
          disabled={saving}
        />
        <FormTextarea
          id="suggest-description"
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
          id="suggest-hours"
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
        <FormField
          id="suggest-note"
          label="Note for your PM (optional)"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Why this change matters"
          disabled={saving}
        />
      </div>

      <div className="mt-auto flex items-center gap-2 border-t border-border pt-4">
        <Button type="submit" disabled={!form.name.trim() || saving}>
          {saving ? "Sending…" : "Send suggestion"}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </form>
  );
}
