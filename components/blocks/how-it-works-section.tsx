"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {CalendarClock,
  Check,
  CircleDollarSign,
  ClipboardList,
  Code,
  Database,
  FileCheck,
  GraduationCap,
  Hammer,
  HeartHandshake,
  LayoutDashboard,
  LineChart,
  ListTodo,
  PhoneCall,
  Route,
  Upload,
  Users,
  type LucideIcon} from "lucide-react";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { cn } from "@/lib/utils";

type Stage = {
  name: string;
  time: string;
  icon: LucideIcon;
  orbit: LucideIcon[];
};

const STAGES: Stage[] = [
  {
    name: "Requirements",
    time: "About 20 min",
    icon: ListTodo,
    orbit: [ClipboardList, Upload, PhoneCall],
  },
  {
    name: "Blueprint",
    time: "5 business days",
    icon: FileCheck,
    orbit: [CircleDollarSign, CalendarClock, Route],
  },
  {
    name: "Build",
    time: "6 to 10 weeks",
    icon: Hammer,
    orbit: [Code, Database, GraduationCap],
  },
  {
    name: "Managed",
    time: "Live and supported",
    icon: LayoutDashboard,
    orbit: [LineChart, Users, HeartHandshake],
  },
];

const STEPS = [
  {
    title: "Share your requirements",
    body: "Write what you need in our simple builder, section by section, or upload a doc. Not sure? Book a call and we'll write it with you.",
  },
  {
    title: "Approve your free Blueprint",
    body: "Within 5 business days you get a plan: milestones, timeline and a fixed price. Ask for changes until it's right.",
  },
  {
    title: "Launch and grow with us",
    body: "6 to 10 weeks, with your weekly board updating as we work. Then we move your data, train your team and stay on as your tech partner.",
  },
];

const LOOP = 11000;
const STAGE_START = [0, 3000, 6000, 9000];
const RADIUS = 115;
const RING_LENGTH = 2 * Math.PI * RADIUS;
const HEAD_ANGLES = [-90, 30, 150];

function easeInOut(value: number) {
  return value < 0.5 ? 2 * value * value : 1 - 2 * (1 - value) * (1 - value);
}

function timeline(t: number) {
  let stage = 0;
  let progress = 0;

  if (t < 1600) {
    stage = 0;
    progress = 0;
  } else if (t < 3000) {
    stage = 0;
    progress = easeInOut((t - 1600) / 1400) / 3;
  } else if (t < 4600) {
    stage = 1;
    progress = 1 / 3;
  } else if (t < 6000) {
    stage = 1;
    progress = 1 / 3 + easeInOut((t - 4600) / 1400) / 3;
  } else if (t < 7600) {
    stage = 2;
    progress = 2 / 3;
  } else if (t < 9000) {
    stage = 2;
    progress = 2 / 3 + easeInOut((t - 7600) / 1400) / 3;
  } else {
    stage = 3;
    progress = 1;
  }

  let opacity = 1;
  if (t >= 10800) opacity = Math.max(0, 1 - (t - 10800) / 200);
  else if (t < 200) opacity = t / 200;

  return { stage, progress, opacity };
}

function pointOnRing(progress: number) {
  const angle = (-90 + 360 * progress) * (Math.PI / 180);

  return {
    x: 150 + RADIUS * Math.cos(angle),
    y: 150 + RADIUS * Math.sin(angle),
  };
}

export function HowItWorksSection() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  const arcRef = useRef<SVGCircleElement>(null);
  const headRef = useRef<SVGGElement>(null);

  const [stage, setStage] = useState(0);
  const stageRef = useRef(0);

  const rafRef = useRef<number | null>(null);
  const startRef = useRef(0);
  const startedRef = useRef(false);
  const visibleRef = useRef(false);

  const paint = useCallback(
    (progress: number, opacity: number, next: number, syncStage = true) => {
    if (arcRef.current) {
      arcRef.current.style.strokeDashoffset = `${RING_LENGTH * (1 - progress)}`;
      arcRef.current.style.opacity = `${opacity}`;
    }

    if (headRef.current) {
      const { x, y } = pointOnRing(progress);
      headRef.current.setAttribute("transform", `translate(${x} ${y})`);
      headRef.current.style.opacity = `${opacity}`;
    }

      if (syncStage && stageRef.current !== next) {
        stageRef.current = next;
        setStage(next);
      }
    },
    [],
  );

  const stop = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  const start = useCallback(
    (fromStage = 0) => {
      stop();
      startedRef.current = true;
      startRef.current = performance.now() - STAGE_START[fromStage];

      const frame = (now: number) => {
        const t = (now - startRef.current) % LOOP;
        const { stage: nextStage, progress, opacity } = timeline(t);
        paint(progress, opacity, nextStage);
        rafRef.current = requestAnimationFrame(frame);
      };

      rafRef.current = requestAnimationFrame(frame);
    },
    [paint, stop],
  );

  useEffect(() => {
    if (reduceMotion) {
      stop();
      paint(1, 1, 3, false);
      return;
    }

    const element = sectionRef.current;
    if (!element) return;

    const desktopQuery = window.matchMedia("(min-width: 768px)");

    function onScroll() {
      if (!visibleRef.current || startedRef.current || !desktopQuery.matches) {
        return;
      }

      const rect = element!.getBoundingClientRect();
      const vh = window.innerHeight;
      const ratio = Math.min(
        1,
        Math.max(0, (0.8 * vh - rect.top) / (0.3 * vh)),
      );

      if (ratio >= 1) {
        start(0);
      } else {
        paint(ratio / 3, 1, 0);
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.4;
        visibleRef.current = visible;

        if (!visible) {
          stop();
          startedRef.current = false;
          stageRef.current = 0;
          setStage(0);
          paint(0, 1, 0);
          return;
        }

        if (!document.hidden) {
          if (!desktopQuery.matches) {
            start(0);
          } else {
            onScroll();
          }
        }
      },
      { threshold: [0, 0.4, 1] },
    );

    observer.observe(element);
    window.addEventListener("scroll", onScroll, { passive: true });

    function onVisibilityChange() {
      if (document.hidden) {
        stop();
        startedRef.current = false;
      } else if (visibleRef.current) {
        start(0);
      }
    }

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      stop();
    };
  }, [reduceMotion, paint, start, stop]);

  const displayStage = reduceMotion ? 3 : stage;
  const activeStep = displayStage < 3 ? displayStage : -1;
  const current = STAGES[displayStage];
  const HubIcon = current.icon;

  function jumpToStep(step: number) {
    if (reduceMotion) return;
    if (!startedRef.current || !visibleRef.current) {
      startedRef.current = true;
    }
    start(step);
  }

  return (
    <section ref={sectionRef} className="py-15 md:py-20 lg:py-25">
      <div className="relative overflow-hidden bg-secondary py-14 text-secondary-foreground sm:py-16 lg:py-24">
        <div
          className="dot-grid pointer-events-none absolute inset-0 text-secondary-foreground opacity-10 dark:text-foreground"
          aria-hidden="true"
        />

        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 md:grid-cols-9 lg:grid-cols-2 lg:gap-16">
            <div className="relative mx-auto w-full max-w-80 md:col-span-4 lg:col-span-1 lg:max-w-130">
              <div
                className="absolute top-1/2 left-1/2 size-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
                aria-hidden="true"
              />

              <div
                className="relative aspect-square w-full"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 300 300"
                  className="absolute inset-0 size-full"
                  fill="none"
                >
                  <circle
                    cx="150"
                    cy="150"
                    r={RADIUS}
                    className="stroke-primary-foreground/20 dark:stroke-foreground/20"
                    strokeWidth="1"
                    strokeDasharray="4 6"
                  />

                  <circle
                    ref={arcRef}
                    cx="150"
                    cy="150"
                    r={RADIUS}
                    className="stroke-highlight"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={RING_LENGTH}
                    strokeDashoffset={RING_LENGTH}
                    transform="rotate(-90 150 150)"
                  />

                  <g ref={headRef} transform="translate(150 35)">
                    <circle r="13" className="fill-highlight" opacity="0.25" />
                    <circle r="6" className="fill-highlight" />
                  </g>
                </svg>

                <div
                  className={cn(
                    "absolute inset-0",
                    reduceMotion ? "" : "animate-[spin_18s_linear_infinite]",
                  )}
                >
                  {current.orbit.map((OrbitIcon, index) => {
                    const angle = index * 120;
                    const rad = (angle * Math.PI) / 180;

                    return (
                      <div
                        key={`${displayStage}-${index}`}
                        className="absolute -translate-x-1/2 -translate-y-1/2"
                        style={{
                          left: `${(50 + 26 * Math.cos(rad)).toFixed(3)}%`,
                          top: `${(50 + 26 * Math.sin(rad)).toFixed(3)}%`,
                        }}
                      >
                        <div
                          className={cn(
                            "flex size-9 items-center justify-center rounded-full border border-border bg-background text-primary lg:size-10",
                            reduceMotion
                              ? ""
                              : "animate-[spin_18s_linear_infinite_reverse]",
                          )}
                        >
                          <OrbitIcon className="size-4 lg:size-4.5" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {HEAD_ANGLES.map((angle, index) => {
                  const rad = (angle * Math.PI) / 180;
                  const x = 50 + (RADIUS / 3) * Math.cos(rad);
                  const y = 50 + (RADIUS / 3) * Math.sin(rad);
                  const isDone = displayStage === 3 || displayStage > index;
                  const isActive =
                    displayStage === index && displayStage < 3;

                  return (
                    <div
                      key={angle}
                      className="absolute -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${x.toFixed(3)}%`, top: `${y.toFixed(3)}%` }}
                    >
                      <div
                        className={cn(
                          "relative flex size-10 items-center justify-center rounded-full border text-sm font-semibold transition-colors duration-300 lg:size-12",
                          isDone
                            ? "border-highlight bg-highlight text-highlight-foreground"
                            : isActive
                              ? "animate-pulse border-highlight bg-highlight/25 text-foreground shadow-[0_0_0_4px_var(--highlight)]"
                              : "border-border bg-background/80 text-secondary-foreground/70",
                        )}
                      >
                        {isDone ? <Check className="size-4 lg:size-5" /> : index + 1}
                      </div>

                      <span
                        className={cn(
                          "absolute left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap text-secondary-foreground/70 lg:text-xs dark:text-foreground/70",
                          index === 0 ? "-top-6" : "-bottom-6",
                        )}
                      >
                        {["Requirements", "Blueprint", "Build"][index]}
                      </span>
                    </div>
                  );
                })}

                <div className="absolute top-1/2 left-1/2 flex aspect-square w-2/5 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1 rounded-full border border-border bg-background/70 text-center">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={displayStage}
                      className="flex flex-col items-center gap-1"
                      initial={
                        reduceMotion ? false : { opacity: 0, scale: 0.85 }
                      }
                      animate={{ opacity: 1, scale: 1 }}
                      exit={
                        reduceMotion
                          ? undefined
                          : { opacity: 0, scale: 0.85 }
                      }
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      <HubIcon className="size-8 text-highlight lg:size-10" />
                      <p className="text-sm font-semibold lg:text-base">{current.name}</p>
                      <span className="rounded-full bg-background/70 px-2 py-0.5 text-[10px] text-secondary-foreground/80 lg:text-xs">
                        {current.time}
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 lg:col-span-1">
              <div>
                <Eyebrow>How it works</Eyebrow>

                <h2 className="mt-5 font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] sm:text-[2.75rem]">
                  From messy to managed in three steps
                </h2>

                <p className="mt-4 max-w-xl text-lg text-secondary-foreground/70 dark:text-foreground/70">
                  No open-ended projects. You know the scope, price and timeline
                  before a single line of code is written, and you don&apos;t
                  pay anything to find out.
                </p>
              </div>

              <ul className="mt-6 space-y-2">
                {STEPS.map((step, index) => {
                  const isActive = activeStep === index;
                  const isDone = displayStage === 3 || displayStage > index;

                  return (
                    <li key={step.title}>
                      <button
                        type="button"
                        onClick={() => jumpToStep(index)}
                        aria-current={isActive ? "step" : undefined}
                        className={cn(
                          "relative flex w-full gap-3 overflow-hidden rounded-lg px-3 py-3 text-left transition-all duration-300 focus-visible:ring-2 focus-visible:ring-highlight focus-visible:outline-none",
                          isActive && "bg-primary/10 opacity-100",
                          !isActive && isDone && "opacity-85",
                          !isActive && !isDone && "opacity-55",
                        )}
                      >
                        <span
                          className={cn(
                            "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors duration-300",
                            isDone || isActive
                              ? "border-highlight bg-highlight text-highlight-foreground"
                              : "border-border text-secondary-foreground/70 dark:border-border dark:text-foreground/70",
                          )}
                        >
                          {isDone ? <Check className="size-3.5" /> : index + 1}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-base font-semibold">
                            {index + 1}. {step.title}
                          </span>
                          <span className="mt-1 block text-sm text-secondary-foreground/70 lg:text-base dark:text-foreground/70">
                            {step.body}
                          </span>
                        </span>

                        {isActive ? (
                          <span
                            key={displayStage}
                            className="point-fill absolute inset-x-0 bottom-0 h-0.5 origin-left bg-primary"
                            style={{ animationDuration: "3000ms" }}
                          />
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <ButtonLink href="/start">Start a project</ButtonLink>

                <span className="flex items-center gap-1.5 text-sm text-secondary-foreground/70 dark:text-foreground/70">
                  <Check className="size-3.5 text-highlight" />
                  Free Blueprint · Fixed price
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
