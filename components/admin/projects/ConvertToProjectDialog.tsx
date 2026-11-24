"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FolderKanban } from "lucide-react";
import { toast } from "sonner";
import { AppDialog } from "@/components/ui/app-dialog";
import { Button } from "@/components/ui/button";
import { FormField, FormSelect } from "@/components/ui/form-field";
import { convertBlueprintToProject } from "@/app/admin/projects/actions";
import type {
  ProjectScope,
  StoredMilestone,
} from "@/lib/project-store";

const PMS = ["Alamin", "Maya"];

export function ConvertToProjectDialog({
  blueprintId,
  blueprintTitle,
  client,
  clientId,
  milestones,
  scope,
}: {
  blueprintId: string;
  blueprintTitle: string;
  client: string;
  clientId: string;
  milestones: StoredMilestone[];
  scope?: Omit<ProjectScope, "approvedAt" | "invoiceId" | "invoiceAmount">;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(blueprintTitle);
  const [pm, setPm] = useState(PMS[0]);
  const [start, setStart] = useState("");
  const [saving, setSaving] = useState(false);

  const tasks = milestones.reduce(
    (total, milestone) => total + milestone.tasks.length,
    0,
  );
  const valid = name.trim().length > 1;

  async function convert() {
    if (!valid || saving) return;
    const id =
      name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || "project";
    setSaving(true);
    const result = await convertBlueprintToProject({
      id,
      name: name.trim(),
      clientId,
      blueprintId,
      pm,
      start: start || new Date().toISOString().slice(0, 10),
      milestones,
      scope: scope
        ? {
            requirementId: scope.requirementId,
            requirementTitle: scope.requirementTitle,
            blueprintId: scope.blueprintId,
            points: scope.points.map((point) => ({
              text: point.text,
              mustHave: point.must,
              milestoneId: point.milestoneId,
              milestoneTitle: point.milestoneTitle,
            })),
          }
        : null,
    });
    setSaving(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setOpen(false);
    toast.success("Project created", {
      description: `${name.trim()} now lives under Projects.`,
    });
    router.push(`/admin/projects/${id}?tab=milestones`);
  }

  return (
    <AppDialog
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button>
          <FolderKanban className="size-4" aria-hidden="true" />
          Convert to project
        </Button>
      }
      size="md"
    >
      <AppDialog.Header
        icon={FolderKanban}
        title="Convert to project"
        subtitle="The Blueprint's milestones and tasks move into the project."
      />
      <AppDialog.Body>
        <form
          id="convert-blueprint"
          onSubmit={(event) => {
            event.preventDefault();
            convert();
          }}
          className="flex flex-col gap-[18px]"
        >
          <FormField
            id="convert-name"
            label="Project name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <FormSelect
            id="convert-pm"
            label="Project manager"
            value={pm}
            onChange={(event) => setPm(event.target.value)}
          >
            {PMS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </FormSelect>
          <FormField
            id="convert-start"
            label="Start date"
            type="date"
            value={start}
            onChange={(event) => setStart(event.target.value)}
          />
          <div className="rounded-[var(--radius-dialog-preview)] border border-border bg-secondary/40 px-4 py-3 text-sm">
            <p className="font-medium">
              {milestones.length}{" "}
              {milestones.length === 1 ? "milestone" : "milestones"} · {tasks}{" "}
              {tasks === 1 ? "task" : "tasks"}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Carried into {client}. You can keep editing them once the project
              is created.
            </p>
            {scope ? (
              <p className="mt-1.5 text-xs text-muted-foreground">
                {scope.points.length} approved requirement{" "}
                {scope.points.length === 1 ? "point" : "points"} from{" "}
                {scope.requirementId} are saved on the project, ready for a
                custom invoice.
              </p>
            ) : null}
          </div>
        </form>
      </AppDialog.Body>
      <AppDialog.Footer
        secondary={{ label: "Cancel" }}
        primary={{
          label: "Create project",
          type: "submit",
          form: "convert-blueprint",
          disabled: !valid || saving,
          loading: saving,
        }}
      />
    </AppDialog>
  );
}
