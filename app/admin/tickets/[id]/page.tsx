import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, ShieldCheck, User } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { TicketConversation } from "@/components/admin/tickets/TicketConversation";
import { tickets } from "@/lib/admin-data";

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return tickets.map((ticket) => ({ id: ticket.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const ticket = tickets.find((item) => item.id === id);
  return ticket ? { title: `${ticket.subject} | Elevosia Admin` } : {};
}

export default async function TicketDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const ticket = tickets.find((item) => item.id === id);
  if (!ticket) notFound();

  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <Link href="/admin/tickets" className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Ticket queue
      </Link>
      <PageHeader
        title={ticket.subject}
        meta={`${ticket.client} · ${ticket.id}`}
        description="Reply to the client or leave an internal note. SLA timers reset on priority changes."
        className="mt-3"
      >
        <StatusBadge tone={ticket.priority === "P1" ? "danger" : ticket.priority === "P2" ? "warning" : "neutral"}>
          {ticket.priority}
        </StatusBadge>
        <StatusBadge tone={ticket.status === "Resolved" ? "success" : "accent"}>
          {ticket.status}
        </StatusBadge>
        {ticket.warranty ? <StatusBadge tone="accent">Warranty</StatusBadge> : null}
      </PageHeader>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="SLA" value={ticket.sla} note="From the care plan" icon={Clock} tone={ticket.close ? "danger" : "default"} />
        <StatCard label="Care plan" value={ticket.care} note={ticket.warranty ? "Under warranty" : "Billable"} icon={ShieldCheck} />
        <StatCard label="Assignee" value={ticket.assignee ?? "Unassigned"} note="Claim or reassign" icon={User} />
        <StatCard label="Project" value="Care dashboard" note="Brightline Care" icon={ShieldCheck} />
      </div>

      <div className="mt-4">
        <TicketConversation ticket={ticket} />
      </div>
    </div>
  );
}
