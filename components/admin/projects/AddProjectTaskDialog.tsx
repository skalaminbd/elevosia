"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { AppDialog } from "@/components/ui/app-dialog";
import { Button } from "@/components/ui/button";
import { FormField, FormTextarea } from "@/components/ui/form-field";
import { cn } from "@/lib/utils";
import type { StoredTask } from "@/lib/project-store";

type Draft = Omit<StoredTask, "id" | "done">;

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        checked ? "bg-primary" : "bg-input",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 size-5 rounded-full bg-background shadow-sm transition-all",
          checked ? "left-6" : "left-0.5",
        )}
      />
    </button>
  );
}

/** Same task form as the Blueprint milestones, used inside a project. */
export function AddProjectTaskDialog({
  onAdd,
}: {
  onAdd: (tasks: Draft[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [hours, setHours] = useState("8");
  const [visible, setVisible] = useState(false);

  const current = (): Draft | null =>
    name.trim()
      ? {
          name: name.trim(),
          description: description.trim(),
          hours: Number(hours) || 0,
          visible,
        }
      : null;

  function clearFields() {
    setName("");
    setDescription("");
    setHours("8");
    setVisible(false);
  }

  function addAnother() {
    const task = current();
    if (!task) return;
    setDrafts((list) => [...list, task]);
    clearFields();
  }

  function submit() {
    const task = current();
    const all = task ? [...drafts, task] : drafts;
    if (all.length === 0) return;
    onAdd(all);
    setDrafts([]);
    clearFields();
    setOpen(false);
  }

  return (
    <AppDialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setDrafts([]);
          clearFields();
        }
      }}
      trigger={
        <Button variant="outline" size="sm">
          <Plus className="size-3.5" aria-hidden="true" />
          Add task
        </Button>
      }
      size="lg"
    >
      <AppDialog.Header
        icon={Plus}
        title="Add tasks"
        subtitle="Add one task, or stack several before saving."
      />
      <AppDialog.Body>
        <form
          id="add-project-task"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
          className="flex flex-col gap-[18px]"
        >
          <div className="grid gap-[18px] sm:grid-cols-2">
            <FormField
              id="project-task-name"
              label="Task name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Import client records"
              className="sm:col-span-2"
            />
            <FormTextarea
              id="project-task-description"
              label="Task description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What done looks like"
              className="sm:col-span-2"
            />
            <FormField
              id="project-task-hours"
              label="Estimated hours"
              type="number"
              min={0}
              step={0.5}
              value={hours}
              onChange={(event) => setHours(event.target.value)}
              inputClassName="font-mono"
            />
            <div className="space-y-2">
              <p className="text-[13px] font-medium text-foreground">
                Client-visible
              </p>
              <div className="flex h-11.5 items-center gap-3 rounded-[var(--radius-dialog-control)] border border-input bg-card px-3.5">
                <Toggle
                  checked={visible}
                  onChange={setVisible}
                  label="Client-visible"
                />
                <span className="text-xs text-muted-foreground">
                  {visible
                    ? "On · shows on the client board"
                    : "Off · internal only"}
                </span>
              </div>
            </div>
          </div>

          {drafts.length > 0 ? (
            <ul className="space-y-2 rounded-lg border border-border bg-secondary/40 p-3">
              {drafts.map((draft, index) => (
                <li
                  key={`${draft.name}-${index}`}
                  className="flex items-center gap-2 text-sm"
                >
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{draft.name}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {draft.hours} h
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Remove ${draft.name}`}
                    onClick={() =>
                      setDrafts((list) =>
                        list.filter((_, itemIndex) => itemIndex !== index),
                      )
                    }
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" aria-hidden="true" />
                  </Button>
                </li>
              ))}
            </ul>
          ) : null}

          <div>
            <Button
              type="button"
              variant="outline"
              size="dialog-sm"
              onClick={addAnother}
              disabled={!name.trim()}
            >
              <Plus className="size-3.5" aria-hidden="true" />
              Add another task
            </Button>
          </div>
        </form>
      </AppDialog.Body>
      <AppDialog.Footer
        secondary={{ label: "Cancel" }}
        primary={{
          label:
            drafts.length > 0
              ? `Add ${drafts.length + (name.trim() ? 1 : 0)} tasks`
              : "Add task",
          type: "submit",
          form: "add-project-task",
          disabled: !name.trim() && drafts.length === 0,
        }}
      />
    </AppDialog>
  );
}
