"use client";

import { useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createBlueprint } from "@/app/admin/blueprints/actions";
import { FileText, Plus, Trash2 } from "lucide-react";
import { z } from "zod";
import { AppDialog } from "@/components/ui/app-dialog";
import { Button } from "@/components/ui/button";
import { FormField, FormSelect } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { useDirectory, type DirectoryClient } from "@/hooks/use-directory";

const TERMS = ["Service agreement", "Retainer agreement", "Custom"];
const PAYMENTS = [
  "40% deposit, 30% demo, 30% launch",
  "Monthly installments",
  "Paid in full",
];

const schema = z.object({
  client: z.string().min(1),
  company: z.string().min(1),
  title: z.string().trim().min(2, "Enter the project name"),
  price: z.string().refine((value) => Number(value) > 0, "Enter a price"),
  terms: z.string().min(1),
  validUntil: z.string().min(1),
  payment: z.string().min(1),
});

type Values = z.infer<typeof schema>;
type Errors = Partial<Record<keyof Values, string>>;

export function NewBlueprintDialog({
  requirementId,
  children,
}: {
  requirementId?: string;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <AppDialog
      open={open}
      onOpenChange={setOpen}
      trigger={
        children ?? (
          <Button>
            <Plus className="size-4" aria-hidden="true" />
            New Blueprint
          </Button>
        )
      }
      size="md"
    >
      <BlueprintDialogForm
        requirementId={requirementId}
        onClose={() => setOpen(false)}
      />
    </AppDialog>
  );
}

function BlueprintDialogForm({
  requirementId,
  onClose,
}: {
  requirementId?: string;
  onClose: () => void;
}) {
  const { clients } = useDirectory();

  if (clients.length === 0) {
    return (
      <AppDialog.Body>
        <p className="py-8 text-center text-sm text-muted-foreground">
          Loading clients…
        </p>
      </AppDialog.Body>
    );
  }

  return (
    <BlueprintDialogFormInner
      requirementId={requirementId}
      onClose={onClose}
      clients={clients}
    />
  );
}

function BlueprintDialogFormInner({
  requirementId,
  onClose,
  clients,
}: {
  requirementId?: string;
  onClose: () => void;
  clients: DirectoryClient[];
}) {
  const preferred =
    clients.find((client) => client.name === "Clearwater Fund") ?? clients[0];
  const [form, setForm] = useState<Values>({
    client: preferred.name,
    company: preferred.companies[0]?.name ?? "",
    title: requirementId ? "Donor CRM and impact reporting" : "",
    price: "28000",
    terms: "Service agreement",
    validUntil: "2026-12-19",
    payment: PAYMENTS[0],
  });
  const [milestones, setMilestones] = useState([
    "Foundation",
    "Donors and members",
    "Applications",
    "Reporting",
    "Launch",
  ]);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [dirty, setDirty] = useState(false);
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Guards against a click that lands on the footer button right after Next
  // swaps it for the save action.
  const stepEnteredAt = useRef(0);

  function update<K extends keyof Values>(key: K, value: Values[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setDirty(true);
  }

  function chooseClient(name: string) {
    const next = clients.find((client) => client.name === name);
    update("client", name);
    update("company", next?.companies[0]?.name ?? "");
  }

  const selectedClient = clients.find((client) => client.name === form.client);

  async function save() {
    if (Date.now() - stepEnteredAt.current < 500) return;
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Values;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      setStep(0);
      return;
    }
    if (milestones.some((item) => !item.trim())) return;
    const client =
      clients.find((item) => item.name === form.client) ?? clients[0];
    setSaving(true);
    const result = await createBlueprint({
      clientId: client.id,
      requirementId: requirementId ?? null,
      title: form.title,
      priceCents: Math.round(Number(form.price) * 100),
      validUntil: form.validUntil,
      milestones,
    });
    setSaving(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setSaved(true);
    setDirty(false);
    toast.success("Blueprint created", {
      description: `${result.id} for ${form.client}.`,
    });
    router.refresh();
    window.setTimeout(() => {
      onClose();
      router.push(`/admin/blueprints/${result.id}`);
    }, 900);
  }

  return (
    <>
      <AppDialog.Header
        icon={FileText}
        title="New Blueprint"
        subtitle={
          step === 0
            ? "Set the client, scope and fixed price."
            : "Add the commercial terms and milestones."
        }
      />
      <AppDialog.Body>
        <form
          id="new-blueprint-dialog"
          onSubmit={(event) => {
            // Enter only advances the step. Saving is always an explicit click.
            event.preventDefault();
            if (step === 0) {
              stepEnteredAt.current = Date.now();
              setStep(1);
            }
          }}
          className="flex flex-col gap-[18px]"
        >
          {requirementId ? (
            <p className="rounded-[var(--radius-dialog-preview)] border border-border bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
              Created from {requirementId}. Every point is copied into the tasks
              below.
            </p>
          ) : null}

          {step === 0 ? (
            <>
              <FormSelect
                id="blueprint-client"
                label="Client"
                value={form.client}
                onChange={(event) => chooseClient(event.target.value)}
              >
                {clients.map((client) => (
                  <option key={client.id}>{client.name}</option>
                ))}
              </FormSelect>
              <FormSelect
                id="blueprint-company"
                label="Company"
                value={form.company}
                onChange={(event) => update("company", event.target.value)}
                hint="The company under this client the work belongs to."
              >
                {(selectedClient?.companies ?? []).map((company) => (
                  <option key={company.name}>{company.name}</option>
                ))}
              </FormSelect>
              <FormField
                id="blueprint-title"
                label="Project name"
                value={form.title}
                onChange={(event) => update("title", event.target.value)}
                error={errors.title}
              />
              <FormField
                id="blueprint-price"
                label="Fixed price (USD)"
                type="number"
                min={0}
                step={500}
                value={form.price}
                onChange={(event) => update("price", event.target.value)}
                error={errors.price}
                inputClassName="font-mono"
              />
            </>
          ) : (
            <>
              <FormSelect
                id="blueprint-terms"
                label="Terms template"
                value={form.terms}
                onChange={(event) => update("terms", event.target.value)}
              >
                {TERMS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </FormSelect>
              <FormField
                id="blueprint-valid"
                label="Valid until"
                type="date"
                value={form.validUntil}
                onChange={(event) => update("validUntil", event.target.value)}
              />
              <FormSelect
                id="blueprint-payment"
                label="Payment schedule"
                value={form.payment}
                onChange={(event) => update("payment", event.target.value)}
              >
                {PAYMENTS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </FormSelect>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-medium">Milestones</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="dialog-sm"
                    onClick={() => {
                      setMilestones((current) => [
                        ...current,
                        `Milestone ${current.length + 1}`,
                      ]);
                      setDirty(true);
                    }}
                  >
                    <Plus className="size-3.5" aria-hidden="true" />
                    Add milestone
                  </Button>
                </div>
                <ul className="space-y-2">
                  {milestones.map((milestone, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-[10px] text-muted-foreground">
                        {index + 1}
                      </span>
                      <Input
                        value={milestone}
                        onChange={(event) => {
                          setMilestones((current) =>
                            current.map((item, itemIndex) =>
                              itemIndex === index ? event.target.value : item,
                            ),
                          );
                          setDirty(true);
                        }}
                        aria-label={`Milestone ${index + 1}`}
                        className="h-11 rounded-[var(--radius-dialog-control)]"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Remove milestone ${index + 1}`}
                        onClick={() => {
                          setMilestones((current) =>
                            current.filter((_, itemIndex) => itemIndex !== index),
                          );
                          setDirty(true);
                        }}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" aria-hidden="true" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
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
            ? {
                label: "Next",
                onClick: () => {
                  stepEnteredAt.current = Date.now();
                  setStep(1);
                },
              }
            : {
                label: "Save as draft",
                onClick: save,
                disabled: !form.title.trim() || Number(form.price) <= 0 || saving,
                loading: saving,
              }
        }
      />
    </>
  );
}
