import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, Paperclip } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { RequirementActions } from "@/components/admin/requirements/RequirementActions";
import { RequirementReviewSection } from "@/components/admin/requirements/RequirementReviewSection";
import { DbRequirementDetail } from "@/components/admin/requirements/DbRequirementDetail";
import { connection } from "next/server";
import { getRequirementDetail } from "@/db/queries";
import {
  blueprints,
  requirementDetails,
  requirements,
} from "@/lib/admin-data";
import { buildMilestones } from "@/lib/blueprint-seed";

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return requirements.map((requirement) => ({ id: requirement.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const requirement = requirements.find((item) => item.id === id);
  return requirement ? { title: `${requirement.client} requirements | Elevosia Admin` } : {};
}

async function DbRequirementLoader({ id }: { id: string }) {
  await connection();
  const requirement = await getRequirementDetail(id);
  if (!requirement) notFound();
  return <DbRequirementDetail requirement={requirement} />;
}

export default async function RequirementDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const requirement = requirements.find((item) => item.id === id);
  const detail = requirementDetails[id];
  if (!requirement || !detail) {
    return (
      <Suspense
        fallback={
          <div className="mx-auto w-full max-w-[1920px]">
            <div className="h-3 w-32 rounded bg-secondary" />
            <div className="mt-4 h-8 w-64 rounded bg-secondary" />
            <div className="mt-6 h-64 rounded-lg border border-border bg-card" />
          </div>
        }
      >
        <DbRequirementLoader id={id} />
      </Suspense>
    );
  }

  const blueprint =
    blueprints.find(
      (item) =>
        item.client === requirement.client && item.title === requirement.title,
    ) ?? blueprints.find((item) => item.client === requirement.client);
  const milestones = blueprint
    ? buildMilestones(blueprint.milestones).map((milestone) => ({
        id: milestone.id,
        title: milestone.title,
      }))
    : [];

  const totalPoints = detail.sections.reduce((sum, section) => sum + section.points.length, 0);

  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <Link
        href="/admin/requirements"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Requirements inbox
      </Link>

      <PageHeader
        title={requirement.title}
        meta={`${requirement.client} · ${requirement.id} · submitted ${requirement.submitted}`}
        description={`Budget ${requirement.budget} · ${detail.deadline}`}
        className="mt-3"
      >
        <StatusBadge tone={requirement.overdue ? "danger" : "neutral"}>
          Blueprint due {requirement.due}
        </StatusBadge>
      </PageHeader>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard label="Points" value={totalPoints} note={`${detail.sections.length} sections`} />
        <StatCard label="Must-have" value={detail.sections.flatMap((s) => s.points).filter((p) => p.must).length} note="For phase one" />
        <StatCard label="Budget" value={requirement.budget} note="Client's rough range" />
        <StatCard
          label="NDA"
          value={detail.nda.startsWith("Signed") ? "Signed" : detail.nda.startsWith("Requested") ? "Requested" : "None"}
          note={detail.nda}
        />
        <StatCard
          label="Attachments"
          value={detail.attachments.length}
          note={detail.attachments.length > 0 ? "Files from the client" : "No files"}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <Suspense
            fallback={
              <div className="rounded-lg border border-border bg-card p-5">
                <div className="h-4 w-40 rounded bg-secondary" />
                <div className="mt-4 space-y-2">
                  <div className="h-3 w-full rounded bg-secondary/70" />
                  <div className="h-3 w-3/4 rounded bg-secondary/70" />
                  <div className="h-8 w-48 rounded bg-secondary/70" />
                </div>
              </div>
            }
          >
            <RequirementReviewSection
              requirementId={requirement.id}
              blueprintId={blueprint?.id ?? null}
              blueprintLabel={
                blueprint ? `${blueprint.id} · ${blueprint.title}` : null
              }
              sections={detail.sections}
              milestones={milestones}
              fallbackStatus={requirement.status}
            />
          </Suspense>
        </div>

        <div className="space-y-4">
          <SectionCard title="Client" description="Submitted by">
            <div className="space-y-2 p-5 text-sm">
              <p className="font-medium">{requirement.client}</p>
              <p className="text-xs text-muted-foreground">
                Received {requirement.submitted} · {requirement.id}
              </p>
              <p className="text-xs text-muted-foreground">
                Time zone and contacts are on the client profile.
              </p>
              <Link
                href="/admin/clients"
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                Open client list
              </Link>
            </div>
          </SectionCard>

          <SectionCard title="Attachments" description={`${detail.attachments.length} files`} bodyClassName="divide-y divide-border">
            {detail.attachments.length === 0 ? (
              <p className="px-5 py-4 text-xs text-muted-foreground">No attachments.</p>
            ) : (
              detail.attachments.map((file) => (
                <div key={file} className="flex items-center gap-2 px-5 py-3">
                  <Paperclip className="size-3.5 text-muted-foreground" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate text-xs">{file}</span>
                </div>
              ))
            )}
          </SectionCard>

          <RequirementActions requirementId={requirement.id} status={requirement.status} />

          <p className="flex items-start gap-2 px-1 text-[11px] text-muted-foreground">
            <FileText className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            Creating a Blueprint locks the requirements and copies every point into the
            plan.
          </p>
        </div>
      </div>
    </div>
  );
}
