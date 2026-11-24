"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { AppDialog } from "@/components/ui/app-dialog";
import { Button } from "@/components/ui/button";
import { FormField, FormTextarea } from "@/components/ui/form-field";
import { createContractTemplate } from "@/app/admin/contracts/actions";

export function NewTemplateDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const valid = name.trim().length >= 2;
  const formId = "new-template-dialog";

  function reset() {
    setName("");
    setBody("");
    setSaved(false);
  }

  async function save() {
    if (!valid || saving) return;
    setSaving(true);
    const result = await createContractTemplate({ name, body });
    setSaving(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setSaved(true);
    toast.success("Template added", {
      description: `${result.id} is ready for the next contract.`,
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
      dirty={!saved && (name.trim() !== "" || body.trim() !== "")}
      trigger={
        <Button variant="outline">
          <Plus className="size-4" aria-hidden="true" />
          New template
        </Button>
      }
    >
      <AppDialog.Header
        icon={Plus}
        title="New contract template"
        subtitle="Templates are starting points for new contracts. They cannot be edited once saved."
      />
      <AppDialog.Body>
        <form
          id={formId}
          onSubmit={(event) => {
            event.preventDefault();
            if (valid) void save();
          }}
          className="flex flex-col gap-[18px]"
        >
          <FormField
            id="template-name"
            label="Template name"
            placeholder="e.g. Care plan renewal"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={saved || saving}
          />
          <FormTextarea
            id="template-body"
            label="What it covers"
            placeholder="Hours, response time, billing and cancellation terms."
            value={body}
            onChange={(event) => setBody(event.target.value)}
            disabled={saved || saving}
          />
        </form>
      </AppDialog.Body>
      <AppDialog.Footer
        status={saved ? "saved" : undefined}
        secondary={{ label: "Cancel" }}
        primary={{
          label: "Add template",
          type: "submit",
          form: formId,
          disabled: !valid || saving,
          loading: saving,
        }}
      />
    </AppDialog>
  );
}
