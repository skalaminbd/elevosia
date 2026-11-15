"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check } from "lucide-react";

const CONTENT: Record<
  string,
  { heading: string; body: string; features: string[] }
> = {
  "/login": {
    heading: "Welcome back.",
    body: "Pick up where your team left off — schedules, clients and invoices in one place.",
    features: [
      "See today's jobs and who is on them",
      "Check invoices and payments at a glance",
      "Ask the AI assistant for a weekly summary",
    ],
  },
  "/signup": {
    heading: "Start with a free blueprint.",
    body: "Tell us how your business runs. We map milestones, a timeline and a fixed price — free, in 5 days.",
    features: [
      "No card and no commitment",
      "A real plan from a real person",
      "Founding pricing for early clients",
    ],
  },
  "/forgot-password": {
    heading: "Let's get you back in.",
    body: "We email you a 6-digit code. Enter it and you can set a new password.",
    features: [
      "The code expires after 10 minutes",
      "Check spam if it does not arrive",
      "Your data stays exactly as it was",
    ],
  },
};

export function AuthAside() {
  const pathname = usePathname();
  const content = CONTENT[pathname] ?? CONTENT["/login"];

  return (
    <aside className="relative hidden flex-1 items-center justify-center overflow-hidden bg-primary p-12 text-primary-foreground dark:bg-secondary dark:text-foreground lg:flex lg:p-16">
      <Link
        href="/"
        className="absolute top-8 left-8 z-10 flex items-center gap-2 text-primary-foreground dark:text-foreground"
      >
        <span className="flex size-8 items-center justify-center rounded-lg bg-highlight font-heading text-base font-bold text-highlight-foreground">
          e
        </span>
        <span className="font-heading text-xl font-bold tracking-tight">
          elevosia
        </span>
      </Link>

      <div className="relative z-10 max-w-md space-y-8">
        <p className="font-heading text-3xl font-semibold tracking-tight">
          {content.heading}
        </p>
        <ul className="space-y-4">
          {content.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm">
              <Check
                className="mt-0.5 size-4 shrink-0 text-highlight"
                aria-hidden="true"
              />
              <span className="text-primary-foreground/80 dark:text-foreground/80">
                {feature}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-primary-foreground/60 dark:text-foreground/60">
          {content.body}
        </p>
      </div>

      <div
        className="absolute -right-24 -bottom-24 size-96 rounded-full bg-highlight/10"
        aria-hidden="true"
      />
    </aside>
  );
}
