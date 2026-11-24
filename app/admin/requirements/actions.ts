"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { requirementReviews, requirements } from "@/db/schema";

const reviewSchema = z.object({
  sectionKey: z.string().min(1),
  pointIndex: z.number().int().min(0),
  milestoneId: z.string().min(1).nullable(),
  state: z.enum(["approved", "skipped"]),
});

const reviewInput = z.object({
  requirementId: z.string().min(1),
  blueprintId: z.string().min(1),
  reviews: z.array(reviewSchema).min(1),
});

export type ApproveScopeResult =
  | { ok: true; approved: number }
  | { ok: false; error: string };

/** Saves the point-by-point review and moves the requirement to Converted. */
export async function approveRequirementScope(
  input: unknown,
): Promise<ApproveScopeResult> {
  const parsed = reviewInput.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "The review data is invalid." };
  }

  const { requirementId, blueprintId, reviews } = parsed.data;
  const approved = reviews.filter((review) => review.state === "approved");

  if (approved.some((review) => review.milestoneId === null)) {
    return { ok: false, error: "Every approved point needs a milestone." };
  }

  try {
    await db
      .delete(requirementReviews)
      .where(eq(requirementReviews.requirementId, requirementId));

    await db.insert(requirementReviews).values(
      reviews.map((review) => ({
        requirementId,
        blueprintId,
        sectionKey: review.sectionKey,
        pointIndex: review.pointIndex,
        milestoneId:
          review.state === "approved" ? review.milestoneId : null,
        state: review.state,
        reviewedAt: new Date(),
      })),
    );

    await db
      .update(requirements)
      .set({ status: "Converted" })
      .where(eq(requirements.id, requirementId));
  } catch (error) {
    console.error("approveRequirementScope failed", error);
    return { ok: false, error: "Could not save the review. Try again." };
  }

  try {
    revalidatePath(`/admin/requirements/${requirementId}`);
    revalidatePath(`/admin/blueprints/${blueprintId}`);
    revalidatePath("/admin/requirements");
  } catch (error) {
    // The client refreshes after the action, so this is not user-facing.
    console.error("approveRequirementScope revalidate failed", error);
  }

  return { ok: true, approved: approved.length };
}
