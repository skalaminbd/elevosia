import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { blueprints } from "@/lib/admin-data";

type Params = Promise<{ id: string; version: string }>;

export function generateStaticParams() {
  return blueprints.flatMap((blueprint) => [
    { id: blueprint.id, version: blueprint.version },
    ...(blueprint.version === "v2" ? [{ id: blueprint.id, version: "v1" }] : []),
  ]);
}

export const metadata: Metadata = { title: "Blueprint history | Elevosia Admin" };

export default async function BlueprintVersionPage({ params }: { params: Params }) {
  const { id, version } = await params;
  const blueprint = blueprints.find((item) => item.id === id);
  if (!blueprint) notFound();

  const versions =
    blueprint.version === "v2"
      ? [
          { version: "v2", when: "18 Nov 2026", status: "Current", note: "Added the retainer report scope." },
          { version: "v1", when: "4 Nov 2026", status: "Superseded", note: "Original plan." },
        ]
      : [
          { version: blueprint.version, when: "Sent to the client", status: "Current", note: "No earlier versions." },
        ];

  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <Link
        href={`/admin/blueprints/${blueprint.id}`}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Back to Blueprint
      </Link>
      <PageHeader
        title={`${blueprint.title} · ${version}`}
        meta={`${blueprint.client} · ${blueprint.id}`}
        description={`Version history. The current version is ${blueprint.version}; nothing is deleted.`}
        className="mt-3"
      >
        <StatusBadge tone="neutral">{blueprint.status}</StatusBadge>
      </PageHeader>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Version" value={version} note={`Current ${blueprint.version}`} icon={Clock} />
        <StatCard label="Price" value={`$${blueprint.price.toLocaleString("en-US")}`} note="Fixed" icon={Clock} />
        <StatCard label="Valid until" value={blueprint.validUntil} note="Expires" icon={Clock} />
      </div>

      <SectionCard title="Versions" description="Newest first" className="mt-4" bodyClassName="divide-y divide-border">
        {versions.map((item) => (
          <div key={item.version} className="flex flex-wrap items-center gap-3 px-5 py-4">
            <span className="flex size-8 items-center justify-center rounded-full bg-secondary font-mono text-[10px] font-semibold text-muted-foreground">
              {item.version}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{item.note}</p>
              <p className="text-xs text-muted-foreground">{item.when}</p>
            </div>
            <StatusBadge tone={item.status === "Current" ? "success" : "neutral"}>
              {item.status}
            </StatusBadge>
          </div>
        ))}
      </SectionCard>
    </div>
  );
}
