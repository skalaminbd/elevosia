"use client";

import { useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { FolderKanban, Plus } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { AppDialog } from "@/components/ui/app-dialog";
import { Button } from "@/components/ui/button";
import { FormField, FormSelect } from "@/components/ui/form-field";
import { createProject } from "@/app/admin/projects/actions";
import {
  useDirectory,
  type DirectoryBlueprint,
  type DirectoryClient,
} from "@/hooks/use-directory";

const MODULES = [
  "Scheduling",
  "Client CRM",
  "Care plans",
  "Invoicing",
  "Client portal",
  "Reports",
];

const schema = z.object({
  client: z.string().min(1),
  company: z.string().min(1),
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
  const { clients, blueprints } = useDirectory();

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
    <ProjectDialogFormInner
      onClose={onClose}
      clients={clients}
      blueprints={blueprints}
    />
  );
}

function ProjectDialogFormInner({
  onClose,
  clients,
  blueprints,
}: {
  onClose: () => void;
  clients: DirectoryClient[];
  blueprints: DirectoryBlueprint[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<Values>({
    client: clients[0].name,
    company: clients[0].companies[0]?.name ?? "",
    from: blueprints[0]?.id ?? "",
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
  // Guards against a click that lands on the footer button right after Next
  // swaps it for the create action.
  const stepEnteredAt = useRef(0);

  function update<K extends keyof Values>(key: K, value: Values[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setDirty(true);
  }

  function chooseClient(name: string) {
    const next = clients.find((client) => client.name === name);
    setForm((current) => ({
      ...current,
      client: name,
      company: next?.companies[0]?.name ?? "",
    }));
    setErrors((current) => ({ ...current, client: undefined, company: undefined }));
    setDirty(true);
  }

  const selectedClient =
    clients.find((client) => client.name === form.client) ?? clients[0];

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
    const client =
      clients.find((item) => item.name === form.client) ?? clients[0];
    if (!client) {
      toast.error("Clients are still loading. Try again in a second.");
      return;
    }
    setSaving(true);
    const result = await createProject({
      clientId: client.id,
      name: form.name,
      blueprintId: form.from || null,
      pm: form.pm,
      start: form.start,
    });
    setSaving(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setSaved(true);
    setDirty(false);
    toast.success("Project created", {
      description: `${form.name} is under ${form.client}.`,
    });
    router.refresh();
    window.setTimeout(() => {
      onClose();
      router.push(`/admin/projects/${result.projectId}?tab=milestones`);
    }, 1200);
  }

  return (
    <>
      <AppDialog.Header
        icon={FolderKanban}
        title="New project"
        subtitle={
          step === 0
            ? "Pick the client, the company and an approved Blueprint."
            : "Set the PM, the start date and the modules in scope."
        }
      />
      <AppDialog.Body>
        <form
          id="new-project-dialog"
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
          {step === 0 ? (
            <>
              <FormSelect
                id="project-client"
                label="Client"
                value={form.client}
                onChange={(event) => chooseClient(event.target.value)}
              >
                {clients.map((client) => (
                  <option key={client.id}>{client.name}</option>
                ))}
              </FormSelect>
              <FormSelect
                id="project-company"
                label="Company"
                value={form.company}
                onChange={(event) => update("company", event.target.value)}
                hint="The company under this client the work belongs to."
              >
                {selectedClient.companies.map((company) => (
                  <option key={company.name}>{company.name}</option>
                ))}
              </FormSelect>
              <FormSelect
                id="project-from"
                label="Start from"
                value={form.from}
                onChange={(event) => update("from", event.target.value)}
                hint="Only approved Blueprints can become projects."
              >
                {blueprints.map((blueprint) => (
                  <option key={blueprint.id} value={blueprint.id}>
                    {blueprint.id} · {blueprint.client} · {blueprint.status} · $
                    {blueprint.price.toLocaleString("en-US")}
                  </option>
                ))}
                <option value="internal">Internal project (no Blueprint)</option>
              </FormSelect>
              <FormField
                id="project-name"
                label="Project name"
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                error={errors.name}
              />
            </>
          ) : (
            <div className="flex flex-col gap-[18px]">
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
            ? {
                label: "Next",
                onClick: () => {
                  stepEnteredAt.current = Date.now();
                  setStep(1);
                },
              }
            : {
                label: "Create project",
                onClick: save,
                disabled: !form.name.trim() || saving,
                loading: saving,
              }
        }
      />
    </>
  );
}
