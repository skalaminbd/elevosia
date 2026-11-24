"use client";

import { Check } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { FieldError } from "@/components/start-project/FieldError";
import { Checkbox } from "@/components/ui/checkbox";
import {
  intakeMarketing,
  intakePlatforms,
  intakeWebsitePlans,
} from "@/lib/intake-catalog";
import type { IntakeFormValues } from "@/lib/intake-schema";
import { cn } from "@/lib/utils";

/** Step 4: website size and the marketing services around it. */
export function StepWebsite() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<IntakeFormValues>();
  const websitePlan = watch("websitePlan");
  const marketing = watch("marketing");
  const platforms = watch("platforms");

  function toggleMarketing(key: string) {
    const next = marketing.includes(key)
      ? marketing.filter((item) => item !== key)
      : [...marketing, key];
    setValue("marketing", next, { shouldDirty: true });
    if (key === "social-media" && !next.includes("social-media")) {
      setValue("platforms", [], { shouldDirty: true });
    }
  }

  function togglePlatform(platform: string) {
    setValue(
      "platforms",
      platforms.includes(platform)
        ? platforms.filter((item) => item !== platform)
        : [...platforms, platform],
      { shouldDirty: true },
    );
  }

  const needsSocial = marketing.includes("social-media");

  return (
    <div className="space-y-8">
      <fieldset>
        <legend className="text-sm font-medium">Website</legend>
        <p className="mt-1 text-xs text-muted-foreground">
          A website on the same system means every form and booking lands in
          your dashboard.
        </p>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {intakeWebsitePlans.map((plan) => {
            const checked = websitePlan === plan.key;
            return (
              <label
                key={plan.key}
                className={cn(
                  "flex min-h-11 cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors",
                  checked
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-secondary/60",
                )}
              >
                <input
                  type="radio"
                  value={plan.key}
                  className="sr-only"
                  {...register("websitePlan")}
                />
                <span
                  className={cn(
                    "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border",
                    checked
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/50",
                  )}
                  aria-hidden="true"
                >
                  {checked ? <Check className="size-3" strokeWidth={3} /> : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-sm font-medium">{plan.label}</span>
                    {plan.priceLabel ? (
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {plan.priceLabel}
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {plan.body}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
        <FieldError message={errors.websitePlan?.message} />
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium">
          Marketing services{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </legend>
        <p className="mt-1 text-xs text-muted-foreground">
          Tell us what you need help with. We quote these in the Blueprint.
        </p>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {intakeMarketing.map((item) => {
            const checked = marketing.includes(item.key);
            return (
              <label
                key={item.key}
                className={cn(
                  "flex min-h-11 cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors",
                  checked
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-secondary/60",
                )}
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggleMarketing(item.key)}
                  aria-label={item.label}
                  className="mt-0.5"
                />
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{item.label}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {item.body}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {needsSocial ? (
        <fieldset>
          <legend className="text-sm font-medium">Social platforms</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {intakePlatforms.map((platform) => {
              const checked = platforms.includes(platform);
              return (
                <label
                  key={platform}
                  className={cn(
                    "flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-3.5 text-sm transition-colors",
                    checked
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:bg-secondary/60",
                  )}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() => togglePlatform(platform)}
                  />
                  {checked ? (
                    <Check className="size-3.5" aria-hidden="true" />
                  ) : null}
                  {platform}
                </label>
              );
            })}
          </div>
        </fieldset>
      ) : null}
    </div>
  );
}
