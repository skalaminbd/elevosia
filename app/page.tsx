import type { Metadata } from "next";
import { DashboardMockup } from "@/components/blocks/dashboard-mockup";
import { ModulesSection } from "@/components/blocks/modules-section";
import { HowItWorksSection } from "@/components/blocks/how-it-works-section";
import { PictureThisSection } from "@/components/blocks/picture-this-section";
import { ProgressSection } from "@/components/blocks/progress-section";
import { ScaleToFit } from "@/components/blocks/scale-to-fit";
import { StorySection } from "@/components/blocks/story-section";
import { WhatWeBuildSection } from "@/components/blocks/what-we-build-section";
import { ComparisonSection } from "@/components/home/ComparisonSection";
import { AiSection } from "@/components/home/AiSection";
import { WhoWeBuildFor } from "@/components/home/WhoWeBuildFor";
import { PricingSection } from "@/components/home/PricingSection";
import { RemoteTeamSection } from "@/components/home/RemoteTeamSection";
import { FounderSection } from "@/components/home/FounderSection";
import { FaqSection } from "@/components/home/FaqSection";
import { ClosingSection } from "@/components/home/ClosingSection";
import { SiteFooter } from "@/components/kit/watermelon/site-footer";
import { SiteHeader } from "@/components/kit/watermelon/site-header";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { ButtonLink } from "@/components/shared/ButtonLink";

export const metadata: Metadata = {
  title: "Elevosia — Run your whole business from one screen",
  description:
    "Custom dashboards for growing service businesses. Staff, clients, jobs, invoices and numbers in one place, with a client portal and website connected to it.",
};

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main className="relative overflow-x-clip">
        <section className="relative mx-auto w-full max-w-7xl px-4 py-15 sm:px-6 md:py-20 lg:px-8 lg:py-25">
        <div className="mx-auto max-w-4xl text-center">
          <Eyebrow>Custom dashboards for growing service businesses</Eyebrow>

          <h1 className="mt-6 font-heading text-[clamp(2.5rem,5.6vw,5rem)] leading-[0.96] font-bold tracking-[-0.04em] text-balance">
            Run your whole business from one screen.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            We build the dashboard your team uses every day, around the way
            you already work. Staff, clients, jobs, invoices and numbers in
            one place, with a client portal and website connected to it.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/start">Start a project</ButtonLink>
            <ButtonLink href="/demo" variant="outline">
              Try the live demo
            </ButtonLink>
          </div>
        </div>

        <div className="mt-12 lg:mt-16">
          <ScaleToFit designWidth={1152}>
            <DashboardMockup />
          </ScaleToFit>
        </div>
        </section>

        <StorySection />

        <PictureThisSection />

        <WhatWeBuildSection />

        <ModulesSection />

        <ProgressSection />

        <HowItWorksSection />

        <ComparisonSection />

        <AiSection />

        <WhoWeBuildFor />

        <PricingSection />

        <RemoteTeamSection />

        <FounderSection />

        <FaqSection />

        <ClosingSection />
      </main>

      <SiteFooter />
    </>
  );
}
