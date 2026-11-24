"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { applyBlueprintPlan } from "@/db/blueprint-plan";
import { getSessionUser } from "@/lib/portal-session";
import { z } from "zod";
import { db } from "@/db";
import {
  blueprintMilestones,
  blueprintSuggestions,
  blueprintTasks,
  blueprints,
} from "@/db/schema";

const input = z.object({
  clientId: z.string().min(1),
  requirementId: z.string().min(1).nullable(),
  title: z.string().trim().min(2),
  priceCents: z.number().int().positive(),
  validUntil: z.string().min(1),
  milestones: z.array(z.string().trim().min(1)).min(1),
});

export type BlueprintMutation =
  | { ok: true; id: string }
  | { ok: false; error: string };

/** Creates a draft Blueprint with an empty task list per milestone. */
export async function createBlueprint(
  raw: unknown,
): Promise<BlueprintMutation> {
  const parsed = input.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Add a client, a title and a price." };
  }
  const { clientId, requirementId, title, priceCents, validUntil, milestones } =
    parsed.data;
  let id = "";

  try {
    const existing = await db
      .select({ id: blueprints.id })
      .from(blueprints);
    const highest = existing.reduce((max, row) => {
      const number = Number(row.id.replace("BP-", ""));
      return Number.isFinite(number) ? Math.max(max, number) : max;
    }, 312);
    id = `BP-${highest + 1}`;

    await db.insert(blueprints).values({
      id,
      clientId,
      requirementId,
      title,
      status: "Draft",
      version: "v1",
      validUntil,
      priceCents,
      milestoneCount: milestones.length,
    });

    await db.insert(blueprintMilestones).values(
      milestones.map((label, position) => ({
        id: `${id}-milestone-${position + 1}`,
        blueprintId: id,
        title: label,
        position,
      })),
    );
  } catch (error) {
    console.error("createBlueprint failed", error);
    return { ok: false, error: "Could not create the Blueprint. Try again." };
  }

  try {
    revalidatePath("/admin/blueprints");
  } catch (error) {
    console.error("createBlueprint revalidate failed", error);
  }
  return { ok: true, id };
}

const planInput = z.object({
  blueprintId: z.string().min(1),
  milestones: z.array(
    z.object({
      id: z.string().min(1),
      title: z.string().trim().min(1),
      tasks: z.array(
        z.object({
          id: z.string().min(1),
          name: z.string().trim().min(1),
          description: z.string().default(""),
          hours: z.number().min(0).default(0),
          visible: z.boolean().default(true),
        }),
      ),
    }),
  ),
});

export type SavePlanResult =
  | { ok: true }
  | { ok: false; error: string };

/** Saves the whole Blueprint plan (milestones, tasks, order). */
export async function saveBlueprintPlan(raw: unknown): Promise<SavePlanResult> {
  const parsed = planInput.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "The plan has an invalid milestone or task." };
  }
  const { blueprintId, milestones } = parsed.data;

  const user = await getSessionUser();
  const role = user?.role ?? "";
  if (!user || !["admin", "pm"].includes(role)) {
    return { ok: false, error: "Only admins and PMs can edit a Blueprint." };
  }

  try {
    await applyBlueprintPlan(blueprintId, milestones);
  } catch (error) {
    console.error("saveBlueprintPlan failed", error);
    return { ok: false, error: "Could not save the plan. Try again." };
  }

  try {
    revalidatePath(`/admin/blueprints/${blueprintId}`);
    revalidatePath("/admin/blueprints");
    revalidatePath("/portal/blueprints");
    revalidatePath(`/portal/blueprints/${blueprintId}`);
  } catch (error) {
    console.error("saveBlueprintPlan revalidate failed", error);
  }
  return { ok: true };
}

const statusInput = z.object({
  id: z.string().min(1),
  status: z.enum([
    "Draft",
    "Waiting for approval",
    "Approved",
    "Expired",
  ]),
});

/** Moves a Blueprint through its lifecycle; the portal only shows non-drafts. */
export async function updateBlueprintStatus(
  raw: unknown,
): Promise<SavePlanResult> {
  const parsed = statusInput.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Unknown Blueprint status." };
  }
  const { id, status } = parsed.data;
  const user = await getSessionUser();
  if (!user || !["admin", "pm"].includes(user.role ?? "")) {
    return { ok: false, error: "Only admins and PMs can change a Blueprint." };
  }

  try {
    await db
      .update(blueprints)
      .set({ status })
      .where(eq(blueprints.id, id));
  } catch (error) {
    console.error("updateBlueprintStatus failed", error);
    return { ok: false, error: "Could not update the Blueprint. Try again." };
  }

  try {
    revalidatePath(`/admin/blueprints/${id}`);
    revalidatePath("/admin/blueprints");
    revalidatePath("/portal/blueprints");
    revalidatePath(`/portal/blueprints/${id}`);
  } catch (error) {
    console.error("updateBlueprintStatus revalidate failed", error);
  }
  return { ok: true };
}

const suggestionInput = z.object({
  blueprintId: z.string().min(1),
  milestoneId: z.string().min(1),
  taskId: z.string().min(1),
  name: z.string().trim().min(1),
  description: z.string().default(""),
  hours: z.number().min(0).default(0),
  visible: z.boolean().default(true),
  note: z.string().trim().optional(),
});

/** Client suggested change. Nothing is applied until an admin approves it. */
export async function submitBlueprintSuggestion(
  raw: unknown,
): Promise<SavePlanResult> {
  const parsed = suggestionInput.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Add a title for the suggestion." };
  }
  const data = parsed.data;
  const user = await getSessionUser();
  if (!user?.clientId) {
    return { ok: false, error: "Sign in again to suggest a change." };
  }

  try {
    const [blueprint] = await db
      .select()
      .from(blueprints)
      .where(eq(blueprints.id, data.blueprintId));
    if (!blueprint || blueprint.clientId !== user.clientId) {
      return { ok: false, error: "This Blueprint is not on your account." };
    }
    if (blueprint.status === "Draft") {
      return { ok: false, error: "This Blueprint has not been sent yet." };
    }

    const [task] = await db
      .select({ id: blueprintTasks.id })
      .from(blueprintTasks)
      .where(eq(blueprintTasks.id, data.taskId));
    if (!task) {
      return { ok: false, error: "That task no longer exists." };
    }

    await db
      .delete(blueprintSuggestions)
      .where(
        and(
          eq(blueprintSuggestions.taskId, data.taskId),
          eq(blueprintSuggestions.status, "pending"),
        ),
      );

    await db.insert(blueprintSuggestions).values({
      id: `sug-${Date.now()}`,
      blueprintId: data.blueprintId,
      milestoneId: data.milestoneId,
      taskId: data.taskId,
      name: data.name,
      description: data.description,
      hours: Math.round(data.hours),
      visible: data.visible,
      note: data.note ?? null,
      status: "pending",
      by: user.name,
    });
  } catch (error) {
    console.error("submitBlueprintSuggestion failed", error);
    return { ok: false, error: "Could not send the suggestion. Try again." };
  }

  try {
    revalidatePath(`/portal/blueprints/${data.blueprintId}`);
    revalidatePath(`/admin/blueprints/${data.blueprintId}`);
  } catch (error) {
    console.error("submitBlueprintSuggestion revalidate failed", error);
  }
  return { ok: true };
}

const resolveInput = z.object({
  id: z.string().min(1),
  action: z.enum(["approve", "dismiss"]),
  final: z
    .object({
      name: z.string().trim().min(1),
      description: z.string().default(""),
      hours: z.number().min(0).default(0),
      visible: z.boolean().default(true),
    })
    .optional(),
  note: z.string().trim().optional(),
});

/** Admin approves a suggestion (as-is or edited) or dismisses it. */
export async function resolveBlueprintSuggestion(
  raw: unknown,
): Promise<SavePlanResult> {
  const parsed = resolveInput.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Unknown suggestion action." };
  }
  const user = await getSessionUser();
  if (!user || !["admin", "pm"].includes(user.role ?? "")) {
    return { ok: false, error: "Only admins and PMs can review suggestions." };
  }

  const { id, action, final } = parsed.data;
  const decisionNote = parsed.data.note?.trim() || null;

  try {
    const [suggestion] = await db
      .select()
      .from(blueprintSuggestions)
      .where(eq(blueprintSuggestions.id, id));
    if (!suggestion) {
      return { ok: false, error: "Suggestion not found." };
    }

    if (action === "dismiss") {
      await db
        .update(blueprintSuggestions)
        .set({
          status: "dismissed",
          reviewedAt: new Date(),
          decisionNote,
        })
        .where(eq(blueprintSuggestions.id, id));
    } else {
      const chosen = final ?? {
        name: suggestion.name,
        description: suggestion.description,
        hours: suggestion.hours,
        visible: suggestion.visible,
      };

      await db
        .update(blueprintTasks)
        .set({
          name: chosen.name,
          description: chosen.description,
          hours: Math.round(chosen.hours),
          visible: chosen.visible,
        })
        .where(eq(blueprintTasks.id, suggestion.taskId));

      await db
        .update(blueprintSuggestions)
        .set({
          status: "approved",
          reviewedAt: new Date(),
          finalName: chosen.name,
          finalDescription: chosen.description,
          finalHours: Math.round(chosen.hours),
          finalVisible: chosen.visible,
          decisionNote,
        })
        .where(eq(blueprintSuggestions.id, id));
    }

    try {
      revalidatePath(`/admin/blueprints/${suggestion.blueprintId}`);
      revalidatePath(`/portal/blueprints/${suggestion.blueprintId}`);
      revalidatePath("/portal/blueprints");
    } catch (error) {
      console.error("resolveBlueprintSuggestion revalidate failed", error);
    }
  } catch (error) {
    console.error("resolveBlueprintSuggestion failed", error);
    return { ok: false, error: "Could not update the suggestion. Try again." };
  }

  return { ok: true };
}

/** Client approves the sent Blueprint. */
export async function approveBlueprintByClient(raw: unknown): Promise<SavePlanResult> {
  const parsed = z.object({ id: z.string().min(1) }).safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Unknown Blueprint." };
  }
  const user = await getSessionUser();
  if (!user?.clientId) {
    return { ok: false, error: "Sign in again to approve." };
  }

  try {
    const [blueprint] = await db
      .select()
      .from(blueprints)
      .where(eq(blueprints.id, parsed.data.id));
    if (!blueprint || blueprint.clientId !== user.clientId) {
      return { ok: false, error: "This Blueprint is not on your account." };
    }
    if (blueprint.status === "Draft") {
      return { ok: false, error: "This Blueprint has not been sent yet." };
    }
    if (blueprint.status !== "Approved") {
      await db
        .update(blueprints)
        .set({ status: "Approved" })
        .where(eq(blueprints.id, blueprint.id));
    }

    try {
      revalidatePath("/portal/blueprints");
      revalidatePath(`/portal/blueprints/${blueprint.id}`);
      revalidatePath(`/admin/blueprints/${blueprint.id}`);
    } catch (error) {
      console.error("approveBlueprintByClient revalidate failed", error);
    }
  } catch (error) {
    console.error("approveBlueprintByClient failed", error);
    return { ok: false, error: "Could not approve. Try again." };
  }
  return { ok: true };
}
