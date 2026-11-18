import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Clock, FileText, Lock } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge, type BadgeTone } from "@/components/admin/ui/StatusBadge";
import { BlueprintActions } from "@/components/admin/blueprints/BlueprintActions";
import { blueprints, type BlueprintStatus } from "@/lib/admin-data";

type Params = Promise<{ id: string }>;

const TONE: Record<BlueprintStatus, BadgeTone> = {
  Draft: "neutral",
  "Waiting for approval": "warning",
  Approved: "success",
  Expired: "danger",
};

const MILESTONE_TASKS = [
  ["Discovery workshop", "Roles and visit types", "Data import"],
  ["Weekly board", "Auto-fill rules", "Caregiver phone view"],
  ["Client records", "Family access", "Care plan fields"],
  ["Invoices", "Reminders", "Exports"],
  ["Training", "Migration checks", "Launch"],
];

export function generateStaticParams() {
  return blueprints.map((blueprint) => ({ id: blueprint.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const blueprint = blueprints.find((item) => item.id === id);
  return blueprint ? { title: `${blueprint.client} Blueprint | Elevosia Admin` } : {};
}

export default async function BlueprintDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const blueprint = blueprints.find((item) => item.id === id);
  if (!blueprint) notFound();

  const deposit = Math.round(blueprint.price * 0.4);
  const middle = Math.round(blueprint.price * 0.3);
  const launch = blueprint.price - deposit - middle;
  const hours = 40 * blueprint.milestones;
  const cost = hours * 38;
  const margin = blueprint.price - cost;

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
        title={blueprint.title}
        meta={`${blueprint.client} · ${blueprint.id} · ${blueprint.version}`}
        description={`Valid until ${blueprint.validUntil}`}
        className="mt-3"
      >
        <StatusBadge tone={TONE[blueprint.status]}>{blueprint.status}</StatusBadge>
        <StatusBadge tone="neutral">
          <Clock className="size-3" aria-hidden="true" />
          {blueprint.validUntil}
        </StatusBadge>
      </PageHeader>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Fixed price" value={`$${blueprint.price.toLocaleString("en-US")}`} note="No per-user fees" icon={FileText} />
        <StatCard label="Milestones" value={blueprint.milestones} note="Each with tasks" icon={Check} />
        <StatCard label="Version" value={blueprint.version} note="History kept" icon={FileText} />
        <StatCard label="Est. hours" value={hours} note={`Cost $${cost.toLocaleString("en-US")}`} icon={Clock} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          {Array.from({ length: blueprint.milestones }).map((_, index) => {
            const tasks = MILESTONE_TASKS[index] ?? MILESTONE_TASKS[0];
            return (
              <SectionCard
                key={index}
                title={`Milestone ${index + 1}`}
                description={`${tasks.length} tasks · client-visible where switched on`}
                action={<StatusBadge tone="neutral">Phase 1</StatusBadge>}
                bodyClassName="divide-y divide-border"
              >
                {tasks.map((task, taskIndex) => (
                  <div key={task} className="flex flex-wrap items-center gap-3 px-5 py-3">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {String(taskIndex + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1 text-sm">{task}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {8 + taskIndex * 2} h
                    </span>
                    <StatusBadge tone={taskIndex === 0 ? "accent" : "neutral"}>
                      {taskIndex === 0 ? "Client-visible" : "Internal"}
                    </StatusBadge>
                  </div>
                ))}
              </SectionCard>
            );
          })}
        </div>

        <div className="space-y-4">
          <BlueprintActions status={blueprint.status} />

          <SectionCard title="Payment schedule" description="Default 40 / 30 / 30">
            <div className="divide-y divide-border">
              {[
                ["Deposit", deposit, "On approval"],
                ["Mid-project", middle, "At the demo"],
                ["At launch", launch, "On handover"],
              ].map(([label, amount, when]) => (
                <div key={String(label)} className="flex items-center justify-between gap-3 px-5 py-3">
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
                <span className="font-mono text-xs">${cost.toLocaleString("en-US")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Margin</span>
                <span className="font-mono text-xs font-semibold">
                  ${margin.toLocaleString("en-US")} ({Math.round((margin / blueprint.price) * 100)}%)
                </span>
              </div>
              <p className="flex items-center gap-1.5 border-t border-border pt-2 text-[10px] text-muted-foreground">
                <Lock className="size-3" aria-hidden="true" />
                Not visible to the client.
              </p>
            </div>
          </SectionCard>

          <Link
            href={`/admin/blueprints/${blueprint.id}/versions/${blueprint.version}`}
            className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-xs font-medium transition-colors hover:border-primary/30"
          >
            Version history
            <span className="font-mono text-[10px] text-muted-foreground">
              {blueprint.version}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
