"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookUser,
  CalendarDays,
  ChartColumn,
  ChevronDown,
  CircleCheck,
  Receipt,
  Smartphone,
  Sparkles,
  Users,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import { ModulePreview } from "@/components/blocks/module-previews";
import { Eyebrow } from "@/components/shared/Eyebrow";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type Module = {
  value: string;
  title: string;
  benefit: string;
  checklist: string[];
  icon: LucideIcon;
  isNew?: boolean;
  classes: {
    tile: string;
    solid: string;
    accent: string;
    preview: string;
  };
};

const MODULES: Module[] = [
  {
    value: "staff",
    title: "Staff & scheduling",
    benefit: "Build the week in minutes. Everyone knows where to be.",
    checklist: [
      "Roles and permissions",
      "Drag-and-drop shifts",
      "Availability and time off",
      "Tasks per shift",
    ],
    icon: Users,
    classes: {
      tile: "bg-module-staff/15 text-module-staff",
      solid: "bg-module-staff",
      accent: "text-module-staff",
      preview: "bg-module-staff/10",
    },
  },
  {
    value: "bookings",
    title: "Services & bookings",
    benefit: "Let clients book online while you sleep.",
    checklist: [
      "Service catalog",
      "Online booking",
      "Jobs and status",
      "Automatic reminders",
    ],
    icon: CalendarDays,
    classes: {
      tile: "bg-module-bookings/15 text-module-bookings",
      solid: "bg-module-bookings",
      accent: "text-module-bookings",
      preview: "bg-module-bookings/10",
    },
  },
  {
    value: "clients",
    title: "Clients & CRM",
    benefit: "Every client, lead and follow-up in one place.",
    checklist: [
      "Client records",
      "Lead tracking",
      "Follow-up reminders",
      "Full history",
    ],
    icon: BookUser,
    classes: {
      tile: "bg-module-clients/15 text-module-clients",
      solid: "bg-module-clients",
      accent: "text-module-clients",
      preview: "bg-module-clients/10",
    },
  },
  {
    value: "invoices",
    title: "Invoices & payments",
    benefit: "Get paid faster, with less chasing.",
    checklist: ["Quotes", "Invoices", "Online payments", "QuickBooks sync"],
    icon: Receipt,
    classes: {
      tile: "bg-module-invoices/15 text-module-invoices",
      solid: "bg-module-invoices",
      accent: "text-module-invoices",
      preview: "bg-module-invoices/10",
    },
  },
  {
    value: "reports",
    title: "Reports & KPIs",
    benefit: "Know your numbers without opening a spreadsheet.",
    checklist: ["Live numbers", "Custom reports", "Scheduled emails"],
    icon: ChartColumn,
    classes: {
      tile: "bg-module-reports/15 text-module-reports",
      solid: "bg-module-reports",
      accent: "text-module-reports",
      preview: "bg-module-reports/10",
    },
  },
  {
    value: "portal",
    title: "Client portal",
    benefit: "Give clients a place to book, pay and approve.",
    checklist: [
      "Book appointments",
      "Pay invoices",
      "Approve quotes",
      "Message your team",
    ],
    icon: Smartphone,
    classes: {
      tile: "bg-module-portal/15 text-module-portal",
      solid: "bg-module-portal",
      accent: "text-module-portal",
      preview: "bg-module-portal/10",
    },
  },
  {
    value: "operations",
    title: "Operations",
    benefit: "Stock, vendors and paperwork, under control.",
    checklist: [
      "Inventory",
      "Vendors",
      "Documents and approvals",
      "Multiple locations",
    ],
    icon: Warehouse,
    classes: {
      tile: "bg-module-operations/15 text-module-operations",
      solid: "bg-module-operations",
      accent: "text-module-operations",
      preview: "bg-module-operations/10",
    },
  },
  {
    value: "ai",
    title: "AI assistant",
    benefit: "Ask your business anything. Get answers in seconds.",
    checklist: [
      "Ask in plain English",
      "Instant answers",
      "Insights from your data",
    ],
    icon: Sparkles,
    isNew: true,
    classes: {
      tile: "bg-module-ai/15 text-module-ai",
      solid: "bg-module-ai",
      accent: "text-module-ai",
      preview: "bg-module-ai/10",
    },
  },
];

function ModuleIconTile({
  module,
  size,
}: {
  module: Module;
  size: "sm" | "lg";
}) {
  const Icon = module.icon;

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg",
        size === "lg" ? "size-11" : "size-7",
        size === "lg"
          ? cn(module.classes.solid, "text-white")
          : module.classes.tile,
      )}
    >
      <Icon className={size === "lg" ? "size-5" : "size-4"} aria-hidden="true" />
    </span>
  );
}

function ModulePanel({ module, index }: { module: Module; index: number }) {
  return (
    <div className="grid gap-7 rounded-lg border border-border bg-card p-5 md:grid-cols-9 md:grid-rows-[1fr_auto] md:p-7">
      <div className="md:col-span-4 md:col-start-1 md:row-start-1">
        <div className="flex items-center gap-3">
          <ModuleIconTile module={module} size="lg" />

          <div>
            <p className={cn("text-xs font-medium", module.classes.accent)}>
              Module {String(index + 1).padStart(2, "0")}
            </p>

            <h3 className="text-xl font-medium">{module.title}</h3>
          </div>
        </div>

        <p className="mt-4 text-base">{module.benefit}</p>

        <ul className="mt-4">
          {module.checklist.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 border-b border-dashed border-border py-2.5 text-sm last:border-0"
            >
              <CircleCheck
                className={cn("size-4 shrink-0", module.classes.accent)}
                aria-hidden="true"
              />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="h-full md:col-span-5 md:col-start-5 md:row-span-2 md:row-start-1">
        <div
          className={cn(
            "flex h-full animate-fade-up flex-col justify-center rounded-lg p-4 group-data-[state=active]:animate-fade-up group-data-[state=active]:motion-reduce:animate-none motion-reduce:animate-none",
            module.classes.preview,
          )}
        >
          <ModulePreview module={module.value} />
        </div>
      </div>

      <div className="md:col-span-4 md:col-start-1 md:row-start-2">
        <div className="flex flex-wrap items-center gap-4 pt-1 md:pt-7">
          <Button asChild>
            <Link href="/demo">
              See them in the live demo
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>

          <p className="text-xs text-muted-foreground">
            {index + 1} of {MODULES.length}
          </p>
        </div>
      </div>
    </div>
  );
}

export function ModulesSection() {
  return (
    <section className="pt-8 pb-16 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 md:items-end md:gap-12">
          <div>
            <Eyebrow>Dashboard modules</Eyebrow>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Pick what you need. Add more as you grow.
            </h2>
          </div>

          <p className="max-w-md text-base text-muted-foreground md:justify-self-end">
            Every module runs on the same dashboard, the same data and the same
            login, so staff, clients, jobs and invoices never live in two
            places. Start with what you need today and switch on more as the
            business grows. Pick a module to see what is inside.
          </p>
        </div>

        <div className="mt-12 hidden md:block">
          <Tabs
            defaultValue={MODULES[0].value}
            orientation="vertical"
            className="flex items-stretch gap-8"
          >
            <TabsList className="flex w-60 shrink-0 flex-col items-stretch gap-1 rounded-none bg-transparent p-0">
              {MODULES.map((module) => (
                <TabsTrigger
                  key={module.value}
                  value={module.value}
                  className="h-auto w-full cursor-pointer justify-start gap-3 rounded-lg border border-transparent px-3 py-2 text-left text-sm font-medium whitespace-normal text-muted-foreground shadow-none! outline-none after:hidden hover:bg-muted hover:text-foreground focus:outline-none data-active:bg-card data-active:text-foreground"
                >
                  <ModuleIconTile module={module} size="sm" />
                  <span className="flex-1">{module.title}</span>
                  {module.isNew ? (
                    <Badge variant="secondary" className="text-xs">
                      New
                    </Badge>
                  ) : null}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex min-w-0 flex-1">
              {MODULES.map((module, index) => (
                <TabsContent
                  key={module.value}
                  value={module.value}
                  forceMount
                  className="group mt-0 h-full w-full data-[state=inactive]:hidden"
                >
                  <ModulePanel module={module} index={index} />
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>

        <div className="mt-10 md:hidden">
          <Accordion
            type="single"
            collapsible
            defaultValue={MODULES[0].value}
            className="border-t border-border"
          >
            {MODULES.map((module, index) => (
              <AccordionItem key={module.value} value={module.value}>
                <AccordionTrigger className="py-4 hover:no-underline [&>[data-slot=accordion-trigger-icon]]:hidden">
                  <span className="flex flex-1 items-center gap-3">
                    <ModuleIconTile module={module} size="sm" />
                    <span className="flex-1 text-left text-base font-medium">
                      {module.title}
                    </span>
                    {module.isNew ? (
                      <Badge variant="secondary" className="text-xs">
                        New
                      </Badge>
                    ) : null}
                    <ChevronDown
                      className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-aria-expanded/accordion-trigger:rotate-180"
                      aria-hidden="true"
                    />
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-5 [&_a]:no-underline [&_a:hover]:text-primary-foreground!">
                  <ModulePanel module={module} index={index} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-6 flex justify-start">
            <Button asChild>
              <Link href="/demo">
                See them in the live demo
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
