"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import {
  invoices,
  projectMilestones,
  projectScopePoints,
  projectScopes,
  projectTasks,
  projects,
} from "@/db/schema";

const taskSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().default(""),
  hours: z.number().int().min(0).default(0),
  visible: z.boolean().default(true),
});

const milestoneSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  tasks: z.array(taskSchema),
});

const scopeSchema = z.object({
  requirementId: z.string().min(1),
  requirementTitle: z.string().default(""),
  blueprintId: z.string().min(1),
  points: z.array(
    z.object({
      text: z.string().min(1),
      mustHave: z.boolean().default(false),
      milestoneId: z.string().min(1),
      milestoneTitle: z.string().default(""),
    }),
  ),
});

const convertInput = z.object({
  id: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and dashes"),
  name: z.string().trim().min(2),
  clientId: z.string().min(1),
  blueprintId: z.string().min(1),
  pm: z.string().min(1),
  start: z.string().min(1),
  milestones: z.array(milestoneSchema),
  scope: scopeSchema.nullable().optional(),
});

export type ConvertResult =
  | { ok: true; projectId: string }
  | { ok: false; error: string };

/** Creates the project, its milestones and tasks, and the scope record. */
export async function convertBlueprintToProject(
  input: unknown,
): Promise<ConvertResult> {
  const parsed = convertInput.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "The project data is invalid.",
    };
  }

  const { id, name, clientId, blueprintId, pm, start, milestones, scope } =
    parsed.data;

  try {
    const [existing] = await db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.id, id));
    if (existing) {
      return { ok: false, error: "That project id is already taken." };
    }

    await db.insert(projects).values({
      id,
      clientId,
      name,
      blueprintId,
      pm,
      status: "Planning",
      startDate: start,
    });

    for (const [index, milestone] of milestones.entries()) {
      const milestoneId = `${id}-${milestone.id}`;
      await db.insert(projectMilestones).values({
        id: milestoneId,
        projectId: id,
        title: milestone.title,
        position: index,
      });

      if (milestone.tasks.length > 0) {
        await db.insert(projectTasks).values(
          milestone.tasks.map((task, taskIndex) => ({
            id: `${milestoneId}-${task.id}`,
            milestoneId,
            name: task.name,
            description: task.description,
            hours: task.hours,
            visible: task.visible,
            position: taskIndex,
          })),
        );
      }
    }

    if (scope) {
      await db.insert(projectScopes).values({
        projectId: id,
        requirementId: scope.requirementId,
        requirementTitle: scope.requirementTitle,
        blueprintId: scope.blueprintId,
        approvedAt: new Date(),
      });

      if (scope.points.length > 0) {
        await db.insert(projectScopePoints).values(
          scope.points.map((point, index) => ({
            projectId: id,
            text: point.text,
            mustHave: point.mustHave,
            milestoneId: point.milestoneId,
            milestoneTitle: point.milestoneTitle,
            position: index,
          })),
        );
      }
    }
  } catch (error) {
    console.error("convertBlueprintToProject failed", error);
    return { ok: false, error: "Could not create the project. Try again." };
  }

  try {
    revalidatePath("/admin/projects");
    revalidatePath("/admin/blueprints");
  } catch (error) {
    console.error("convertBlueprintToProject revalidate failed", error);
  }

  return { ok: true, projectId: id };
}

const newProjectInput = z.object({
  clientId: z.string().min(1),
  name: z.string().trim().min(2),
  blueprintId: z.string().min(1).nullable(),
  pm: z.string().min(1),
  start: z.string().min(1),
});

/** Creates a project by hand (no Blueprint conversion, no milestones yet). */
export async function createProject(
  input: unknown,
): Promise<ConvertResult> {
  const parsed = newProjectInput.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Add a client, a name, a PM and a start date." };
  }
  const { clientId, name, blueprintId, pm, start } = parsed.data;
  let id = "";

  try {
    const existing = await db.select({ id: projects.id }).from(projects);
    const taken = new Set(existing.map((row) => row.id));
    const base =
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || "project";
    id = base;
    let index = 2;
    while (taken.has(id)) {
      id = `${base}-${index}`;
      index += 1;
    }

    await db.insert(projects).values({
      id,
      clientId,
      name,
      blueprintId,
      pm,
      status: "Planning",
      startDate: start,
    });
  } catch (error) {
    console.error("createProject failed", error);
    return { ok: false, error: "Could not create the project. Try again." };
  }

  try {
    revalidatePath("/admin/projects");
  } catch (error) {
    console.error("createProject revalidate failed", error);
  }
  return { ok: true, projectId: id };
}

const invoiceInput = z.object({
  projectId: z.string().min(1),
  lineItem: z.string().trim().min(1),
  amountCents: z.number().int().positive(),
  due: z.string().min(1).nullable(),
});

export type InvoiceResult =
  | { ok: true; invoiceId: string }
  | { ok: false; error: string };

/** Bills the project's approved scope with a custom amount. */
export async function createProjectInvoice(
  input: unknown,
): Promise<InvoiceResult> {
  const parsed = invoiceInput.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Enter a line item and an amount." };
  }

  const { projectId, lineItem, amountCents, due } = parsed.data;
  const invoiceId = `INV-CR-${Date.now().toString(36).toUpperCase().slice(-5)}`;

  try {
    const [project] = await db
      .select({ clientId: projects.clientId })
      .from(projects)
      .where(eq(projects.id, projectId));
    if (!project) {
      return { ok: false, error: "Project not found." };
    }

    const dueLabel = due
      ? new Date(`${due}T00:00:00`).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "On receipt";

    await db.insert(invoices).values({
      id: invoiceId,
      clientId: project.clientId,
      projectId,
      kind: "Custom",
      lineItem,
      amountCents,
      dueOn: due,
      dueLabel,
      status: "Due",
    });

    await db
      .update(projectScopes)
      .set({ invoiceId })
      .where(eq(projectScopes.projectId, projectId));
  } catch (error) {
    console.error("createProjectInvoice failed", error);
    return { ok: false, error: "Could not create the invoice. Try again." };
  }

  try {
    revalidatePath(`/admin/projects/${projectId}`);
    revalidatePath("/admin/invoices");
  } catch (error) {
    console.error("createProjectInvoice revalidate failed", error);
  }

  return { ok: true, invoiceId };
}
