"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { contracts, contractTemplates } from "@/db/schema";

const contractInput = z.object({
  clientId: z.string().min(1),
  projectId: z.string().min(1).nullable(),
  type: z.string().trim().min(1),
  status: z.enum(["Draft", "Sent", "Signed"]),
});

export type ContractMutation =
  | { ok: true; id: string }
  | { ok: false; error: string };

function nextId(prefix: string, ids: string[]): string {
  const highest = ids.reduce((max, id) => {
    const value = Number(id.replace(/\D/g, ""));
    return Number.isFinite(value) ? Math.max(max, value) : max;
  }, 0);
  return `${prefix}-${highest + 1}`;
}

/** Creates a contract and links it to the client, and the project when known. */
export async function createContract(
  input: unknown,
): Promise<ContractMutation> {
  const parsed = contractInput.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Pick a client and a template." };
  }

  const { clientId, projectId, type, status } = parsed.data;
  const today = new Date().toISOString().slice(0, 10);
  let id = "";

  try {
    const existing = await db.select({ id: contracts.id }).from(contracts);
    id = nextId(
      "CT",
      existing.map((row) => row.id),
    );

    await db.insert(contracts).values({
      id,
      clientId,
      projectId,
      type,
      status,
      signedOn: status === "Signed" ? today : null,
    });
  } catch (error) {
    console.error("createContract failed", error);
    return { ok: false, error: "Could not create the contract. Try again." };
  }

  try {
    revalidatePath("/admin/contracts");
  } catch (error) {
    console.error("createContract revalidate failed", error);
  }
  return { ok: true, id };
}

const templateInput = z.object({
  name: z.string().trim().min(2),
  body: z.string().trim().default(""),
});

/** Adds a starting template. Templates are never edited, only added. */
export async function createContractTemplate(
  input: unknown,
): Promise<ContractMutation> {
  const parsed = templateInput.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Enter a template name." };
  }

  const { name, body } = parsed.data;
  let id = "";

  try {
    const existing = await db
      .select({ id: contractTemplates.id })
      .from(contractTemplates);
    id = nextId(
      "T",
      existing.map((row) => row.id),
    );

    await db.insert(contractTemplates).values({
      id,
      name,
      body: body || "New template. Add the clauses from the templates page.",
      usedCount: 0,
      updatedOn: new Date().toISOString().slice(0, 10),
    });
  } catch (error) {
    console.error("createContractTemplate failed", error);
    return { ok: false, error: "Could not add the template. Try again." };
  }

  try {
    revalidatePath("/admin/contracts");
    revalidatePath("/admin/contracts/templates");
  } catch (error) {
    console.error("createContractTemplate revalidate failed", error);
  }
  return { ok: true, id };
}

const statusInput = z.object({
  id: z.string().min(1),
  status: z.enum(["Draft", "Sent", "Signed"]),
});

export async function updateContractStatus(
  input: unknown,
): Promise<ContractMutation> {
  const parsed = statusInput.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Unknown contract status." };
  }

  const { id, status } = parsed.data;

  try {
    const [existing] = await db
      .select({ signedOn: contracts.signedOn })
      .from(contracts)
      .where(eq(contracts.id, id));
    if (!existing) {
      return { ok: false, error: "Contract not found." };
    }

    await db
      .update(contracts)
      .set({
        status,
        signedOn:
          status === "Signed"
            ? (existing.signedOn ?? new Date().toISOString().slice(0, 10))
            : null,
      })
      .where(eq(contracts.id, id));
  } catch (error) {
    console.error("updateContractStatus failed", error);
    return { ok: false, error: "Could not update the contract. Try again." };
  }

  try {
    revalidatePath("/admin/contracts");
    revalidatePath(`/admin/contracts/${id}`);
  } catch (error) {
    console.error("updateContractStatus revalidate failed", error);
  }
  return { ok: true, id };
}
