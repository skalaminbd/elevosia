// Source: https://registry.watermelon.sh/r/navigation-2.json (adapted to Elevosia tokens)

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Briefcase,
  ChevronDown,
  LayoutDashboard,
  Menu,
  User,
  type LucideIcon,
} from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/shared/ButtonLink";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type NavLink = { label: string; href: string; muted?: boolean };

type MegaMenu = {
  id: string;
  label: string;
  icon: LucideIcon;
  title: string;
  href: string;
  description: string;
  chips: NavLink[];
  columns: { title: string; links: NavLink[] }[];
  featured: {
    badge: string;
    title: string;
    body: string;
    linkLabel: string;
    href: string;
  };
};

const MENUS: MegaMenu[] = [
  {
    id: "solutions",
    label: "Solutions",
    icon: LayoutDashboard,
    title: "Custom Dashboards",
    href: "/custom-dashboards",
    description:
      "Your staff, clients, jobs and billing in one system, built around how you work.",
    chips: [
      { label: "Client Portal", href: "/how-it-works#portal" },
      { label: "Weekly Board", href: "/how-it-works#weekly-board" },
      { label: "AI Assistant", href: "/ai-automation" },
    ],
    columns: [
      {
        title: "What you can manage",
        links: [
          { label: "Staff & Scheduling", href: "/custom-dashboards#staff" },
          { label: "Services & Bookings", href: "/custom-dashboards#bookings" },
          { label: "Clients & CRM", href: "/custom-dashboards#crm" },
          { label: "Invoices & Payments", href: "/custom-dashboards#invoices" },
          { label: "Reports & KPIs", href: "/custom-dashboards#reports" },
        ],
      },
      {
        title: "Explore",
        links: [
          { label: "AI & Automation", href: "/ai-automation" },
          { label: "Live Demo", href: "/demo" },
          { label: "Why Custom vs SaaS", href: "/why-custom" },
          { label: "Website projects", href: "/website-projects", muted: true },
        ],
      },
    ],
    featured: {
      badge: "Free",
      title: "Get your Blueprint in 5 days",
      body: "Share what you need. Get milestones, a timeline and a fixed price, free.",
      linkLabel: "Start a project",
      href: "/start",
    },
  },
  {
    id: "industries",
    label: "Industries",
    icon: Briefcase,
    title: "Built for service businesses",
    href: "/industries",
    description: "Teams of 5 to 200 that run on people, schedules and clients.",
    chips: [
      { label: "Field services", href: "/industries#field-services" },
      { label: "Agencies", href: "/industries#agencies" },
      { label: "Care", href: "/industries#care" },
    ],
    columns: [
      {
        title: "Industries",
        links: [
          { label: "Home & Field Services", href: "/industries#field-services" },
          { label: "Agencies & Professional Services", href: "/industries#agencies" },
          { label: "Nonprofits & Associations", href: "/industries#nonprofits" },
          { label: "Care Providers", href: "/industries#care" },
        ],
      },
      {
        title: "Also built for",
        links: [
          { label: "Cleaning Companies", href: "/industries#also-built-for" },
          { label: "Property Management", href: "/industries#also-built-for" },
          { label: "Staffing Agencies", href: "/industries#also-built-for" },
          { label: "Education & Training", href: "/industries#also-built-for" },
        ],
      },
    ],
    featured: {
      badge: "Live demo",
      title: "See a home care dashboard",
      body: "Click through Brightline Care, a working demo with sample data.",
      linkLabel: "Open the demo",
      href: "/demo",
    },
  },
  {
    id: "resources",
    label: "Resources",
    icon: BookOpen,
    title: "Elevosia Blog",
    href: "/blog",
    description: "Practical guides for owners tired of juggling tools.",
    chips: [
      { label: "Build vs buy", href: "/blog?category=build-vs-buy" },
      { label: "AI", href: "/blog?category=ai-automation" },
      { label: "Operations", href: "/blog?category=operations" },
    ],
    columns: [
      {
        title: "Tools",
        links: [
          { label: "Cost Calculator", href: "/why-custom#calculator" },
          { label: "Blueprint Checklist", href: "/checklist" },
          { label: "Sample Blueprint (PDF)", href: "/files/sample-blueprint.pdf" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About", href: "/about" },
          { label: "Work & Case Studies", href: "/work" },
          { label: "How We Work Remotely", href: "/how-it-works#contract" },
          { label: "Contact", href: "/start" },
        ],
      },
    ],
    featured: {
      badge: "5 spots left",
      title: "Become a founding client",
      body: "Founding pricing and the founder on every weekly call.",
      linkLabel: "Ask about a spot",
      href: "/work#founding-clients",
    },
  },
];

const PLAIN_LINKS: NavLink[] = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
];

const topNavItemClassName =
  "inline-flex h-auto items-center justify-center rounded-lg bg-transparent px-3 py-1.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground focus:bg-accent focus:text-foreground data-open:bg-accent data-open:text-foreground";

function megaPanel(menu: MegaMenu) {
  const Icon = menu.icon;

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-border lg:px-8">
      <div className="flex flex-col lg:pr-8">
        <span className="mb-3 flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <Link
          href={menu.href}
          className="text-sm font-semibold text-foreground hover:underline"
        >
          {menu.title}
        </Link>
        <p className="mt-1 text-sm text-muted-foreground">{menu.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {menu.chips.map((chip) => (
            <Button
              key={chip.label}
              asChild
              variant="outline"
              size="sm"
              className="h-7 rounded-full px-3 text-xs"
            >
              <Link href={chip.href}>{chip.label}</Link>
            </Button>
          ))}
        </div>
      </div>

      {menu.columns.map((column) => (
        <div key={column.title} className="flex flex-col gap-3 lg:px-8">
          <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {column.title}
          </span>
          {column.links.map((link) => (
            <Link
              key={`${column.title}-${link.label}`}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-foreground",
                link.muted ? "text-muted-foreground/70" : "text-muted-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      ))}

      <div className="flex flex-col lg:pl-8">
        <span className="mb-4 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Featured
        </span>
        <Link
          href={menu.featured.href}
          className="group flex h-full flex-col justify-between rounded-lg bg-accent p-6 ring-1 ring-border transition-shadow hover:shadow-md"
        >
          <div>
            <Badge variant="outline" className="mb-3 bg-card text-foreground">
              {menu.featured.badge}
            </Badge>
            <p className="text-sm font-semibold text-foreground">
              {menu.featured.title}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {menu.featured.body}
            </p>
          </div>
          <span className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
            {menu.featured.linkLabel}
            <ArrowUpRight
              className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
        </Link>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    function onScroll() {
      const y = window.scrollY;
      setScrolled(y > 8);

      if (y <= 8) {
        setHidden(false);
      } else if (y > lastY + 6) {
        setHidden(true);
      } else if (y < lastY - 6) {
        setHidden(false);
      }

      lastY = y;
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-[transform,colors] duration-300 ease-out motion-reduce:transition-none",
        hidden ? "-translate-y-full" : "translate-y-0",
        "has-[[data-state=open]]:bg-card",
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 border-b border-border bg-background/80 backdrop-blur transition-opacity duration-500 ease-out",
          scrolled ? "opacity-100" : "opacity-0",
        )}
      />
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 md:h-18.5 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary font-heading text-base font-bold text-primary-foreground">
            e
          </span>
          <span className="font-heading text-xl font-bold tracking-tight">
            elevosia
          </span>
        </Link>

        <div className="hidden flex-1 items-center justify-center lg:flex">
          <NavigationMenu
            className={cn(
              "static flex-none",
              // Full-width panel anchored to the header
              "[&>.absolute]:inset-x-0 [&>.absolute]:top-full [&>.absolute]:w-full",
              // Viewport geometry
              "[&_[data-slot=navigation-menu-viewport]]:mt-0",
              "[&_[data-slot=navigation-menu-viewport]]:w-full md:[&_[data-slot=navigation-menu-viewport]]:w-full",
              "[&_[data-slot=navigation-menu-viewport]]:rounded-none",
              "[&_[data-slot=navigation-menu-viewport]]:shadow-none",
              "[&_[data-slot=navigation-menu-viewport]]:ring-0",
              // Panel surface
              "[&_[data-slot=navigation-menu-viewport]]:border-0",
              "[&_[data-slot=navigation-menu-viewport]]:border-b",
              "[&_[data-slot=navigation-menu-viewport]]:border-border",
              "[&_[data-slot=navigation-menu-viewport]]:bg-card",
            )}
          >
            <NavigationMenuList className="gap-1">
              <NavigationMenuItem>
                <NavigationMenuTrigger className={topNavItemClassName}>
                  Solutions
                </NavigationMenuTrigger>
                <NavigationMenuContent className="w-full p-0 md:w-full">
                  {megaPanel(MENUS[0])}
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className={topNavItemClassName}>
                  Industries
                </NavigationMenuTrigger>
                <NavigationMenuContent className="w-full p-0 md:w-full">
                  {megaPanel(MENUS[1])}
                </NavigationMenuContent>
              </NavigationMenuItem>

              {PLAIN_LINKS.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <Link href={link.href} className={topNavItemClassName}>
                    {link.label}
                    <ChevronDown
                      className="invisible ml-1 size-3"
                      aria-hidden="true"
                    />
                  </Link>
                </NavigationMenuItem>
              ))}

              <NavigationMenuItem>
                <NavigationMenuTrigger className={topNavItemClassName}>
                  Resources
                </NavigationMenuTrigger>
                <NavigationMenuContent className="w-full p-0 md:w-full">
                  {megaPanel(MENUS[2])}
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <Button asChild variant="ghost" className="text-muted-foreground">
            <Link href="/login">
              <User className="size-4" aria-hidden="true" />
              Login
            </Link>
          </Button>
          <ButtonLink href="/start">Start a project</ButtonLink>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open navigation menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full!">
              <SheetHeader className="border-b border-border">
                <SheetTitle className="font-heading text-xl">elevosia</SheetTitle>
                <SheetDescription className="sr-only">
                  Site navigation
                </SheetDescription>
              </SheetHeader>

              <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-4 pb-4">
                <Accordion
                  type="single"
                  collapsible
                  className="w-full border-b border-border"
                >
                  {MENUS.map((menu) => (
                    <AccordionItem
                      key={menu.id}
                      value={menu.id}
                      className="border-border"
                    >
                      <AccordionTrigger className="rounded-lg px-0 py-2.5 text-base font-medium text-foreground/80 hover:text-foreground hover:no-underline">
                        {menu.label}
                      </AccordionTrigger>
                      <AccordionContent className="flex h-auto! flex-col gap-4 pb-4 [&_a]:no-underline!">
                        <div className="flex flex-col">
                          <Link
                            href={menu.href}
                            className="text-base font-semibold text-foreground"
                          >
                            {menu.title}
                          </Link>
                          <p className="mt-1 text-base text-muted-foreground">
                            {menu.description}
                          </p>
                          <div className="mt-0.5 flex flex-wrap gap-2">
                            {menu.chips.map((chip) => (
                              <Button
                                key={chip.label}
                                asChild
                                variant="outline"
                                size="sm"
                                className="h-8 rounded-full px-3 text-sm"
                              >
                                <Link href={chip.href}>{chip.label}</Link>
                              </Button>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col gap-4 border-t border-border pt-4">
                          {menu.columns.map((column) => (
                            <div
                              key={column.title}
                              className="flex flex-col gap-3 last:pb-4"
                            >
                              <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                {column.title}
                              </span>
                              <div className="flex flex-col gap-2 border-l border-border pl-4">
                                {column.links.map((link) => (
                                  <Link
                                    key={`${column.title}-${link.label}`}
                                    href={link.href}
                                    className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
                                  >
                                    {link.label}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {PLAIN_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="border-b border-border py-2.5 text-base font-medium text-foreground/80 transition-colors last:border-b-0 hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <SheetFooter>
                <Button asChild variant="outline" className="text-base">
                  <Link href="/login">
                    <User className="size-4" aria-hidden="true" />
                    Login
                  </Link>
                </Button>
                <ButtonLink href="/start" className="text-base">
                  Start a project
                </ButtonLink>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
