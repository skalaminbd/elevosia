"use client";

import {
  Building2,
  Dumbbell,
  GraduationCap,
  HeartHandshake,
  HeartPulse,
  Home,
  Megaphone,
  Sparkles,
  Truck,
  Wrench,
} from "lucide-react";
import { motion } from "motion/react";
import { industriesHero } from "@/content/industries";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const INNER = [Wrench, Megaphone, HeartHandshake, HeartPulse];
const OUTER = [Home, Building2, GraduationCap, Dumbbell, Truck, Sparkles];

function Ring({
  icons,
  radius,
  duration,
  reverse,
  reduceMotion,
  small,
}: {
  icons: typeof INNER;
  radius: number;
  duration: number;
  reverse?: boolean;
  reduceMotion: boolean;
  small?: boolean;
}) {
  return (
    <motion.div
      className="absolute inset-0"
      animate={reduceMotion ? undefined : { rotate: reverse ? -360 : 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      {icons.map((Icon, index) => {
        const angle = ((360 / icons.length) * index - 90) * (Math.PI / 180);
        return (
          <span
            key={index}
            className="absolute"
            style={{
              left: `${50 + radius * Math.cos(angle)}%`,
              top: `${50 + radius * Math.sin(angle)}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <motion.span
              className={cn(
                "flex items-center justify-center rounded-full border border-border bg-card text-primary shadow-sm",
                small ? "size-8" : "size-11",
              )}
              animate={reduceMotion ? undefined : { rotate: reverse ? 360 : -360 }}
              transition={{ duration, repeat: Infinity, ease: "linear" }}
            >
              <Icon className={small ? "size-3.5" : "size-5"} aria-hidden="true" />
            </motion.span>
          </span>
        );
      })}
    </motion.div>
  );
}

export function IndustriesHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative">
      <div className="mx-auto w-full max-w-7xl px-4 pt-16 pb-16 sm:px-6 md:pt-20 md:pb-20 lg:px-8 lg:pt-24 lg:pb-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-7">
            <Eyebrow>{industriesHero.eyebrow}</Eyebrow>
            <h1 className="mt-6 font-heading text-[clamp(2.375rem,4.6vw,4.25rem)] leading-[0.98] font-bold tracking-[-0.04em] text-balance">
              {industriesHero.title}
            </h1>
            <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
              {industriesHero.subhead}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href={industriesHero.primary.href}>
                {industriesHero.primary.label}
              </ButtonLink>
              <ButtonLink href={industriesHero.secondary.href} variant="outline">
                {industriesHero.secondary.label}
              </ButtonLink>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative mx-auto aspect-square w-full max-w-sm">
              <div
                aria-hidden="true"
                className="absolute inset-[8%] rounded-full border border-dashed border-border"
              />
              <div
                aria-hidden="true"
                className="absolute inset-[26%] rounded-full border border-dashed border-border"
              />

              <Ring
                icons={OUTER}
                radius={38}
                duration={90}
                reduceMotion={reduceMotion}
                small
              />
              <Ring
                icons={INNER}
                radius={20}
                duration={55}
                reverse
                reduceMotion={reduceMotion}
              />

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="flex size-14 items-center justify-center rounded-full bg-primary font-heading text-xl font-bold text-primary-foreground shadow-md">
                  e
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
