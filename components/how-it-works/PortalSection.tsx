"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { portal } from "@/content/how-it-works";
import { AnimatedList } from "@/components/ui/animated-list";
import { Section } from "@/components/shared/Section";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * The client portal: the features on the left, the live portal window on the
 * right with activities arriving.
 */
export function PortalSection() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.15 });
  const [round, setRound] = useState(0);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const timer = window.setInterval(
      () => setRound((value) => value + 1),
      portal.feed.length * 1400 + 3000,
    );
    return () => window.clearInterval(timer);
  }, [inView, reduceMotion]);

  const feed = (
    <AnimatedList key={round} delay={1300} className="gap-2">
      {portal.feed.map((item) => (
        <div
          key={item}
          className="flex w-full items-center gap-2.5 rounded-md border border-border bg-background px-3 py-2"
        >
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
            <Check className="size-3" aria-hidden="true" />
          </span>
          <span className="text-xs text-foreground">{item}</span>
        </div>
      ))}
    </AnimatedList>
  );

  return (
    <Section id="portal">
      <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-16">
        <div className="lg:col-span-6">
          <h2 className="max-w-xl font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem]">
            {portal.title}
          </h2>
          <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            {portal.intro}
          </p>

          <ul className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {portal.features.map((feature) => (
              <li key={feature.id} className="border-t border-border pt-4">
                <h3 className="text-base font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {feature.body}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div ref={ref} className="lg:col-span-6">
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-md">
            <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5">
              <span className="size-2 rounded-full bg-muted-foreground/30" />
              <span className="size-2 rounded-full bg-muted-foreground/30" />
              <span className="size-2 rounded-full bg-muted-foreground/30" />
              <span className="ml-2 font-mono text-[10px] text-muted-foreground">
                portal.elevosia.com
              </span>
            </div>

            <div className="grid gap-4 p-4 sm:min-h-[400px] sm:grid-cols-5">
              <aside className="hidden flex-col gap-1 sm:flex">
                {["Board", "Approvals", "Messages", "Files", "Invoices"].map(
                  (item, index) => (
                    <span
                      key={item}
                      className={
                        index === 0
                          ? "rounded-md bg-accent px-2 py-1.5 text-[11px] font-medium text-accent-foreground"
                          : "px-2 py-1.5 text-[11px] text-muted-foreground"
                      }
                    >
                      {item}
                    </span>
                  ),
                )}
              </aside>

              <div className="sm:col-span-4">
                <p className="text-[11px] text-muted-foreground">Activity</p>
                <div className="mt-2">
                  {reduceMotion ? (
                    <div className="flex flex-col gap-2">
                      {portal.feed.map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-2.5 rounded-md border border-border bg-background px-3 py-2"
                        >
                          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                            <Check className="size-3" aria-hidden="true" />
                          </span>
                          <span className="text-xs text-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    feed
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
