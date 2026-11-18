import type { Metadata } from "next";
import { SiteFooter } from "@/components/kit/watermelon/site-footer";
import { SiteHeader } from "@/components/kit/watermelon/site-header";
import { PageClosing } from "@/components/shared/PageClosing";
import { FoundingSection } from "@/components/work/FoundingSection";
import { ProcessSection } from "@/components/work/ProcessSection";
import { WhatYouGet } from "@/components/work/WhatYouGet";
import { WorkHero } from "@/components/work/WorkHero";
import { workClosing, workMeta } from "@/content/work";

export const metadata: Metadata = {
  title: workMeta.title,
  description: workMeta.description,
  alternates: { canonical: "/work" },
  openGraph: {
    title: workMeta.title,
    description: workMeta.description,
    url: "/work",
    type: "website",
  },
};

export default function WorkPage() {
  return (
    <>
      <SiteHeader />

      <main className="relative overflow-x-clip">
        <WorkHero />
        <WhatYouGet />
        <ProcessSection />
        <FoundingSection />
        <PageClosing
          title={workClosing.title}
          body={workClosing.body}
          primary={workClosing.primary}
          secondary={workClosing.secondary}
        />
      </main>

      <SiteFooter />
    </>
  );
}
