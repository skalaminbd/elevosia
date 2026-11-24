"use server";

import { revalidatePath } from "next/cache";
import { and, eq, notInArray } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import {
  clients,
  ticketEvents,
  ticketMessages,
  tickets,
} from "@/db/schema";

const messageSchema = z.object({
  id: z.string().min(1),
  author: z.string().min(1),
  sender: z.enum(["Client", "Staff", "System"]),
  channel: z.string().default("Portal"),
  body: z.string().min(1),
  at: z.string().min(1),
  internal: z.boolean().optional(),
  unread: z.boolean().optional(),
});

const patchSchema = z.object({
  status: z.string().optional(),
  priority: z.string().optional(),
  assignee: z.string().nullable().optional(),
  unread: z.number().optional(),
  sla: z.record(z.string(), z.string()).optional(),
  messages: z.array(messageSchema).optional(),
  linked: z
    .array(
      z.object({
        id: z.string(),
        type: z.string(),
        label: z.string(),
        meta: z.string().optional(),
        href: z.string().optional(),
      }),
    )
    .optional(),
});

export type TicketMutation =
  | { ok: true; id: string }
  | { ok: false; error: string };

/** Applies a header/sidebar patch and syncs the message list. */
export async function updateTicket(input: {
  id: string;
  patch: unknown;
}): Promise<TicketMutation> {
  const patch = patchSchema.safeParse(input.patch);
  if (!patch.success) {
    return { ok: false, error: "That change is not valid." };
  }
  const { id } = input;
  const next = patch.data;

  try {
    const [existing] = await db
      .select({ id: tickets.id, sla: tickets.sla })
      .from(tickets)
      .where(eq(tickets.id, id));
    if (!existing) {
      return { ok: false, error: "Ticket not found." };
    }

    if (next.messages) {
      const current = await db
        .select({ id: ticketMessages.id })
        .from(ticketMessages)
        .where(eq(ticketMessages.ticketId, id));
      const currentIds = new Set(current.map((row) => row.id));
      const keepIds = next.messages.map((message) => message.id);

      const missing = next.messages.filter(
        (message) => !currentIds.has(message.id),
      );
      if (missing.length > 0) {
        await db.insert(ticketMessages).values(
          missing.map((message) => ({
            id: message.id,
            ticketId: id,
            author: message.author,
            sender: message.sender,
            channel: message.channel,
            body: message.body,
            at: new Date(message.at),
            internal: message.internal ?? false,
            unread: message.unread ?? false,
          })),
        );
      }

      if (keepIds.length > 0) {
        await db
          .delete(ticketMessages)
          .where(
            and(
              eq(ticketMessages.ticketId, id),
              notInArray(ticketMessages.id, keepIds),
            ),
          );
      } else {
        await db
          .delete(ticketMessages)
          .where(eq(ticketMessages.ticketId, id));
      }
    }

    await db
      .update(tickets)
      .set({
        ...(next.status ? { status: next.status } : {}),
        ...(next.priority ? { priority: next.priority } : {}),
        ...(next.assignee !== undefined ? { assignee: next.assignee } : {}),
        ...(next.unread !== undefined ? { unread: next.unread } : {}),
        ...(next.sla ? { sla: next.sla } : {}),
        ...(next.linked ? { linked: next.linked } : {}),
        updatedAt: new Date(),
      })
      .where(eq(tickets.id, id));
  } catch (error) {
    console.error("updateTicket failed", error);
    return { ok: false, error: "Could not update the ticket. Try again." };
  }

  try {
    revalidatePath("/admin/tickets");
    revalidatePath(`/admin/tickets/${id}`);
  } catch (error) {
    console.error("updateTicket revalidate failed", error);
  }
  return { ok: true, id };
}

const createSchema = z.object({
  clientId: z.string().min(1),
  subject: z.string().trim().min(3),
  body: z.string().trim().min(3),
  priority: z.enum(["P1", "P2", "P3"]),
  projectLabel: z.string().trim().min(1).nullable().optional(),
});

/** Staff-created ticket with its first message and event. */
export async function createTicket(
  input: unknown,
): Promise<TicketMutation> {
  const parsed = createSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Add a subject and a description." };
  }
  const { clientId, subject, body, priority, projectLabel } = parsed.data;
  let id = "";

  try {
    const [client] = await db
      .select()
      .from(clients)
      .where(eq(clients.id, clientId));
    if (!client) {
      return { ok: false, error: "Client not found." };
    }

    const all = await db.select({ id: tickets.id }).from(tickets);
    const highest = all.reduce((max, row) => {
      const number = Number(row.id.replace("TKT-", ""));
      return Number.isFinite(number) ? Math.max(max, number) : max;
    }, 812);
    id = `TKT-${highest + 1}`;
    const now = new Date();
    const iso = now.toISOString();
    const initials = client.contact
      .split(/\s+/)
      .map((part) => part[0])
      .slice(0, 2)
      .join("");

    await db.insert(tickets).values({
      id,
      clientId,
      subject,
      description: body,
      projectLabel: projectLabel ?? null,
      status: "New",
      priority,
      category: "Other",
      carePlan: client.plan.includes("Care") ? "Growth" : "None",
      channel: "Portal",
      requester: {
        name: client.contact,
        email: client.email,
        role: "Owner",
        initials,
      },
      followers: [],
      cc: [],
      tags: [],
      linked: [],
      sla: {
        firstResponseDue: iso,
        resolutionDue: iso,
      },
      unread: 0,
      createdAt: now,
      updatedAt: now,
    });

    await db.insert(ticketMessages).values({
      id: `m-${Date.now()}`,
      ticketId: id,
      author: client.contact,
      sender: "Client",
      channel: "Portal",
      body,
      at: now,
    });

    await db.insert(ticketEvents).values({
      id: `e-${Date.now()}`,
      ticketId: id,
      kind: "created",
      text: "Ticket created by staff",
      actor: "Alamin",
      at: now,
    });
  } catch (error) {
    console.error("createTicket failed", error);
    return { ok: false, error: "Could not create the ticket. Try again." };
  }

  try {
    revalidatePath("/admin/tickets");
  } catch (error) {
    console.error("createTicket revalidate failed", error);
  }
  return { ok: true, id };
}

const portalReplyInput = z.object({
  ticketId: z.string().min(1),
  body: z.string().trim().min(1),
});

/** Client reply from the portal: adds a message and reopens the ticket. */
export async function portalTicketReply(
  input: unknown,
): Promise<TicketMutation> {
  const parsed = portalReplyInput.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Write a reply first." };
  }
  const { ticketId, body } = parsed.data;

  try {
    const [ticket] = await db
      .select({ requester: tickets.requester })
      .from(tickets)
      .where(eq(tickets.id, ticketId));
    if (!ticket) {
      return { ok: false, error: "Ticket not found." };
    }
    const requester = ticket.requester as { name?: string } | null;
    const now = new Date();

    await db.insert(ticketMessages).values({
      id: `pm-${Date.now()}`,
      ticketId,
      author: requester?.name ?? "Client",
      sender: "Client",
      channel: "Portal",
      body,
      at: now,
    });

    await db
      .update(tickets)
      .set({ status: "Open", unread: 0, updatedAt: now })
      .where(eq(tickets.id, ticketId));
  } catch (error) {
    console.error("portalTicketReply failed", error);
    return { ok: false, error: "Could not send the reply. Try again." };
  }

  try {
    revalidatePath("/portal/tickets");
    revalidatePath(`/portal/tickets/${ticketId}`);
    revalidatePath("/admin/tickets");
  } catch (error) {
    console.error("portalTicketReply revalidate failed", error);
  }
  return { ok: true, id: ticketId };
}

const portalStatusInput = z.object({
  ticketId: z.string().min(1),
  status: z.enum(["Open", "In progress", "Waiting on you", "Resolved"]),
});

/** Portal status change mapped onto the internal ticket status. */
export async function portalTicketStatus(
  input: unknown,
): Promise<TicketMutation> {
  const parsed = portalStatusInput.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Unknown status." };
  }
  const { ticketId, status } = parsed.data;
  const internal =
    status === "Resolved"
      ? "Resolved"
      : status === "Waiting on you"
        ? "Waiting on client"
        : "Open";

  try {
    await db
      .update(tickets)
      .set({ status: internal, updatedAt: new Date() })
      .where(eq(tickets.id, ticketId));
  } catch (error) {
    console.error("portalTicketStatus failed", error);
    return { ok: false, error: "Could not update the ticket. Try again." };
  }

  try {
    revalidatePath("/portal/tickets");
    revalidatePath(`/portal/tickets/${ticketId}`);
    revalidatePath("/admin/tickets");
  } catch (error) {
    console.error("portalTicketStatus revalidate failed", error);
  }
  return { ok: true, id: ticketId };
}
