import { z } from "zod";

import {
  intakeServiceIds,
  intakeWebsitePlans,
  type IntakeServiceId,
} from "@/lib/intake-catalog";

const serviceIds = intakeServiceIds as [IntakeServiceId, ...IntakeServiceId[]];
const websitePlanKeys = intakeWebsitePlans.map((plan) => plan.key) as [
  string,
  ...string[],
];

export const intakeFileSchema = z.object({
  name: z.string().trim().min(1).max(255),
  url: z.string().url().max(2000),
  contentType: z.string().max(150),
  sizeBytes: z
    .number()
    .int()
    .min(0)
    .max(10 * 1024 * 1024),
});

export const intakeSubmissionSchema = z.object({
  serviceType: z.enum(serviceIds, { message: "Pick what you need." }),
  modules: z.array(z.string()).max(8),
  /** "moduleId:featureKey" pairs. */
  features: z.array(z.string()).max(40),
  addons: z.array(z.string()).max(10),
  websitePlan: z.enum(websitePlanKeys),
  marketing: z.array(z.string()).max(10),
  platforms: z.array(z.string()).max(10),
  description: z
    .string()
    .trim()
    .min(40, "Write at least a few sentences (40 characters or more).")
    .max(5000, "Keep it under 5,000 characters."),
  deadline: z.string().max(20),
  nda: z.boolean(),
  fullName: z.string().trim().min(2, "Enter your full name.").max(120),
  email: z.string().trim().email("Enter a valid work email.").max(200),
  company: z.string().trim().min(2, "Enter your company name.").max(160),
  teamSize: z.string().min(1, "Pick a team size.").max(40),
  budget: z.string().max(60),
  files: z.array(intakeFileSchema).max(5),
});

export type IntakeFormValues = z.infer<typeof intakeSubmissionSchema>;
