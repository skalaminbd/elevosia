import Link from "next/link";
import { ArrowLeft, Check, Clock, FileText } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { BlueprintActions } from "@/components/admin/blueprints/BlueprintActions";
import { BlueprintTasksSection } from "@/components/admin/blueprints/BlueprintTasksSection";
import type { BlueprintDetail } from "@/db/queries";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** A Blueprint created from the admin (not in the demo seed). */
export function DbBlueprintPage({ detail }: { detail: BlueprintDetail }) {
  const hours = detail.milestones.reduce(
    (total, milestone) =>
      total +
      milestone.tasks.reduce((sum, task) => sum + task.hours, 0),
    0,
  );
  const cost = hours * 38;
  const margin = detail.price - cost;

  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <Link
        href="/admin/blueprints"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        All Blueprints
      </Link>

      <PageHeader
        title={detail.title}
        meta={`${detail.client} · ${detail.id} · ${detail.version}`}
        description={`Valid until ${formatDate(detail.validUntil)}`}
        className="mt-3"
      >
        <StatusBadge tone={detail.status === "Approved" ? "success" : "neutral"}>
          {detail.status}
        </StatusBadge>
        <StatusBadge tone="neutral">
          <Clock className="size-3" aria-hidden="true" />
          {formatDate(detail.validUntil)}
        </StatusBadge>
      </PageHeader>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Fixed price"
          value={`$${detail.price.toLocaleString("en-US")}`}
          note="No per-user fees"
          icon={FileText}
        />
        <StatCard
          label="Milestones"
          value={detail.milestones.length}
          note="Each with tasks"
          icon={Check}
        />
        <StatCard
          label="Version"
          value={detail.version}
          note="History kept"
          icon={FileText}
        />
        <StatCard
          label="Est. hours"
          value={hours}
          note={`Cost $${cost.toLocaleString("en-US")}`}
          icon={Clock}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <BlueprintTasksSection
            blueprintId={detail.id}
            convert={{
              blueprintId: detail.id,
              blueprintTitle: detail.title,
              client: detail.client,
              clientId: detail.clientId,
              requirement: detail.requirementId
                ? { id: detail.requirementId, title: detail.title }
                : undefined,
            }}
          />
        </div>

        <div className="space-y-4">
          <BlueprintActions id={detail.id} status={detail.status} />
          <SectionCard title="Payment schedule" description="Default 40 / 30 / 30">
            <div className="divide-y divide-border">
              {[
                ["Deposit", Math.round(detail.price * 0.4), "On approval"],
                ["Mid-project", Math.round(detail.price * 0.3), "At the demo"],
                [
                  "At launch",
                  detail.price -
                    Math.round(detail.price * 0.4) -
                    Math.round(detail.price * 0.3),
                  "On handover",
                ],
              ].map(([label, amount, when]) => (
                <div
                  key={String(label)}
                  className="flex items-center justify-between gap-3 px-5 py-3"
                >
                  <div>
                    <p className="text-sm">{label}</p>
                    <p className="text-[10px] text-muted-foreground">{when}</p>
                  </div>
                  <span className="font-mono text-xs font-semibold">
                    ${Number(amount).toLocaleString("en-US")}
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>
          <SectionCard title="Internal margin" description="Admin only">
            <div className="space-y-2 p-5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Estimated cost</span>
                <span className="font-mono text-xs">
                  ${cost.toLocaleString("en-US")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Margin</span>
                <span className="font-mono text-xs font-semibold">
                  ${margin.toLocaleString("en-US")}
                </span>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
