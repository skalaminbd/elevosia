import type { Metadata } from "next";
import Link from "next/link";
import { DashboardMockup } from "@/components/blocks/dashboard-mockup";
import { ModulesSection } from "@/components/blocks/modules-section";
import { HowItWorksSection } from "@/components/blocks/how-it-works-section";
import { PictureThisSection } from "@/components/blocks/picture-this-section";
import { ProgressSection } from "@/components/blocks/progress-section";
import { ScaleToFit } from "@/components/blocks/scale-to-fit";
import { StorySection } from "@/components/blocks/story-section";
import { WhatWeBuildSection } from "@/components/blocks/what-we-build-section";
import { SiteFooter } from "@/components/kit/watermelon/site-footer";
import { SiteHeader } from "@/components/kit/watermelon/site-header";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Elevosia — Run your whole business from one screen",
  description:
    "Custom dashboards for growing service businesses. Staff, clients, jobs, invoices and numbers in one place, with a client portal and website connected to it.",
};

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main className="relative overflow-hidden">
        <section className="relative mx-auto w-full max-w-7xl px-4 pt-16 pb-12 sm:px-6 lg:px-8 lg:pt-24 lg:pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Custom dashboards for growing service businesses</Eyebrow>

          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Run your whole business from one screen.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            We build the dashboard your team uses every day, around the way
            you already work. Staff, clients, jobs, invoices and numbers in
            one place, with a client portal and website connected to it.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild>
              <Link href="/start">Start a project</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/demo">Try the live demo</Link>
            </Button>
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
      </main>

      <SiteFooter />
    </>
  );
}
