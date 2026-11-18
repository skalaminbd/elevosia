import type { Metadata } from "next";
import { NativeSelect } from "@/components/shared/NativeSelect";
import { Check, Minus, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = {
  title: "Settings | Elevosia Admin",
};

const ROLES = ["Admin", "PM", "Dev", "Mkt", "Sup"];

const PERMISSIONS: { page: string; access: boolean[] }[] = [
  { page: "Clients", access: [true, true, false, true, true] },
  { page: "Requirements and Blueprints", access: [true, true, false, false, false] },
  { page: "Projects", access: [true, true, true, true, true] },
  { page: "Invoices", access: [true, false, false, false, true] },
  { page: "Marketing", access: [true, false, false, true, false] },
  { page: "Settings", access: [true, false, false, false, false] },
];

const NOTIFICATIONS = [
  { id: "briefing", label: "Daily AI briefing", hint: "Every weekday at 7:30 am", on: true },
  { id: "sla", label: "SLA breach alerts", hint: "When a ticket is close to breaching", on: true },
  { id: "replies", label: "Client replies", hint: "Portal and email replies", on: true },
  { id: "digest", label: "Weekly board digest", hint: "Friday summary of all projects", on: false },
];

const HEALTH_RULES = [
  { id: "on-track", label: "On track", body: "No milestone overdue and no task past its week.", tone: "success" as const },
  { id: "at-risk", label: "At risk", body: "One milestone overdue, or two client approvals waiting over 3 days.", tone: "warning" as const },
  { id: "late", label: "Late", body: "More than one milestone overdue, or launch date passed.", tone: "danger" as const },
];

export default function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="Settings"
        meta="Admin"
        description="Workspace details, permissions, project health rules and the security defaults."
      />

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <SectionCard title="Workspace" description="Used on invoices and the client portal">
          <div className="space-y-4 p-5">
            <div className="space-y-1.5">
              <Label htmlFor="workspace-name" className="text-xs font-medium">
                Workspace name
              </Label>
              <input
                id="workspace-name"
                defaultValue="Elevosia"
                className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="workspace-tz" className="text-xs font-medium">
                  Staff time zone
                </Label>
                <NativeSelect
                  id="workspace-tz"
                  defaultValue="America/New_York"
                  className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="America/New_York">US Eastern (ET)</option>
                  <option value="America/Chicago">US Central (CT)</option>
                  <option value="America/Denver">US Mountain (MT)</option>
                  <option value="America/Los_Angeles">US Pacific (PT)</option>
                </NativeSelect>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="workspace-week" className="text-xs font-medium">
                  Week starts on
                </Label>
                <NativeSelect
                  id="workspace-week"
                  defaultValue="monday"
                  className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="monday">Monday</option>
                  <option value="sunday">Sunday</option>
                </NativeSelect>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Client weeks always roll over in the client&apos;s own time zone.
            </p>
          </div>
        </SectionCard>

        <SectionCard title="Roles and permissions" description="Who can open which page">
          <div className="overflow-x-auto p-5">
            <table className="w-full min-w-[460px] text-left text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr>
                  <th className="pb-2 font-medium">Page</th>
                  {ROLES.map((role) => (
                    <th key={role} className="pb-2 text-center font-medium">
                      {role}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERMISSIONS.map((row) => (
                  <tr key={row.page} className="border-t border-border">
                    <td className="py-2.5 text-xs">{row.page}</td>
                    {row.access.map((allowed, index) => (
                      <td key={ROLES[index]} className="py-2.5 text-center">
                        {allowed ? (
                          <Check
                            className="mx-auto size-3.5 text-success"
                            aria-label="Allowed"
                          />
                        ) : (
                          <Minus
                            className="mx-auto size-3.5 text-muted-foreground/50"
                            aria-label="Not allowed"
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="Project health" description="Rules used by the dashboard and project list">
          <div className="divide-y divide-border">
            {HEALTH_RULES.map((rule) => (
              <div key={rule.id} className="flex items-start justify-between gap-3 px-5 py-4">
                <div>
                  <p className="text-sm font-medium">{rule.label}</p>
                  <p className="mt-0.5 max-w-md text-xs text-muted-foreground">
                    {rule.body}
                  </p>
                </div>
                <StatusBadge tone={rule.tone}>{rule.label}</StatusBadge>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Notifications" description="Team defaults; each person can change these">
          <div className="divide-y divide-border">
            {NOTIFICATIONS.map((item) => (
              <div key={item.id} className="flex items-start gap-3 px-5 py-4">
                <Checkbox
                  id={`notify-${item.id}`}
                  defaultChecked={item.on}
                  className="mt-0.5"
                />
                <div>
                  <Label htmlFor={`notify-${item.id}`} className="text-sm font-medium">
                    {item.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">{item.hint}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Security"
        description="Defaults for every staff account"
        className="mt-4"
        bodyClassName="divide-y divide-border"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div className="flex items-start gap-3">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <ShieldCheck className="size-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-medium">Two-factor authentication</p>
              <p className="text-xs text-muted-foreground">
                Required for every staff account before the admin panel opens.
              </p>
            </div>
          </div>
          <StatusBadge tone="success">Required</StatusBadge>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div>
            <p className="text-sm font-medium">HIPAA mode</p>
            <p className="text-xs text-muted-foreground">
              Per client. Turns AI off and adds upload warnings for patient data.
            </p>
          </div>
          <p className="font-mono text-xs text-muted-foreground">
            Care providers · 2 clients
          </p>
        </div>
      </SectionCard>
    </div>
  );
}
