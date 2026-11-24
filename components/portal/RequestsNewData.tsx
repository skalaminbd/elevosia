import { connection } from "next/server";
import { Clock, Sparkles } from "lucide-react";
import { Progress } from "@/components/admin/ui/Progress";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatCard } from "@/components/admin/ui/StatCard";
import { NewRequestForm } from "@/components/portal/NewRequestForm";
import { getPortalRetainer } from "@/db/queries";
import { requirePortalClientId } from "@/lib/portal-session";

/** New work request page, with the live care plan balance. */
export async function RequestsNewData() {
  await connection();
  const clientId = await requirePortalClientId();
  const plan = await getPortalRetainer(clientId);
  const retainer = plan ?? {
    plan: "Care plan",
    price: 0,
    hours: 1,
    used: 0,
    next: "—",
    sla: "",
    work: [],
  };

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard
          label="Hours left"
          value={`${retainer.hours - retainer.used} h`}
          note={`of ${retainer.hours} h this month`}
          icon={Clock}
        />
        <StatCard
          label="Plan"
          value={retainer.plan}
          note={retainer.sla}
          icon={Sparkles}
        />
        <StatCard
          label="Renews"
          value={retainer.next}
          note="Unused hours do not roll over"
          icon={Clock}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <NewRequestForm retainer={retainer} />
        </div>
        <SectionCard title="This month" description="Care plan hours">
          <div className="p-5">
            <div className="flex items-baseline justify-between">
              <p className="font-mono text-2xl font-semibold tabular-nums">
                {retainer.used} h
              </p>
              <p className="text-xs text-muted-foreground">
                used of {retainer.hours} h
              </p>
            </div>
            <div className="mt-2">
              <Progress
                value={
                  retainer.hours > 0
                    ? (retainer.used / retainer.hours) * 100
                    : 0
                }
              />
            </div>
            <ul className="mt-4 space-y-2 border-t border-border pt-3">
              {retainer.work.map((item) => (
                <li key={item.id} className="flex items-center gap-2 text-xs">
                  <span className="min-w-0 flex-1 truncate text-muted-foreground">
                    {item.title}
                  </span>
                  <span className="font-mono text-muted-foreground">
                    {item.hours} h
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </SectionCard>
      </div>
    </>
  );
}
