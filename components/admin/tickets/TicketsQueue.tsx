"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Circle } from "lucide-react";
import { toast } from "sonner";
import {
  FilterDisclosure,
  type FilterOption,
} from "@/components/shared/FilterDisclosure";
import { TicketRow, slaChip } from "@/components/admin/tickets/TicketRow";
import { NewTicketButton } from "@/components/admin/tickets/TicketTabs";
import { updateTicket } from "@/app/admin/tickets/actions";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/shared/NativeSelect";
import { TICKET_STATUSES, type TicketRecord } from "@/lib/tickets/types";
import { cn } from "@/lib/utils";

const NOW = new Date("2026-11-20T10:20:00");
const ME = "Alamin";

const VIEWS = [
  { id: "all", label: "All" },
  { id: "unassigned", label: "Unassigned" },
  { id: "mine", label: "Mine" },
] as const;
type ViewId = (typeof VIEWS)[number]["id"];

const statusOptions: FilterOption[] = TICKET_STATUSES.map((status) => ({
  id: status,
  label: status,
  icon: Circle,
}));

const emptySubscribe = () => () => {};

/** Simple ticket queue: three views, search, status filter, sort. */
export function TicketsQueue({ tickets }: { tickets: TicketRecord[] }) {
  const router = useRouter();
  const hydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const [view, setView] = useState<ViewId>("all");
  const [search, setSearch] = useState("");
  const [statuses, setStatuses] = useState<string[]>([]);
  const [sort, setSort] = useState("sla");

  const rows = tickets
    .filter((ticket) => {
      if (view === "unassigned" && ticket.assignee) return false;
      if (view === "mine" && ticket.assignee !== ME) return false;
      if (statuses.length > 0 && !statuses.includes(ticket.status)) return false;
      const needle = search.trim().toLowerCase();
      if (!needle) return true;
      return (
        ticket.id.toLowerCase().includes(needle) ||
        ticket.subject.toLowerCase().includes(needle) ||
        ticket.client.company.toLowerCase().includes(needle)
      );
    })
    .sort((a, b) =>
      sort === "newest"
        ? b.updatedAt.localeCompare(a.updatedAt)
        : slaChip(a, NOW).minutesLeft - slaChip(b, NOW).minutesLeft,
    );

  async function claim(ticket: TicketRecord) {
    const result = await updateTicket({
      id: ticket.id,
      patch: { assignee: ME },
    });
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(`Claimed ${ticket.id}`);
    router.refresh();
  }

  if (!hydrated) {
    return (
      <div className="rounded-lg border border-border bg-card">
        <ul>
          {Array.from({ length: 5 }).map((_, index) => (
            <li
              key={index}
              className="flex items-center gap-3 border-t border-border px-4 py-3.5 first:border-t-0"
            >
              <span className="h-3 w-2/3 animate-pulse rounded bg-secondary" />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-1">
          {VIEWS.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => setView(entry.id)}
              aria-pressed={view === entry.id}
              className={cn(
                "h-8 rounded-md px-3 text-sm font-medium transition-colors",
                view === entry.id
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {entry.label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search tickets"
            aria-label="Search tickets"
            className="h-8 w-44 text-sm"
          />
          <FilterDisclosure
            compact
            label="Status"
            values={statuses}
            options={statusOptions}
            onChange={setStatuses}
          />
          <div className="w-40">
            <NativeSelect
              aria-label="Sort tickets"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="h-8 rounded-md border border-input bg-card px-2 text-sm"
            >
              <option value="sla">SLA due soonest</option>
              <option value="newest">Newest first</option>
            </NativeSelect>
          </div>
          <NewTicketButton />
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_52px_76px] items-center gap-3 border-b border-border bg-secondary/40 px-4 py-2 text-xs font-medium text-muted-foreground sm:grid-cols-[minmax(0,1fr)_56px_150px_110px_90px]">
        <span>Ticket</span>
        <span>Priority</span>
        <span className="hidden sm:block">SLA</span>
        <span className="hidden sm:block">Status</span>
        <span className="text-right">Assignee</span>
      </div>

      <ul>
        {rows.length === 0 ? (
          <li className="px-5 py-14 text-center">
            <p className="text-sm font-medium">No tickets here.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try All, or clear the search.
            </p>
          </li>
        ) : (
          rows.map((ticket) => (
            <TicketRow
              key={ticket.id}
              ticket={ticket}
              now={NOW}
              onClaim={() => claim(ticket)}
            />
          ))
        )}
      </ul>
    </div>
  );
}
