"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  BellRing,
  BookUser,
  Briefcase,
  CalendarCheck,
  CalendarDays,
  CalendarOff,
  CalendarPlus,
  ChartColumn,
  CheckCheck,
  ChevronDown,
  Clock,
  Contact,
  CreditCard,
  FileBarChart,
  FileText,
  Globe,
  History,
  Languages,
  Layers,
  LineChart,
  ListChecks,
  Mail,
  MapPin,
  MessageCircleQuestion,
  MessageSquare,
  Package,
  Receipt,
  RefreshCw,
  Shield,
  Smartphone,
  Sparkles,
  Truck,
  UserPlus,
  Users,
  Warehouse,
  Zap,
  type LucideIcon,
} from "lucide-react";
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

type Chip = { label: string; icon: LucideIcon };

type Module = {
  value: string;
  title: string;
  description: string;
  icon: LucideIcon;
  chips: Chip[];
  isNew?: boolean;
  classes: {
    tile: string;
    solid: string;
    panel: string;
    chip: string;
    accent: string;
  };
};

const MODULES: Module[] = [
  {
    value: "staff",
    title: "Staff & scheduling",
    description: "Roles, shifts, availability, time off and tasks.",
    icon: Users,
    chips: [
      { label: "Roles", icon: Shield },
      { label: "Shifts", icon: Clock },
      { label: "Availability", icon: CalendarCheck },
      { label: "Time off", icon: CalendarOff },
      { label: "Tasks", icon: ListChecks },
    ],
    classes: {
      tile: "bg-module-staff/15 text-module-staff",
      solid: "bg-module-staff",
      panel: "bg-module-staff/12",
      chip: "border border-module-staff/20 bg-module-staff/15",
      accent: "text-module-staff",
    },
  },
  {
    value: "bookings",
    title: "Services & bookings",
    description: "Service catalog, online booking, jobs and status.",
    icon: CalendarDays,
    chips: [
      { label: "Service catalog", icon: Layers },
      { label: "Online booking", icon: Globe },
      { label: "Jobs", icon: Briefcase },
      { label: "Status tracking", icon: Activity },
    ],
    classes: {
      tile: "bg-module-bookings/15 text-module-bookings",
      solid: "bg-module-bookings",
      panel: "bg-module-bookings/12",
      chip: "border border-module-bookings/20 bg-module-bookings/15",
      accent: "text-module-bookings",
    },
  },
  {
    value: "clients",
    title: "Clients & CRM",
    description: "Client records, leads, follow-ups and full history.",
    icon: BookUser,
    chips: [
      { label: "Client records", icon: Contact },
      { label: "Leads", icon: UserPlus },
      { label: "Follow-ups", icon: BellRing },
      { label: "Full history", icon: History },
    ],
    classes: {
      tile: "bg-module-clients/15 text-module-clients",
      solid: "bg-module-clients",
      panel: "bg-module-clients/12",
      chip: "border border-module-clients/20 bg-module-clients/15",
      accent: "text-module-clients",
    },
  },
  {
    value: "invoices",
    title: "Invoices & payments",
    description: "Quotes, invoices, online payments and QuickBooks sync.",
    icon: Receipt,
    chips: [
      { label: "Quotes", icon: FileText },
      { label: "Invoices", icon: Receipt },
      { label: "Online payments", icon: CreditCard },
      { label: "QuickBooks sync", icon: RefreshCw },
    ],
    classes: {
      tile: "bg-module-invoices/15 text-module-invoices",
      solid: "bg-module-invoices",
      panel: "bg-module-invoices/12",
      chip: "border border-module-invoices/20 bg-module-invoices/15",
      accent: "text-module-invoices",
    },
  },
  {
    value: "reports",
    title: "Reports & KPIs",
    description: "Live numbers, custom reports and scheduled emails.",
    icon: ChartColumn,
    chips: [
      { label: "Live numbers", icon: Activity },
      { label: "Custom reports", icon: FileBarChart },
      { label: "Scheduled emails", icon: Mail },
    ],
    classes: {
      tile: "bg-module-reports/15 text-module-reports",
      solid: "bg-module-reports",
      panel: "bg-module-reports/12",
      chip: "border border-module-reports/20 bg-module-reports/15",
      accent: "text-module-reports",
    },
  },
  {
    value: "portal",
    title: "Client portal",
    description: "Clients log in to book, pay, approve and message.",
    icon: Smartphone,
    chips: [
      { label: "Book", icon: CalendarPlus },
      { label: "Pay", icon: CreditCard },
      { label: "Approve", icon: CheckCheck },
      { label: "Message", icon: MessageSquare },
    ],
    classes: {
      tile: "bg-module-portal/15 text-module-portal",
      solid: "bg-module-portal",
      panel: "bg-module-portal/12",
      chip: "border border-module-portal/20 bg-module-portal/15",
      accent: "text-module-portal",
    },
  },
  {
    value: "operations",
    title: "Operations",
    description: "Inventory, vendors, documents, approvals and locations.",
    icon: Warehouse,
    chips: [
      { label: "Inventory", icon: Package },
      { label: "Vendors", icon: Truck },
      { label: "Documents", icon: FileText },
      { label: "Approvals", icon: BadgeCheck },
      { label: "Locations", icon: MapPin },
    ],
    classes: {
      tile: "bg-module-operations/15 text-module-operations",
      solid: "bg-module-operations",
      panel: "bg-module-operations/12",
      chip: "border border-module-operations/20 bg-module-operations/15",
      accent: "text-module-operations",
    },
  },
  {
    value: "ai",
    title: "AI assistant",
    description: "Ask questions about your business in plain English.",
    icon: Sparkles,
    isNew: true,
    chips: [
      { label: "Ask anything", icon: MessageCircleQuestion },
      { label: "Instant answers", icon: Zap },
      { label: "Insights from your data", icon: LineChart },
      { label: "Plain English", icon: Languages },
    ],
    classes: {
      tile: "bg-module-ai/15 text-module-ai",
      solid: "bg-module-ai",
      panel: "bg-module-ai/12",
      chip: "border border-module-ai/20 bg-module-ai/15",
      accent: "text-module-ai",
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
        size === "lg" ? "size-12 text-white" : "size-7",
        size === "lg" ? module.classes.solid : module.classes.tile,
      )}
    >
      <Icon className={size === "lg" ? "size-6" : "size-4"} aria-hidden="true" />
    </span>
  );
}

function ModulePanel({
  module,
  index,
  showFooter,
}: {
  module: Module;
  index: number;
  showFooter: boolean;
}) {
  return (
    <div
      className={cn(
        "flex min-h-85 h-full flex-col rounded-lg p-6 sm:p-8",
        module.classes.panel,
      )}
    >
      <div className="flex items-center gap-4">
        <ModuleIconTile module={module} size="lg" />

        <div>
          <p className={cn("text-xs font-medium", module.classes.accent)}>
            Module {String(index + 1).padStart(2, "0")}
          </p>

          <h3 className="mt-1 text-xl font-semibold">{module.title}</h3>
        </div>
      </div>

      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        {module.description}
      </p>

      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {module.chips.map(({ label, icon: Icon }) => (
          <li
            key={label}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-4 py-3 text-sm",
              module.classes.chip,
            )}
          >
            <Icon
              className={cn("size-4 shrink-0", module.classes.accent)}
              aria-hidden="true"
            />
            <span>{label}</span>
          </li>
        ))}
      </ul>

      {showFooter ? (
        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-8">
          <p className="text-xs text-muted-foreground">
            {index + 1} of {MODULES.length} modules
          </p>
          <Button asChild>
            <Link href="/demo">
              See them in the live demo
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export function ModulesSection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Dashboard modules</Eyebrow>

          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Pick what you need. Add more as you grow.
          </h2>
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
                  className="mt-0 h-full w-full data-[state=inactive]:hidden data-[state=active]:animate-fade-in data-[state=active]:motion-reduce:animate-none"
                >
                  <ModulePanel module={module} index={index} showFooter />
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
                  <ModulePanel
                    module={module}
                    index={index}
                    showFooter={false}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-6 flex justify-center">
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
