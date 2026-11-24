"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Circle, ClipboardCheck } from "lucide-react";
import { toast } from "sonner";
import { NativeSelect } from "@/components/shared/NativeSelect";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { approveRequirementScope } from "@/app/admin/requirements/actions";
import type { RequirementStatus } from "@/lib/admin-data";

type ReviewSection = {
  id: string;
  title: string;
  points: { text: string; must: boolean; comment?: string }[];
};

type InitialReview = {
  sectionKey: string;
  pointIndex: number;
  milestoneId: string | null;
  state: string;
};

type Draft = { approved: boolean; milestoneId: string };

/**
 * Review each requirement point and approve it into a Blueprint milestone.
 * Approved points become tasks under that milestone before conversion.
 */
export function RequirementReview({
  requirementId,
  blueprintId,
  blueprintLabel,
  sections,
  milestones,
  status,
  initialReviews,
}: {
  requirementId: string;
  blueprintId: string | null;
  blueprintLabel: string | null;
  sections: ReviewSection[];
  milestones: { id: string; title: string }[];
  status: RequirementStatus;
  initialReviews: InitialReview[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});

  const stored: Record<string, InitialReview> = {};
  for (const review of initialReviews) {
    stored[`${review.sectionKey}:${review.pointIndex}`] =
      review;
  }

  const converted = status === "Converted" && initialReviews.length > 0;
  const defaultMilestoneId = milestones[0]?.id ?? "";
  const totalPoints = sections.reduce(
    (total, section) => total + section.points.length,
    0,
  );

  function milestoneTitle(milestoneId: string | null) {
    if (!milestoneId) return null;
    return milestones.find((item) => item.id === milestoneId)?.title ?? null;
  }

  function readPoint(sectionId: string, pointIndex: number) {
    const key = `${sectionId}:${pointIndex}`;
    const storedReview = stored[key];
    const draft = drafts[key];
    return {
      key,
      approved: draft
        ? draft.approved
        : storedReview?.state === "approved",
      milestoneId:
        draft?.milestoneId ??
        storedReview?.milestoneId ??
        defaultMilestoneId,
    };
  }

  const approvedCount = sections.reduce(
    (total, section) =>
      total +
      section.points.filter(
        (_, pointIndex) => readPoint(section.id, pointIndex).approved,
      ).length,
    0,
  );

  function toggle(sectionId: string, pointIndex: number) {
    const current = readPoint(sectionId, pointIndex);
    setDrafts((prev) => ({
      ...prev,
      [current.key]: {
        approved: !current.approved,
        milestoneId: current.milestoneId,
      },
    }));
  }

  function changeMilestone(
    sectionId: string,
    pointIndex: number,
    milestoneId: string,
  ) {
    const current = readPoint(sectionId, pointIndex);
    setDrafts((prev) => ({
      ...prev,
      [current.key]: { approved: current.approved, milestoneId },
    }));
  }

  function approveScope() {
    if (!blueprintId || approvedCount === 0) return;
    const reviews = sections.flatMap((section) =>
      section.points.map((_, pointIndex) => {
        const current = readPoint(section.id, pointIndex);
        return {
          sectionKey: section.id,
          pointIndex,
          milestoneId: current.approved ? current.milestoneId : null,
          state: current.approved
            ? ("approved" as const)
            : ("skipped" as const),
        };
      }),
    );

    startTransition(async () => {
      const result = await approveRequirementScope({
        requirementId,
        blueprintId,
        reviews,
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Requirements approved", {
        description: `${result.approved} ${result.approved === 1 ? "point" : "points"} added under ${blueprintLabel ?? "the Blueprint"} milestones.`,
      });
      router.refresh();
    });
  }

  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-sm font-semibold">
            <ClipboardCheck
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
            Requirement review
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {blueprintLabel
              ? `Approved points become tasks under a milestone in ${blueprintLabel}.`
              : "No Blueprint exists for this client yet. Create one before approving."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {converted ? (
            <StatusBadge tone="success">Converted</StatusBadge>
          ) : (
            <StatusBadge tone="neutral">
              {approvedCount} of {totalPoints} approved
            </StatusBadge>
          )}
        </div>
      </div>

      {sections.map((section) => (
        <div
          key={section.id}
          className="border-b border-border last:border-b-0"
        >
          <div className="flex items-center justify-between gap-2 bg-secondary/30 px-5 py-2.5">
            <p className="text-xs font-semibold">{section.title}</p>
            <span className="font-mono text-[10px] text-muted-foreground">
              {section.points.length} points
            </span>
          </div>
          <ul className="divide-y divide-border">
            {section.points.map((point, pointIndex) => {
              const current = readPoint(section.id, pointIndex);
              const storedReview = stored[current.key];
              const approvedMilestone = converted
                ? milestoneTitle(storedReview?.milestoneId ?? null)
                : null;
              return (
                <li key={current.key} className="px-5 py-3.5">
                  <div className="flex items-start gap-3">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                    <p className="min-w-0 flex-1 text-sm">{point.text}</p>
                    <StatusBadge tone={point.must ? "accent" : "neutral"}>
                      {point.must ? "Must-have" : "Nice-to-have"}
                    </StatusBadge>
                  </div>

                  {converted ? (
                    <div className="mt-2 ml-4 flex flex-wrap items-center gap-2">
                      {storedReview?.state === "approved" && approvedMilestone ? (
                        <StatusBadge tone="success">
                          <Check className="size-3" aria-hidden="true" />
                          Added to {approvedMilestone}
                        </StatusBadge>
                      ) : (
                        <StatusBadge tone="neutral">Skipped</StatusBadge>
                      )}
                    </div>
                  ) : (
                    <div className="mt-2 ml-4 flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        aria-pressed={current.approved}
                        onClick={() => toggle(section.id, pointIndex)}
                        disabled={!blueprintId || pending}
                        className={
                          current.approved
                            ? "border-success/40 text-success"
                            : ""
                        }
                      >
                        {current.approved ? (
                          <Check
                            className="size-3.5 text-success"
                            aria-hidden="true"
                          />
                        ) : (
                          <Circle className="size-3.5" aria-hidden="true" />
                        )}
                        {current.approved ? "Approved" : "Approve"}
                      </Button>
                      <NativeSelect
                        aria-label={`Milestone for ${point.text}`}
                        value={current.milestoneId}
                        onChange={(event) =>
                          changeMilestone(
                            section.id,
                            pointIndex,
                            event.target.value,
                          )
                        }
                        disabled={
                          !blueprintId || milestones.length === 0 || pending
                        }
                        className="h-8 w-44 text-xs"
                      >
                        {milestones.length === 0 ? (
                          <option value="">No milestones</option>
                        ) : (
                          milestones.map((milestone) => (
                            <option key={milestone.id} value={milestone.id}>
                              {milestone.title}
                            </option>
                          ))
                        )}
                      </NativeSelect>
                    </div>
                  )}

                  {point.comment ? (
                    <div className="mt-2 ml-4 rounded-md bg-secondary/60 px-3 py-2">
                      <p className="text-[10px] font-medium text-muted-foreground">
                        Client comment
                      </p>
                      <p className="mt-0.5 text-xs">{point.comment}</p>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4">
        {converted ? (
          <p className="text-xs text-muted-foreground">
            Scope approved and locked. It carries into the project when the
            Blueprint is converted.
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Skipped points stay out of the Blueprint. Approval locks the review.
          </p>
        )}
        {!converted ? (
          <Button
            type="button"
            onClick={approveScope}
            disabled={!blueprintId || approvedCount === 0 || pending}
          >
            <ClipboardCheck className="size-4" aria-hidden="true" />
            {pending ? "Saving…" : "Approve reviewed scope"}
          </Button>
        ) : null}
      </div>
    </section>
  );
}
