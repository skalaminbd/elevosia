"use client";

import { useFormContext } from "react-hook-form";

import { FieldError } from "@/components/start-project/FieldError";
import { NativeSelect } from "@/components/shared/NativeSelect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  budgets,
  intakeAddons,
  intakeMarketing,
  moduleById,
  serviceById,
  teamSizes,
  websitePlanByKey,
} from "@/lib/intake-catalog";
import type { IntakeFormValues } from "@/lib/intake-schema";
import { cn } from "@/lib/utils";

/** Step 6: review what was picked, then the visitor's details. */
export function StepContact() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<IntakeFormValues>();

  const values = watch();
  const service = serviceById(values.serviceType);
  const plan = websitePlanByKey(values.websitePlan);
  const moduleNames = values.modules
    .map((id) => moduleById(id)?.name)
    .filter(Boolean);
  const addonNames = values.addons
    .map((key) => intakeAddons.find((addon) => addon.key === key)?.label)
    .filter(Boolean);
  const marketingNames = values.marketing
    .map((key) => intakeMarketing.find((item) => item.key === key)?.label)
    .filter(Boolean);

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-border bg-secondary/40 p-4">
        <p className="text-xs font-medium text-muted-foreground">Your request</p>
        <dl className="mt-3 space-y-2 text-sm">
          <SummaryRow label="Starting point" value={service?.label ?? "—"} />
          <SummaryRow
            label="Modules"
            value={
              moduleNames.length > 0
                ? `${moduleNames.join(", ")} · ${values.features.length} function${values.features.length === 1 ? "" : "s"}`
                : "None picked"
            }
          />
          <SummaryRow
            label="Add-ons"
            value={addonNames.length > 0 ? addonNames.join(", ") : "None"}
          />
          <SummaryRow label="Website" value={plan?.label ?? "—"} />
          {marketingNames.length > 0 ? (
            <SummaryRow label="Marketing" value={marketingNames.join(", ")} />
          ) : null}
          {values.platforms.length > 0 ? (
            <SummaryRow label="Platforms" value={values.platforms.join(", ")} />
          ) : null}
          <SummaryRow
            label="Files"
            value={
              values.files.length > 0
                ? `${values.files.length} attached`
                : "None attached"
            }
          />
        </dl>
        <p className="mt-3 line-clamp-3 border-t border-border pt-3 text-xs text-muted-foreground">
          {values.description}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="fullName" className="text-sm font-medium">
            Full name
          </Label>
          <Input
            id="fullName"
            className="mt-1.5 h-11 text-base md:text-sm"
            placeholder="Jane Smith"
            autoComplete="name"
            aria-invalid={Boolean(errors.fullName)}
            {...register("fullName")}
          />
          <FieldError message={errors.fullName?.message} />
        </div>
        <div>
          <Label htmlFor="email" className="text-sm font-medium">
            Work email
          </Label>
          <Input
            id="email"
            type="email"
            inputMode="email"
            className="mt-1.5 h-11 text-base md:text-sm"
            placeholder="jane@company.com"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </div>
        <div>
          <Label htmlFor="company" className="text-sm font-medium">
            Company
          </Label>
          <Input
            id="company"
            className="mt-1.5 h-11 text-base md:text-sm"
            placeholder="Smith Roofing"
            autoComplete="organization"
            aria-invalid={Boolean(errors.company)}
            {...register("company")}
          />
          <FieldError message={errors.company?.message} />
        </div>
        <div>
          <Label htmlFor="budget" className="text-sm font-medium">
            Rough budget{" "}
            <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <NativeSelect
            id="budget"
            className="mt-1.5 h-11 w-full rounded-lg border border-input bg-card px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
            {...register("budget")}
          >
            <option value="">Not sure yet</option>
            {budgets.map((budget) => (
              <option key={budget} value={budget}>
                {budget}
              </option>
            ))}
          </NativeSelect>
        </div>
      </div>

      <fieldset>
        <legend className="text-sm font-medium">Team size</legend>
        <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          {teamSizes.map((size) => {
            const checked = values.teamSize === size;
            return (
              <label
                key={size}
                className={cn(
                  "flex min-h-11 cursor-pointer items-center justify-center rounded-lg border text-xs font-medium transition-colors",
                  checked
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-muted-foreground hover:bg-secondary/60",
                )}
              >
                <input
                  type="radio"
                  value={size}
                  className="sr-only"
                  {...register("teamSize")}
                />
                {size}
              </label>
            );
          })}
        </div>
        <FieldError message={errors.teamSize?.message} />
      </fieldset>

      <p className="text-xs text-muted-foreground">
        We&apos;ll only use these details to reply about this project. No
        newsletter, no sharing.
      </p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <dt className="w-28 shrink-0 text-muted-foreground">{label}</dt>
      <dd className="min-w-0 flex-1">{value}</dd>
    </div>
  );
}
