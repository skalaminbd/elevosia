"use client";

import { useState, type ReactNode } from "react";
import { FolderKanban, Plus } from "lucide-react";
import { z } from "zod";
import { AppDialog } from "@/components/ui/app-dialog";
import { Button } from "@/components/ui/button";
import { FormField, FormSelect } from "@/components/ui/form-field";

const MODULES = [
  "Scheduling",
  "Client CRM",
  "Care plans",
  "Invoicing",
  "Client portal",
  "Reports",
];

const schema = z.object({
  from: z.string().min(1),
  name: z.string().trim().min(2, "Enter the project name"),
  pm: z.string().min(1),
  start: z.string().min(1),
});

type Values = z.infer<typeof schema>;
type Errors = Partial<Record<keyof Values, string>>;

export function NewProjectDialog({ children }: { children?: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <AppDialog
      open={open}
      onOpenChange={setOpen}
      trigger={
        children ?? (
          <Button>
            <Plus className="size-4" aria-hidden="true" />
            New project
          </Button>
        )
      }
      size="md"
    >
      <ProjectDialogForm onClose={() => setOpen(false)} />
    </AppDialog>
  );
}

function ProjectDialogForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<Values>({
    from: "BP-309",
    name: "Care dashboard and client portal",
    pm: "Alamin",
    start: "2026-11-24",
  });
  const [modules, setModules] = useState<string[]>([
    "Scheduling",
    "Client CRM",
    "Invoicing",
    "Client portal",
  ]);
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
      setStep(0);
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
        icon={FolderKanban}
        title="New project"
        subtitle={
          step === 0
            ? "Start from an approved Blueprint."
            : "Choose the modules in scope."
        }
      />
      <AppDialog.Body>
        <form
          id="new-project-dialog"
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
                id="project-from"
                label="Start from"
                value={form.from}
                onChange={(event) => update("from", event.target.value)}
                hint="Only approved Blueprints can become projects."
              >
                <option value="BP-309">
                  BP-309 · Brightline Care · Approved · $16,000
                </option>
                <option value="internal">Internal project (no Blueprint)</option>
              </FormSelect>
              <FormField
                id="project-name"
                label="Project name"
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                error={errors.name}
              />
              <FormSelect
                id="project-pm"
                label="Project manager"
                value={form.pm}
                onChange={(event) => update("pm", event.target.value)}
              >
                <option>Alamin</option>
                <option>Maya</option>
              </FormSelect>
              <FormField
                id="project-start"
                label="Start date"
                type="date"
                value={form.start}
                onChange={(event) => update("start", event.target.value)}
              />
            </>
          ) : (
            <div className="space-y-2">
              <p className="text-[13px] font-medium">Modules in scope</p>
              <div className="flex flex-wrap gap-2">
                {MODULES.map((module) => {
                  const on = modules.includes(module);
                  return (
                    <button
                      key={module}
                      type="button"
                      aria-pressed={on}
                      onClick={() => {
                        setModules((current) =>
                          current.includes(module)
                            ? current.filter((item) => item !== module)
                            : [...current, module],
                        );
                        setDirty(true);
                      }}
                      className={
                        on
                          ? "h-9 rounded-full bg-primary px-3.5 text-[13px] font-medium text-primary-foreground"
                          : "h-9 rounded-full border border-input bg-card px-3.5 text-[13px] font-medium text-muted-foreground hover:text-foreground"
                      }
                    >
                      {module}
                    </button>
                  );
                })}
              </div>
            </div>
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
                label: "Create project",
                type: "submit",
                form: "new-project-dialog",
                disabled: !form.name.trim() || saving,
                loading: saving,
              }
        }
      />
    </>
  );
}
