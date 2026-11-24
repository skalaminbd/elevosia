import type { Metadata } from "next";
import { Suspense } from "react";
import { NativeSelect } from "@/components/shared/NativeSelect";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { Label } from "@/components/ui/label";
import { SettingsData } from "@/components/admin/settings/SettingsData";
import { TwoFactorSetup } from "@/components/admin/settings/TwoFactorSetup";

export const metadata: Metadata = {
  title: "Settings | Elevosia Admin",
};

export default function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="Settings"
        meta="Admin"
        description="Workspace details, project health rules and the security defaults."
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

        <Suspense
          fallback={
            <>
              <div className="h-52 rounded-lg border border-border bg-card" />
              <div className="h-52 rounded-lg border border-border bg-card" />
            </>
          }
        >
          <SettingsData />
        </Suspense>

        <SectionCard
          title="Security"
          description="Defaults for every staff account"
          bodyClassName="divide-y divide-border"
        >
          <TwoFactorSetup />
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
    </div>
  );
}
