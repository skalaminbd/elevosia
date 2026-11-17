"use client";

import { honesty } from "@/content/about";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Section } from "@/components/shared/Section";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * A short, opinionated list: what we refuse to sell, next to what we do instead.
 * The strikethrough draws itself through each refusal on a loop.
 */
export function HonestySection() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.2 });
  const alive = inView && !reduceMotion;

  return (
    <Section id="honesty" className="border-t border-border">
      <div ref={ref} className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <Eyebrow>{honesty.eyebrow}</Eyebrow>
          <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            {honesty.title}
          </h2>
          <p className="mt-4 max-w-xs text-base text-muted-foreground">
            {honesty.lead}
          </p>
        </div>

        <div className="lg:col-span-8">
          <ul className="border-t border-border">
            {honesty.items.map((item, index) => (
              <li
                key={item.wont}
                className="grid gap-2 border-b border-border py-5 sm:grid-cols-2 sm:items-baseline sm:gap-10"
              >
                <p className="text-base text-muted-foreground">
                  <span className="relative inline-block">
                    {item.wont}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute top-1/2 left-0 h-px w-full origin-left bg-foreground/70",
                        alive && "animate-[who-grow-x_5000ms_ease-out_infinite]",
                      )}
                      style={{ animationDelay: `${index * 0.22}s` }}
                    />
                  </span>
                </p>
                <p className="text-base text-foreground">{item.will}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
