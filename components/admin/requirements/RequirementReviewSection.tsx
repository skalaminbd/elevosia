import { connection } from "next/server";
import { getRequirementReviewState } from "@/db/queries";
import { RequirementReview } from "@/components/admin/requirements/RequirementReview";
import type { RequirementStatus } from "@/lib/admin-data";

/** Request-time review state; render inside a Suspense boundary. */
export async function RequirementReviewSection({
  requirementId,
  blueprintId,
  blueprintLabel,
  sections,
  milestones,
  fallbackStatus,
}: {
  requirementId: string;
  blueprintId: string | null;
  blueprintLabel: string | null;
  sections: {
    id: string;
    title: string;
    points: { text: string; must: boolean; comment?: string }[];
  }[];
  milestones: { id: string; title: string }[];
  fallbackStatus: RequirementStatus;
}) {
  await connection();
  const state = await getRequirementReviewState(requirementId);

  return (
    <RequirementReview
      requirementId={requirementId}
      blueprintId={blueprintId}
      blueprintLabel={blueprintLabel}
      sections={sections}
      milestones={milestones}
      status={(state.status ?? fallbackStatus) as RequirementStatus}
      initialReviews={state.reviews}
    />
  );
}
