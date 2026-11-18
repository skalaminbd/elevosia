import type { Metadata } from "next";
import { SiteFooter } from "@/components/kit/watermelon/site-footer";
import { SiteHeader } from "@/components/kit/watermelon/site-header";
import { AiHero } from "@/components/ai/AiHero";
import { AiClosing } from "@/components/ai/AiClosing";
import { AuditSection } from "@/components/ai/AuditSection";
import { AutomateSection } from "@/components/ai/AutomateSection";
import { NightStory } from "@/components/ai/NightStory";
import { RolloutSection } from "@/components/ai/RolloutSection";
import { RulesSection } from "@/components/ai/RulesSection";
import { aiMeta } from "@/content/ai-automation";

export const metadata: Metadata = {
  title: aiMeta.title,
  description: aiMeta.description,
  alternates: { canonical: "/ai-automation" },
  openGraph: {
    title: aiMeta.title,
    description: aiMeta.description,
    url: "/ai-automation",
    type: "website",
  },
};

export default function AiAutomationPage() {
  return (
    <>
      <SiteHeader />

      <main className="relative overflow-x-clip">
        <AiHero />
        <RulesSection />
        <AutomateSection />
        <NightStory />
        <RolloutSection />
        <AuditSection />
        <AiClosing />
      </main>

      <SiteFooter />
    </>
  );
}
