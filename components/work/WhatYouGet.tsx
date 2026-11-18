"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { whatYouGet } from "@/content/work";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Section } from "@/components/shared/Section";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Three cards, each with a small browser mock whose content drifts on a loop,
 * like a slow auto-scroll.
 */
export function WhatYouGet() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.15 });
  const alive = inView && !reduceMotion;

  return (
    <Section>
      <div className="max-w-2xl">
        <h2 className="font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem]">
          {whatYouGet.title}
        </h2>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          {whatYouGet.intro}
        </p>
      </div>

      <div ref={ref} className="mt-10 grid gap-4 md:grid-cols-3 lg:gap-6">
        {whatYouGet.cards.map((card, index) => (
          <div
            key={card.id}
            className="flex flex-col rounded-lg border border-border bg-card p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold">{card.title}</h3>
              <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                {card.meta}
              </span>
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">{card.body}</p>

            <div className="mt-5 flex h-[136px] overflow-hidden rounded-md border border-border bg-background">
              <motion.div
                className="flex w-full flex-col gap-2 p-3"
                animate={
                  alive ? { y: [0, -14, 0] } : undefined
                }
                transition={{
                  duration: 7 + index,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.4,
                }}
              >
                <Mock id={card.id} />
                <Mock id={card.id} />
              </motion.div>
            </div>

            <div className="mt-auto pt-5">
              <ButtonLink href={card.cta.href} variant="outline" size="sm">
                {card.cta.label}
              </ButtonLink>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Mock({ id }: { id: string }) {
  if (id === "dashboard") {
    return (
      <>
        <div className="grid grid-cols-2 gap-2">
          {[
            ["Jobs", "148"],
            ["Revenue", "$32.4k"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-sm bg-secondary/70 px-2 py-1.5">
              <p className="text-[9px] text-muted-foreground">{label}</p>
              <p className="font-mono text-xs font-semibold">{value}</p>
            </div>
          ))}
        </div>
        <div className="flex h-10 items-end gap-1 rounded-sm border border-border px-2 pb-1.5">
          {[40, 65, 50, 80, 60, 90, 72].map((height, i) => (
            <span
              key={i}
              className="flex-1 rounded-t-[2px] bg-primary/70"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        <div className="flex items-center justify-between rounded-sm border border-border px-2 py-1.5 text-[10px]">
          <span className="text-muted-foreground">Open quote</span>
          <span className="font-mono">#1042</span>
        </div>
      </>
    );
  }

  if (id === "blueprint") {
    return (
      <>
        <div className="flex items-center justify-between rounded-sm border border-border px-2 py-1.5 text-[10px]">
          <span className="font-medium">Week 1 · Discovery</span>
          <Check className="size-3 text-success" aria-hidden="true" />
        </div>
        <div className="flex items-center justify-between rounded-sm border border-border px-2 py-1.5 text-[10px]">
          <span className="font-medium">Week 2 · Build</span>
          <span className="font-mono text-muted-foreground">4/6</span>
        </div>
        <div className="rounded-sm border border-border px-2 py-1.5">
          <p className="text-[9px] text-muted-foreground">Fixed price</p>
          <p className="font-mono text-xs font-semibold">$16,000</p>
        </div>
        <div className="flex items-center justify-between rounded-sm border border-border px-2 py-1.5 text-[10px]">
          <span className="font-medium">Week 3 · Review</span>
          <span className="font-mono text-muted-foreground">—</span>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between rounded-sm border border-border px-2 py-1.5 text-[10px]">
        <span className="font-medium">This week</span>
        <span className="font-mono text-muted-foreground">1/3</span>
      </div>
      {["Client portal layout", "Quote → invoice flow", "Scheduling rules"].map(
        (task, i) => (
          <div
            key={task}
            className="flex items-center justify-between gap-2 rounded-sm border border-border px-2 py-1.5 text-[10px]"
          >
            <span className="truncate">{task}</span>
            <span
              className={`flex size-3 shrink-0 items-center justify-center rounded-full ${
                i === 0 ? "bg-success text-success-foreground" : "border border-muted-foreground/40"
              }`}
            >
              {i === 0 ? <Check className="size-2" aria-hidden="true" /> : null}
            </span>
          </div>
        ),
      )}
      <div className="rounded-sm border border-dashed border-border px-2 py-1.5 text-[10px] text-muted-foreground">
        Comment from your PM
      </div>
    </>
  );
}
