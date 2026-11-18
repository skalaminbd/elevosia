import type { Metadata } from "next";
import { BarChart3, CheckCircle2, FileText } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { portalReports } from "@/lib/portal-data";

export const metadata: Metadata = {
  title: "Reports | Elevosia client portal",
};

export default function PortalReportsPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px]">
      <PageHeader
        title="Reports"
        meta="Support"
        description="Monthly project reports and the marketing reports your team published."
      />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Published" value={portalReports.length} note="This quarter" icon={FileText} />
        <StatCard label="On time" value="100%" note="Every report" icon={CheckCircle2} tone="success" />
        <StatCard label="Tasks delivered" value={12} note="October" icon={BarChart3} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        {portalReports.map((report, index) => (
          <SectionCard
            key={report.id}
            title={report.title}
            description={`${report.period} · published ${report.published}`}
            action={<StatusBadge tone={index === 0 ? "accent" : "neutral"}>PDF</StatusBadge>}
            bodyClassName="p-5"
          >
            <ul className="space-y-2">
              {report.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-success" />
                  {highlight}
                </li>
              ))}
            </ul>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
