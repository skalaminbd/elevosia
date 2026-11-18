"use client";

import { useRouter } from "next/navigation";
import { NativeSelect } from "@/components/shared/NativeSelect";
import { motion } from "motion/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { ArrowUpRight, Check, Mail } from "lucide-react";
import { startForm } from "@/content/start";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Section } from "@/components/shared/Section";
import { useInViewLoop, useLoopStep } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const schema = z.object({
  need: z.string().min(1, "Pick one option"),
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid work email"),
  company: z.string().min(2, "Enter your company name"),
  teamSize: z.string().min(1, "Pick a team size"),
  budget: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const RADIUS = 24;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Short form, completion ring and the "what happens next" column. */
export function StartForm() {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      need: "",
      fullName: "",
      email: "",
      company: "",
      teamSize: "",
      budget: "",
    },
  });

  const values = useWatch({ control: form.control });
  const filled = [
    values.need,
    values.fullName,
    values.email,
    values.company,
    values.teamSize,
  ].filter(Boolean).length;
  const progress = Math.round((filled / 5) * 100);
  const offset = CIRCUMFERENCE * (1 - progress / 100);
  const errors = form.formState.errors;

  function onSubmit(data: FormValues) {
    const first = data.fullName.trim().split(" ")[0];
    router.push(`/thank-you?name=${encodeURIComponent(first)}`);
  }

  return (
    <Section id="start-form">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <form
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
            className="rounded-lg border border-border bg-card p-6 shadow-sm lg:p-8"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] sm:text-[2.75rem]">
                  {startForm.title}
                </h2>
                <p className="mt-2 max-w-lg text-sm text-muted-foreground sm:text-base">
                  {startForm.intro}
                </p>
              </div>
              <ProgressRing offset={offset} filled={filled} />
            </div>

            <ol className="mt-6 grid grid-cols-3 gap-2" aria-label="Form progress">
              {[
                { id: "need", label: "What you need", done: Boolean(values.need) },
                {
                  id: "about",
                  label: "About you",
                  done: Boolean(values.fullName && values.email && values.company),
                },
                { id: "team", label: "Team size", done: Boolean(values.teamSize) },
              ].map((step, index) => (
                <li key={step.id}>
                  <span
                    className={cn(
                      "block h-1.5 rounded-full transition-colors",
                      step.done ? "bg-primary" : "bg-secondary",
                    )}
                  />
                  <span
                    className={cn(
                      "mt-1.5 flex items-center gap-1 text-[11px]",
                      step.done
                        ? "font-medium text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {step.done ? (
                      <Check className="size-2.5 text-primary" aria-hidden="true" />
                    ) : (
                      <span className="font-mono">{index + 1}</span>
                    )}
                    {step.label}
                  </span>
                </li>
              ))}
            </ol>

            <fieldset className="mt-7">
              <legend className="sr-only">What do you need?</legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {startForm.needs.map((need) => {
                  const checked = values.need === need;
                  return (
                    <label
                      key={need}
                      className={cn(
                        "flex min-h-11 cursor-pointer items-center gap-2.5 rounded-md border px-3 py-2.5 text-sm transition-colors",
                        checked
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-secondary/60",
                      )}
                    >
                      <input
                        type="radio"
                        value={need}
                        className="sr-only"
                        {...form.register("need")}
                      />
                      <span
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded-full border",
                          checked
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/50",
                        )}
                      >
                        {checked ? (
                          <motion.span
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.15 }}
                          >
                            <Check className="size-2.5" strokeWidth={3} aria-hidden="true" />
                          </motion.span>
                        ) : null}
                      </span>
                      {need}
                    </label>
                  );
                })}
              </div>
              <FieldError message={errors.need?.message} />
            </fieldset>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field
                id="fullName"
                label="Full name"
                error={errors.fullName?.message}
              >
                <Input
                  id="fullName"
                  className="h-11"
                  placeholder="Jane Smith"
                  autoComplete="name"
                  aria-invalid={Boolean(errors.fullName)}
                  {...form.register("fullName")}
                />
              </Field>
              <Field
                id="email"
                label="Work email"
                error={errors.email?.message}
              >
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  className="h-11"
                  placeholder="jane@company.com"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  {...form.register("email")}
                />
              </Field>
              <Field id="company" label="Company" error={errors.company?.message}>
                <Input
                  id="company"
                  className="h-11"
                  placeholder="Smith Roofing"
                  autoComplete="organization"
                  aria-invalid={Boolean(errors.company)}
                  {...form.register("company")}
                />
              </Field>
              <fieldset className="space-y-1.5">
                <legend className="text-sm font-medium">Team size</legend>
                <div className="grid grid-cols-2 gap-1.5">
                  {startForm.teamSizes.map((size) => {
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
                          {...form.register("teamSize")}
                        />
                        {size}
                      </label>
                    );
                  })}
                </div>
                <FieldError message={errors.teamSize?.message} />
              </fieldset>
            </div>

            <div className="mt-6 space-y-1.5">
              <Label htmlFor="budget" className="text-sm font-medium">
                Rough budget{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </Label>
              <NativeSelect
                id="budget"
                className="h-11 w-full rounded-lg border border-input bg-card px-3 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
                {...form.register("budget")}
              >
                <option value="">Not sure yet</option>
                {startForm.budgets.map((budget) => (
                  <option key={budget} value={budget}>
                    {budget}
                  </option>
                ))}
              </NativeSelect>
            </div>

            <div className="mt-7">
              <Button type="submit" size="lg" className="w-full sm:w-auto">
                {startForm.submit}
                <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
              </Button>
              <p className="mt-3 text-xs text-muted-foreground">
                {startForm.privacy}
              </p>
            </div>
          </form>
        </div>

        <aside className="lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <NextSteps />
            <div className="mt-6 rounded-lg border border-border bg-card p-6">
              <h3 className="text-sm font-semibold">
                {startForm.side.notReadyTitle}
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {startForm.side.notReadyBody}
              </p>
              <a
                href={startForm.side.notReadyCta.href}
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                {startForm.side.notReadyCta.label}
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </a>
            </div>
            <div className="mt-6 rounded-lg border border-border bg-card p-6">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/founder/alamin.svg"
                  alt=""
                  className="size-9 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium">Alamin</p>
                  <p className="text-xs text-muted-foreground">
                    Founder · reads every request
                  </p>
                </div>
              </div>
              <h3 className="mt-4 text-sm font-semibold">
                {startForm.side.contactTitle}
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href={`mailto:${startForm.side.email}`}
                    className="inline-flex items-center gap-2 text-foreground hover:text-primary"
                  >
                    <Mail className="size-4" aria-hidden="true" />
                    {startForm.side.email}
                  </a>
                </li>
                <li>{startForm.side.location}</li>
                <li>{startForm.side.live}</li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </Section>
  );
}

function ProgressRing({ offset, filled }: { offset: number; filled: number }) {
  return (
    <div
      className="relative hidden size-16 shrink-0 sm:block"
      role="img"
      aria-label={`${startForm.progressLabel}: ${filled} of 5`}
    >
      <svg viewBox="0 0 56 56" className="size-16 -rotate-90">
        <circle
          cx="28"
          cy="28"
          r={RADIUS}
          fill="none"
          stroke="var(--color-secondary)"
          strokeWidth="3"
        />
        <motion.circle
          cx="28"
          cy="28"
          r={RADIUS}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-mono text-xs font-semibold tabular-nums">
        {filled}/5
      </span>
    </div>
  );
}

function NextSteps() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.3 });
  const alive = inView && !reduceMotion;
  const step = useLoopStep(startForm.side.next.length, {
    active: alive,
    intervalMs: 2400,
  });

  return (
    <div ref={ref} className="rounded-lg border border-border bg-card p-6">
      <h3 className="text-sm font-semibold">{startForm.side.nextTitle}</h3>
      <ol className="mt-4 space-y-3">
        {startForm.side.next.map((line, index) => {
          const active = !reduceMotion && index === step;
          return (
            <li key={line} className="flex items-start gap-3">
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px] transition-colors duration-300",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground",
                )}
              >
                {index + 1}
              </span>
              <span
                className={cn(
                  "text-sm transition-colors duration-300",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {line}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      {children}
      <FieldError message={error} />
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-destructive">{message}</p>;
}
