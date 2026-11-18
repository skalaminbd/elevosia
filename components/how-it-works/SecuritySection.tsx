"use client";

import { Lock } from "lucide-react";
import { security } from "@/content/how-it-works";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Ripple } from "@/components/ui/ripple";
import { Section } from "@/components/shared/Section";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/** Security: the shield with its ripple, and locks that click shut in order. */
export function SecuritySection() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.2 });
  const alive = inView && !reduceMotion;

  return (
    <Section id="security">
      <div ref={ref} className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Eyebrow>Security</Eyebrow>
          <h2 className="mt-5 font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem]">
            {security.title}
          </h2>

          <div className="relative mt-10 flex size-40 items-center justify-center rounded-full border border-border">
            {alive ? (
              <Ripple
                aria-hidden="true"
                numCircles={4}
                mainCircleOpacity={0.14}
                className="[mask-image:none]"
              />
            ) : null}
            <span className="relative flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Lock className="size-7" aria-hidden="true" />
            </span>
          </div>
        </div>

        <ul className="grid gap-x-10 sm:grid-cols-2 lg:col-span-7">
          {security.points.map((point, index) => (
            <li key={point.id} className="border-t border-border py-5">
              <div className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full bg-accent text-accent-foreground",
                    alive && "animate-[hiw-lock_7000ms_ease-out_infinite]",
                  )}
                  style={{ animationDelay: `${index * 0.45}s` }}
                >
                  <Lock className="size-3.5" aria-hidden="true" />
                </span>
                <h3 className="text-base font-semibold text-foreground">
                  {point.title}
                </h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{point.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
