"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileSignature, Plus } from "lucide-react";
import { toast } from "sonner";
import { AppDialog } from "@/components/ui/app-dialog";
import { Button } from "@/components/ui/button";
import { FormSelect } from "@/components/ui/form-field";
import { createContract } from "@/app/admin/contracts/actions";
import type { ContractStatus } from "@/lib/admin-data";
import { useDirectory } from "@/hooks/use-directory";
import { CONTRACT_TEMPLATES } from "@/lib/contract-store";

const STATUSES: ContractStatus[] = ["Draft", "Sent", "Signed"];

export function NewContractDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { clients, projects: projectOptions } = useDirectory();
  const [clientId, setClientId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [templateName, setTemplateName] = useState(
    CONTRACT_TEMPLATES[0]?.name ?? "Service agreement",
  );
  const [status, setStatus] = useState<ContractStatus>("Draft");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const client = clients.find((item) => item.id === clientId) ?? clients[0];
  const projects = client
    ? projectOptions.filter((project) => project.client === client.name)
    : [];

  const valid = Boolean(client);
  const formId = "new-contract-dialog";

  function reset() {
    setClientId(clients[0]?.id ?? "");
    setProjectId("");
    setTemplateName(CONTRACT_TEMPLATES[0]?.name ?? "Service agreement");
    setStatus("Draft");
    setSaved(false);
  }

  async function save() {
    if (!client || saving) return;
    setSaving(true);
    const result = await createContract({
      clientId: client.id,
      projectId: projectId || null,
      type: templateName,
      status,
    });
    setSaving(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setSaved(true);
    toast.success("Contract created", {
      description: `${result.id} is linked to ${client.name}.`,
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
        if (!next) setSaved(false);
      }}
      trigger={
        <Button>
          <Plus className="size-4" aria-hidden="true" />
          New contract
        </Button>
      }
    >
      <AppDialog.Header
        icon={FileSignature}
        title="New contract"
        subtitle="Pick the client and, when the project exists, the project it covers."
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
          <FormSelect
            id="contract-client"
            label="Client"
            value={clientId || clients[0]?.id || ""}
            onChange={(event) => {
              setClientId(event.target.value);
              setProjectId("");
            }}
            disabled={saved || saving}
          >
            {clients.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </FormSelect>

          <FormSelect
            id="contract-project"
            label="Project"
            hint={
              projects.length === 0
                ? "This client has no project yet. The contract stays client-level, like an NDA."
                : "One project per contract. Leave empty for pre-project documents."
            }
            value={projectId}
            onChange={(event) => setProjectId(event.target.value)}
            disabled={saved || saving || projects.length === 0}
          >
            <option value="">No project yet</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </FormSelect>

          <FormSelect
            id="contract-template"
            label="Template"
            value={templateName}
            onChange={(event) => setTemplateName(event.target.value)}
            disabled={saved || saving}
          >
            {CONTRACT_TEMPLATES.map((template) => (
              <option key={template.id} value={template.name}>
                {template.name}
              </option>
            ))}
          </FormSelect>

          <FormSelect
            id="contract-status"
            label="Status"
            hint="Draft keeps it out of the client portal until you send it."
            value={status}
            onChange={(event) => setStatus(event.target.value as ContractStatus)}
            disabled={saved || saving}
          >
            {STATUSES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </FormSelect>
        </form>
      </AppDialog.Body>
      <AppDialog.Footer
        status={saved ? "saved" : undefined}
        secondary={{ label: "Cancel" }}
        primary={{
          label: "Create contract",
          type: "submit",
          form: formId,
          disabled: !valid || saving,
          loading: saving,
        }}
      />
    </AppDialog>
  );
}
