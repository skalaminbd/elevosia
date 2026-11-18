"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import {Check,
  CircleCheck,
  Eye,
  Folder,
  Lock,
  MessageSquare,
  MousePointer2,
  Palette} from "lucide-react";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { cn } from "@/lib/utils";

const POINTS = [
  {
    label: "See every task the moment it starts",
    icon: Eye,
    duration: 3800,
  },
  {
    label: "Approve designs and milestones with one click",
    icon: CircleCheck,
    duration: 2800,
  },
  {
    label: "Message your project manager in the same place",
    icon: MessageSquare,
    duration: 2600,
  },
  {
    label: "Every file, invoice and contract in one spot",
    icon: Folder,
    duration: 4200,
  },
];

const WEEKS = [
  { label: "Week 1", done: true },
  { label: "Week 2", done: true },
  { label: "Week 3", active: true },
  { label: "Week 4", muted: true },
] as const;

type MockState = {
  loginProgress: number;
  paymentProgress: number;
  loginFilling: boolean;
  paymentFilling: boolean;
  loginDone: boolean;
  paymentDone: boolean;
  ring: number;
  approved: boolean;
  ripple: number;
  typing: boolean;
  message: string | null;
  week3Done: boolean;
  activePoint: number;
  activeDuration: number;
  cursorVisible: boolean;
  cursor: { x: number; y: number };
  toast: { id: number; text: string } | null;
};

const INITIAL: MockState = {
  loginProgress: 25,
  paymentProgress: 5,
  loginFilling: false,
  paymentFilling: false,
  loginDone: false,
  paymentDone: false,
  ring: 33,
  approved: false,
  ripple: 0,
  typing: false,
  message: null,
  week3Done: false,
  activePoint: -1,
  activeDuration: 2800,
  cursorVisible: false,
  cursor: { x: 0, y: 0 },
  toast: null,
};

const STATIC: MockState = {
  ...INITIAL,
  loginProgress: 100,
  loginDone: true,
  paymentProgress: 60,
  ring: 67,
  approved: true,
  message: "Thanks, Megan! Payment setup wraps up today.",
  activePoint: -2,
};

export function ProgressSection() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const approveRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<MockState>(INITIAL);

  const runRef = useRef(0);
  const timersRef = useRef<number[]>([]);
  const toastIdRef = useRef(0);
  const intersectingRef = useRef(false);

  const stopTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const stop = useCallback(() => {
    runRef.current += 1;
    stopTimers();
  }, [stopTimers]);

  const reset = useCallback(() => {
    setState(INITIAL);
  }, []);

  const measureCursor = useCallback(() => {
    const area = mainRef.current?.getBoundingClientRect();
    const button = approveRef.current?.getBoundingClientRect();
    if (!area || !button) return { x: 0, y: 0 };

    return {
      x: button.left - area.left + button.width / 2,
      y: button.top - area.top + button.height / 2,
    };
  }, []);

  const showToast = useCallback(
    (text: string) => {
      toastIdRef.current += 1;
      const id = toastIdRef.current;
      setState((prev) => ({ ...prev, toast: { id, text } }));

      const hideId = window.setTimeout(() => {
        setState((prev) =>
          prev.toast?.id === id ? { ...prev, toast: null } : prev,
        );
      }, 1700);
      timersRef.current.push(hideId);
    },
    [],
  );

  const run = useCallback(async () => {
    const runId = runRef.current + 1;
    runRef.current = runId;

    const alive = () => runRef.current === runId;

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = window.setTimeout(resolve, ms);
        timersRef.current.push(id);
      });

    while (alive()) {
    setState(INITIAL);

    await wait(900);
    if (!alive()) return;

    setState((prev) => ({
      ...prev,
      loginFilling: true,
      loginProgress: 100,
      activePoint: 0,
      activeDuration: POINTS[0].duration,
    }));
    await wait(2600);
    if (!alive()) return;

    setState((prev) => ({
      ...prev,
      loginDone: true,
      loginFilling: false,
      ring: 67,
    }));
    showToast("Client portal login is done");
    await wait(1200);
    if (!alive()) return;

    setState((prev) => ({
      ...prev,
      activePoint: 1,
      activeDuration: POINTS[1].duration,
      cursorVisible: true,
      cursor: measureCursor(),
    }));
    await wait(900);
    if (!alive()) return;

    setState((prev) => ({
      ...prev,
      approved: true,
      ripple: prev.ripple + 1,
    }));
    showToast("Design approved");
    await wait(700);
    if (!alive()) return;

    setState((prev) => ({ ...prev, cursorVisible: false }));
    await wait(200);
    if (!alive()) return;

    setState((prev) => ({
      ...prev,
      activePoint: 2,
      activeDuration: POINTS[2].duration,
      typing: true,
    }));
    await wait(1500);
    if (!alive()) return;

    setState((prev) => ({
      ...prev,
      typing: false,
      message: "Thanks, Megan! Payment setup wraps up today.",
    }));
    await wait(900);
    if (!alive()) return;

    setState((prev) => ({ ...prev, paymentFilling: true, paymentProgress: 100 }));
    await wait(2600);
    if (!alive()) return;

    setState((prev) => ({
      ...prev,
      paymentDone: true,
      paymentFilling: false,
      ring: 100,
    }));
    await wait(400);
    if (!alive()) return;

    setState((prev) => ({ ...prev, week3Done: true }));
    showToast("Week 3 complete");
    await wait(1200);
    if (!alive()) return;

    setState((prev) => ({
      ...prev,
      activePoint: 3,
      activeDuration: POINTS[3].duration,
    }));
    showToast("Week-3-report.pdf added");
    await wait(3200);
    }
  }, [measureCursor, showToast]);

  useEffect(() => {
    if (reduceMotion) {
      stop();
      return;
    }

    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.4;
        intersectingRef.current = visible;

        if (visible && !document.hidden) {
          stop();
          void run();
        } else if (!visible) {
          stop();
          reset();
        }
      },
      { threshold: [0, 0.4, 1] },
    );

    observer.observe(element);

    function onVisibilityChange() {
      if (document.hidden) {
        stop();
        reset();
      } else if (intersectingRef.current) {
        stop();
        void run();
      }
    }

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      stop();
    };
  }, [reduceMotion, run, stop, reset]);

  const view = reduceMotion ? STATIC : state;

  const isPointActive = (index: number) =>
    view.activePoint === -2 || view.activePoint === index;

  const ringOffset = 100.5 - (view.ring / 100) * 100.5;

  return (
    <section ref={sectionRef} className="py-15 md:py-20 lg:py-25">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex w-full flex-col items-center text-center">
          <Eyebrow>No more &quot;how&apos;s it going?&quot; emails</Eyebrow>

          <h2 className="mt-5 font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] sm:text-[2.75rem]">
            Watch your dashboard get built, week by week.
          </h2>

          <p className="mt-4 max-w-140 text-base text-muted-foreground">
            The moment your project starts, you get your own client portal.
            Every week has its own board. When we start a task, you see In
            progress. When it&apos;s done, it turns green. No chasing, no
            guessing, no waiting for a status call.
          </p>

          <div
            aria-hidden="true"
            className="relative mt-8 w-full select-none overflow-hidden rounded-lg border border-border bg-card text-left shadow-sm"
          >
            <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-3 py-2">
              <span className="size-2 rounded-full bg-border" />
              <span className="size-2 rounded-full bg-border" />
              <span className="size-2 rounded-full bg-border" />
              <span className="mx-auto flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-sm text-muted-foreground">
                <Lock className="size-3.5" />
                portal.elevosia.com/your-project
              </span>
            </div>

            <div className="flex">
              <aside className="hidden w-32 shrink-0 border-r border-border p-3 md:block lg:w-40">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Weeks
                </p>
                <ul className="mt-2 space-y-1">
                  {WEEKS.map((week, index) => (
                    <WeekRow
                      key={week.label}
                      label={week.label}
                      done={index < 2 || (index === 2 && view.week3Done)}
                      active={index === 2 && !view.week3Done}
                      muted={"muted" in week && week.muted}
                    />
                  ))}
                </ul>
              </aside>

              <div ref={mainRef} className="relative min-w-0 flex-1 p-3 sm:p-4">
                <div className="mb-3 flex gap-1.5 md:hidden">
                  {WEEKS.map((week, index) => (
                    <span
                      key={week.label}
                      className={cn(
                        "flex flex-1 items-center justify-center gap-1 border-b-2 px-1 pb-1 text-xs",
                        index === 2
                          ? "border-success font-medium text-foreground"
                          : "border-transparent text-muted-foreground",
                      )}
                    >
                      {index < 2 || (index === 2 && view.week3Done) ? (
                        <Check className="size-3 text-success" />
                      ) : null}
                      {week.label}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ProgressRing offset={ringOffset} />
                    <div>
                      <p className="text-xs font-semibold">This week</p>
                      <p className="text-xs text-muted-foreground">
                        {view.ring}% done · Nov 16 to 20
                      </p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="size-1.5 animate-pulse rounded-full bg-success" />
                    Live
                  </span>
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <div className="min-h-40">
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span className="size-1.5 rounded-full bg-warning" />
                      In progress
                    </p>
                    <div className="mt-2 space-y-2">
                      <AnimatePresence initial={false}>
                        {!view.loginDone ? (
                          <TaskCard
                            key="login"
                            name="Client portal login"
                            progress={view.loginProgress}
                            filling={view.loginFilling}
                          />
                        ) : null}
                        {!view.paymentDone ? (
                          <TaskCard
                            key="payment"
                            name="Payment setup"
                            progress={view.paymentProgress}
                            filling={view.paymentFilling}
                          />
                        ) : null}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="min-h-40">
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span className="size-1.5 rounded-full bg-success" />
                      Done
                    </p>
                    <div className="mt-2 space-y-2">
                      <DoneCard name="Booking form" />
                      <AnimatePresence initial={false}>
                        {view.loginDone ? (
                          <DoneCard key="login-done" name="Client portal login" />
                        ) : null}
                        {view.paymentDone ? (
                          <DoneCard key="payment-done" name="Payment setup" />
                        ) : null}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  <div className="relative rounded-lg border border-border bg-background p-2.5">
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Palette className="size-3" />
                      Needs your approval
                    </p>
                    <div className="mt-1.5 flex items-center justify-between gap-2">
                      <p className="truncate text-xs">Booking form design</p>
                      <div ref={approveRef} className="relative">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium",
                            view.approved
                              ? "bg-success text-success-foreground"
                              : "bg-primary text-primary-foreground",
                          )}
                        >
                          {view.approved ? "Approved" : "Approve"}
                        </span>
                        <AnimatePresence>
                          {view.ripple > 0 ? (
                            <motion.span
                              key={view.ripple}
                              className="pointer-events-none absolute top-1/2 left-1/2 size-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background"
                              initial={{ scale: 0, opacity: 0.6 }}
                              animate={{ scale: 2.4, opacity: 0 }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                            />
                          ) : null}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border bg-background p-2.5">
                    <p className="text-xs text-muted-foreground">Messages</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-info/15 text-xs font-medium text-info">
                        RB
                      </span>
                      {view.typing ? (
                        <span className="flex items-center gap-1">
                          {[0, 150, 300].map((delay) => (
                            <span
                              key={delay}
                              className="size-1 animate-bounce rounded-full bg-muted-foreground"
                              style={{ animationDelay: `${delay}ms` }}
                            />
                          ))}
                        </span>
                      ) : (
                        <AnimatePresence mode="wait">
                          <motion.p
                            key={view.message ?? "empty"}
                            className={cn(
                              "truncate text-sm",
                              view.message
                                ? "text-foreground"
                                : "text-muted-foreground",
                            )}
                            initial={
                              view.message
                                ? { opacity: 0, y: 6 }
                                : false
                            }
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                          >
                            {view.message ?? "No new messages"}
                          </motion.p>
                        </AnimatePresence>
                      )}
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {view.toast ? (
                    <motion.div
                      key={view.toast.id}
                      className="absolute top-2 right-2 z-20 flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs shadow-sm"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                      <CircleCheck className="size-4 text-success" />
                      {view.toast.text}
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <motion.div
                  className="pointer-events-none absolute z-30"
                  animate={{
                    x: view.cursor.x,
                    y: view.cursor.y,
                    opacity: view.cursorVisible ? 1 : 0,
                  }}
                  transition={{ duration: 0.9, ease: "easeInOut" }}
                >
                  <MousePointer2 className="size-4 fill-foreground text-background" />
                </motion.div>
              </div>
            </div>
          </div>

          <ul className="mt-8 grid w-full grid-cols-2 gap-3 md:grid-cols-4">
            {POINTS.map(({ label, icon: Icon }, index) => {
              const active = isPointActive(index);

              return (
                <li
                  key={label}
                  className={cn(
                    "relative flex flex-col items-center gap-3 overflow-hidden rounded-lg border px-3 py-5 text-center shadow-sm transition-colors duration-300",
                    active
                      ? "border-success/40 bg-success/10"
                      : "border-border bg-card",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-10 items-center justify-center rounded-full transition-colors duration-300",
                      active
                        ? "bg-success/15 text-success"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span
                    className={cn(
                      "text-sm transition-colors duration-300",
                      active
                        ? "font-medium text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {label}
                  </span>
                  {active && view.activePoint >= 0 ? (
                    <span
                      key={view.activePoint}
                      className="point-fill absolute inset-x-0 bottom-0 h-0.5 origin-left bg-success"
                      style={{ animationDuration: `${view.activeDuration}ms` }}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>

          <ButtonLink href="/demo" className="mt-8">
            See how it works
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

function ProgressRing({ offset }: { offset: number }) {
  return (
    <svg viewBox="0 0 40 40" className="size-12 shrink-0" aria-hidden="true">
      <circle
        cx="20"
        cy="20"
        r="16"
        fill="none"
        strokeWidth="4"
        className="stroke-muted"
      />
      <circle
        cx="20"
        cy="20"
        r="16"
        fill="none"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="100.5"
        transform="rotate(-90 20 20)"
        className="stroke-success"
        style={{
          strokeDashoffset: offset,
          transition: "stroke-dashoffset 0.6s ease",
        }}
      />
    </svg>
  );
}

function WeekRow({
  label,
  done,
  active,
  muted,
}: {
  label: string;
  done: boolean;
  active: boolean;
  muted?: boolean;
}) {
  return (
    <li
      className={cn(
        "flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm",
        active && "bg-success/10",
        muted && "text-muted-foreground",
      )}
    >
      {done ? (
        <motion.span
          className="flex size-5 shrink-0 items-center justify-center rounded-full bg-success text-success-foreground"
          initial={{ scale: 0.3 }}
          animate={{ scale: [0.3, 1.25, 1] }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <Check className="size-3" />
        </motion.span>
      ) : active ? (
        <span className="flex size-4 shrink-0 items-center justify-center">
          <span className="size-3 animate-pulse rounded-full border-2 border-success" />
        </span>
      ) : (
        <span className="flex size-4 shrink-0 items-center justify-center">
          <span className="size-3 rounded-full border border-dashed border-muted-foreground/50" />
        </span>
      )}
      {label}
    </li>
  );
}

function TaskCard({
  name,
  progress,
  filling,
}: {
  name: string;
  progress: number;
  filling: boolean;
}) {
  return (
    <motion.div
      layout
      className="relative overflow-hidden rounded-lg border border-border bg-background px-2.5 py-2"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex items-center gap-1.5">
        <span className="size-3 shrink-0 animate-spin rounded-full border-2 border-warning border-t-transparent" />
        <p className="min-w-0 flex-1 truncate text-sm">{name}</p>
        <span className="shrink-0 rounded-full bg-warning/15 px-1.5 py-0.5 text-[10px] text-warning">
          In progress
        </span>
      </div>
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 h-0.5 bg-warning",
          filling ? "transition-[width] duration-[2600ms] ease-linear" : "",
        )}
        style={{ width: `${progress}%` }}
      />
    </motion.div>
  );
}

function DoneCard({ name }: { name: string }) {
  return (
    <motion.div
      layout
      className="flex items-center gap-1.5 rounded-lg border border-success/30 bg-success/10 px-2.5 py-2"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <motion.span
        className="flex size-3.5 shrink-0 items-center justify-center rounded-full bg-success text-success-foreground"
        initial={{ scale: 0.3 }}
        animate={{ scale: [0.3, 1.25, 1] }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <Check className="size-3" />
      </motion.span>
      <p className="min-w-0 flex-1 truncate text-sm">{name}</p>
    </motion.div>
  );
}
