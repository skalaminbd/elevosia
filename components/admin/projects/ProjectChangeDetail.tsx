import Link from "next/link";
import { ArrowLeft, Clock, DollarSign } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { ChangeActions } from "@/components/admin/projects/ChangeActions";
import type { ProjectChangeRow, ProjectSummary } from "@/db/queries";

/** One change request from Postgres. */
export function ProjectChangeDetail({
  project,
  change,
}: {
  project: ProjectSummary;
  change: ProjectChangeRow;
}) {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <Link
        href={`/admin/projects/${project.id}?tab=changes`}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Back to {project.name}
      </Link>

      <PageHeader
        title={change.title}
        meta={`${project.client} · ${change.id}`}
        description={change.scope}
        className="mt-3"
      >
        <StatusBadge tone="warning">{change.status}</StatusBadge>
      </PageHeader>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard
          label="Price impact"
          value={`+$${change.price.toLocaleString("en-US")}`}
          note="One-time"
          icon={DollarSign}
        />
        <StatCard
          label="Timeline impact"
          value={`+${change.days} ${change.days === 1 ? "day" : "days"}`}
          note="Launch moves"
          icon={Clock}
        />
        <StatCard
          label="Invoice"
          value="On approval"
          note="Change invoice"
          icon={DollarSign}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <SectionCard
          title="Scope"
          description="What changes"
          className="xl:col-span-2"
          bodyClassName="p-5"
        >
          <p className="text-sm text-muted-foreground">{change.scope}</p>
          <div className="mt-4 rounded-md bg-secondary/60 p-3 text-xs text-muted-foreground">
            Requested after the week 3 review. The current plan stays in force
            until this is approved.
          </div>
        </SectionCard>
        <ChangeActions projectId={project.id} />
      </div>
    </div>
  );
}
