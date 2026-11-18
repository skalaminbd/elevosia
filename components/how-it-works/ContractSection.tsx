"use client";

import { contract } from "@/content/how-it-works";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Section } from "@/components/shared/Section";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Dark band: the contract, with the signature drawing itself and the 40/30/30
 * schedule filling in three steps.
 */
export function ContractSection() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.2 });
  const alive = inView && !reduceMotion;

  return (
    <Section className="bg-primary text-primary-foreground dark:bg-secondary dark:text-foreground">
      <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-16">
        <div className="lg:col-span-7">
          <Eyebrow tone="inverse">In the contract</Eyebrow>
          <h2 className="mt-5 max-w-2xl font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem]">
            {contract.title}
          </h2>

          <ul className="mt-10 grid gap-x-10 sm:grid-cols-2">
            {contract.points.map((point) => (
              <li
                key={point.id}
                className="border-t border-border/40 py-5"
              >
                <h3 className="text-base font-semibold text-primary-foreground dark:text-foreground">
                  {point.title}
                </h3>
                <p className="mt-1.5 text-sm text-primary-foreground/70 dark:text-foreground/70">
                  {point.body}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div ref={ref} className="lg:col-span-5">
          <div className="rounded-lg border border-border bg-card p-6 text-card-foreground shadow-md">
            <div className="flex items-center justify-between">
              <p className="font-mono text-xs text-muted-foreground">
                Agreement
              </p>
              <span className="rounded-full bg-success/15 px-2.5 py-1 text-[10px] font-medium text-success">
                Signed on payment
              </span>
            </div>

            <div className="relative mt-6 rounded-md border border-border bg-background p-4">
              <p className="text-xs text-muted-foreground">
                Authorised signature
              </p>
              <svg
                viewBox="0 0 220 48"
                className="mt-2 h-12 w-full"
                aria-hidden="true"
              >
                <path
                  d="M6 34c14-22 22-22 28-4s10 16 18-2 14-22 22-8 8 20 18 10 14-16 22-8 10 14 18 8 14-10 22-16"
                  fill="none"
                  stroke="var(--color-foreground)"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  pathLength={100}
                  strokeDasharray={100}
                  className={cn(
                    alive && "animate-[hiw-sign_6000ms_ease-in-out_infinite]",
                  )}
                  style={{ strokeDashoffset: alive ? undefined : 0 }}
                />
              </svg>
              <p className="mt-2 border-t border-border pt-2 text-[10px] text-muted-foreground">
                Elevosia · fixed price, you own the code
              </p>
              <span
                aria-hidden="true"
                className={cn(
                  "absolute right-4 bottom-4 rotate-[-7deg] rounded-md border-2 border-success px-2 py-0.5 text-[10px] font-bold tracking-wide text-success",
                  alive && "animate-[who-pop_6000ms_ease-out_infinite]",
                )}
                style={{ animationDelay: "2.6s" }}
              >
                Signed
              </span>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Payment schedule</span>
                <span className="font-mono">100%</span>
              </div>
              <div className="mt-2 flex h-2 gap-0.5 overflow-hidden rounded-full bg-muted">
                {contract.payments.map((payment, index) => (
                  <span
                    key={payment}
                    className={cn(
                      "block h-full origin-left rounded-sm bg-primary",
                      alive && "animate-[who-grow-x_6000ms_ease-out_infinite]",
                    )}
                    style={{
                      width: `${[40, 30, 30][index]}%`,
                      animationDelay: `${index * 0.5}s`,
                    }}
                  />
                ))}
              </div>
              <ul className="mt-2 flex justify-between text-[10px] text-muted-foreground">
                {contract.payments.map((payment) => (
                  <li key={payment}>{payment}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
