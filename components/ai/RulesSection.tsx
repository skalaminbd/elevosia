"use client";

import { motion } from "motion/react";
import { BadgeCheck, Gauge, Lock, Target } from "lucide-react";
import { aiRules } from "@/content/ai-automation";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Section } from "@/components/shared/Section";
import { MagicCard } from "@/components/ui/magic-card";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const ICONS = {
  job: Target,
  approve: BadgeCheck,
  measure: Gauge,
  data: Lock,
} as const;

/** Four rules as a 2×2 Magic Card grid, one tiny live icon in each. */
export function RulesSection() {
  const reduceMotion = useReducedMotion();

  return (
    <Section>
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-16">
        <div className="lg:col-span-7">
          <Eyebrow>How we build it</Eyebrow>
          <h2 className="mt-4 font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem]">
            {aiRules.title}
          </h2>
        </div>
        <p className="max-w-xl text-base text-muted-foreground sm:text-lg lg:col-span-5">
          {aiRules.intro}
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:gap-6">
        {aiRules.rules.map((rule) => {
          const Icon = ICONS[rule.id as keyof typeof ICONS];
          return (
            <MagicCard
              key={rule.id}
              className="rounded-lg border border-border bg-card"
              gradientFrom="var(--primary)"
              gradientTo="var(--success)"
              gradientOpacity={0.12}
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <span className="relative flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                    <LiveGlyph id={rule.id} reduceMotion={reduceMotion} />
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {rule.number}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold">{rule.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {rule.body}
                </p>
              </div>
            </MagicCard>
          );
        })}
      </div>
    </Section>
  );
}

function LiveGlyph({ id, reduceMotion }: { id: string; reduceMotion: boolean }) {
  if (reduceMotion) return null;

  if (id === "job") {
    return (
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute size-10 rounded-full border border-primary/50"
        animate={{ scale: [1, 1.5], opacity: [0.7, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
      />
    );
  }

  if (id === "approve") {
    return (
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute size-10 rounded-md bg-success/15"
        animate={{ opacity: [0, 0, 0.9, 0], scale: [1, 1, 1.15, 1.3] }}
        transition={{
          duration: 3.6,
          repeat: Infinity,
          times: [0, 0.55, 0.8, 1],
        }}
      />
    );
  }

  if (id === "measure") {
    return (
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-end justify-center pb-1"
        animate={{ rotate: [-10, 10, -10] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "50% 80%" }}
      >
        <span className="h-2 w-px bg-primary" />
      </motion.span>
    );
  }

  return (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute -right-1.5 -top-1.5 size-2.5 rounded-full bg-success"
      animate={{ opacity: [0.35, 1, 0.35] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
