// Source: https://registry.watermelon.sh/r/footer-4.json (adapted to Elevosia tokens)

"use client";

import Link from "next/link";
import { Globe, Mail, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const LINK_GROUPS = [
  {
    title: "Product",
    links: [
      { label: "Custom Dashboards", href: "/custom-dashboards" },
      { label: "AI & Automation", href: "/ai-automation" },
      { label: "Live Demo", href: "/demo" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Work & Case Studies", href: "/work" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Contact", href: "/start" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Cost Calculator", href: "/why-custom#calculator" },
      { label: "Blueprint Checklist", href: "/checklist" },
      { label: "Sample Blueprint", href: "/files/sample-blueprint.pdf" },
    ],
  },
];

const LEGAL_LINKS = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

const SOCIAL_LINKS = [
  {
    label: "Email us",
    href: "mailto:hello@elevosia.com",
    icon: Mail,
  },
  {
    label: "Website",
    href: "https://elevosia.com",
    icon: Globe,
  },
];

export function SiteFooter() {
  return (
    <footer className="w-full bg-background">
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-0">
          <div className="flex flex-col justify-between gap-6 lg:col-span-5 lg:pr-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary font-heading text-base font-bold text-primary-foreground">
                e
              </span>
              <span className="font-heading text-2xl font-semibold tracking-tight">
                elevosia
              </span>
            </Link>

            <div className="flex flex-col gap-5">
              <Badge
                variant="secondary"
                className="w-fit gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
              >
                <Sparkles className="size-3" aria-hidden="true" />
                Free blueprint in 5 days
              </Badge>

              <h2 className="text-3xl leading-tight font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Make every client count.
              </h2>

              <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                Custom dashboards for service businesses — staff, clients, jobs
                and billing in one system.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-12 lg:col-span-7 lg:border-l lg:border-border lg:pl-16">
            <div className="rounded-lg bg-muted/50 p-8">
              <div className="mb-5 flex flex-col gap-1">
                <h3 className="text-base font-semibold">
                  One useful email a month
                </h3>
                <p className="text-sm text-muted-foreground">
                  Ops and AI notes for service business owners.
                </p>
              </div>

              <form
                className="flex flex-col gap-2.5 sm:flex-row"
                onSubmit={(event) => event.preventDefault()}
              >
                <Input
                  type="email"
                  placeholder="you@company.com"
                  className="h-11 w-full bg-card"
                />
                <Button type="submit" className="shrink-0">
                  Subscribe
                </Button>
              </form>

              <p className="mt-3 text-xs text-muted-foreground">
                No spam, ever. Unsubscribe anytime.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              {LINK_GROUPS.map((group) => (
                <div key={group.title} className="flex flex-col gap-4">
                  <h4 className="text-xs font-semibold tracking-wider uppercase">
                    {group.title}
                  </h4>
                  <ul className="flex flex-col gap-3">
                    {group.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Separator className="mt-12 opacity-60" />

        <div className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © 2026 Elevosia. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-5">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs text-muted-foreground transition-colors duration-150 hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map((social) => {
              const Icon = social.icon;

              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
                >
                  <Icon className="size-4" aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
