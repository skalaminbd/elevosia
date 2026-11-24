"use server";

import { db } from "@/db";
import {
  clients,
  intakeFiles as intakeFilesTable,
  intakeSelections,
  intakeSubmissions,
} from "@/db/schema";
import {
  addonByKey,
  intakeAddons,
  intakeMarketing,
  intakePlatforms,
  intakeServices,
  marketingByKey,
  moduleById,
  serviceById,
  websitePlanByKey,
} from "@/lib/intake-catalog";
import { intakeSubmissionSchema } from "@/lib/intake-schema";

export type IntakeResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

type SelectionRow = {
  submissionId: string;
  kind: string;
  moduleKey: string;
  key: string;
  label: string;
  priceCents: number;
  position: number;
};

/**
 * Public /start-project submission: creates the lead client row, the intake
 * submission and every selected module, feature, add-on and service. The
 * Blueprint is built from these rows later.
 */
export async function submitIntake(raw: unknown): Promise<IntakeResult> {
  const parsed = intakeSubmissionSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message;
    return { ok: false, error: first ?? "Check the form and try again." };
  }
  const data = parsed.data;

  if (!serviceById(data.serviceType)) {
    return { ok: false, error: "Pick what you need first." };
  }
  if (data.deadline && !/^\d{4}-\d{2}-\d{2}$/.test(data.deadline)) {
    return { ok: false, error: "Enter the deadline as a date." };
  }

  const modules = data.modules
    .filter((id) => moduleById(id))
    .filter((id, index, all) => all.indexOf(id) === index);

  const features: { moduleId: string; key: string; label: string }[] = [];
  for (const value of data.features) {
    const [moduleId, key] = value.split(":");
    if (!modules.includes(moduleId) || !key) continue;
    const feature = moduleById(moduleId)?.features.find(
      (item) => item.key === key,
    );
    if (feature) features.push({ moduleId, key, label: feature.label });
  }

  const addons = data.addons
    .filter((key) => addonByKey(key))
    .filter((key, index, all) => all.indexOf(key) === index);
  const marketing = data.marketing
    .filter((key) => marketingByKey(key))
    .filter((key, index, all) => all.indexOf(key) === index);
  const platforms = data.platforms
    .filter((value) =>
      (intakePlatforms as readonly string[]).includes(value),
    )
    .filter((value, index, all) => all.indexOf(value) === index);
  const websitePlan = websitePlanByKey(data.websitePlan);

  if (!websitePlan) {
    return { ok: false, error: "Pick a website option." };
  }
  if (data.files.some((file) => !isBlobUrl(file.url))) {
    return { ok: false, error: "One of the files did not upload. Try again." };
  }

  const clientId = `lead-${crypto.randomUUID().slice(0, 8)}`;
  const service = intakeServices.find((item) => item.id === data.serviceType);
  const submissionId = await nextSubmissionId();

  try {
    await db.insert(clients).values({
      id: clientId,
      name: data.company,
      contact: data.fullName,
      email: data.email.toLowerCase(),
      initials: initialsOf(data.fullName),
      status: "Lead",
      source: "Start a project",
      plan: service?.label ?? "",
    });

    await db.insert(intakeSubmissions).values({
      id: submissionId,
      clientId,
      serviceType: data.serviceType,
      teamSize: data.teamSize,
      budget: data.budget,
      description: data.description,
      deadline: data.deadline || null,
      websiteNeeded: data.websitePlan !== "none",
      websitePages: data.websitePlan,
      nda: data.nda,
      status: "Submitted",
      source: "Start a project",
    });

    const rows: SelectionRow[] = [];
    for (const moduleId of modules) {
      const entry = moduleById(moduleId);
      if (!entry) continue;
      rows.push({
        submissionId,
        kind: "module",
        moduleKey: moduleId,
        key: moduleId,
        label: entry.name,
        priceCents: 0,
        position: rows.length,
      });
    }
    for (const feature of features) {
      rows.push({
        submissionId,
        kind: "feature",
        moduleKey: feature.moduleId,
        key: feature.key,
        label: feature.label,
        priceCents: 0,
        position: rows.length,
      });
    }
    for (const key of addons) {
      const addon = intakeAddons.find((item) => item.key === key);
      if (!addon) continue;
      rows.push({
        submissionId,
        kind: "addon",
        moduleKey: "",
        key,
        label: addon.label,
        priceCents: addon.priceCents,
        position: rows.length,
      });
    }
    for (const key of marketing) {
      const item = intakeMarketing.find((entry) => entry.key === key);
      if (!item) continue;
      rows.push({
        submissionId,
        kind: "marketing",
        moduleKey: "",
        key,
        label: item.label,
        priceCents: 0,
        position: rows.length,
      });
    }
    for (const platform of platforms) {
      rows.push({
        submissionId,
        kind: "platform",
        moduleKey: "",
        key: platform.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        label: platform,
        priceCents: 0,
        position: rows.length,
      });
    }

    if (rows.length > 0) {
      await db.insert(intakeSelections).values(rows);
    }

    if (data.files.length > 0) {
      await db.insert(intakeFilesTable).values(
        data.files.map((file) => ({
          submissionId,
          name: file.name.slice(0, 255),
          url: file.url,
          contentType: file.contentType,
          sizeBytes: file.sizeBytes,
        })),
      );
    }
  } catch (error) {
    console.error("submitIntake failed", error);
    return {
      ok: false,
      error: "Could not save your request. Try again in a moment.",
    };
  }

  return { ok: true, id: submissionId };
}

async function nextSubmissionId(): Promise<string> {
  const existing = await db
    .select({ id: intakeSubmissions.id })
    .from(intakeSubmissions);
  const highest = existing.reduce((max, row) => {
    const number = Number(row.id.replace("INT-", ""));
    return Number.isFinite(number) ? Math.max(max, number) : max;
  }, 1000);
  return `INT-${highest + 1}`;
}

function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function isBlobUrl(value: string): boolean {
  try {
    const host = new URL(value).hostname;
    return host.endsWith(".blob.vercel-storage.com");
  } catch {
    return false;
  }
}
