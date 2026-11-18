import type { Metadata } from "next";
import { ArrowUpRight, Megaphone, MousePointerClick, Search, Send } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Progress } from "@/components/admin/ui/Progress";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge, type BadgeTone } from "@/components/admin/ui/StatusBadge";
import { campaigns } from "@/lib/admin-data";

export const metadata: Metadata = {
  title: "Marketing | Elevosia Admin",
};

const TONE: Record<string, BadgeTone> = {
  Live: "success",
  Review: "warning",
  Writing: "info",
  Planned: "neutral",
};

const SEARCH_ROWS = [
  { label: "Google impressions", value: "18.4k", change: "+12%" },
  { label: "Clicks from search", value: "1,120", change: "+8%" },
  { label: "AI answers citing us", value: "14", change: "+5" },
];

export default function MarketingPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px]">
      <PageHeader
        title="Marketing"
        meta="Team & growth"
        description="Campaigns, content and the numbers behind them. Website work for clients is tracked separately."
      />

      <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="Live campaigns" value={1} note="Field services page" icon={Megaphone} />
        <StatCard label="Leads this month" value={14} note="6 from search" icon={MousePointerClick} tone="success" />
        <StatCard label="Organic sessions" value="3,240" note="Last 28 days" icon={Search} />
        <StatCard label="Newsletter" value="812" note="41% open rate" icon={Send} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <SectionCard
          title="Campaigns"
          description="Everything in flight this month"
          className="xl:col-span-2"
          bodyClassName="divide-y divide-border"
        >
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{campaign.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {campaign.channel} · {campaign.owner} · {campaign.due}
                  </p>
                </div>
                <StatusBadge tone={TONE[campaign.status] ?? "neutral"}>
                  {campaign.status}
                </StatusBadge>
              </div>
              <div className="mt-2.5 flex items-center gap-3">
                <Progress value={campaign.progress} />
                <span className="w-8 shrink-0 text-right font-mono text-[10px] text-muted-foreground">
                  {campaign.progress}%
                </span>
              </div>
            </div>
          ))}
        </SectionCard>

        <SectionCard
          title="Search and AI visibility"
          description="Last 28 days"
          bodyClassName="divide-y divide-border"
        >
          {SEARCH_ROWS.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-3 px-5 py-4"
            >
              <p className="text-sm text-muted-foreground">{row.label}</p>
              <div className="text-right">
                <p className="font-mono text-sm font-semibold tabular-nums">{row.value}</p>
                <p className="flex items-center justify-end gap-0.5 text-[10px] text-success">
                  <ArrowUpRight className="size-3" aria-hidden="true" />
                  {row.change}
                </p>
              </div>
            </div>
          ))}
        </SectionCard>
      </div>
    </div>
  );
}
