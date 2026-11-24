import Link from "next/link";
import { ArrowLeft, Calendar, ClipboardCheck, FolderKanban, ListChecks } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { AdminProjectTabsSection } from "@/components/admin/projects/AdminProjectTabsSection";
import type { ProjectDetail } from "@/db/queries";
import type { ProjectScope, StoredMilestone } from "@/lib/project-store";

/** Project converted from a Blueprint and stored in Postgres. */
export function DbProjectPage({ detail }: { detail: ProjectDetail }) {
  const milestones: StoredMilestone[] = detail.milestones.map((milestone) => ({
    id: milestone.id,
    title: milestone.title,
    due: milestone.dueOn ?? undefined,
    tasks: milestone.tasks.map((task) => ({
      id: task.id,
      name: task.name,
      description: task.description,
      hours: task.hours,
      visible: task.visible,
      done: task.done,
    })),
  }));

  const scope: ProjectScope | undefined = detail.scope
    ? {
        requirementId: detail.scope.requirementId,
        requirementTitle: detail.scope.requirementTitle,
        blueprintId: detail.scope.blueprintId,
        approvedAt: detail.scope.approvedAt.toISOString(),
        points: detail.scope.points.map((point) => ({
          text: point.text,
          must: point.mustHave,
          milestoneId: point.milestoneId,
          milestoneTitle: point.milestoneTitle,
        })),
        invoiceId: detail.scope.invoiceId ?? undefined,
        invoiceAmount:
          detail.scope.invoiceAmountCents !== null
            ? detail.scope.invoiceAmountCents / 100
            : undefined,
      }
    : undefined;

  const taskCount = milestones.reduce(
    (total, milestone) => total + milestone.tasks.length,
    0,
  );

  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <Link
        href="/admin/projects"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        All projects
      </Link>

      <PageHeader
        title={detail.name}
        meta={`${detail.clientName}${detail.blueprintId ? ` · from ${detail.blueprintId}` : ""}`}
        description={`Starts ${detail.startDate ?? "soon"} · ${detail.pm} is the PM`}
        className="mt-3"
      >
        <StatusBadge tone="info">{detail.status}</StatusBadge>
        {scope ? (
          <StatusBadge tone={scope.invoiceId ? "success" : "neutral"}>
            {scope.invoiceId ? "Scope invoiced" : "Scope not invoiced"}
          </StatusBadge>
        ) : null}
      </PageHeader>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Milestones"
          value={milestones.length}
          note="From the Blueprint"
          icon={FolderKanban}
        />
        <StatCard
          label="Tasks"
          value={taskCount}
          note="Carried into the project"
          icon={ListChecks}
        />
        <StatCard
          label="Approved scope"
          value={scope?.points.length ?? 0}
          note={scope ? `From ${scope.requirementId}` : "No requirement link"}
          icon={ClipboardCheck}
        />
        <StatCard
          label="Start"
          value={detail.startDate ?? "Not set"}
          note="Planning"
          icon={Calendar}
        />
      </div>

      <div className="mt-4">
        <AdminProjectTabsSection projectId={detail.id} scope={scope} />
      </div>
    </div>
  );
}
