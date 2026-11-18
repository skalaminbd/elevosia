"use client";

import { Plus } from "lucide-react";
import { pricingFaq } from "@/content/pricing-page";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Section } from "@/components/shared/Section";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: pricingFaq.items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

/** Pricing FAQ: accordion only, answers stay in the DOM. */
export function PricingFaq() {
  return (
    <Section id="faq" className="scroll-mt-24">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.8fr)] lg:gap-16">
        <div>
          <Eyebrow>{pricingFaq.eyebrow}</Eyebrow>
          <h2 className="mt-5 font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] sm:text-[2.75rem]">
            The money questions.
          </h2>
        </div>

        <Accordion type="single" collapsible defaultValue={pricingFaq.items[0].id}>
          {pricingFaq.items.map((item) => (
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
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Section>
  );
}
