"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { honestLists } from "@/content/why-custom";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Section } from "@/components/shared/Section";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Two honest lists. The build column's checks light up in sequence; nothing
 * else moves.
 */
export function HonestLists() {
  const reduceMotion = useReducedMotion();

  return (
    <Section>
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow>No pitch, just criteria</Eyebrow>
        <h2 className="mt-4 font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem]">
          Two honest lists
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
          Read both before you read our pitch. One of them may tell you not to
          hire us.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:gap-8">
        <ListPanel
          title={honestLists.buy.title}
          items={honestLists.buy.items}
          muted
        />
        <ListPanel
          title={honestLists.build.title}
          items={honestLists.build.items}
          reduceMotion={reduceMotion}
        />
      </div>
    </Section>
  );
}

function ListPanel({
  title,
  items,
  muted = false,
  reduceMotion = true,
}: {
  title: string;
  items: readonly string[];
  muted?: boolean;
  reduceMotion?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="font-heading text-xl font-semibold tracking-tight">
        {title}
      </h3>
      <ul className="mt-5 space-y-3.5">
        {items.map((item, index) => (
          <li key={item} className="flex items-start gap-3">
            <motion.span
              aria-hidden="true"
              className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${
                muted
                  ? "bg-muted text-muted-foreground"
                  : "bg-success/10 text-success"
              }`}
              animate={
                muted || reduceMotion
                  ? undefined
                  : { opacity: [0.45, 1, 1, 0.45] }
              }
              transition={
                muted || reduceMotion
                  ? undefined
                  : {
                      duration: items.length * 0.9,
                      times: [
                        0,
                        index / items.length + 0.02,
                        index / items.length + 0.22,
                        1,
                      ],
                      repeat: Infinity,
                    }
              }
            >
              <Check className="size-3" strokeWidth={3} />
            </motion.span>
            <span
              className={
                muted ? "text-sm text-muted-foreground" : "text-sm sm:text-base"
              }
            >
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
