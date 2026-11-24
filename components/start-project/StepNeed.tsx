"use client";

import { Check } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { FieldError } from "@/components/start-project/FieldError";
import { intakeServices } from "@/lib/intake-catalog";
import type { IntakeFormValues } from "@/lib/intake-schema";
import { cn } from "@/lib/utils";

/** Step 1: the starting point. */
export function StepNeed() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<IntakeFormValues>();
  const selected = watch("serviceType");

  return (
    <fieldset>
      <legend className="text-sm text-muted-foreground">
        Pick the closest match. You can add more in the next steps.
      </legend>
      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {intakeServices.map((service) => {
          const checked = selected === service.id;
          return (
            <label
              key={service.id}
              className={cn(
                "flex min-h-11 cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors",
                checked
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-secondary/60",
              )}
            >
              <input
                type="radio"
                value={service.id}
                className="sr-only"
                {...register("serviceType")}
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
              <span className="min-w-0">
                <span className="block text-sm font-medium">{service.label}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {service.body}
                </span>
              </span>
            </label>
          );
        })}
      </div>
      <FieldError message={errors.serviceType?.message} />
    </fieldset>
  );
}
