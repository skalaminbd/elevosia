import Link from "next/link";
import { connection } from "next/server";
import {
  ArrowLeft,
  CalendarClock,
  CircleDollarSign,
  TriangleAlert,
} from "lucide-react";
import { Progress } from "@/components/admin/ui/Progress";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { listInstallments } from "@/db/queries";

/** Installment plans from Postgres, read at request time. */
export async function InstallmentsData() {
  await connection();
  const installments = await listInstallments();
  const total = installments.reduce((sum, plan) => sum + plan.total, 0);
  const paid = installments.reduce((sum, plan) => sum + plan.paid, 0);
  const missed = installments.reduce((sum, plan) => sum + plan.missed, 0);
  const missedPlans = installments.filter((plan) => plan.missed > 0).length;

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard
          label="Plans"
          value={installments.length}
          note="Active"
          icon={CalendarClock}
        />
        <StatCard
          label="Paid"
          value={`$${paid.toLocaleString("en-US")}`}
          note={`of $${total.toLocaleString("en-US")}`}
          icon={CircleDollarSign}
          tone="success"
        />
        <StatCard
          label="Missed payments"
          value={missed}
          note={`${missedPlans} ${missedPlans === 1 ? "plan" : "plans"}`}
          icon={TriangleAlert}
          tone="danger"
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        {installments.map((plan) => (
          <SectionCard
            key={plan.id}
            title={plan.client}
            description={`${plan.months} months · ${plan.id}`}
          >
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
                <Progress
                  value={(plan.paid / plan.total) * 100}
                  tone={plan.missed > 0 ? "warning" : "primary"}
                />
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
    </>
  );
}

/** Page shell kept here so the back link stays static. */
export function InstallmentsHeader() {
  return (
    <Link
      href="/admin/invoices"
      className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="size-3.5" aria-hidden="true" />
      Invoices
    </Link>
  );
}
