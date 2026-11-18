"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { LayoutGroup, motion } from "motion/react";
import { hiwDemo, hiwHero } from "@/content/how-it-works";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const MOVER = "Reports — first pass";

function TaskRow({
  text,
  done,
  layoutId,
}: {
  text: string;
  done?: boolean;
  layoutId?: string;
}) {
  const inner = (
    <>
      <span
        aria-hidden="true"
        className={cn(
          "mt-0.5 flex size-3 shrink-0 items-center justify-center rounded-full",
          done
            ? "bg-success text-success-foreground"
            : "border border-muted-foreground/40",
        )}
      >
        {done ? <Check className="size-2" aria-hidden="true" /> : null}
      </span>
      <span className="leading-tight">{text}</span>
    </>
  );

  const className =
    "flex items-start gap-1.5 rounded-sm border border-border bg-card px-2 py-1.5 text-[10px] text-foreground";

  if (layoutId) {
    return (
      <motion.div layoutId={layoutId} className={className}>
        {inner}
      </motion.div>
    );
  }

  return <div className={className}>{inner}</div>;
}

/**
 * The hero item: a task that moves from In progress into Completed and a
 * weekly board that keeps ticking.
 */
function MiniBoard({ alive }: { alive: boolean }) {
  const [moved, setMoved] = useState(false);

  useEffect(() => {
    if (!alive) return;
    const timer = window.setInterval(() => setMoved((value) => !value), 3600);
    return () => window.clearInterval(timer);
  }, [alive]);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-md">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-success motion-safe:animate-[who-blink_1800ms_ease-in-out_infinite]" />
          <p className="text-xs font-semibold text-foreground">
            Your weekly board
          </p>
        </div>
        <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
          {hiwDemo.board.week}
        </span>
      </div>

      <LayoutGroup>
        <div className="grid grid-cols-2 gap-3 p-4">
          <div className="rounded-md bg-muted/60 p-2.5">
            <p className="flex items-center justify-between text-[10px] font-medium text-muted-foreground">
              In progress
              <span className="font-mono">{moved ? 1 : 2}</span>
            </p>
            <div className="mt-2 flex flex-col gap-1.5">
              <TaskRow text="Invoices — testing" />
              {!moved && alive ? (
                <TaskRow text={MOVER} layoutId="hiw-mover" />
              ) : null}
              {!moved && !alive ? <TaskRow text={MOVER} /> : null}
            </div>
          </div>

          <div className="rounded-md bg-muted/60 p-2.5">
            <p className="flex items-center justify-between text-[10px] font-medium text-muted-foreground">
              Completed
              <span className="font-mono">{moved ? 4 : 3}</span>
            </p>
            <div className="mt-2 flex flex-col gap-1.5">
              {hiwDemo.board.columns[1].tasks.map((task) => (
                <TaskRow key={task} text={task} done />
              ))}
              {moved && alive ? (
                <TaskRow text={MOVER} done layoutId="hiw-mover" />
              ) : null}
            </div>
          </div>
        </div>
      </LayoutGroup>

      <p className="border-t border-border px-4 py-2 text-[10px] text-muted-foreground">
        Tasks turn green as we finish them. Sample data.
      </p>
    </div>
  );
}

export function HowItWorksHero() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.15 });
  const alive = inView && !reduceMotion;

  return (
    <section className="relative">
      <div className="mx-auto w-full max-w-7xl px-4 pt-16 pb-16 sm:px-6 md:pt-20 md:pb-20 lg:px-8 lg:pt-24 lg:pb-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-7">
            <Eyebrow>{hiwHero.eyebrow}</Eyebrow>
            <h1 className="mt-6 font-heading text-[clamp(2.375rem,4.6vw,4.25rem)] leading-[0.98] font-bold tracking-[-0.04em] text-balance">
              {hiwHero.title}
            </h1>
            <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
              {hiwHero.subhead}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href={hiwHero.primary.href}>
                {hiwHero.primary.label}
              </ButtonLink>
              <ButtonLink href={hiwHero.secondary.href} variant="outline">
                {hiwHero.secondary.label}
              </ButtonLink>
            </div>
          </div>

          <div ref={ref} className="lg:col-span-5">
            <MiniBoard alive={alive} />
          </div>
        </div>
      </div>
    </section>
  );
}
