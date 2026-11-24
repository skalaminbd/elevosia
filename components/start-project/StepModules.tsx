"use client";

import { Check } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { FieldError } from "@/components/start-project/FieldError";
import { Checkbox } from "@/components/ui/checkbox";
import { intakeModules } from "@/lib/intake-catalog";
import type { IntakeFormValues } from "@/lib/intake-schema";
import { cn } from "@/lib/utils";

/** Step 2: dashboard modules, then the functions inside each one. */
export function StepModules() {
  const {
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<IntakeFormValues>();
  const serviceType = watch("serviceType");
  const modules = watch("modules");
  const features = watch("features");

  function toggleModule(moduleId: string) {
    const nextModules = modules.includes(moduleId)
      ? modules.filter((id) => id !== moduleId)
      : [...modules, moduleId];
    const nextFeatures = features.filter((value) =>
      nextModules.includes(value.split(":")[0]),
    );

    setValue("modules", nextModules, { shouldDirty: true, shouldValidate: true });
    setValue("features", nextFeatures, { shouldDirty: true });
    if (nextModules.length > 0) clearErrors("modules");
  }

  function toggleFeature(moduleId: string, key: string) {
    const value = `${moduleId}:${key}`;
    setValue(
      "features",
      features.includes(value)
        ? features.filter((item) => item !== value)
        : [...features, value],
      { shouldDirty: true },
    );
  }

  const websiteOnly = serviceType === "website";

  return (
    <div>
      <p className="text-sm text-muted-foreground">
        {websiteOnly
          ? "A website works on its own. Pick any dashboard modules you might want later."
          : "Start with the parts of your business that hurt most. Each module is a tested starting point we shape to how you work."}
      </p>

      <div className="mt-5 space-y-3">
        {intakeModules.map((module) => {
          const selected = modules.includes(module.id);
          const featureCount = module.features.filter((feature) =>
            features.includes(`${module.id}:${feature.key}`),
          ).length;

          return (
            <div
              key={module.id}
              className={cn(
                "rounded-lg border transition-colors",
                selected ? "border-primary bg-primary/5" : "border-border",
              )}
            >
              <label className="flex min-h-11 cursor-pointer items-center gap-3 p-4">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={selected}
                  onChange={() => toggleModule(module.id)}
                />
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-md border",
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/50",
                  )}
                  aria-hidden="true"
                >
                  {selected ? <Check className="size-3" strokeWidth={3} /> : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">{module.name}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {selected
                      ? `${featureCount} of ${module.features.length} functions picked`
                      : `${module.features.length} functions`}
                  </span>
                </span>
              </label>

              {selected ? (
                <ul className="space-y-2 border-t border-border p-4">
                  {module.features.map((feature) => {
                    const value = `${module.id}:${feature.key}`;
                    const checked = features.includes(value);
                    return (
                      <li key={feature.key}>
                        <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-md px-1 py-1.5 text-sm">
                          <Checkbox
                            checked={checked}
                            onCheckedChange={() =>
                              toggleFeature(module.id, feature.key)
                            }
                            aria-label={feature.label}
                            className="mt-0.5"
                          />
                          <span
                            className={cn(
                              checked
                                ? "text-foreground"
                                : "text-muted-foreground",
                            )}
                          >
                            {feature.label}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        {modules.length} module{modules.length === 1 ? "" : "s"} ·{" "}
        {features.length} function{features.length === 1 ? "" : "s"} selected.
        Anything you skip can be added later.
      </p>
      <FieldError message={errors.modules?.message} />
    </div>
  );
}
