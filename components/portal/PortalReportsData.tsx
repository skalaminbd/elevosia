import { connection } from "next/server";
import { BarChart3, CheckCircle2, FileText } from "lucide-react";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { listPortalReports } from "@/db/queries";
import { requirePortalClientId } from "@/lib/portal-session";

/** Client reports from Postgres, read at request time. */
export async function PortalReportsData() {
  await connection();
  const clientId = await requirePortalClientId();
  const reports = await listPortalReports(clientId);

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard
          label="Published"
          value={reports.length}
          note="This quarter"
          icon={FileText}
        />
        <StatCard
          label="On time"
          value="100%"
          note="Every report"
          icon={CheckCircle2}
          tone="success"
        />
        <StatCard
          label="Tasks delivered"
          value={12}
          note="October"
          icon={BarChart3}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        {reports.map((report, index) => (
          <SectionCard
            key={report.id}
            title={report.title}
            description={`${report.period} · published ${report.published}`}
            action={
              <StatusBadge tone={index === 0 ? "accent" : "neutral"}>
                PDF
              </StatusBadge>
            }
            bodyClassName="p-5"
          >
            <ul className="space-y-2">
              {report.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-success" />
                  {highlight}
                </li>
              ))}
            </ul>
          </SectionCard>
        ))}
      </div>
    </>
  );
}
