"use client";

import { alsoBuiltFor } from "@/content/industries";
import { Section } from "@/components/shared/Section";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/** The six extra industries, drifting past in a marquee. */
export function AlsoBuiltFor() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.2 });
  const running = inView && !reduceMotion;

  return (
    <Section id="also-built-for" className="scroll-mt-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 className="font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] sm:text-[2.75rem]">
          {alsoBuiltFor.title}
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Six more teams we build for, with the same modules.
        </p>
      </div>

      <div
        ref={ref}
        aria-hidden="true"
        className="mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
      >
        <div className={cn("marquee-track flex w-max gap-4", !running && "who-pause")}>
          {[...alsoBuiltFor.items, ...alsoBuiltFor.items].map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="w-64 rounded-lg border border-border bg-card p-5 shadow-sm"
            >
              <p className="text-base font-semibold text-foreground">
                {item.name}
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">{item.line}</p>
            </div>
          ))}
        </div>
      </div>

      <ul className="sr-only">
        {alsoBuiltFor.items.map((item) => (
          <li key={item.name}>
            {item.name}: {item.line}
          </li>
        ))}
      </ul>
    </Section>
  );
}
