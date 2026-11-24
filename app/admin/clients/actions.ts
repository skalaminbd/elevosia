"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { clients, clientCompanies } from "@/db/schema";

const companySchema = z.object({
  name: z.string().trim().min(1),
  address: z.string().default(""),
  city: z.string().default(""),
  region: z.string().default(""),
  zip: z.string().default(""),
  phone: z.string().default(""),
  website: z.string().default(""),
});

const clientSchema = z.object({
  id: z.string().min(1).optional(),
  contact: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().default(""),
  status: z.enum(["Lead", "Onboarding", "Active", "Paused", "Former"]),
  industry: z.string().default(""),
  pm: z.string().default("Alamin"),
  timezone: z.string().default("America/New_York"),
  source: z.string().default("Admin"),
  companies: z.array(companySchema).min(1),
});

export type ClientMutation =
  | { ok: true; id: string }
  | { ok: false; error: string };

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return slug || "client";
}

/** Adds a client and its companies. */
export async function createClient(input: unknown): Promise<ClientMutation> {
  const parsed = clientSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Add a name and a valid email." };
  }
  const { contact, email, phone, status, industry, pm, timezone, source, companies } =
    parsed.data;
  const name = companies[0].name;
  let id = "";

  try {
    const existing = await db.select({ id: clients.id }).from(clients);
    const taken = new Set(existing.map((row) => row.id));
    const base = slugify(name);
    id = base;
    let index = 2;
    while (taken.has(id)) {
      id = `${base}-${index}`;
      index += 1;
    }

    await db.insert(clients).values({
      id,
      name,
      contact,
      email,
      phone,
      status,
      industry,
      pm,
      timezone,
      source: source || "Admin",
      initials: contact
        .split(/\s+/)
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase(),
      plan: "Not set",
    });

    await db.insert(clientCompanies).values(
      companies.map((company, position) => ({
        clientId: id,
        name: company.name,
        address: company.address,
        city: company.city,
        region: company.region,
        zip: company.zip,
        phone: company.phone,
        website: company.website,
        position,
      })),
    );
  } catch (error) {
    console.error("createClient failed", error);
    return { ok: false, error: "Could not add the client. Try again." };
  }

  try {
    revalidatePath("/admin/clients");
  } catch (error) {
    console.error("createClient revalidate failed", error);
  }
  return { ok: true, id };
}

/** Updates the client and replaces its company list. */
export async function updateClient(input: unknown): Promise<ClientMutation> {
  const parsed = clientSchema.safeParse(input);
  if (!parsed.success || !parsed.data.id) {
    return { ok: false, error: "Add a name and a valid email." };
  }
  const { id, contact, email, phone, status, industry, pm, timezone, source, companies } =
    parsed.data;

  try {
    await db
      .update(clients)
      .set({
        name: companies[0].name,
        contact,
        email,
        phone,
        status,
        industry,
        pm,
        timezone,
        source,
      })
      .where(eq(clients.id, id));

    await db.delete(clientCompanies).where(eq(clientCompanies.clientId, id));
    await db.insert(clientCompanies).values(
      companies.map((company, position) => ({
        clientId: id,
        name: company.name,
        address: company.address,
        city: company.city,
        region: company.region,
        zip: company.zip,
        phone: company.phone,
        website: company.website,
        position,
      })),
    );
  } catch (error) {
    console.error("updateClient failed", error);
    return { ok: false, error: "Could not save the client. Try again." };
  }

  try {
    revalidatePath("/admin/clients");
    revalidatePath(`/admin/clients/${id}`);
  } catch (error) {
    console.error("updateClient revalidate failed", error);
  }
  return { ok: true, id };
}
