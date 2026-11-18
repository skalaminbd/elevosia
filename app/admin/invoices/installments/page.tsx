import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CalendarClock, CircleDollarSign, TriangleAlert } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Progress } from "@/components/admin/ui/Progress";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { installments } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Installment plans | Elevosia Admin" };

export default function InstallmentsPage() {
  const total = installments.reduce((sum, plan) => sum + plan.total, 0);
  const paid = installments.reduce((sum, plan) => sum + plan.paid, 0);

  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <Link href="/admin/invoices" className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Invoices
      </Link>
      <PageHeader
        title="Installment plans"
        meta="Finance"
        description="Every plan, what is paid, what is next and any missed payment."
        className="mt-3"
      />
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Plans" value={installments.length} note="Active" icon={CalendarClock} />
        <StatCard label="Paid" value={`$${paid.toLocaleString("en-US")}`} note={`of $${total.toLocaleString("en-US")}`} icon={CircleDollarSign} tone="success" />
        <StatCard label="Missed payments" value={installments.reduce((sum, plan) => sum + plan.missed, 0)} note="One plan" icon={TriangleAlert} tone="danger" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        {installments.map((plan) => (
          <SectionCard key={plan.id} title={plan.client} description={`${plan.months} months · ${plan.id}`}>
            <div className="p-5">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-lg font-semibold">
                  ${plan.paid.toLocaleString("en-US")}
                </span>
                <span className="text-xs text-muted-foreground">
                  of ${plan.total.toLocaleString("en-US")}
                </span>
              </div>
              <div className="mt-2">
                <Progress value={(plan.paid / plan.total) * 100} tone={plan.missed > 0 ? "warning" : "primary"} />
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>Next {plan.next}</span>
                <StatusBadge tone={plan.missed > 0 ? "warning" : "success"}>
                  {plan.missed > 0 ? `${plan.missed} missed` : "On schedule"}
                </StatusBadge>
              </div>
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
