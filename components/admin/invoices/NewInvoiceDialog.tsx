"use client";

import { useState, type ReactNode } from "react";
import { Plus, Receipt } from "lucide-react";
import { z } from "zod";
import { AppDialog } from "@/components/ui/app-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormSelect } from "@/components/ui/form-field";

const CLIENTS = [
  "Brightline Care",
  "Lumen Studio",
  "Northwind HVAC",
  "Harbor Therapy",
  "Ridgeline Cleaning",
  "Cedarbrook Schools",
];
const KINDS = ["Milestone", "Care plan", "Retainer", "Change request", "Custom"];

const schema = z.object({
  client: z.string().min(1),
  kind: z.string().min(1),
  amount: z.string().refine((value) => Number(value) > 0, "Enter an amount"),
  due: z.string().min(1, "Choose a due date"),
  description: z.string().trim().min(2, "Add a short description"),
  send: z.boolean(),
});

type Values = z.infer<typeof schema>;
type Errors = Partial<Record<keyof Values, string>>;

export function NewInvoiceDialog({ children }: { children?: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <AppDialog
      open={open}
      onOpenChange={setOpen}
      trigger={
        children ?? (
          <Button>
            <Plus className="size-4" aria-hidden="true" />
            New invoice
          </Button>
        )
      }
      size="md"
    >
      <InvoiceDialogForm onClose={() => setOpen(false)} />
    </AppDialog>
  );
}

function InvoiceDialogForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<Values>({
    client: "Brightline Care",
    kind: "Milestone",
    amount: "4800",
    due: "2026-12-02",
    description: "Milestone 3 of 3 · care dashboard",
    send: true,
  });
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function update<K extends keyof Values>(key: K, value: Values[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setDirty(true);
  }

  function save() {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Values;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      setStep(next.description ? 1 : 0);
      return;
    }
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setDirty(false);
      window.setTimeout(onClose, 2000);
    }, 450);
  }

  return (
    <>
      <AppDialog.Header
        icon={Receipt}
        title="New invoice"
        subtitle={
          step === 0
            ? "Who is it for, and what is it worth?"
            : "Add a note and choose whether to send it."
        }
      />
      <AppDialog.Body>
        <form
          id="new-invoice-dialog"
          onSubmit={(event) => {
            event.preventDefault();
            if (step === 0) setStep(1);
            else save();
          }}
          className="flex flex-col gap-[18px]"
        >
          {step === 0 ? (
            <>
              <FormSelect
                id="invoice-client"
                label="Client"
                value={form.client}
                onChange={(event) => update("client", event.target.value)}
              >
                {CLIENTS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </FormSelect>
              <FormSelect
                id="invoice-kind"
                label="Type"
                value={form.kind}
                onChange={(event) => update("kind", event.target.value)}
              >
                {KINDS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </FormSelect>
              <FormField
                id="invoice-amount"
                label="Amount (USD)"
                type="number"
                min={0}
                step={50}
                value={form.amount}
                onChange={(event) => update("amount", event.target.value)}
                error={errors.amount}
                inputClassName="font-mono"
              />
              <FormField
                id="invoice-due"
                label="Due date"
                type="date"
                value={form.due}
                onChange={(event) => update("due", event.target.value)}
                error={errors.due}
              />
            </>
          ) : (
            <>
              <FormField
                id="invoice-description"
                label="Description"
                value={form.description}
                onChange={(event) => update("description", event.target.value)}
                error={errors.description}
              />
              <label className="flex cursor-pointer items-start gap-3 rounded-[var(--radius-dialog-preview)] border border-border p-4">
                <Checkbox
                  id="invoice-send"
                  checked={form.send}
                  onCheckedChange={(value) => update("send", value === true)}
                  className="mt-0.5"
                />
                <span>
                  <span className="block text-sm font-medium">
                    Send after creating
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    The client gets an email and sees it in the portal.
                  </span>
                </span>
              </label>
            </>
          )}
        </form>
      </AppDialog.Body>
      <AppDialog.Footer
        status={saved ? "saved" : dirty ? "dirty" : undefined}
        secondary={
          step === 0
            ? { label: "Cancel" }
            : { label: "Back", onClick: () => setStep(0) }
        }
        primary={
          step === 0
            ? { label: "Next", onClick: () => setStep(1) }
            : {
                label: "Create invoice",
                type: "submit",
                form: "new-invoice-dialog",
                disabled:
                  Number(form.amount) <= 0 ||
                  !form.due ||
                  !form.description.trim() ||
                  saving,
                loading: saving,
              }
        }
      />
    </>
  );
}
