import type { Metadata } from "next";
import { DashboardsHero } from "@/components/custom-dashboards/DashboardsHero";
import { ProblemSection } from "@/components/custom-dashboards/ProblemSection";
import { IncludedSection } from "@/components/custom-dashboards/IncludedSection";
import { ModuleLibrary } from "@/components/custom-dashboards/ModuleLibrary";
import { ViewsSection } from "@/components/custom-dashboards/ViewsSection";
import { FlowSection } from "@/components/custom-dashboards/FlowSection";
import { IntegrationsSection } from "@/components/custom-dashboards/IntegrationsSection";
import { BuiltSection } from "@/components/custom-dashboards/BuiltSection";
import { DashboardsClosing } from "@/components/custom-dashboards/DashboardsClosing";
import { SiteFooter } from "@/components/kit/watermelon/site-footer";
import { SiteHeader } from "@/components/kit/watermelon/site-header";
import { dashboardsMeta } from "@/content/custom-dashboards";

export const metadata: Metadata = {
  title: dashboardsMeta.title,
  description: dashboardsMeta.description,
  alternates: { canonical: "/custom-dashboards" },
  openGraph: {
    title: dashboardsMeta.title,
    description: dashboardsMeta.description,
    url: "/custom-dashboards",
    type: "website",
  },
};

export default function CustomDashboardsPage() {
  return (
    <>
      <SiteHeader />

      <main className="relative overflow-x-clip">
        <DashboardsHero />
        <ProblemSection />
        <IncludedSection />
        <ModuleLibrary />
        <ViewsSection />
        <FlowSection />
        <IntegrationsSection />
        <BuiltSection />
        <DashboardsClosing />
      </main>

      <SiteFooter />
    </>
  );
}
