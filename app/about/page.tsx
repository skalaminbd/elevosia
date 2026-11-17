import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { FactRail } from "@/components/about/FactRail";
import { StoryChapters } from "@/components/about/StoryChapters";
import { BoardSection } from "@/components/about/BoardSection";
import { BeliefsSection } from "@/components/about/BeliefsSection";
import { TeamSection } from "@/components/about/TeamSection";
import { ExperienceSection } from "@/components/about/ExperienceSection";
import { HonestySection } from "@/components/about/HonestySection";
import { DhakaSection } from "@/components/about/DhakaSection";
import { AboutClosing } from "@/components/about/AboutClosing";
import { SiteFooter } from "@/components/kit/watermelon/site-footer";
import { SiteHeader } from "@/components/kit/watermelon/site-header";
import { aboutMeta } from "@/content/about";

export const metadata: Metadata = {
  title: aboutMeta.title,
  description: aboutMeta.description,
  alternates: { canonical: "/about" },
  openGraph: {
    title: aboutMeta.title,
    description: aboutMeta.description,
    url: "/about",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />

      <main className="relative overflow-x-clip">
        <AboutHero />
        <FactRail />
        <StoryChapters />
        <BoardSection />
        <BeliefsSection />
        <TeamSection />
        <HonestySection />
        <ExperienceSection />
        <DhakaSection />
        <AboutClosing />
      </main>

      <SiteFooter />
    </>
  );
}
