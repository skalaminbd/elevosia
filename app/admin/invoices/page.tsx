import type { Metadata } from "next";
import { CalendarClock, CircleDollarSign, Receipt, TriangleAlert } from "lucide-react";
import { InvoicesTable } from "@/components/admin/invoices/InvoicesTable";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Progress } from "@/components/admin/ui/Progress";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { installments } from "@/lib/admin-data";

export const metadata: Metadata = {
  title: "Invoices | Elevosia Admin",
};

const RETAINERS = [
  { id: "R-1", client: "Harbor Therapy", plan: "Growth care", amount: 699, next: "1 Dec", state: "Active" },
  { id: "R-2", client: "Lumen Studio", plan: "Retainer · 20 h", amount: 2400, next: "1 Dec", state: "Active" },
  { id: "R-3", client: "Brightline Care", plan: "Essential care", amount: 299, next: "1 Dec", state: "Starts at launch" },
];

export default function InvoicesPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px]">
      <PageHeader
        title="Invoices"
        meta="Finance"
        description="What came in, what is due and what needs a nudge. Care plans invoice themselves on the 1st."
      />

      <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="Paid this month" value="$7,040" note="2 invoices" icon={Receipt} tone="success" />
        <StatCard label="Due" value="$11,100" note="4 invoices before 2 Dec" icon={CalendarClock} />
        <StatCard label="Overdue" value="$4,800" note="Lumen Studio · 7 days" icon={TriangleAlert} tone="danger" />
        <StatCard label="Monthly care plans" value="$3,398" note="3 active or starting" icon={CircleDollarSign} />
      </div>

      <div className="mt-4">
        <InvoicesTable />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <SectionCard
          title="Installment plans"
          description="Ideas for clients paying across months"
          bodyClassName="divide-y divide-border"
        >
          {installments.map((plan) => (
            <div key={plan.id} className="px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium">{plan.client}</p>
                <span className="font-mono text-xs text-muted-foreground">
                  ${plan.paid.toLocaleString("en-US")} / $
                  {plan.total.toLocaleString("en-US")}
                </span>
              </div>
              <div className="mt-2">
                <Progress
                  value={(plan.paid / plan.total) * 100}
                  tone={plan.missed > 0 ? "warning" : "primary"}
                />
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>
                  {plan.months} months · next {plan.next}
                </span>
                {plan.missed > 0 ? (
                  <StatusBadge tone="warning">{plan.missed} missed payment</StatusBadge>
                ) : (
                  <StatusBadge tone="success">On schedule</StatusBadge>
                )}
              </div>
            </div>
          ))}
        </SectionCard>

        <SectionCard
          title="Retainers and care plans"
          description="Auto-invoiced monthly"
          bodyClassName="divide-y divide-border"
        >
          {RETAINERS.map((plan) => (
            <div
              key={plan.id}
              className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{plan.client}</p>
                <p className="text-xs text-muted-foreground">
                  {plan.plan} · next {plan.next}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs tabular-nums">
                  ${plan.amount.toLocaleString("en-US")}/mo
                </span>
                <StatusBadge tone={plan.state === "Active" ? "success" : "neutral"}>
                  {plan.state}
                </StatusBadge>
              </div>
            </div>
          ))}
        </SectionCard>
      </div>
    </div>
  );
}
