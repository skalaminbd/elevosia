import type { Metadata } from "next";
import { PricingHero } from "@/components/pricing/PricingHero";
import { BlueprintSection } from "@/components/pricing/BlueprintSection";
import { PackagesSection } from "@/components/pricing/PackagesSection";
import { CarePlansSection } from "@/components/pricing/CarePlansSection";
import { ExtrasSection } from "@/components/pricing/ExtrasSection";
import { PricingFaq } from "@/components/pricing/PricingFaq";
import { PricingClosing } from "@/components/pricing/PricingClosing";
import { SiteFooter } from "@/components/kit/watermelon/site-footer";
import { SiteHeader } from "@/components/kit/watermelon/site-header";
import { pricingMeta } from "@/content/pricing-page";

export const metadata: Metadata = {
  title: pricingMeta.title,
  description: pricingMeta.description,
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: pricingMeta.title,
    description: pricingMeta.description,
    url: "/pricing",
    type: "website",
  },
};

export default function PricingPage() {
  return (
    <>
      <SiteHeader />

      <main className="relative overflow-x-clip">
        <PricingHero />
        <BlueprintSection />
        <PackagesSection />
        <CarePlansSection />
        <ExtrasSection />
        <PricingFaq />
        <PricingClosing />
      </main>

      <SiteFooter />
    </>
  );
}
