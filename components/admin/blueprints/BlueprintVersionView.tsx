import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import type { BlueprintDetail } from "@/db/queries";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Version history for a Blueprint, from Postgres. */
export function BlueprintVersionView({
  detail,
  version,
}: {
  detail: BlueprintDetail;
  version: string;
}) {
  const versions = [
    {
      version: detail.version,
      when: detail.validUntil
        ? `Valid until ${formatDate(detail.validUntil)}`
        : detail.status,
      status: version === detail.version ? "Current" : "Viewed",
      note:
        version === detail.version
          ? "The version the client sees."
          : "Older versions stay archived.",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <Link
        href={`/admin/blueprints/${detail.id}`}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Back to Blueprint
      </Link>
      <PageHeader
        title={`${detail.title} · ${version}`}
        meta={`${detail.client} · ${detail.id}`}
        description={`Version history. The current version is ${detail.version}; nothing is deleted.`}
        className="mt-3"
      >
        <StatusBadge tone="neutral">{detail.status}</StatusBadge>
      </PageHeader>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard
          label="Version"
          value={version}
          note={`Current ${detail.version}`}
          icon={Clock}
        />
        <StatCard
          label="Price"
          value={`$${detail.price.toLocaleString("en-US")}`}
          note="Fixed"
          icon={Clock}
        />
        <StatCard
          label="Valid until"
          value={formatDate(detail.validUntil)}
          note="Expires"
          icon={Clock}
        />
      </div>

      <SectionCard
        title="Versions"
        description="Newest first"
        className="mt-4"
        bodyClassName="divide-y divide-border"
      >
        {versions.map((item) => (
          <div
            key={item.version}
            className="flex flex-wrap items-center gap-3 px-5 py-4"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-secondary font-mono text-[10px] font-semibold text-muted-foreground">
              {item.version}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{item.note}</p>
              <p className="text-xs text-muted-foreground">{item.when}</p>
            </div>
            <StatusBadge
              tone={item.status === "Current" ? "success" : "neutral"}
            >
              {item.status}
            </StatusBadge>
          </div>
        ))}
      </SectionCard>
    </div>
  );
}
