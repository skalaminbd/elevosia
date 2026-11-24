"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Receipt } from "lucide-react";
import { toast } from "sonner";
import { AppDialog } from "@/components/ui/app-dialog";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { createProjectInvoice } from "@/app/admin/projects/actions";
import type { ProjectScope } from "@/lib/project-store";

/** Bills the approved requirement scope on the project with a custom amount. */
export function SendScopeInvoiceDialog({
  scope,
  projectId,
  projectName,
  client,
}: {
  scope: ProjectScope;
  projectId: string;
  projectName: string;
  client: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState(
    `${scope.requirementTitle} · ${scope.points.length} approved points`,
  );
  const [amount, setAmount] = useState("");
  const [due, setDue] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const price = Number(amount);
  const valid = description.trim() !== "" && price > 0;
  const formId = "scope-invoice-dialog";

  function reset() {
    setDescription(
      `${scope.requirementTitle} · ${scope.points.length} approved points`,
    );
    setAmount("");
    setDue("");
    setSaved(false);
  }

  async function submit() {
    if (!valid || saving) return;
    setSaving(true);
    const result = await createProjectInvoice({
      projectId,
      lineItem: description.trim(),
      amountCents: Math.round(price * 100),
      due: due || null,
    });
    setSaving(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setSaved(true);
    toast.success("Custom invoice created", {
      description: `${result.invoiceId} for ${projectName} is due separately.`,
    });
    router.refresh();
    window.setTimeout(() => {
      setOpen(false);
      reset();
    }, 900);
  }

  return (
    <AppDialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
      trigger={
        <Button>
          <Receipt className="size-4" aria-hidden="true" />
          Send custom invoice
        </Button>
      }
      size="md"
    >
      <AppDialog.Header
        icon={Receipt}
        title="Send a custom invoice"
        subtitle={`Billed to ${client} and stored under ${projectName}.`}
      />
      <AppDialog.Body>
        <div className="rounded-[var(--radius-dialog-preview)] border border-border bg-card p-3">
          <p className="text-sm font-medium">
            {scope.requirementId} · {scope.requirementTitle}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {scope.points.length} approved requirement{" "}
            {scope.points.length === 1 ? "point" : "points"} from{" "}
            {scope.blueprintId}
          </p>
        </div>
        <form
          id={formId}
          onSubmit={(event) => {
            event.preventDefault();
            if (valid) void submit();
          }}
          className="flex flex-col gap-[18px]"
        >
          <FormField
            id="scope-invoice-description"
            label="Line item"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            disabled={saved || saving}
          />
          <FormField
            id="scope-invoice-amount"
            label="Amount (USD)"
            type="number"
            min="1"
            step="0.01"
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            disabled={saved || saving}
          />
          <FormField
            id="scope-invoice-due"
            label="Due date"
            type="date"
            hint="Leave empty to bill on receipt."
            value={due}
            onChange={(event) => setDue(event.target.value)}
            disabled={saved || saving}
          />
        </form>
      </AppDialog.Body>
      <AppDialog.Footer
        status={saved ? "saved" : undefined}
        secondary={{ label: "Cancel" }}
        primary={{
          label: "Create invoice",
          type: "submit",
          form: formId,
          disabled: !valid || saving,
          loading: saving,
        }}
      />
    </AppDialog>
  );
}
