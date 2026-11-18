import type { Metadata } from "next";
import { IndustriesHero } from "@/components/industries/IndustriesHero";
import { IndustryTabs } from "@/components/industries/IndustryTabs";
import { AlsoBuiltFor } from "@/components/industries/AlsoBuiltFor";
import { FoundationSection } from "@/components/industries/FoundationSection";
import { IndustriesClosing } from "@/components/industries/IndustriesClosing";
import { SiteFooter } from "@/components/kit/watermelon/site-footer";
import { SiteHeader } from "@/components/kit/watermelon/site-header";
import { industriesMeta } from "@/content/industries";

export const metadata: Metadata = {
  title: industriesMeta.title,
  description: industriesMeta.description,
  alternates: { canonical: "/industries" },
  openGraph: {
    title: industriesMeta.title,
    description: industriesMeta.description,
    url: "/industries",
    type: "website",
  },
};

export default function IndustriesPage() {
  return (
    <>
      <SiteHeader />

      <main className="relative overflow-x-clip">
        <IndustriesHero />
        <IndustryTabs />
        <FoundationSection />
        <AlsoBuiltFor />
        <IndustriesClosing />
      </main>

      <SiteFooter />
    </>
  );
}
