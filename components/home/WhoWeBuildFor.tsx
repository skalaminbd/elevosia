"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, HeartHandshake, HeartPulse, Megaphone, Wrench } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { industries } from "@/content/home";
import { Reveal } from "@/components/home/Reveal";
import { AgenciesPreview } from "@/components/home/who-previews/AgenciesPreview";
import { CarePreview } from "@/components/home/who-previews/CarePreview";
import { FieldServicesPreview } from "@/components/home/who-previews/FieldServicesPreview";
import { NonprofitsPreview } from "@/components/home/who-previews/NonprofitsPreview";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

const CYCLE_MS = 4500;

const PREVIEWS = {
  field: FieldServicesPreview,
  agencies: AgenciesPreview,
  nonprofits: NonprofitsPreview,
  care: CarePreview,
};

const ICONS = {
  field: Wrench,
  agencies: Megaphone,
  nonprofits: HeartHandshake,
  care: HeartPulse,
};

export function WhoWeBuildFor() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.15 });
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const progressRef = useRef<HTMLSpanElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);

  const running = inView && !held && !reduceMotion;
  const loopsOn = inView && !reduceMotion;

  // Advance when the active row's progress line finishes. Reading the running
  // CSS animation means resuming after a pause continues from where it stopped.
  useEffect(() => {
    if (!running) return;

    const animation = progressRef.current?.getAnimations()[0];
    const elapsed =
      typeof animation?.currentTime === "number" ? animation.currentTime : 0;
    const remaining = Math.max(400, CYCLE_MS - elapsed);

    const timer = window.setTimeout(() => {
      setActive((current) => (current + 1) % industries.items.length);
    }, remaining);

    return () => window.clearTimeout(timer);
  }, [running, active]);

  const activeItem = industries.items[active];
  const Preview = PREVIEWS[activeItem.id];
  const Icon = ICONS[activeItem.id];

  return (
    <section id="industries" className="relative py-15 md:py-20 lg:py-25">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={ref}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-[30rem]">
              <Reveal>
                <Eyebrow>{industries.eyebrow}</Eyebrow>
              </Reveal>
              <Reveal delay={0.07}>
                <h2 className="mt-5 font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem]">
                  {industries.title}
                </h2>
              </Reveal>
            </div>

            <Reveal delay={0.14}>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold tabular-nums text-foreground">
                  {industries.counter.value}
                </span>{" "}
                {industries.counter.label}
              </p>
            </Reveal>
          </div>

          <div className="mt-16 flex flex-wrap gap-10 lg:gap-14">
            {/* Index */}
            <div className="order-2 flex min-w-0 flex-[999_1_560px] flex-col lg:order-none">
              <div
                className="border-b border-border lg:flex lg:h-full lg:flex-col"
                onPointerLeave={(event) => {
                  if (event.pointerType !== "mouse") return;
                  setHeld(false);
                }}
                onBlur={(event) => {
                  const next = event.relatedTarget;
                  if (next instanceof Node && event.currentTarget.contains(next)) {
                    return;
                  }
                  setHeld(false);
                }}
              >
                {industries.items.map((item, index) => {
                  const isActive = active === index;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={isActive}
                      onPointerEnter={(event) => {
                        if (event.pointerType !== "mouse") return;
                        setHeld(true);
                        setActive(index);
                      }}
                      onFocus={() => {
                        setHeld(true);
                        setActive(index);
                      }}
                      onClick={() => {
                        setActive(index);
                        // On mobile the preview sits above the index, so bring it back
                        // into view when a row is tapped. No-op when it is already visible.
                        previewRef.current?.scrollIntoView({
                          behavior: reduceMotion ? "auto" : "smooth",
                          block: "nearest",
                        });
                      }}
                      className="relative flex w-full items-center gap-5 border-t border-border py-5 text-left focus-visible:outline-2 focus-visible:outline-offset-6 focus-visible:outline-primary lg:flex-1 lg:py-4"
                    >
                      {isActive ? (
                        <span
                          ref={progressRef}
                          aria-hidden="true"
                          className={cn(
                            "absolute -top-px left-0 h-0.5 w-full origin-left bg-primary",
                            !reduceMotion &&
                              "animate-[who-progress_4500ms_linear_forwards]",
                          )}
                          style={
                            reduceMotion
                              ? undefined
                              : {
                                  animationPlayState: running
                                    ? "running"
                                    : "paused",
                                }
                          }
                        />
                      ) : null}

                      <span
                        className={cn(
                          "w-8 shrink-0 text-sm font-semibold tabular-nums transition duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                          isActive ? "text-primary" : "text-foreground/38",
                        )}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span
                        className={cn(
                          "min-w-0 flex-1 transition-transform duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                          isActive ? "translate-x-4" : "translate-x-0",
                        )}
                      >
                        <span
                          className={cn(
                            "block font-heading text-[clamp(22px,2.1vw,30px)] leading-[1.06] font-bold tracking-[-0.03em] transition-colors duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                            isActive ? "text-foreground" : "text-foreground/24",
                          )}
                        >
                          {item.title}
                        </span>
                        <span
                          className={cn(
                            "mt-1 block min-h-5 text-sm text-muted-foreground transition-opacity duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                            isActive ? "opacity-100" : "opacity-0",
                          )}
                        >
                          {item.blurb}
                        </span>
                      </span>

                      <span
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center text-primary transition duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                          isActive
                            ? "translate-x-0 opacity-100"
                            : "-translate-x-3 opacity-0",
                        )}
                        aria-hidden="true"
                      >
                        <ArrowUpRight className="size-7" />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preview */}
            <div className="order-1 min-w-0 flex-[1_1_400px] lg:order-none">
              <div ref={previewRef} className="relative">
                <div
                  aria-hidden="true"
                  className={cn(
                    "radial-glow pointer-events-none absolute -inset-20 opacity-25 blur-2xl",
                    loopsOn && "animate-[who-glow_20s_ease-in-out_infinite]",
                  )}
                />

                <div className="relative overflow-hidden rounded-lg border border-border bg-card p-6 shadow-md">
                  <div className="flex items-center gap-3 border-b border-border pb-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <p className="text-sm font-semibold text-foreground">
                      {activeItem.title}
                    </p>
                    <span className="ml-auto inline-flex items-center gap-2 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
                      <span
                        aria-hidden="true"
                        className={cn(
                          "size-1.5 rounded-full bg-success",
                          loopsOn &&
                            "animate-[who-blink_1600ms_ease-in-out_infinite]",
                        )}
                      />
                      Live
                    </span>
                  </div>

                  <div
                    aria-live="polite"
                    className={cn(
                      "relative mt-4 h-[360px]",
                      (!inView || held) && "who-pause",
                    )}
                  >
                    <AnimatePresence initial={false} mode="sync">
                      <motion.div
                        key={activeItem.id}
                        className="absolute inset-0"
                        initial={
                          reduceMotion ? false : { opacity: 0, y: 10 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{
                          duration: reduceMotion ? 0 : 0.55,
                          ease: EASE,
                        }}
                      >
                        <Preview animated={loopsOn} />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Reveal delay={0.1}>
            <div className="mt-12">
              <ButtonLink href={industries.cta.href} variant="outline">
                {industries.cta.label}
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
