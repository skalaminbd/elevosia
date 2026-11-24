/**
 * Catalog for the public /start-project intake form. Modules, features and
 * add-on prices come straight from the marketing copy, so a content edit
 * updates the form too. The server action validates against these keys.
 */

import { moduleLibrary } from "@/content/custom-dashboards";
import { addOns } from "@/content/pricing-page";
import { startForm } from "@/content/start";
import { webPricing } from "@/content/website-projects";

export const intakeServices = [
  {
    id: "dashboard",
    label: "A custom dashboard",
    body: "Staff, clients, jobs, invoices and numbers in one place.",
  },
  {
    id: "ai",
    label: "Add AI to what we have",
    body: "Briefings, follow-ups and smart scheduling inside your tools.",
  },
  {
    id: "website",
    label: "A website for now",
    body: "A fast site with forms that can grow into a dashboard later.",
  },
  {
    id: "everything",
    label: "A dashboard and a website",
    body: "Both, on one system, from the start.",
  },
  {
    id: "unsure",
    label: "Not sure yet",
    body: "Tell us what is painful. We suggest the smallest first step.",
  },
] as const;

export type IntakeServiceId = (typeof intakeServices)[number]["id"];

export const intakeServiceIds = intakeServices.map((service) => service.id);

export type IntakeModule = {
  id: string;
  name: string;
  features: { key: string; label: string }[];
};

/** Module ids are stable slugs used in the database. */
export const intakeModules: IntakeModule[] = moduleLibrary.modules.map(
  (module) => ({
    id: module.id,
    name: module.name,
    features: module.features.map((feature) => ({
      key: slug(feature),
      label: feature,
    })),
  }),
);

export type IntakeAddon = {
  key: string;
  label: string;
  priceLabel: string;
  priceCents: number;
  body: string;
  /** Shown first when this returns true for the visitor's picks. */
  suggestedFor: (picks: { services: IntakeServiceId[]; modules: string[] }) => boolean;
};

const addonPrices = new Map(addOns.items.map((item) => [slug(item.name), item.price]));

function addonPrice(name: string) {
  return (addonPrices.get(slug(name)) ?? 0) * 100;
}

export const intakeAddons: IntakeAddon[] = [
  {
    key: "ai-automation",
    label: "AI automation",
    priceLabel: "$1,500+",
    priceCents: addonPrice("AI automation"),
    body: "A focused automation built into your dashboard or website.",
    suggestedFor: ({ modules }) => !modules.includes("ai"),
  },
  {
    key: "integration",
    label: "Integration",
    priceLabel: "$1,000+",
    priceCents: addonPrice("Integration"),
    body: "Connect Stripe, QuickBooks, Google, Slack or your current tools.",
    suggestedFor: ({ modules }) => modules.length > 0,
  },
  {
    key: "extra-module",
    label: "Extra module",
    priceLabel: "$2,500+",
    priceCents: addonPrice("Extra module"),
    body: "Add another module beyond the package you start with.",
    suggestedFor: ({ modules }) => modules.length >= 4,
  },
  {
    key: "ai-audit",
    label: "AI audit",
    priceLabel: "$750",
    priceCents: addonPrice("AI audit"),
    body: "One focused week, ending with your three biggest automation wins.",
    suggestedFor: ({ services, modules }) =>
      services.includes("ai") || modules.includes("ai"),
  },
  {
    key: "data-migration",
    label: "Data migration",
    priceLabel: "Quoted",
    priceCents: 0,
    body: "Move clients, jobs and invoices out of spreadsheets and old tools.",
    suggestedFor: ({ services }) => !services.includes("website"),
  },
  {
    key: "team-training",
    label: "Team training",
    priceLabel: "Quoted",
    priceCents: 0,
    body: "Role by role training on a real week of your work.",
    suggestedFor: () => false,
  },
];

export const intakeMarketing = [
  { key: "seo-setup", label: "SEO setup", body: "Technical and on-page setup so the site can rank." },
  { key: "seo-ongoing", label: "Ongoing SEO", body: "Monthly work on rankings, content and links." },
  { key: "social-media", label: "Social media management", body: "Planned, written and published for you." },
  { key: "google-ads", label: "Google Ads", body: "Campaign setup and management, measured in leads." },
  { key: "email-marketing", label: "Email marketing", body: "Welcome flows, newsletters and follow-ups." },
  { key: "content-writing", label: "Content writing", body: "Service pages, guides and posts written for owners." },
] as const;

export const intakePlatforms = [
  "Facebook",
  "Instagram",
  "LinkedIn",
  "X",
  "TikTok",
  "YouTube",
  "Google Business Profile",
] as const;

const starterPlan = webPricing.plans.find((plan) => plan.id === "starter");
const growthPlan = webPricing.plans.find((plan) => plan.id === "growth");

/** Website choices; Starter and Growth copy comes from the website page. */
export const intakeWebsitePlans = [
  {
    key: "none",
    label: "No website needed",
    body: "Everything lands in the dashboard and the client portal.",
    priceLabel: "",
  },
  {
    key: "starter",
    label: starterPlan?.name ?? "Starter website",
    body: starterPlan?.body ?? "Up to 6 pages, about 3 to 4 weeks.",
    priceLabel: `from $${(starterPlan?.price ?? 3500).toLocaleString("en-US")}`,
  },
  {
    key: "growth",
    label: growthPlan?.name ?? "Growth website",
    body: growthPlan?.body ?? "Up to 15 pages with booking or quote forms.",
    priceLabel: `from $${(growthPlan?.price ?? 6500).toLocaleString("en-US")}`,
  },
  {
    key: "custom",
    label: "16+ pages",
    body: "A larger site or a multi-location setup. Quoted in your Blueprint.",
    priceLabel: "Custom",
  },
] as const;

export type IntakeWebsitePlanKey = (typeof intakeWebsitePlans)[number]["key"];

export const teamSizes = startForm.teamSizes;
export const budgets = startForm.budgets;

/** Labels for a selection key, for the admin side and the review step. */
export function moduleById(id: string) {
  return intakeModules.find((module) => module.id === id);
}

export function addonByKey(key: string) {
  return intakeAddons.find((addon) => addon.key === key);
}

export function marketingByKey(key: string) {
  return intakeMarketing.find((item) => item.key === key);
}

export function websitePlanByKey(key: string) {
  return intakeWebsitePlans.find((plan) => plan.key === key);
}

export function serviceById(id: string) {
  return intakeServices.find((service) => service.id === id);
}

/** Suggested add-on keys for the visitor's picks, most relevant first. */
export function suggestedAddonKeys(picks: {
  services: IntakeServiceId[];
  modules: string[];
}): string[] {
  return intakeAddons
    .filter((addon) => addon.suggestedFor(picks))
    .map((addon) => addon.key);
}

function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
