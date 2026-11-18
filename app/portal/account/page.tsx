import type { Metadata } from "next";
import { KeyRound, ShieldCheck, Users } from "lucide-react";
import { Avatar } from "@/components/admin/ui/Avatar";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { portalClient, portalTeam } from "@/lib/portal-data";

export const metadata: Metadata = {
  title: "Account | Elevosia client portal",
};

const NOTIFY = [
  { id: "updates", label: "Weekly board updates", hint: "Tasks, demos and reports", on: true },
  { id: "approvals", label: "Approvals and Blueprints", hint: "When something needs your answer", on: true },
  { id: "invoices", label: "Invoices and payments", hint: "Due dates and receipts", on: true },
  { id: "news", label: "Product news", hint: "New modules and features", on: false },
];

export default function PortalAccountPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px]">
      <PageHeader
        title="Account and team"
        meta="Settings"
        description="Company details, who can see what, and the notifications you get."
      />

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <SectionCard title="Company profile" description="Used on invoices and the portal">
          <div className="space-y-4 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="company" className="text-xs font-medium">Company</Label>
                <input
                  id="company"
                  defaultValue={portalClient.company}
                  className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contact" className="text-xs font-medium">Main contact</Label>
                <input
                  id="contact"
                  defaultValue={portalClient.contact}
                  className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="billing" className="text-xs font-medium">Billing email</Label>
                <input
                  id="billing"
                  type="email"
                  defaultValue={portalClient.email}
                  className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="timezone" className="text-xs font-medium">Time zone</Label>
                <select
                  id="timezone"
                  defaultValue="America/Chicago"
                  className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="America/Chicago">US Central (CT)</option>
                  <option value="America/New_York">US Eastern (ET)</option>
                  <option value="America/Denver">US Mountain (MT)</option>
                  <option value="America/Los_Angeles">US Pacific (PT)</option>
                </select>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Your plan: {portalClient.plan}. Week rollover and due dates use your time
              zone.
            </p>
          </div>
        </SectionCard>

        <SectionCard
          title="Team"
          description="Who can open the portal"
          action={
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="size-3.5" aria-hidden="true" />
              {portalTeam.length}
            </span>
          }
          bodyClassName="divide-y divide-border"
        >
          {portalTeam.map((member) => (
            <div key={member.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
              <Avatar initials={member.initials} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{member.name}</p>
                <p className="truncate text-xs text-muted-foreground">{member.email}</p>
              </div>
              <div className="text-right">
                <StatusBadge tone={member.role === "Owner" ? "accent" : "neutral"}>
                  {member.role}
                </StatusBadge>
                <p className="mt-1 text-[10px] text-muted-foreground">{member.projects}</p>
              </div>
            </div>
          ))}
          <p className="px-5 py-3 text-[11px] text-muted-foreground">
            The owner can invite teammates, choose their projects and give approve or
            pay rights.
          </p>
        </SectionCard>

        <SectionCard title="Notifications" description="Per person; email and in-app">
          <div className="divide-y divide-border">
            {NOTIFY.map((item) => (
              <div key={item.id} className="flex items-start gap-3 px-5 py-3.5">
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

        <SectionCard title="Security" description="Your sign-in and sessions">
          <div className="divide-y divide-border">
            <div className="flex items-start gap-3 px-5 py-4">
              <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                <ShieldCheck className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Two-factor authentication</p>
                <p className="text-xs text-muted-foreground">
                  Ask for a code when signing in from a new device.
                </p>
              </div>
              <StatusBadge tone="success">On</StatusBadge>
            </div>
            <div className="flex items-start gap-3 px-5 py-4">
              <span className="flex size-8 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                <KeyRound className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Password</p>
                <p className="text-xs text-muted-foreground">
                  Last changed 42 days ago.
                </p>
              </div>
              <span className="text-[10px] text-muted-foreground">Owner only</span>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm font-medium">Active sessions</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Chrome on Mac · Nashville · active now
              </p>
              <p className="text-xs text-muted-foreground">
                Safari on iPhone · Nashville · 2 days ago
              </p>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Your data"
        description="Owner only"
        className="mt-4"
        bodyClassName="p-5"
      >
        <p className="max-w-3xl text-sm text-muted-foreground">
          Export every project, file list, invoice and message as a ZIP, or ask us to
          delete the account. Deletion is handled by our team under the privacy policy.
        </p>
      </SectionCard>
    </div>
  );
}
