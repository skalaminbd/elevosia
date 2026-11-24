import { connection } from "next/server";
import { Clock, RefreshCw, Wallet } from "lucide-react";
import { Progress } from "@/components/admin/ui/Progress";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { listRetainers } from "@/db/queries";

/** Retainers and care plans from Postgres. */
export async function RetainersData() {
  await connection();
  const retainers = await listRetainers();
  const active = retainers.filter((plan) => plan.status === "Active");
  const monthly = active.reduce((total, plan) => total + plan.amount, 0);
  const withHours = active.filter((plan) => plan.hours > 0);
  const used = withHours.reduce((total, plan) => total + plan.used, 0);
  const hours = withHours.reduce((total, plan) => total + plan.hours, 0);

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard
          label="Active plans"
          value={active.length}
          note="Monthly"
          icon={RefreshCw}
        />
        <StatCard
          label="Monthly value"
          value={`$${monthly.toLocaleString("en-US")}`}
          note="Invoices on the 1st"
          icon={Wallet}
          tone="success"
        />
        <StatCard
          label="Hours used"
          value={`${used} / ${hours}`}
          note="This month"
          icon={Clock}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        {retainers.map((plan) => (
          <SectionCard
            key={plan.id}
            title={plan.client}
            description={plan.plan}
            action={
              <StatusBadge
                tone={
                  plan.status === "Active"
                    ? "success"
                    : plan.status === "Paused"
                      ? "neutral"
                      : "warning"
                }
              >
                {plan.status}
              </StatusBadge>
            }
          >
            <div className="p-5">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-lg font-semibold">
                  ${plan.amount.toLocaleString("en-US")}
                  <span className="text-xs font-normal text-muted-foreground">
                    {" "}
                    /mo
                  </span>
                </span>
                <span className="text-xs text-muted-foreground">
                  Next: {plan.next}
                </span>
              </div>
              {plan.hours > 0 ? (
                <>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Hours used</span>
                    <span className="font-mono">
                      {plan.used} / {plan.hours}
                    </span>
                  </div>
                  <div className="mt-1.5">
                    <Progress value={(plan.used / plan.hours) * 100} />
                  </div>
                </>
              ) : (
                <p className="mt-2 text-xs text-muted-foreground">
                  No hours on this plan.
                </p>
              )}
            </div>
          </SectionCard>
        ))}
      </div>
    </>
  );
}
