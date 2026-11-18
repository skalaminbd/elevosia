import type { Metadata } from "next";
import { SiteFooter } from "@/components/kit/watermelon/site-footer";
import { SiteHeader } from "@/components/kit/watermelon/site-header";
import { DemoClosing } from "@/components/demo/DemoClosing";
import { DemoExperience } from "@/components/demo/DemoExperience";
import { DemoHero } from "@/components/demo/DemoHero";
import { demoMeta } from "@/content/demo";

export const metadata: Metadata = {
  title: demoMeta.title,
  description: demoMeta.description,
  alternates: { canonical: "/demo" },
  openGraph: {
    title: demoMeta.title,
    description: demoMeta.description,
    url: "/demo",
    type: "website",
  },
};

export default function DemoPage() {
  return (
    <>
      <SiteHeader />

      <main className="relative overflow-x-clip">
        <DemoHero />
        <DemoExperience />
        <DemoClosing />
      </main>

      <SiteFooter />
    </>
  );
}
