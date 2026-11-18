"use client";

import { useState, type ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { z } from "zod";
import { AppDialog } from "@/components/ui/app-dialog";
import { FormField, FormSelect, FormTextarea } from "@/components/ui/form-field";
import { retainer } from "@/lib/portal-data";

const schema = z.object({
  title: z.string().trim().min(2, "Give the request a short name"),
  project: z.string().min(1),
  priority: z.string().min(1),
  detail: z.string().trim().min(10, "Add a little more detail"),
});

type Values = z.infer<typeof schema>;
type Errors = Partial<Record<keyof Values, string>>;

export function NewRequestDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <AppDialog
      open={open}
      onOpenChange={setOpen}
      trigger={children}
      size="md"
    >
      <RequestForm onClose={() => setOpen(false)} />
    </AppDialog>
  );
}

function RequestForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<Values>({
    title: "",
    project: "Care dashboard and client portal",
    priority: "Normal",
    detail: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function update<K extends keyof Values>(key: K, value: Values[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setDirty(true);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Values;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
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
        icon={Sparkles}
        title="Request new work"
        subtitle="For care plan clients. Small additions use your monthly hours."
      />
      <AppDialog.Body>
        <form id="new-request-dialog" onSubmit={submit} className="flex flex-col gap-[18px]">
          <FormField
            id="request-title"
            label="Title"
            value={form.title}
            onChange={(event) => update("title", event.target.value)}
            placeholder="A short name for the work"
            error={errors.title}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormSelect
              id="request-project"
              label="Project"
              value={form.project}
              onChange={(event) => update("project", event.target.value)}
            >
              <option>Care dashboard and client portal</option>
              <option>Online booking</option>
            </FormSelect>
            <FormSelect
              id="request-priority"
              label="Priority"
              value={form.priority}
              onChange={(event) => update("priority", event.target.value)}
            >
              <option>Normal</option>
              <option>Urgent</option>
              <option>Low</option>
            </FormSelect>
          </div>
          <FormTextarea
            id="request-detail"
            label="What do you need?"
            value={form.detail}
            onChange={(event) => update("detail", event.target.value)}
            rows={4}
            error={errors.detail}
            hint={`Uses your ${retainer.plan} hours first. ${retainer.hours - retainer.used} h left this month.`}
          />
        </form>
      </AppDialog.Body>
      <AppDialog.Footer
        status={saved ? "saved" : dirty ? "dirty" : undefined}
        secondary={{ label: "Cancel" }}
        primary={{
          label: "Send request",
          type: "submit",
          form: "new-request-dialog",
          disabled: !form.title.trim() || !form.detail.trim() || saving,
          loading: saving,
        }}
      />
    </>
  );
}
