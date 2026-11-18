"use client";

import { useEffect, useRef, useState } from "react";
import { timeline } from "@/content/how-it-works";
import { Section } from "@/components/shared/Section";
import { cn } from "@/lib/utils";

/**
 * The 10-week timeline: the rail fills as you read, and the milestone you are
 * on lights up.
 */
export function TimelineSection() {
  const [reached, setReached] = useState(-1);
  const rows = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset.index);
          if (!Number.isNaN(index)) {
            setReached((current) => Math.max(current, index));
          }
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 },
    );

    rows.current.forEach((row) => row && observer.observe(row));
    return () => observer.disconnect();
  }, []);

  const progress = (reached + 1) / timeline.milestones.length;

  return (
    <Section id="timeline">
      <h2 className="max-w-2xl font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem]">
        {timeline.title}
      </h2>

      <div className="relative mt-14 pl-8 sm:pl-12">
        <div
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-0 w-px bg-border"
        >
          <div
            className="h-full w-px origin-top bg-primary transition-transform duration-700 ease-out motion-reduce:transition-none"
            style={{ transform: `scaleY(${progress})` }}
          />
        </div>

        <ol className="flex flex-col gap-10">
          {timeline.milestones.map((milestone, index) => {
            const isReached = index <= reached;
            const isCurrent = index === reached;

            return (
              <li
                key={milestone.id}
                data-index={index}
                ref={(element) => {
                  rows.current[index] = element;
                }}
                className="relative"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute top-1.5 -left-8 size-2.5 -translate-x-1/2 rounded-full border-2 sm:-left-12",
                    isReached
                      ? "border-primary bg-primary"
                      : "border-border bg-card",
                    isCurrent && "motion-safe:animate-pulse",
                  )}
                />

                <div className="grid gap-2 lg:grid-cols-12 lg:gap-8">
                  <p className="font-mono text-xs text-muted-foreground lg:col-span-2">
                    {milestone.when}
                  </p>
                  <h3 className="font-heading text-xl font-semibold tracking-tight text-foreground lg:col-span-4">
                    {milestone.title}
                  </h3>
                  <p className="max-w-2xl text-base text-muted-foreground lg:col-span-6">
                    {milestone.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
