"use client";

import { motion } from "motion/react";
import { CalendarDays, FileText } from "lucide-react";
import { doors, doorsIntro } from "@/content/start";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Section } from "@/components/shared/Section";
import { MagicCard } from "@/components/ui/magic-card";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/** Two doors side by side: the Blueprint form or a 30-minute call. */
export function TwoDoors() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.2 });
  const alive = inView && !reduceMotion;

  return (
    <Section className="bg-primary text-primary-foreground dark:bg-secondary dark:text-foreground">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-16">
        <div className="lg:col-span-7">
          <h2 className="font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem]">
            {doorsIntro.title}
          </h2>
        </div>
        <p className="max-w-xl text-base text-primary-foreground/80 dark:text-foreground/80 lg:col-span-5">
          {doorsIntro.body}
        </p>
      </div>

      <div ref={ref} className="mt-10 grid gap-4 md:grid-cols-2 lg:gap-6">
        {doors.map((door) => (
          <MagicCard
            key={door.id}
            className="rounded-lg border border-border bg-card text-foreground"
            gradientFrom="var(--primary)"
            gradientTo="var(--success)"
            gradientOpacity={0.1}
          >
            <div className="flex h-full flex-col p-6 lg:p-8">
              <div className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  {door.id === "blueprint" ? (
                    <FileText className="size-5" aria-hidden="true" />
                  ) : (
                    <CalendarDays className="size-5" aria-hidden="true" />
                  )}
                </span>
                <span className="rounded-full bg-secondary px-2.5 py-1 font-mono text-[10px] text-muted-foreground">
                  {door.meta}
                </span>
              </div>

              <h2 className="mt-5 text-lg font-semibold">{door.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{door.body}</p>

              <div className="mt-6 h-40 overflow-hidden rounded-md border border-border bg-background">
                {door.id === "blueprint" ? (
                  <BlueprintPreview alive={alive} />
                ) : (
                  <CalendarPreview alive={alive} />
                )}
              </div>

              <div className="mt-auto pt-6">
                <ButtonLink href={door.cta.href} variant="outline">
                  {door.cta.label}
                </ButtonLink>
              </div>
            </div>
          </MagicCard>
        ))}
      </div>
    </Section>
  );
}

function BlueprintPreview({ alive }: { alive: boolean }) {
  return (
    <div className="relative p-3">
      <motion.span
        aria-hidden="true"
        className="absolute inset-x-3 h-5 rounded-sm bg-primary/10"
        animate={alive ? { y: [0, 24, 48, 72] } : undefined}
        transition={{
          duration: 5.6,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.33, 0.66, 1],
        }}
      />
      <div className="relative space-y-1.5">
        {["Milestones", "Timeline and tasks", "Fixed price", "Payment schedule"].map(
          (line, index) => (
            <div
              key={line}
              className="flex items-center justify-between rounded-sm border border-border px-2 py-1.5 text-[10px]"
            >
              <span>{line}</span>
              <span className="font-mono text-muted-foreground">
                {index === 2 ? "$16,000" : `0${index + 1}`}
              </span>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function CalendarPreview({ alive }: { alive: boolean }) {
  return (
    <div className="p-3">
      <div className="grid grid-cols-5 gap-1.5">
        {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, index) => (
          <div
            key={day}
            className="rounded-sm border border-border px-1 py-1.5 text-center"
          >
            <p className="text-[9px] text-muted-foreground">{day}</p>
            <motion.span
              className={`mx-auto mt-1 block size-4 rounded-full ${
                index === 2 ? "bg-primary" : "bg-secondary"
              }`}
              animate={
                alive && index === 2 ? { scale: [1, 1.15, 1] } : undefined
              }
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        ))}
      </div>
      <div className="mt-3 space-y-1.5">
        {[
          ["Wed", "10:00 am"],
          ["Thu", "2:30 pm"],
        ].map(([day, time]) => (
          <div
            key={day}
            className="flex items-center justify-between rounded-sm border border-border px-2 py-1.5 text-[10px]"
          >
            <span>
              {day} · 30 min
            </span>
            <span className="font-mono text-muted-foreground">{time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
