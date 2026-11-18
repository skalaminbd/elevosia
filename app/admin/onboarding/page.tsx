import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardList, Layers, UserCheck, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { onboardingPipeline } from "@/lib/admin-data";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Onboarding | Elevosia Admin",
};

const templates = [
  { id: "field", name: "Field services", steps: 7, days: "5 business days", pm: "Alamin" },
  { id: "care", name: "Care providers", steps: 8, days: "7 business days", pm: "Maya" },
  { id: "agency", name: "Agencies", steps: 6, days: "5 business days", pm: "Maya" },
];

export default function OnboardingPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="Onboarding"
        meta="Clients"
        description="Every new client between the invite and the deposit. A card moves only when the step is really done."
      >
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/onboarding/templates">Templates</Link>
        </Button>
      </PageHeader>

      <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="In the pipeline" value={6} note="Across all stages" icon={UserPlus} />
        <StatCard label="Waiting on clients" value={5} note="Oldest: 4 days" icon={ClipboardList} tone="warning" />
        <StatCard label="Blueprints approved" value={1} note="Harbor Therapy" icon={UserCheck} />
        <StatCard label="Ready to start" value={0} note="No one blocked on us" icon={Layers} />
      </div>

      <SectionCard
        title="Pipeline"
        description="Invited → profile → NDA → requirements → Blueprint → contract → deposit → ready"
        className="mt-4"
        bodyClassName="p-3"
      >
        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-max gap-3">
            {onboardingPipeline.map((column) => (
              <div
                key={column.stage}
                className="w-64 shrink-0 rounded-lg border border-border bg-background"
              >
                <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
                  <p className="text-xs font-semibold">{column.stage}</p>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {column.cards.length}
                  </span>
                </div>
                <div className="space-y-2 p-2">
                  {column.cards.length === 0 ? (
                    <p className="rounded-md border border-dashed border-border px-3 py-6 text-center text-[11px] text-muted-foreground">
                      Nothing here
                    </p>
                  ) : (
                    column.cards.map((card) => (
                      <div
                        key={card.id}
                        className="rounded-md border border-border bg-card p-3 transition-colors hover:border-primary/30"
                      >
                        <p className="text-sm font-medium">{card.client}</p>
                        <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <span className="size-1.5 rounded-full bg-warning" aria-hidden="true" />
                          {card.missing}
                        </p>
                        <p className="mt-2 font-mono text-[10px] text-muted-foreground">
                          {card.days}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Checklist templates"
        description="What a new client is asked for, by service type."
        className="mt-4"
        bodyClassName="grid gap-3 p-4 sm:grid-cols-3"
      >
        {templates.map((template) => (
          <div key={template.id} className="rounded-lg border border-border p-4">
            <p className="text-sm font-medium">{template.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {template.steps} steps · {template.days}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <StatusBadge tone="neutral">Default PM · {template.pm}</StatusBadge>
              <span className="font-mono text-[10px] text-muted-foreground">Template</span>
            </div>
          </div>
        ))}
      </SectionCard>
    </div>
  );
}
