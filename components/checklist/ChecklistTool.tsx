"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import {
  checklistGroups,
  checklistResults,
  downloadBox,
} from "@/content/checklist";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Section } from "@/components/shared/Section";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TOTAL = checklistGroups.reduce((sum, group) => sum + group.items.length, 0);
const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** The 12-item check with a live score, a result and the PDF sign-up. */
export function ChecklistTool() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const count = Object.values(checked).filter(Boolean).length;
  const percent = Math.round((count / TOTAL) * 100);
  const result =
    checklistResults.find((item) => count <= item.max) ??
    checklistResults[checklistResults.length - 1];

  function toggle(key: string, value: boolean) {
    setChecked((current) => ({ ...current, [key]: value }));
  }

  return (
    <Section id="check">
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
        <div className="order-first lg:order-none lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-5">
                <div
                  className="relative size-28 shrink-0"
                  role="img"
                  aria-label={`Score: ${count} of ${TOTAL}`}
                >
                  <svg viewBox="0 0 100 100" className="size-28 -rotate-90">
                    <circle
                      cx="50"
                      cy="50"
                      r={RADIUS}
                      fill="none"
                      stroke="var(--color-secondary)"
                      strokeWidth="5"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r={RADIUS}
                      fill="none"
                      stroke="var(--color-primary)"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray={CIRCUMFERENCE}
                      animate={{
                        strokeDashoffset: CIRCUMFERENCE * (1 - percent / 100),
                      }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-baseline justify-center gap-0.5 pt-10">
                    <span className="font-mono text-3xl font-semibold tabular-nums">
                      {count}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      /{TOTAL}
                    </span>
                  </span>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {percent}% of the check
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {count === 0
                      ? "Tick what's true to see your result."
                      : "Your result updates as you tick."}
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-border pt-5">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={result.max}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <h3 className="font-heading text-lg font-semibold">
                      {result.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      {result.body}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <ButtonLink href={downloadBox.cta.href}>
                  {downloadBox.cta.label}
                </ButtonLink>
                {count > 0 ? (
                  <button
                    type="button"
                    onClick={() => setChecked({})}
                    className="text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    Clear all
                  </button>
                ) : null}
              </div>
            </div>

            <DownloadBox />
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="space-y-8">
            {checklistGroups.map((group) => (
              <fieldset key={group.id}>
                <legend className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {group.label}
                </legend>
                <div className="mt-3 space-y-2">
                  {group.items.map((item) => {
                    const key = `${group.id}-${item}`;
                    const isChecked = Boolean(checked[key]);
                    return (
                      <label
                        key={key}
                        className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-md border px-4 py-3 text-sm transition-colors ${
                          isChecked
                            ? "border-primary/30 bg-primary/5"
                            : "border-border bg-card hover:bg-secondary/50"
                        }`}
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={(value) => toggle(key, value === true)}
                          aria-label={item}
                        />
                        <span className="text-sm leading-relaxed">{item}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>

          <p className="mt-8 text-xs text-muted-foreground">
            Nothing is stored. This check runs in your browser.
          </p>
        </div>
      </div>
    </Section>
  );
}

function DownloadBox() {
  const [sent, setSent] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");

  if (sent) {
    return (
      <div className="mt-4 rounded-lg border border-success/30 bg-success/5 p-5">
        <p className="text-sm font-medium text-success">{downloadBox.success}</p>
      </div>
    );
  }

  return (
    <form
      className="mt-4 rounded-lg border border-border bg-card p-5"
      onSubmit={(event) => {
        event.preventDefault();
        if (!firstName.trim() || !email.trim()) return;
        setSent(true);
      }}
    >
      <h3 className="text-sm font-semibold">{downloadBox.title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        {downloadBox.body}
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <div className="space-y-1.5">
          <Label htmlFor="checklist-name" className="text-xs font-medium">
            {downloadBox.fields.firstName}
          </Label>
          <Input
            id="checklist-name"
            className="h-11"
            autoComplete="given-name"
            required
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="checklist-email" className="text-xs font-medium">
            {downloadBox.fields.email}
          </Label>
          <Input
            id="checklist-email"
            type="email"
            inputMode="email"
            className="h-11"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
      </div>
      <Button type="submit" variant="outline" className="mt-3 w-full">
        {downloadBox.submit}
        <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
      </Button>
    </form>
  );
}
