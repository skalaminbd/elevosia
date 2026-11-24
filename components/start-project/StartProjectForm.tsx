"use client";

import { useState } from "react";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { submitIntake } from "@/app/start-project/actions";
import { Button } from "@/components/ui/button";
import {
  intakeSubmissionSchema,
  type IntakeFormValues,
} from "@/lib/intake-schema";
import { cn } from "@/lib/utils";
import { StepAddons } from "./StepAddons";
import { StepContact } from "./StepContact";
import { StepDetails } from "./StepDetails";
import { StepModules } from "./StepModules";
import { StepNeed } from "./StepNeed";
import { StepWebsite } from "./StepWebsite";

const STEPS = [
  { id: "need", label: "What you need" },
  { id: "modules", label: "Modules" },
  { id: "addons", label: "Add-ons" },
  { id: "website", label: "Website" },
  { id: "details", label: "Details" },
  { id: "contact", label: "Contact" },
] as const;

/** Steps that need at least one module picked before moving on. */
const MODULE_FIRST_SERVICES = ["dashboard", "ai", "everything"];

export function StartProjectForm() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const form = useForm<IntakeFormValues>({
    resolver: zodResolver(intakeSubmissionSchema),
    defaultValues: {
      serviceType: "" as IntakeFormValues["serviceType"],
      modules: [],
      features: [],
      addons: [],
      websitePlan: "none",
      marketing: [],
      platforms: [],
      description: "",
      deadline: "",
      nda: false,
      fullName: "",
      email: "",
      company: "",
      teamSize: "",
      budget: "",
      files: [],
    },
  });

  const progress = Math.round((step / (STEPS.length - 1)) * 100);

  function stepValid() {
    if (step === 1) {
      const { serviceType, modules } = form.getValues();
      if (
        MODULE_FIRST_SERVICES.includes(serviceType) &&
        modules.length === 0
      ) {
        form.setError("modules", {
          message: "Pick at least one module, or go back and choose a website.",
        });
        return false;
      }
      form.clearErrors("modules");
      return true;
    }
    if (step === 0) return form.trigger("serviceType");
    if (step === 3) return form.trigger("websitePlan");
    if (step === 4) return form.trigger(["description", "deadline", "nda"]);
    if (step === 5) {
      return form.trigger(["fullName", "email", "company", "teamSize", "budget"]);
    }
    return true;
  }

  async function goNext() {
    if (!(await stepValid())) return;
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
    scrollToForm();
  }

  function goBack() {
    setStep((current) => Math.max(current - 1, 0));
    scrollToForm();
  }

  async function onSubmit(values: IntakeFormValues) {
    if (submitting) return;
    setSubmitting(true);
    const result = await submitIntake(values);
    setSubmitting(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    setSubmittedId(result.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function scrollToForm() {
    document
      .getElementById("intake-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (submittedId) {
    return <SubmittedPanel id={submittedId} />;
  }

  return (
    <FormProvider {...form}>
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs text-muted-foreground">
                Step {step + 1} of {STEPS.length}
              </p>
              <h2 className="mt-1 text-xl font-semibold sm:text-2xl">
                {STEPS[step].label}
              </h2>
            </div>
            <span className="font-mono text-sm text-muted-foreground">
              {progress}%
            </span>
          </div>

          <div
            className="mt-4 h-1.5 overflow-hidden rounded-full bg-secondary"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            aria-label="Form progress"
          >
            <span
              className="block h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <ol className="mt-4 hidden grid-cols-6 gap-1.5 sm:grid">
            {STEPS.map((item, index) => (
              <li key={item.id}>
                <span
                  className={cn(
                    "flex items-center gap-1 text-[11px]",
                    index === step
                      ? "font-medium text-foreground"
                      : index < step
                        ? "text-muted-foreground"
                        : "text-muted-foreground/60",
                  )}
                >
                  {index < step ? (
                    <Check className="size-2.5 text-primary" aria-hidden="true" />
                  ) : (
                    <span className="font-mono">{index + 1}</span>
                  )}
                  <span className="truncate">{item.label}</span>
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-8">
            {step === 0 ? <StepNeed /> : null}
            {step === 1 ? <StepModules /> : null}
            {step === 2 ? <StepAddons /> : null}
            {step === 3 ? <StepWebsite /> : null}
            {step === 4 ? <StepDetails /> : null}
            {step === 5 ? <StepContact /> : null}
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              disabled={step === 0 || submitting}
              className={cn(step === 0 && "invisible hidden sm:inline-flex")}
            >
              <ArrowLeft data-icon="inline-start" aria-hidden="true" />
              Back
            </Button>

            {step === STEPS.length - 1 ? (
              <Button
                type="button"
                onClick={form.handleSubmit(onSubmit)}
                disabled={submitting}
              >
                {submitting ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : null}
                {submitting ? "Sending…" : "Submit my request"}
              </Button>
            ) : (
              <Button type="button" onClick={goNext}>
                Continue
                <ArrowRight data-icon="inline-end" aria-hidden="true" />
              </Button>
            )}
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Free Blueprint. No commitment. We never share your details, and we
            can sign an NDA first.
          </p>
        </div>
      </div>
    </FormProvider>
  );
}

function SubmittedPanel({ id }: { id: string }) {
  return (
    <div className="mx-auto w-full max-w-2xl rounded-lg border border-success/30 bg-card p-6 text-center shadow-sm sm:p-10">
      <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-success/10 text-success">
        <Check className="size-6" aria-hidden="true" />
      </span>
      <h2 className="mt-5 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
        Your request is in.
      </h2>
      <p className="mt-3 text-base text-muted-foreground">
        Reference <span className="font-mono text-foreground">{id}</span>. We
        read every submission and reply within one business day. Your Blueprint,
        with milestones, a timeline and a fixed price, arrives within 5 business
        days.
      </p>
      <ul className="mx-auto mt-6 max-w-md space-y-2 text-left text-sm text-muted-foreground">
        <li className="flex items-start gap-2">
          <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
          Your project manager reads it and asks questions by email.
        </li>
        <li className="flex items-start gap-2">
          <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
          The Blueprint is free. Nothing is charged until you approve it.
        </li>
        <li className="flex items-start gap-2">
          <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
          Want to talk sooner? Book a 30-minute call any time.
        </li>
      </ul>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <a href="/book-a-call">Book a call</a>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
