import { connection } from "next/server";
import { CalendarClock, FileText, PhoneCall, Video } from "lucide-react";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge, type BadgeTone } from "@/components/admin/ui/StatusBadge";
import { listCallNotes, listCalls } from "@/db/queries";
import type { CallRecord } from "@/lib/admin-data";

const KIND_TONE: Record<CallRecord["kind"], BadgeTone> = {
  Weekly: "accent",
  Discovery: "info",
  Launch: "success",
  Internal: "neutral",
  "Care review": "warning",
};

/** Calls from Postgres, read at request time. */
export async function CallsData() {
  await connection();
  const [calls, notes] = await Promise.all([listCalls(), listCallNotes()]);
  const today = calls.filter((call) => call.day === "Today");

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-3">
        <StatCard
          label="Calls today"
          value={today.length}
          note={today[0] ? `First at ${today[0].time}` : "Nothing booked"}
          icon={PhoneCall}
        />
        <StatCard
          label="This week"
          value={calls.length}
          note={`${calls.filter((call) => call.kind === "Discovery").length} discoveries`}
          icon={CalendarClock}
        />
        <StatCard
          label="Open action items"
          value={3}
          note="From last week's calls"
          icon={FileText}
          tone="warning"
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <SectionCard
          title="Today"
          description="Today · US Eastern"
          className="xl:col-span-2"
          bodyClassName="p-2"
        >
          <ul>
            {today.map((call) => (
              <li
                key={call.id}
                className="flex flex-wrap items-center gap-3 rounded-md px-3 py-3 transition-colors hover:bg-secondary/50"
              >
                <span className="w-16 shrink-0 font-mono text-xs text-muted-foreground">
                  {call.time}
                </span>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Video className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{call.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {call.client} · {call.owner}
                  </p>
                </div>
                <StatusBadge tone={KIND_TONE[call.kind]}>{call.kind}</StatusBadge>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          title="This week"
          description="Next two days"
          bodyClassName="p-2"
        >
          <ul>
            {calls
              .filter((call) => call.day !== "Today")
              .map((call) => (
                <li
                  key={call.id}
                  className="rounded-md px-3 py-2.5 transition-colors hover:bg-secondary/50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{call.title}</p>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {call.time}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {call.day} · {call.client}
                  </p>
                </li>
              ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard
        title="Recent call notes"
        description="Action items stay internal unless switched to client-visible"
        className="mt-4"
        bodyClassName="divide-y divide-border"
      >
        {notes.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap items-start gap-3 px-5 py-4"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground">
              <FileText className="size-3.5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{item.call}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {item.note}
              </p>
            </div>
            <StatusBadge tone="neutral">{item.actions} action items</StatusBadge>
          </div>
        ))}
      </SectionCard>
    </>
  );
}
