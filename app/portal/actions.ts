"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { getSessionUser } from "@/lib/portal-session";
import { createTicket } from "@/app/admin/tickets/actions";
import {
  clientNotificationPrefs,
  requirementPoints,
  requirementSections,
  requirements as requirementsTable,
  workRequests,
} from "@/db/schema";

const input = z.object({
  title: z.string().trim().min(2),
  detail: z.string().trim().min(2),
});

export type PortalMutation =
  | { ok: true; id: string }
  | { ok: false; error: string };

/** Client work request from the portal, into the admin inbox. */
export async function createWorkRequest(
  raw: unknown,
): Promise<PortalMutation> {
  const parsed = input.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Add a title and a description." };
  }
  const { title, detail } = parsed.data;
  const user = await getSessionUser();
  if (!user?.clientId) {
    return { ok: false, error: "Sign in again to send a request." };
  }
  let id = "";

  try {
    const existing = await db
      .select({ id: workRequests.id })
      .from(workRequests);
    const highest = existing.reduce((max, row) => {
      const number = Number(row.id.replace("WR-", ""));
      return Number.isFinite(number) ? Math.max(max, number) : max;
    }, 31);
    id = `WR-${highest + 1}`;

    await db.insert(workRequests).values({
      id,
      clientId: user.clientId,
      title,
      detail,
      hours: 0,
      submittedLabel: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      status: "Submitted",
      pm: "Alamin",
    });
  } catch (error) {
    console.error("createWorkRequest failed", error);
    return { ok: false, error: "Could not send the request. Try again." };
  }

  try {
    revalidatePath("/portal/requests/new");
    revalidatePath("/admin/tickets/requests");
  } catch (error) {
    console.error("createWorkRequest revalidate failed", error);
  }
  return { ok: true, id };
}

const requirementInput = z.object({
  title: z.string().trim().min(2),
  budget: z.string().default(""),
  sections: z
    .array(
      z.object({
        title: z.string().trim().min(1),
        points: z
          .array(
            z.object({
              text: z.string().trim().min(1),
              must: z.boolean().default(false),
            }),
          )
          .default([]),
      }),
    )
    .min(1),
});

/** Client requirements submission, into the admin inbox. */
export async function submitRequirements(
  raw: unknown,
): Promise<PortalMutation> {
  const parsed = requirementInput.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Add a project name and at least one point." };
  }
  const { title, budget, sections } = parsed.data;
  const user = await getSessionUser();
  if (!user?.clientId) {
    return { ok: false, error: "Sign in again to submit requirements." };
  }
  let id = "";

  try {
    const existing = await db
      .select({ id: requirementsTable.id })
      .from(requirementsTable);
    const highest = existing.reduce((max, row) => {
      const number = Number(row.id.replace("REQ-", ""));
      return Number.isFinite(number) ? Math.max(max, number) : max;
    }, 2051);
    id = `REQ-${highest + 1}`;

    const now = new Date();
    const due = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    await db.insert(requirementsTable).values({
      id,
      clientId: user.clientId,
      title,
      submittedOn: now.toISOString().slice(0, 10),
      dueOn: due.toISOString().slice(0, 10),
      status: "Submitted",
      budget,
      pointsCount: sections.reduce(
        (total, section) => total + section.points.length,
        0,
      ),
    });

    for (const [position, section] of sections.entries()) {
      const sectionKey = `section-${position + 1}`;
      await db.insert(requirementSections).values({
        requirementId: id,
        sectionKey,
        title: section.title,
        position,
      });
      const [stored] = await db
        .select()
        .from(requirementSections)
        .where(
          and(
            eq(requirementSections.requirementId, id),
            eq(requirementSections.sectionKey, sectionKey),
          ),
        );
      if (!stored) continue;
      if (section.points.length > 0) {
        await db.insert(requirementPoints).values(
          section.points.map((point, pointIndex) => ({
            sectionId: stored.id,
            text: point.text,
            mustHave: point.must,
            position: pointIndex,
          })),
        );
      }
    }
  } catch (error) {
    console.error("submitRequirements failed", error);
    return { ok: false, error: "Could not submit the requirements. Try again." };
  }

  try {
    revalidatePath("/admin/requirements");
    revalidatePath("/portal/requirements/new");
  } catch (error) {
    console.error("submitRequirements revalidate failed", error);
  }
  return { ok: true, id };
}


const prefInput = z.object({
  settingId: z.string().min(1),
  enabled: z.boolean(),
});

/** Saves one notification preference for a client account. */
export async function setClientNotificationPref(
  raw: unknown,
): Promise<PortalMutation> {
  const parsed = prefInput.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Unknown notification." };
  }
  const { settingId, enabled } = parsed.data;
  const user = await getSessionUser();
  if (!user?.clientId) {
    return { ok: false, error: "Sign in again to save preferences." };
  }
  const clientId = user.clientId;

  try {
    await db
      .insert(clientNotificationPrefs)
      .values({ clientId, settingId, enabled })
      .onConflictDoUpdate({
        target: [
          clientNotificationPrefs.clientId,
          clientNotificationPrefs.settingId,
        ],
        set: { enabled },
      });
  } catch (error) {
    console.error("setClientNotificationPref failed", error);
    return { ok: false, error: "Could not save the preference." };
  }

  try {
    revalidatePath("/portal/account");
  } catch (error) {
    console.error("setClientNotificationPref revalidate failed", error);
  }
  return { ok: true, id: settingId };
}


const portalTicketInput = z.object({
  subject: z.string().trim().min(3),
  body: z.string().trim().min(3),
  priority: z.enum(["P1", "P2", "P3"]),
  projectLabel: z.string().trim().min(1).nullable().optional(),
});

/** Client ticket creation, scoped to the signed-in client. */
export async function createPortalTicket(
  raw: unknown,
): Promise<PortalMutation> {
  const parsed = portalTicketInput.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Add a subject and a description." };
  }
  const user = await getSessionUser();
  if (!user?.clientId) {
    return { ok: false, error: "Sign in again to open a ticket." };
  }
  return createTicket({
    clientId: user.clientId,
    subject: parsed.data.subject,
    body: parsed.data.body,
    priority: parsed.data.priority,
    projectLabel: parsed.data.projectLabel ?? null,
  });
}
