import type { Metadata } from "next";
import { CalendarClock, Check, Video } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { portalCalls } from "@/lib/portal-data";
import { ButtonLink } from "@/components/shared/ButtonLink";

export const metadata: Metadata = {
  title: "Calls | Elevosia client portal",
};

export default function PortalCallsPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="Calls"
        meta="Support"
        description="Your next call, the notes from past ones and the actions that came out of them."
      />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Next call" value="Fri 22 Nov" note="10:00 am CT" icon={CalendarClock} />
        <StatCard label="Past calls" value={portalCalls.past.length} note="Notes shared" icon={Video} />
        <StatCard label="Live hours" value="8–12" note="US Eastern, Mon–Fri" icon={CalendarClock} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <SectionCard title="Upcoming" description="This week" className="xl:col-span-1">
          <div className="p-5">
            <p className="text-sm font-medium">{portalCalls.upcoming.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {portalCalls.upcoming.when}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {portalCalls.upcoming.with}
            </p>
            <p className="mt-3 rounded-md bg-secondary px-3 py-2 text-[11px] text-muted-foreground">
              {portalCalls.upcoming.join}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <ButtonLink href="/book-a-call">Book another call</ButtonLink>
            </div>
            <p className="mt-3 text-[10px] text-muted-foreground">
              Reschedule or cancel up to 4 hours before the call.
            </p>
          </div>
        </SectionCard>

        <SectionCard
          title="Past calls"
          description="Client-visible notes and actions"
          className="xl:col-span-2"
          bodyClassName="divide-y divide-border"
        >
          {portalCalls.past.map((call) => (
            <div key={call.id} className="px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium">{call.title}</p>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {call.when}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">{call.notes}</p>
              <ul className="mt-2 space-y-1">
                {call.actions.map((action) => (
                  <li
                    key={action}
                    className="flex items-start gap-1.5 text-xs text-muted-foreground"
                  >
                    <Check className="mt-0.5 size-3 shrink-0 text-success" aria-hidden="true" />
                    {action}
                  </li>
                ))}
              </ul>
              <StatusBadge tone="neutral" className="mt-2">
                Notes visible to you and your PM
              </StatusBadge>
            </div>
          ))}
        </SectionCard>
      </div>
    </div>
  );
}
