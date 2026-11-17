import { Check } from "lucide-react";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { ShineBorder } from "@/components/ui/shine-border";

const BEFORE = [
  "Five tabs to answer one question",
  "Data typed two or three times",
  "Reports built by hand every Friday",
  "Paying for seats nobody uses",
];

const AFTER = [
  "One dashboard for the whole team",
  "Website, dashboard and client portal share one database",
  "Reports written for you",
  "No per-user fees. Add people for free",
];

export function PictureThisSection() {
  return (
    <section className="bg-primary py-15 text-primary-foreground md:py-20 lg:py-25 dark:bg-secondary dark:text-foreground">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <Eyebrow tone="inverse">Now picture this</Eyebrow>

          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            One login. Every answer.
          </h2>

          <p className="mt-5 text-base text-primary-foreground/80 dark:text-foreground/80">
            Your schedule, staff, clients, invoices and numbers live in one
            dashboard built around your business. A customer books on your
            website and the job appears for your team. A shift opens and AI
            suggests who can cover it. You want to know how the month is going,
            so you just look.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-primary-foreground/15 bg-primary-foreground/5 p-6 dark:border-border dark:bg-card">
            <h3 className="text-lg font-semibold">Before</h3>
            <ul className="mt-4 space-y-3">
              {BEFORE.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-primary-foreground/60 dark:text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span className="text-primary-foreground/80 dark:text-foreground/80">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative overflow-hidden rounded-lg bg-highlight/5 p-6">
            <ShineBorder
              borderWidth={1}
              duration={24}
              shineColor={[
                "var(--highlight)",
                "var(--accent)",
                "var(--highlight)",
                "var(--success)",
                "var(--highlight)",
              ]}
            />

            <h3 className="text-lg font-semibold text-highlight">
              After Elevosia
            </h3>
            <ul className="mt-4 space-y-3">
              {AFTER.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-highlight"
                    aria-hidden="true"
                  />
                  <span className="text-primary-foreground/90 dark:text-foreground/90">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
