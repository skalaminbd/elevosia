import { connection } from "next/server";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatusBadge, type BadgeTone } from "@/components/admin/ui/StatusBadge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { listHealthRules, listNotificationSettings } from "@/db/queries";

/** Project health rules and team notification defaults from Postgres. */
export async function SettingsData() {
  await connection();
  const [rules, notifications] = await Promise.all([
    listHealthRules(),
    listNotificationSettings("team"),
  ]);

  return (
    <>
      <SectionCard title="Project health" description="Rules used by the dashboard and project list">
        <div className="divide-y divide-border">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="flex items-start justify-between gap-3 px-5 py-4"
            >
              <div>
                <p className="text-sm font-medium">{rule.label}</p>
                <p className="mt-0.5 max-w-md text-xs text-muted-foreground">
                  {rule.body}
                </p>
              </div>
              <StatusBadge tone={rule.tone as BadgeTone}>
                {rule.label}
              </StatusBadge>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Notifications" description="Team defaults; each person can change these">
        <div className="divide-y divide-border">
          {notifications.map((item) => (
            <div key={item.id} className="flex items-start gap-3 px-5 py-4">
              <Checkbox
                id={`notify-${item.id}`}
                defaultChecked={item.enabled}
                className="mt-0.5"
              />
              <div>
                <Label
                  htmlFor={`notify-${item.id}`}
                  className="text-sm font-medium"
                >
                  {item.label}
                </Label>
                <p className="text-xs text-muted-foreground">{item.hint}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  );
}
