import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, Paperclip } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge, type BadgeTone } from "@/components/admin/ui/StatusBadge";
import { RequirementActions } from "@/components/admin/requirements/RequirementActions";
import { requirementDetails, requirements, type RequirementStatus } from "@/lib/admin-data";

type Params = Promise<{ id: string }>;

const TONE: Record<RequirementStatus, BadgeTone> = {
  Submitted: "info",
  "In review": "warning",
  "Changes needed": "danger",
  Converted: "success",
  Declined: "neutral",
};

export function generateStaticParams() {
  return requirements.map((requirement) => ({ id: requirement.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const requirement = requirements.find((item) => item.id === id);
  return requirement ? { title: `${requirement.client} requirements | Elevosia Admin` } : {};
}

export default async function RequirementDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const requirement = requirements.find((item) => item.id === id);
  const detail = requirementDetails[id];
  if (!requirement || !detail) notFound();

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
        <StatusBadge tone={TONE[requirement.status]}>{requirement.status}</StatusBadge>
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
          {detail.sections.map((section) => (
            <SectionCard
              key={section.id}
              title={section.title}
              description={`${section.points.length} points`}
              bodyClassName="divide-y divide-border"
            >
              {section.points.map((point) => (
                <div key={point.text} className="px-5 py-3.5">
                  <div className="flex items-start gap-3">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                    <p className="min-w-0 flex-1 text-sm">{point.text}</p>
                    <StatusBadge tone={point.must ? "accent" : "neutral"}>
                      {point.must ? "Must-have" : "Nice-to-have"}
                    </StatusBadge>
                  </div>
                  {point.comment ? (
                    <div className="mt-2 ml-4 rounded-md bg-secondary/60 px-3 py-2">
                      <p className="text-[10px] font-medium text-muted-foreground">
                        Client comment
                      </p>
                      <p className="mt-0.5 text-xs">{point.comment}</p>
                    </div>
                  ) : null}
                </div>
              ))}
            </SectionCard>
          ))}
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
