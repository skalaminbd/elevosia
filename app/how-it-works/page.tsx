import type { Metadata } from "next";
import { HowItWorksHero } from "@/components/how-it-works/HowItWorksHero";
import { TimelineSection } from "@/components/how-it-works/TimelineSection";
import { PortalSection } from "@/components/how-it-works/PortalSection";
import { WeekSection } from "@/components/how-it-works/WeekSection";
import { TimeZonesSection } from "@/components/how-it-works/TimeZonesSection";
import { ContractSection } from "@/components/how-it-works/ContractSection";
import { SecuritySection } from "@/components/how-it-works/SecuritySection";
import { HowItWorksFaq } from "@/components/how-it-works/HowItWorksFaq";
import { HiwClosing } from "@/components/how-it-works/HiwClosing";
import { SiteFooter } from "@/components/kit/watermelon/site-footer";
import { SiteHeader } from "@/components/kit/watermelon/site-header";
import { hiwMeta } from "@/content/how-it-works";

export const metadata: Metadata = {
  title: hiwMeta.title,
  description: hiwMeta.description,
  alternates: { canonical: "/how-it-works" },
  openGraph: {
    title: hiwMeta.title,
    description: hiwMeta.description,
    url: "/how-it-works",
    type: "website",
  },
};

export default function HowItWorksPage() {
  return (
    <>
      <SiteHeader />

      <main className="relative overflow-x-clip">
        <HowItWorksHero />
        <TimelineSection />
        <PortalSection />
        <WeekSection />
        <TimeZonesSection />
        <ContractSection />
        <SecuritySection />
        <HowItWorksFaq />
        <HiwClosing />
      </main>

      <SiteFooter />
    </>
  );
}
