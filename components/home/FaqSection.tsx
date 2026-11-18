"use client";

import { Plus } from "lucide-react";
import { faq } from "@/content/home";
import { Reveal } from "@/components/home/Reveal";
import { Eyebrow } from "@/components/shared/Eyebrow";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ButtonLink } from "@/components/shared/ButtonLink";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export function FaqSection() {
  return (
    <section id="faq" className="relative py-15 md:py-20 lg:py-25">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Reveal>
              <Eyebrow>{faq.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={0.07}>
              <h2 className="mt-5 font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem]">
                {faq.title}
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <div className="mt-8">
                <ButtonLink href={faq.cta.href}>{faq.cta.label}</ButtonLink>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <Accordion type="single" collapsible defaultValue={faq.items[0].id}>
              {faq.items.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger className="cursor-pointer gap-4 py-5 text-lg font-medium hover:no-underline [&_[data-slot=accordion-trigger-icon]]:hidden">
                    <span>{item.question}</span>
                    <Plus
                      aria-hidden="true"
                      className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 motion-reduce:transition-none group-aria-expanded/accordion-trigger:rotate-45"
                    />
                  </AccordionTrigger>

                  <AccordionContent
                    forceMount
                    className="grid h-auto grid-rows-[0fr] overflow-hidden pb-0 text-base text-muted-foreground transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none [[data-state=open]_&]:grid-rows-[1fr]"
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div className="pb-5">{item.answer}</div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
