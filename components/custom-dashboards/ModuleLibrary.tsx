"use client";

import { useEffect, useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { moduleLibrary as library } from "@/content/custom-dashboards";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Section } from "@/components/shared/Section";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

const CYCLE_MS = 5200;

/**
 * The module library: a list on the left, the selected module's features on the
 * right. It walks itself until you take over.
 */
export function ModuleLibrary() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.15 });
  const [active, setActive] = useState(0);
  const [picked, setPicked] = useState(false);

  useEffect(() => {
    if (!inView || picked || reduceMotion) return;
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % library.modules.length),
      CYCLE_MS,
    );
    return () => window.clearInterval(timer);
  }, [inView, picked, reduceMotion]);

  const selected = library.modules[active];

  const pick = (index: number) => {
    setActive(index);
    setPicked(true);
  };

  return (
    <Section id="modules">
      <div ref={ref} className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-xl">
          <Eyebrow>Module library</Eyebrow>
          <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            {library.title}
          </h2>
        </div>
        <p className="max-w-md text-base text-muted-foreground">{library.intro}</p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <ul className="border-t border-border">
            {library.modules.map((module, index) => {
              const isActive = active === index;

              return (
                <li key={module.id} className="relative border-b border-border">
                  {isActive ? (
                    <span
                      aria-hidden="true"
                      className="absolute top-0 left-0 h-full w-0.5 bg-primary"
                    />
                  ) : null}
                  <button
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => pick(index)}
                    className="flex w-full items-center gap-4 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <span className="font-mono text-xs text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "flex-1 text-base font-medium transition-colors",
                        isActive ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {module.name}
                    </span>
                    <ChevronRight
                      aria-hidden="true"
                      className={cn(
                        "size-4 shrink-0 transition-transform lg:hidden",
                        isActive ? "rotate-90 text-primary" : "text-muted-foreground",
                      )}
                    />
                  </button>

                  {/* Mobile: the features open inline */}
                  <div
                    className={cn(
                      "grid transition-[grid-template-rows] duration-300 ease-out lg:hidden",
                      isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden">
                      <ul className="flex flex-col gap-2 pb-4 pl-10">
                        {module.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <Check
                              className="mt-0.5 size-3.5 shrink-0 text-success"
                              aria-hidden="true"
                            />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="hidden lg:col-span-7 lg:block">
          <div className="relative h-full overflow-hidden rounded-lg border border-border bg-card p-8 shadow-sm">
            <div className="flex h-full flex-col justify-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={selected.id}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                transition={{ duration: reduceMotion ? 0 : 0.35, ease: EASE }}
              >
                <p className="font-mono text-xs text-muted-foreground">
                  Module {String(active + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-heading text-2xl font-bold tracking-tight text-foreground">
                  {selected.name}
                </h3>

                <ul className="mt-6">
                  {selected.features.map((feature, index) => (
                    <motion.li
                      key={feature}
                      initial={reduceMotion ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: reduceMotion ? 0 : 0.1 + index * 0.07 }}
                      className="flex items-start gap-3 border-t border-border py-3.5 text-base text-foreground"
                    >
                      <Check
                        className="mt-1 size-4 shrink-0 text-success"
                        aria-hidden="true"
                      />
                      {feature}
                    </motion.li>
                  ))}
                </ul>

                <p className="mt-6 text-sm text-muted-foreground">
                  Shaped to your workflow, not bolted on.
                </p>
              </motion.div>
            </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
