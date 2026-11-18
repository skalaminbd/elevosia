import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check, FileText, Layers, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { portalBlueprint } from "@/lib/portal-data";

export const metadata: Metadata = {
  title: "Blueprints | Elevosia client portal",
};

export default function PortalBlueprintsPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px]">
      <PageHeader
        title="Blueprints"
        meta="Project"
        description="The approved plan for your build: milestones, payments and what is in scope."
      />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Status" value="Approved" note={portalBlueprint.version} icon={ShieldCheck} tone="success" />
        <StatCard label="Fixed price" value={`$${portalBlueprint.price.toLocaleString("en-US")}`} note="No per-user fees" icon={FileText} />
        <StatCard label="Milestones" value={portalBlueprint.milestones.length} note="All in scope" icon={Layers} />
        <StatCard label="Valid until" value="1 Dec" note="Then archived" icon={FileText} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <SectionCard
          title={portalBlueprint.title}
          description={`${portalBlueprint.id} · ${portalBlueprint.version} · approved`}
          className="xl:col-span-2"
          action={<StatusBadge tone="success">Approved</StatusBadge>}
          bodyClassName="p-5"
        >
          <ol className="space-y-3">
            {portalBlueprint.milestones.map((milestone, index) => (
              <li key={milestone} className="flex items-center gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-[10px] font-semibold text-primary">
                  {index + 1}
                </span>
                <p className="text-sm font-medium">{milestone}</p>
              </li>
            ))}
          </ol>

          <div className="mt-5 border-t border-border pt-4">
            <p className="text-xs font-semibold text-muted-foreground">In scope</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {["Scheduling", "Client CRM", "Care plans", "Invoicing", "Client portal", "Reports"].map(
                (module) => (
                  <span
                    key={module}
                    className="rounded-full border border-border px-2.5 py-0.5 text-xs"
                  >
                    {module}
                  </span>
                ),
              )}
            </div>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            The plan is locked. New scope goes through a change request.
          </p>
        </SectionCard>

        <SectionCard title="Payments" description="Per the Blueprint">
          <div className="divide-y divide-border">
            {portalBlueprint.schedule.map((item) => (
              <div key={item.id} className="flex items-center gap-3 px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.due}</p>
                </div>
                <span className="font-mono text-xs font-semibold">
                  ${item.amount.toLocaleString("en-US")}
                </span>
                <StatusBadge tone={item.state === "Paid" ? "success" : "neutral"}>
                  {item.state === "Paid" ? (
                    <Check className="size-3" aria-hidden="true" />
                  ) : null}
                  {item.state}
                </StatusBadge>
              </div>
            ))}
            <Link
              href="/portal/approvals"
              className="flex items-center justify-between px-5 py-3.5 text-xs font-medium text-primary hover:underline"
            >
              Need something different?
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
