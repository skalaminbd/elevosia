import type { Metadata } from "next";
import { SiteFooter } from "@/components/kit/watermelon/site-footer";
import { SiteHeader } from "@/components/kit/watermelon/site-header";
import { PageClosing } from "@/components/shared/PageClosing";
import { IncludedSection } from "@/components/website-projects/IncludedSection";
import { PathSection } from "@/components/website-projects/PathSection";
import { WebsiteHero } from "@/components/website-projects/WebsiteHero";
import { WebsitePricing } from "@/components/website-projects/WebsitePricing";
import { webClosing, webMeta } from "@/content/website-projects";

export const metadata: Metadata = {
  title: webMeta.title,
  description: webMeta.description,
  alternates: { canonical: "/website-projects" },
  openGraph: {
    title: webMeta.title,
    description: webMeta.description,
    url: "/website-projects",
    type: "website",
  },
};

export default function WebsiteProjectsPage() {
  return (
    <>
      <SiteHeader />

      <main className="relative overflow-x-clip">
        <WebsiteHero />
        <PathSection />
        <IncludedSection />
        <WebsitePricing />
        <PageClosing
          title={webClosing.title}
          body={webClosing.body}
          primary={webClosing.primary}
          secondary={webClosing.secondary}
        />
      </main>

      <SiteFooter />
    </>
  );
}
