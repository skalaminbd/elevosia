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
    rotate: -2,
  },
  {
    label: "Client spreadsheet v7 (final)",
    icon: Table2,
    color: "bg-success/15 text-success",
    rotate: 1,
  },
  {
    label: "Invoicing tool",
    icon: Receipt,
    color: "bg-warning/15 text-warning",
    rotate: -1,
  },
  {
    label: "CRM nobody updates",
    icon: Users,
    color: "bg-info/15 text-info",
    rotate: 2,
  },
  {
    label: "Email threads",
    icon: Mail,
    color: "bg-destructive/15 text-destructive",
    rotate: -1,
  },
  {
    label: "Group texts",
    icon: MessageSquare,
    color: "bg-primary/15 text-primary",
    rotate: 2,
  },
  {
    label: "Paper forms",
    icon: FileText,
    color: "bg-accent text-accent-foreground",
    rotate: -2,
  },
  {
    label: "Payroll export",
    icon: Wallet,
    color: "bg-success/15 text-success",
    rotate: 1,
  },
  {
    label: "Google Drive folders",
    icon: FolderOpen,
    color: "bg-info/15 text-info",
    rotate: -1,
  },
  {
    label: "Sticky notes",
    icon: StickyNote,
    color: "bg-warning/15 text-warning",
  },
];

export function StorySection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
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

          <div className="rounded-lg bg-card p-6 sm:p-8">
            <ul className="flex flex-wrap justify-start gap-5">
              {TOOLS.map(({ label, icon: Icon, color, rotate }, index) => (
                <motion.li
                  key={label}
                  style={{ rotate }}
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: 0.4,
                    ease: "easeOut",
                    delay: index * 0.05,
                  }}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-medium whitespace-nowrap",
                    color,
                  )}
                >
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  {label}
                </motion.li>
              ))}
            </ul>

            <p className="mt-6 text-xs text-muted-foreground">
              Every tool does one job. None of them show you the whole business.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
