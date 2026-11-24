import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge, type BadgeTone } from "@/components/admin/ui/StatusBadge";
import type { RequirementDetailRow } from "@/db/queries";
import type { RequirementStatus } from "@/lib/admin-data";

const TONE: Record<RequirementStatus, BadgeTone> = {
  Submitted: "info",
  "In review": "warning",
  "Changes needed": "danger",
  Converted: "success",
  Declined: "neutral",
};

/** A requirement submitted from the portal (not in the demo seed). */
export function DbRequirementDetail({
  requirement,
}: {
  requirement: RequirementDetailRow;
}) {
  const totalPoints = requirement.sections.reduce(
    (total, section) => total + section.points.length,
    0,
  );
  const must = requirement.sections.reduce(
    (total, section) =>
      total + section.points.filter((point) => point.must).length,
    0,
  );

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
        description={`Budget ${requirement.budget || "not set"} · due ${requirement.due}`}
        className="mt-3"
      >
        <StatusBadge
          tone={TONE[requirement.status as RequirementStatus] ?? "neutral"}
        >
          {requirement.status}
        </StatusBadge>
        <StatusBadge tone={requirement.overdue ? "danger" : "neutral"}>
          Blueprint due {requirement.due}
        </StatusBadge>
      </PageHeader>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatCard
          label="Points"
          value={totalPoints}
          note={`${requirement.sections.length} sections`}
        />
        <StatCard label="Must-have" value={must} note="For phase one" />
        <StatCard
          label="Budget"
          value={requirement.budget || "Not set"}
          note="Client's rough range"
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          {requirement.sections.map((section) => (
            <SectionCard
              key={section.id}
              title={section.title}
              description={`${section.points.length} points`}
              bodyClassName="divide-y divide-border"
            >
              {section.points.map((point, index) => (
                <div key={`${section.id}-${index}`} className="px-5 py-3.5">
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
          <SectionCard title="Next step" description="Before a Blueprint">
            <div className="space-y-2 p-5 text-sm text-muted-foreground">
              <p>
                Create a Blueprint from this intake, then review every point into
                a milestone.
              </p>
              <Link
                href="/admin/blueprints"
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                Open Blueprints
              </Link>
            </div>
          </SectionCard>
          <p className="flex items-start gap-2 px-1 text-[11px] text-muted-foreground">
            <FileText className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            Submitted through the client portal. The blueprint is due five
            business days after submission.
          </p>
        </div>
      </div>
    </div>
  );
}
