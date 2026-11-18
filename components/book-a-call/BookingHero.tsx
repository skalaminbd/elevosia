"use client";

import { motion } from "motion/react";
import { CalendarCheck, Check } from "lucide-react";
import { bookingHero } from "@/content/book-a-call";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/** Split hero with a small call card. The booked slot pulses on a loop. */
export function BookingHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto w-full max-w-7xl px-4 pt-16 pb-14 sm:px-6 md:pt-20 md:pb-16 lg:px-8 lg:pt-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-6">
            <Eyebrow>{bookingHero.eyebrow}</Eyebrow>
            <h1 className="mt-6 font-heading text-[clamp(2.375rem,4.6vw,4.25rem)] leading-[0.98] font-bold tracking-[-0.04em] text-balance">
              {bookingHero.title}
            </h1>
            <p className="mt-6 max-w-lg text-base text-muted-foreground sm:text-lg">
              {bookingHero.subhead}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href={bookingHero.primary.href}>
                {bookingHero.primary.label}
              </ButtonLink>
              <ButtonLink href={bookingHero.secondary.href} variant="outline">
                {bookingHero.secondary.label}
              </ButtonLink>
            </div>
            <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
              {bookingHero.trust.map((line) => (
                <li
                  key={line}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <Check className="size-3.5 text-success" aria-hidden="true" />
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6">
            <div className="relative mx-auto w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CalendarCheck className="size-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold">30-minute call</p>
                    <p className="text-[10px] text-muted-foreground">
                      With the founder · US Eastern
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-success/10 px-2 py-0.5 text-[9px] font-medium text-success">
                  Free
                </span>
              </div>

              <div className="mt-4 grid grid-cols-5 gap-1.5">
                {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, index) => (
                  <div
                    key={day}
                    className={`rounded-md border px-1 py-2 text-center ${
                      index === 2
                        ? "border-primary/40 bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    <p className="text-[9px] text-muted-foreground">{day}</p>
                    <span className="mt-1 flex justify-center">
                      {index === 2 ? (
                        <motion.span
                          className="block size-4 rounded-full bg-primary"
                          animate={
                            reduceMotion
                              ? undefined
                              : { scale: [1, 1.2, 1], opacity: [1, 0.85, 1] }
                          }
                          transition={{ duration: 2.4, repeat: Infinity }}
                        />
                      ) : (
                        <span className="block size-4 rounded-full bg-secondary" />
                      )}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between rounded-md border border-border bg-background px-3 py-2.5">
                <div>
                  <p className="text-[11px] font-medium">Wed 20 Nov</p>
                  <p className="text-[10px] text-muted-foreground">
                    10:00 am ET · 30 min
                  </p>
                </div>
                <span className="flex size-6 items-center justify-center rounded-full bg-success text-success-foreground">
                  <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                </span>
              </div>

              <p className="mt-4 border-t border-border pt-3 text-[10px] leading-relaxed text-muted-foreground">
                You&apos;ll get a calendar invite and two short questions before
                we talk.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
