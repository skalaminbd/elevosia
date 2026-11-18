import type { Metadata } from "next";
import { SiteFooter } from "@/components/kit/watermelon/site-footer";
import { SiteHeader } from "@/components/kit/watermelon/site-header";
import { ReassuranceStrip } from "@/components/start/ReassuranceStrip";
import { StartForm } from "@/components/start/StartForm";
import { StartHero } from "@/components/start/StartHero";
import { TwoDoors } from "@/components/start/TwoDoors";
import { startMeta } from "@/content/start";

export const metadata: Metadata = {
  title: startMeta.title,
  description: startMeta.description,
  alternates: { canonical: "/start" },
  openGraph: {
    title: startMeta.title,
    description: startMeta.description,
    url: "/start",
    type: "website",
  },
};

export default function StartPage() {
  return (
    <>
      <SiteHeader />

      <main className="relative overflow-x-clip">
        <StartHero />
        <TwoDoors />
        <StartForm />
        <ReassuranceStrip />
      </main>

      <SiteFooter />
    </>
  );
}
