"use client";

import { motion } from "motion/react";
import { Check, Inbox, Mail, Send } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const DOTS = [
  { x: -70, y: -60, color: "bg-highlight" },
  { x: -30, y: -90, color: "bg-success" },
  { x: 20, y: -80, color: "bg-primary" },
  { x: 65, y: -55, color: "bg-highlight" },
  { x: 80, y: -10, color: "bg-success" },
  { x: -80, y: -15, color: "bg-primary" },
];

/** Confetti once on load, then an envelope drifting into an inbox on a loop. */
export function ThankYouArt() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative mx-auto flex h-40 w-40 items-center justify-center">
      <span className="absolute inset-0 rounded-full bg-primary/5" aria-hidden="true" />

      {!reduceMotion
        ? DOTS.map((dot, index) => (
            <motion.span
              key={index}
              aria-hidden="true"
              className={`absolute size-1.5 rounded-full ${dot.color}`}
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{ x: dot.x, y: dot.y, opacity: 0 }}
              transition={{ duration: 0.9, delay: 0.15 + index * 0.04, ease: "easeOut" }}
            />
          ))
        : null}

      <div className="relative flex size-20 items-center justify-center rounded-lg border border-border bg-card shadow-sm">
        <Inbox className="size-8 text-muted-foreground" aria-hidden="true" />
        <motion.span
          className="absolute -top-3 text-primary"
          aria-hidden="true"
          animate={
            reduceMotion
              ? undefined
              : { y: [-14, 6, -14], opacity: [0, 1, 1, 0] }
          }
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", times: [0, 0.35, 0.7, 1] }}
        >
          <Mail className="size-6" />
        </motion.span>
        <span className="absolute -right-2 -bottom-2 flex size-6 items-center justify-center rounded-full bg-success text-success-foreground">
          <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
        </span>
      </div>

      <Send className="absolute top-6 right-6 size-4 text-highlight" aria-hidden="true" />
    </div>
  );
}

const WEEK = [
  { label: "M", booked: false },
  { label: "T", booked: false },
  { label: "W", booked: true },
  { label: "T", booked: false },
  { label: "F", booked: false },
];

/** Calendar card with a check stamping onto the booked day, then resting. */
export function BookedArt() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="mx-auto w-full max-w-xs rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">This week</span>
        <span className="font-mono text-xs text-muted-foreground">30 min</span>
      </div>

      <div className="mt-4 grid grid-cols-5 gap-2">
        {WEEK.map((day, index) => (
          <div
            key={index}
            className={`relative flex aspect-square items-center justify-center rounded-md border text-xs ${
              day.booked
                ? "border-primary bg-primary/5 font-semibold text-primary"
                : "border-border text-muted-foreground"
            }`}
          >
            {day.label}
            {day.booked ? (
              <motion.span
                className="absolute -right-1.5 -bottom-1.5 flex size-5 items-center justify-center rounded-full bg-success text-success-foreground"
                initial={reduceMotion ? false : { scale: 2.2, opacity: 0, rotate: -12 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.35, delay: 0.5, ease: "easeOut" }}
              >
                <Check className="size-3" strokeWidth={3} aria-hidden="true" />
              </motion.span>
            ) : null}
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        10:00 am, US Eastern · Calendar invite on its way
      </p>
    </div>
  );
}
