import { connection } from "next/server";
import { CalendarClock, Check, Video } from "lucide-react";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatCard } from "@/components/admin/ui/StatCard";
import { listPortalCalls } from "@/db/queries";
import { requirePortalClientId } from "@/lib/portal-session";
import { ButtonLink } from "@/components/shared/ButtonLink";

/** Client calls from Postgres, read at request time. */
export async function PortalCallsData() {
  await connection();
  const clientId = await requirePortalClientId();
  const calls = await listPortalCalls(clientId);

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard
          label="Next call"
          value={calls.upcoming?.when.split(",")[0] ?? "None"}
          note={calls.upcoming?.when ?? "Book one when you need it"}
          icon={CalendarClock}
        />
        <StatCard
          label="Past calls"
          value={calls.past.length}
          note="Notes shared"
          icon={Video}
        />
        <StatCard
          label="Live hours"
          value="8–12"
          note="US Eastern, Mon–Fri"
          icon={CalendarClock}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <SectionCard title="Upcoming" description="This week" className="xl:col-span-1">
          <div className="p-5">
            {calls.upcoming ? (
              <>
                <p className="text-sm font-medium">{calls.upcoming.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {calls.upcoming.when}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {calls.upcoming.with}
                </p>
                <p className="mt-3 rounded-md bg-secondary px-3 py-2 text-[11px] text-muted-foreground">
                  {calls.upcoming.join}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                No call booked yet.
              </p>
            )}
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
          {calls.past.length === 0 ? (
            <p className="px-5 py-6 text-sm text-muted-foreground">
              No past calls yet.
            </p>
          ) : (
            calls.past.map((call) => (
              <div key={call.id} className="px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium">{call.title}</p>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {call.when}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {call.notes}
                </p>
                <ul className="mt-2 space-y-1">
                  {call.actions.map((action) => (
                    <li
                      key={action}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <Check className="size-3.5 text-success" aria-hidden="true" />
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </SectionCard>
      </div>
    </>
  );
}
