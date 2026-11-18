import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock, RefreshCw, Wallet } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Progress } from "@/components/admin/ui/Progress";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";

export const metadata: Metadata = { title: "Retainers and care plans | Elevosia Admin" };

const PLANS = [
  { id: "RP-1", client: "Harbor Therapy", plan: "Growth care", amount: 699, hours: 6, used: 2.5, next: "1 Dec 2026", status: "Active" },
  { id: "RP-2", client: "Lumen Studio", plan: "Retainer · 20 h", amount: 2400, hours: 20, used: 11, next: "1 Dec 2026", status: "Active" },
  { id: "RP-3", client: "Brightline Care", plan: "Essential care", amount: 299, hours: 2, used: 0, next: "At launch", status: "Starts at launch" },
  { id: "RP-4", client: "Ridgeline Cleaning", plan: "Care plan", amount: 0, hours: 0, used: 0, next: "—", status: "Paused" },
];

export default function RetainersPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <Link href="/admin/invoices" className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Invoices
      </Link>
      <PageHeader
        title="Retainers and care plans"
        meta="Finance"
        description="Monthly plans, their hours bucket and the next automatic invoice."
        className="mt-3"
      />
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Active plans" value={2} note="Monthly" icon={RefreshCw} />
        <StatCard label="Monthly value" value="$3,398" note="Invoices on the 1st" icon={Wallet} tone="success" />
        <StatCard label="Hours used" value="13.5 / 26" note="This month" icon={Clock} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        {PLANS.map((plan) => (
          <SectionCard key={plan.id} title={plan.client} description={plan.plan} action={<StatusBadge tone={plan.status === "Active" ? "success" : plan.status === "Paused" ? "neutral" : "warning"}>{plan.status}</StatusBadge>}>
            <div className="p-5">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-lg font-semibold">
                  ${plan.amount.toLocaleString("en-US")}
                  <span className="text-xs font-normal text-muted-foreground"> /mo</span>
                </span>
                <span className="text-xs text-muted-foreground">Next: {plan.next}</span>
              </div>
              {plan.hours > 0 ? (
                <>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Hours used</span>
                    <span className="font-mono">{plan.used} / {plan.hours}</span>
                  </div>
                  <div className="mt-1.5">
                    <Progress value={(plan.used / plan.hours) * 100} />
                  </div>
                </>
              ) : (
                <p className="mt-2 text-xs text-muted-foreground">No hours on this plan.</p>
              )}
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
