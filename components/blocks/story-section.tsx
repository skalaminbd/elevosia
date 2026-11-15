"use client";

import {
  Calendar,
  FileText,
  FolderOpen,
  Mail,
  MessageSquare,
  Receipt,
  StickyNote,
  Table2,
  Users,
  Wallet,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { cn } from "@/lib/utils";

const TOOLS = [
  {
    label: "Scheduling app",
    icon: Calendar,
    color: "bg-primary/15 text-primary",
  },
  {
    label: "Client spreadsheet v7 (final)",
    icon: Table2,
    color: "bg-success/15 text-success",
  },
  {
    label: "Invoicing tool",
    icon: Receipt,
    color: "bg-warning/15 text-warning",
  },
  {
    label: "CRM nobody updates",
    icon: Users,
    color: "bg-info/15 text-info",
  },
  {
    label: "Email threads",
    icon: Mail,
    color: "bg-destructive/15 text-destructive",
  },
  {
    label: "Group texts",
    icon: MessageSquare,
    color: "bg-primary/15 text-primary",
  },
  {
    label: "Paper forms",
    icon: FileText,
    color: "bg-accent text-accent-foreground",
  },
  {
    label: "Payroll export",
    icon: Wallet,
    color: "bg-success/15 text-success",
  },
  {
    label: "Google Drive folders",
    icon: FolderOpen,
    color: "bg-info/15 text-info",
  },
  {
    label: "Sticky notes",
    icon: StickyNote,
    color: "bg-warning/15 text-warning",
  },
];

const ORBITS = [
  { radius: 36, duration: 70, tools: TOOLS.slice(0, 5) },
  { radius: 20, duration: 48, tools: TOOLS.slice(5) },
];

function ToolOrbit({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-xl">
      <div
        className="absolute inset-0 rounded-full bg-highlight/5 blur-2xl"
        aria-hidden="true"
      />

      {ORBITS.map(({ radius }) => (
        <div
          key={radius}
          aria-hidden="true"
          className="absolute rounded-full border border-dashed border-border"
          style={{
            width: `${radius * 2}%`,
            height: `${radius * 2}%`,
            left: `${50 - radius}%`,
            top: `${50 - radius}%`,
          }}
        />
      ))}

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className="absolute inset-0 rounded-full bg-highlight/30 blur-xl"
          aria-hidden="true"
        />
        <div className="relative flex size-16 items-center justify-center rounded-full bg-primary font-heading text-xl font-bold text-primary-foreground shadow-md">
          e
        </div>
      </div>

      {ORBITS.map(({ radius, duration, tools }) => (
        <motion.div
          key={radius}
          className="absolute inset-0"
          animate={reduceMotion ? undefined : { rotate: 360 }}
          transition={{ duration, repeat: Infinity, ease: "linear" }}
        >
          {tools.map(({ label, icon: Icon, color }, index) => {
            const angle =
              ((360 / tools.length) * index - 90) * (Math.PI / 180);
            const x = 50 + radius * Math.cos(angle);
            const y = 50 + radius * Math.sin(angle);

            return (
              <motion.div
                key={label}
                className="absolute"
                style={{ left: `${x}%`, top: `${y}%`, x: "-50%", y: "-50%" }}
                animate={reduceMotion ? undefined : { rotate: -360 }}
                transition={{ duration, repeat: Infinity, ease: "linear" }}
              >
                <span
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium whitespace-nowrap shadow-sm",
                    color,
                  )}
                >
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  {label}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      ))}
    </div>
  );
}

export function StorySection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5 lg:items-center lg:gap-16">
          <div className="lg:col-span-2">
            <Eyebrow>Sound familiar?</Eyebrow>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              It&apos;s 7:40 on Monday morning.
            </h2>

            <p className="mt-5 text-base text-muted-foreground">
              You open the scheduling app to see who&apos;s working. Then a
              spreadsheet to check which clients are due. Then your inbox,
              because a customer emailed about an invoice that lives in another
              tool. A team member texts that a job was missed. Nobody updated
              the sheet.
            </p>

            <p className="mt-5 text-base font-semibold sm:text-lg">
              You don&apos;t have a people problem. You have a system problem.
              Your tools don&apos;t talk to each other, so your team does the
              talking for them.
            </p>

            <p className="mt-6 text-xs text-muted-foreground">
              Small businesses with 1 to 24 employees use 36 SaaS apps on
              average.{" "}
              <span className="font-medium">Source: BetterCloud, 2025.</span>
            </p>
          </div>

          <div className="lg:col-span-3">
            <ToolOrbit reduceMotion={Boolean(reduceMotion)} />
          </div>
        </div>
      </div>
    </section>
  );
}
