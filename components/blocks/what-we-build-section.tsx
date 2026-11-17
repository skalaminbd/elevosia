"use client";

import Image from "next/image";
import { Eyebrow } from "@/components/shared/Eyebrow";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ButtonLink } from "@/components/shared/ButtonLink";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

type Item = {
  value: string;
  label: string;
  body: string;
  image: string;
  imageAlt: string;
  cta: { label: string; href: string };
};

const ITEMS: Item[] = [
  {
    value: "dashboard",
    label: "Custom dashboard",
    body: "Staff and scheduling, services and bookings, clients and CRM, invoices and reports. Built to your requirements, never a template.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Laptop showing a business dashboard with charts and figures",
    cta: { label: "Explore dashboards", href: "/demo" },
  },
  {
    value: "portal",
    label: "Client portal included",
    body: "Your clients book, pay, approve and message you in one place with your logo.",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Two people reviewing a project together on a laptop",
    cta: { label: "See the client portal", href: "/demo" },
  },
  {
    value: "ai",
    label: "AI built in",
    body: "Morning briefings, smart alerts and follow-ups that run without anyone pressing a button.",
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Abstract visual of connected data points",
    cta: { label: "See what AI can do", href: "/ai" },
  },
  {
    value: "website",
    label: "Website included",
    body: "A fast public website on the same system, so every form and booking lands in your dashboard.",
    image:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Designer working on a website layout on a laptop",
    cta: { label: "Only need a website for now?", href: "/start" },
  },
];

function Intro() {
  return (
    <>
      <Eyebrow>What we build</Eyebrow>

      <h2 className="mt-5 font-heading text-4xl leading-[1.02] font-bold tracking-[-0.03em] sm:text-5xl">
        One system, built for your business
      </h2>

      <p className="mt-5 text-base text-muted-foreground sm:text-lg">
        A private dashboard for your team, a portal for your clients and a
        website for everyone else. One system, one login, one partner.
      </p>
    </>
  );
}

function ItemPanel({ item }: { item: Item }) {
  return (
    <>
      <Image
        src={item.image}
        alt={item.imageAlt}
        width={1200}
        height={750}
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="aspect-video w-full rounded-lg object-cover"
      />

      <h3 className="mt-6 text-2xl font-semibold">{item.label}</h3>

      <p className="mt-3 max-w-xl text-sm text-muted-foreground">
        {item.body}
      </p>

      <ButtonLink href={item.cta.href} className="mt-1 lg:mt-4">
        {item.cta.label}
      </ButtonLink>
    </>
  );
}

export function WhatWeBuildSection() {
  return (
    <section className="py-15 md:py-20 lg:py-25">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="hidden lg:block">
          <Tabs
            defaultValue="dashboard"
            orientation="vertical"
            className="grid grid-cols-5 items-start gap-16"
          >
            <div className="col-span-2">
              <Intro />

              <TabsList className="mt-8 flex w-full flex-col items-stretch gap-2.5 rounded-none bg-transparent p-0">
                {ITEMS.map(({ value, label }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className="group h-auto w-full cursor-pointer justify-start rounded-none border-x-0! border-t-0! border-b-0 border-border px-0 py-4 text-left text-xl font-normal whitespace-normal text-muted-foreground shadow-none! outline-none! after:hidden transition-colors duration-300 focus:outline-none focus-visible:border-transparent focus-visible:bg-muted focus-visible:ring-0 focus-visible:outline-none hover:bg-transparent hover:text-foreground not-last:border-b data-active:bg-transparent! data-active:font-semibold data-active:text-primary data-active:border-b-foreground! dark:data-active:border-b-foreground!"
                  >
                    {label}
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-300 group-data-[state=active]:scale-x-100 motion-reduce:transition-none"
                    />
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="col-span-3">
              {ITEMS.map((item) => (
                <TabsContent
                  key={item.value}
                  value={item.value}
                  className="mt-0 data-[state=active]:animate-fade-up data-[state=active]:motion-reduce:animate-none"
                >
                  <ItemPanel item={item} />
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>

        <div className="lg:hidden">
          <Intro />

          <Accordion type="single" collapsible defaultValue="dashboard" className="mt-8">
            {ITEMS.map((item) => (
              <AccordionItem key={item.value} value={item.value}>
                <AccordionTrigger className="py-4 text-xl font-medium hover:no-underline">
                  {item.label}
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-5 [&_a]:no-underline [&_a:hover]:text-primary-foreground!">
                  <ItemPanel item={item} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
