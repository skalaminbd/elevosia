import Link from "next/link";
import { ChevronRight, Inbox } from "lucide-react";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/admin/ui/Table";
import { connection } from "next/server";
import { listWorkRequests } from "@/db/queries";

/** Work requests from Postgres, read at request time. */
export async function RequestsData() {
  await connection();
  const requests = await listWorkRequests();
  const submitted = requests.filter((request) => request.status === "Submitted");
  const accepted = requests.filter((request) => request.status === "Accepted");
  const converted = requests.filter((request) => request.status === "Converted");

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard
          label="Submitted"
          value={submitted.length}
          note={submitted[0]?.client ?? "None waiting"}
          icon={Inbox}
        />
        <StatCard
          label="Accepted"
          value={accepted.length}
          note="Uses care plan hours"
          icon={Inbox}
          tone="success"
        />
        <StatCard
          label="Converted"
          value={converted.length}
          note="Became a project"
          icon={Inbox}
        />
      </div>

      <Table className="mt-4">
        <THead>
          <tr>
            <TH>Request</TH>
            <TH>Client</TH>
            <TH>Hours</TH>
            <TH>Submitted</TH>
            <TH>Status</TH>
            <TH className="w-10" />
          </tr>
        </THead>
        <TBody>
          {requests.map((request) => (
            <TR key={request.id}>
              <TD>
                <Link
                  href={`/admin/tickets/requests/${request.id}`}
                  className="font-medium hover:underline"
                >
                  {request.title}
                </Link>
                <p className="font-mono text-[10px] text-muted-foreground">
                  {request.id}
                </p>
              </TD>
              <TD className="text-xs text-muted-foreground">{request.client}</TD>
              <TD className="font-mono text-xs">{request.hours} h</TD>
              <TD className="text-xs text-muted-foreground">
                {request.submitted}
              </TD>
              <TD>
                <StatusBadge
                  tone={
                    request.status === "Submitted"
                      ? "info"
                      : request.status === "Accepted"
                        ? "success"
                        : request.status === "Converted"
                          ? "accent"
                          : "neutral"
                  }
                >
                  {request.status}
                </StatusBadge>
              </TD>
              <TD>
                <Link
                  href={`/admin/tickets/requests/${request.id}`}
                  aria-label={`Open ${request.id}`}
                  className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary"
                >
                  <ChevronRight className="size-4" aria-hidden="true" />
                </Link>
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </>
  );
}
