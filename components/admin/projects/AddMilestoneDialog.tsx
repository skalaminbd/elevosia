"use client";

import { useState } from "react";
import { Plus, Receipt, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppDialog } from "@/components/ui/app-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { createProjectInvoice } from "@/app/admin/projects/actions";
import type { StoredMilestone } from "@/lib/project-store";

type DraftTask = { key: number; name: string; hours: string };

let keyCounter = 0;
const nextKey = () => ++keyCounter;

export function AddMilestoneDialog({
  projectId,
  onAdd,
}: {
  projectId: string;
  onAdd: (milestone: StoredMilestone) => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState<DraftTask[]>([
    { key: nextKey(), name: "", hours: "8" },
  ]);
  const [bill, setBill] = useState(true);
  const [amount, setAmount] = useState("");
  const [due, setDue] = useState("");

  function reset() {
    setTitle("");
    setTasks([{ key: nextKey(), name: "", hours: "8" }]);
    setBill(true);
    setAmount("");
    setDue("");
  }

  function updateTask(key: number, patch: Partial<DraftTask>) {
    setTasks((current) =>
      current.map((task) => (task.key === key ? { ...task, ...patch } : task)),
    );
  }

  const filled = tasks.filter((task) => task.name.trim() !== "");
  const price = Number(amount);
  const valid =
    title.trim() !== "" &&
    (filled.length > 0 || tasks.length === 0) &&
    (!bill || price > 0);

  async function submit() {
    if (!valid) return;

    const milestone: StoredMilestone = {
      id: `milestone-${Date.now().toString(36)}`,
      title: title.trim(),
      tasks: filled.map((task, index) => ({
        id: `task-${Date.now().toString(36)}-${index}`,
        name: task.name.trim(),
        description: "",
        hours: Number(task.hours) || 0,
        visible: true,
        done: false,
      })),
    };

    let invoiceId: string | null = null;
    if (bill) {
      const result = await createProjectInvoice({
        projectId,
        lineItem: `${title.trim()} milestone`,
        amountCents: Math.round(price * 100),
        due: due || null,
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      invoiceId = result.invoiceId;
    }

    onAdd(milestone);
    toast.success("Milestone added", {
      description: invoiceId
        ? `Change invoice ${invoiceId} is due separately.`
        : "No invoice — this work is covered by the existing plan.",
    });
    reset();
    setOpen(false);
  }

  return (
    <AppDialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
      trigger={
        <Button variant="outline" className="w-full">
          <Plus className="size-4" aria-hidden="true" />
          Add requested work
        </Button>
      }
      size="lg"
    >
      <AppDialog.Header
        icon={Plus}
        title="Add requested work"
        subtitle="Client-requested work becomes a milestone. Bill it separately if the plan is already paid."
      />
      <AppDialog.Body>
        <form
          id="add-requested-milestone"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
          className="flex flex-col gap-[18px]"
        >
          <FormField
            id="requested-title"
            label="Milestone name"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Family access additions"
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-medium">Tasks</p>
              <Button
                type="button"
                variant="ghost"
                size="dialog-sm"
                onClick={() =>
                  setTasks((current) => [
                    ...current,
                    { key: nextKey(), name: "", hours: "8" },
                  ])
                }
              >
                <Plus className="size-3.5" aria-hidden="true" />
                Add task
              </Button>
            </div>
            <ul className="space-y-2">
              {tasks.map((task, index) => (
                <li key={task.key} className="flex items-center gap-2">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-[10px] text-muted-foreground">
                    {index + 1}
                  </span>
                  <FormField
                    id={`requested-task-${task.key}`}
                    label={`Task ${index + 1}`}
                    value={task.name}
                    onChange={(event) =>
                      updateTask(task.key, { name: event.target.value })
                    }
                    placeholder="What gets delivered"
                    className="flex-1"
                  />
                  <FormField
                    id={`requested-task-hours-${task.key}`}
                    label="Hours"
                    type="number"
                    min={0}
                    step={0.5}
                    value={task.hours}
                    onChange={(event) =>
                      updateTask(task.key, { hours: event.target.value })
                    }
                    inputClassName="font-mono"
                    className="w-24"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Remove task ${index + 1}`}
                    onClick={() =>
                      setTasks((current) =>
                        current.filter((item) => item.key !== task.key),
                      )
                    }
                    disabled={tasks.length === 1}
                    className="mt-6 shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" aria-hidden="true" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-border pt-4">
            <label className="flex cursor-pointer items-start gap-3">
              <Checkbox
                id="requested-bill"
                checked={bill}
                onCheckedChange={(value) => setBill(value === true)}
                className="mt-0.5"
              />
              <span>
                <span className="block text-sm font-medium">
                  Bill this work separately
                </span>
                <span className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Receipt className="size-3" aria-hidden="true" />
                  Creates a one-off change invoice. The paid plan stays as it is.
                </span>
              </span>
            </label>

            {bill ? (
              <div className="mt-3 grid gap-[18px] sm:grid-cols-2">
                <FormField
                  id="requested-amount"
                  label="Change invoice (USD)"
                  type="number"
                  min={0}
                  step={50}
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  inputClassName="font-mono"
                />
                <FormField
                  id="requested-due"
                  label="Invoice due"
                  type="date"
                  value={due}
                  onChange={(event) => setDue(event.target.value)}
                  hint="Leave empty for on approval."
                />
              </div>
            ) : null}
          </div>
        </form>
      </AppDialog.Body>
      <AppDialog.Footer
        secondary={{ label: "Cancel" }}
        primary={{
          label: bill ? "Add and invoice" : "Add milestone",
          type: "submit",
          form: "add-requested-milestone",
          disabled: !valid,
        }}
      />
    </AppDialog>
  );
}
