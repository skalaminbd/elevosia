"use client";

import { Sparkles } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import {
  intakeAddons,
  suggestedAddonKeys,
  type IntakeServiceId,
} from "@/lib/intake-catalog";
import type { IntakeFormValues } from "@/lib/intake-schema";
import { cn } from "@/lib/utils";

/** Step 3: add-ons, with the ones that fit the visitor's picks shown first. */
export function StepAddons() {
  const { watch, setValue } = useFormContext<IntakeFormValues>();
  const serviceType = watch("serviceType");
  const modules = watch("modules");
  const addons = watch("addons");

  const suggested = suggestedAddonKeys({
    services: serviceType ? [serviceType as IntakeServiceId] : [],
    modules,
  });
  const ordered = [...intakeAddons].sort(
    (a, b) => Number(suggested.includes(b.key)) - Number(suggested.includes(a.key)),
  );

  function toggle(key: string) {
    setValue(
      "addons",
      addons.includes(key)
        ? addons.filter((item) => item !== key)
        : [...addons, key],
      { shouldDirty: true },
    );
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground">
        Optional. These are the extras that usually pay for themselves first. We
        only suggest what fits what you picked.
      </p>

      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
        {ordered.map((addon) => {
          const checked = addons.includes(addon.key);
          const isSuggested = suggested.includes(addon.key);

          return (
            <label
              key={addon.key}
              className={cn(
                "flex min-h-11 cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors",
                checked
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-secondary/60",
              )}
            >
              <Checkbox
                checked={checked}
                onCheckedChange={() => toggle(addon.key)}
                aria-label={addon.label}
                className="mt-0.5"
              />
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium">{addon.label}</span>
                  <span className="rounded-full bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                    {addon.priceLabel}
                  </span>
                  {isSuggested ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-medium text-success">
                      <Sparkles className="size-2.5" aria-hidden="true" />
                      Suggested
                    </span>
                  ) : null}
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {addon.body}
                </span>
              </span>
            </label>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        {addons.length === 0
          ? "None selected. You can add these after your Blueprint."
          : `${addons.length} add-on${addons.length === 1 ? "" : "s"} selected. Prices are starting points, confirmed in your Blueprint.`}
      </p>
    </div>
  );
}
