"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { invoices } from "@/db/schema";

const input = z.object({
  clientId: z.string().min(1),
  kind: z.string().min(1),
  amountCents: z.number().int().positive(),
  due: z.string().min(1).nullable(),
  lineItem: z.string().trim().min(2),
});

export type ManualInvoiceResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

/** A hand-made invoice from the admin, not tied to a project. */
export async function createManualInvoice(
  raw: unknown,
): Promise<ManualInvoiceResult> {
  const parsed = input.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Add a client, a description and an amount." };
  }
  const { clientId, kind, amountCents, due, lineItem } = parsed.data;
  let id = "";

  try {
    const existing = await db.select({ id: invoices.id }).from(invoices);
    const highest = existing.reduce((max, row) => {
      const number = Number(row.id.replace(/\D/g, ""));
      return Number.isFinite(number) ? Math.max(max, number) : max;
    }, 1048);
    id = `INV-${highest + 1}`;

    await db.insert(invoices).values({
      id,
      clientId,
      projectId: null,
      kind,
      lineItem,
      amountCents,
      dueOn: due,
      dueLabel: due
        ? new Date(`${due}T00:00:00`).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "On receipt",
      status: "Due",
    });
  } catch (error) {
    console.error("createManualInvoice failed", error);
    return { ok: false, error: "Could not create the invoice. Try again." };
  }

  try {
    revalidatePath("/admin/invoices");
  } catch (error) {
    console.error("createManualInvoice revalidate failed", error);
  }
  return { ok: true, id };
}
