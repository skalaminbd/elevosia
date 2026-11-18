import type { Metadata } from "next";
import { SiteFooter } from "@/components/kit/watermelon/site-footer";
import { SiteHeader } from "@/components/kit/watermelon/site-header";
import { PageClosing } from "@/components/shared/PageClosing";
import { CalculatorSection } from "@/components/why-custom/CalculatorSection";
import { CostsSection } from "@/components/why-custom/CostsSection";
import { HonestLists } from "@/components/why-custom/HonestLists";
import { MiddlePath } from "@/components/why-custom/MiddlePath";
import { WhyHero } from "@/components/why-custom/WhyHero";
import { whyClosing, whyMeta } from "@/content/why-custom";

export const metadata: Metadata = {
  title: whyMeta.title,
  description: whyMeta.description,
  alternates: { canonical: "/why-custom" },
  openGraph: {
    title: whyMeta.title,
    description: whyMeta.description,
    url: "/why-custom",
    type: "website",
  },
};

export default function WhyCustomPage() {
  return (
    <>
      <SiteHeader />

      <main className="relative overflow-x-clip">
        <WhyHero />
        <HonestLists />
        <CostsSection />
        <CalculatorSection />
        <MiddlePath />
        <PageClosing
          title={whyClosing.title}
          body={whyClosing.body}
          primary={whyClosing.primary}
          secondary={whyClosing.secondary}
        />
      </main>

      <SiteFooter />
    </>
  );
}
