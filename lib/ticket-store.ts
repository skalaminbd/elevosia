/**
 * Portal support tickets. Created and replied to by the client; staff replies
 * are seeded until the admin side writes here too. Stored per browser.
 */

export type TicketStatus = "Open" | "In progress" | "Waiting on you" | "Resolved";
export type TicketPriority = "Low" | "Normal" | "High" | "Urgent";
export type TicketCategory =
  | "Something is broken"
  | "Question"
  | "Change request"
  | "Billing";

export type TicketMessage = {
  id: string;
  from: "Client" | "Support";
  body: string;
  at: string;
};

export type PortalTicketRecord = {
  id: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  warranty: boolean;
  updated: string;
  project?: string;
  messages: TicketMessage[];
};

const KEY = "elevosia.portal-tickets";
const EVENT = "elevosia:tickets";

const SEED: PortalTicketRecord[] = [
  {
    id: "TKT-812",
    subject: "Invoice reminder sent twice",
    category: "Billing",
    priority: "High",
    status: "In progress",
    warranty: true,
    updated: "2 hrs ago",
    messages: [
      {
        id: "m-812-1",
        from: "Client",
        body: "We got the same reminder email twice this morning. Can you check the schedule?",
        at: "2 hrs ago",
      },
      {
        id: "m-812-2",
        from: "Support",
        body: "Thanks for flagging. The reminder job fired twice after a retry — we are fixing the queue and will confirm.",
        at: "1 hr ago",
      },
    ],
  },
  {
    id: "TKT-807",
    subject: "Where do I download my files?",
    category: "Question",
    priority: "Normal",
    status: "Resolved",
    warranty: false,
    updated: "6 days ago",
    messages: [
      {
        id: "m-807-1",
        from: "Client",
        body: "Looking for the handover files from the launch.",
        at: "6 days ago",
      },
      {
        id: "m-807-2",
        from: "Support",
        body: "They are under Files → Handover. I re-shared the folder with your team.",
        at: "6 days ago",
      },
    ],
  },
];

export const TICKET_SLA: Record<TicketPriority, string> = {
  Urgent: "2 hours",
  High: "4 business hours",
  Normal: "1 business day",
  Low: "2 business days",
};

export function parseTickets(raw: string | null): PortalTicketRecord[] {
  if (!raw) return SEED;
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PortalTicketRecord[]) : SEED;
  } catch {
    return SEED;
  }
}

function read(): PortalTicketRecord[] {
  if (typeof window === "undefined") return SEED;
  const raw = window.localStorage.getItem(KEY);
  return raw ? parseTickets(raw) : SEED;
}

export function ticketsRaw(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(KEY);
}

export function subscribeTickets(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function write(tickets: PortalTicketRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(tickets));
  window.dispatchEvent(new Event(EVENT));
}

export function listTickets(): PortalTicketRecord[] {
  return read();
}

export function nextTicketId(): string {
  const all = read();
  const highest = all.reduce((max, ticket) => {
    const number = Number(ticket.id.replace("TKT-", ""));
    return Number.isFinite(number) ? Math.max(max, number) : max;
  }, 812);
  return `TKT-${highest + 1}`;
}

export function addTicket(input: {
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  body: string;
  project?: string;
}): PortalTicketRecord {
  const ticket: PortalTicketRecord = {
    id: nextTicketId(),
    subject: input.subject,
    category: input.category,
    priority: input.priority,
    status: "Open",
    warranty: false,
    updated: "Just now",
    project: input.project,
    messages: [
      {
        id: `m-${Date.now()}`,
        from: "Client",
        body: input.body,
        at: "Just now",
      },
    ],
  };
  write([ticket, ...read()]);
  return ticket;
}

export function replyToTicket(ticketId: string, body: string) {
  const next = read().map((ticket) =>
    ticket.id === ticketId
      ? {
          ...ticket,
          status: ticket.status === "Resolved" ? "Open" : ticket.status,
          updated: "Just now",
          messages: [
            ...ticket.messages,
            {
              id: `m-${Date.now()}`,
              from: "Client" as const,
              body,
              at: "Just now",
            },
          ],
        }
      : ticket,
  );
  write(next);
}

export function setTicketStatus(ticketId: string, status: TicketStatus) {
  const next = read().map((ticket) =>
    ticket.id === ticketId ? { ...ticket, status, updated: "Just now" } : ticket,
  );
  write(next);
}
