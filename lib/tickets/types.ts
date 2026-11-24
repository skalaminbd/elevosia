/** Shared ticket model for the admin workspace and the client portal. */

export const TICKET_STATUSES = [
  "New",
  "Open",
  "Waiting on client",
  "Waiting on development",
  "Snoozed",
  "Resolved",
  "Closed",
] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];

export const TICKET_PRIORITIES = ["P1", "P2", "P3"] as const;
export type TicketPriority = (typeof TICKET_PRIORITIES)[number];

export const TICKET_CATEGORIES = [
  "Bug",
  "Question",
  "Access",
  "Billing",
  "Feature request",
  "Other",
] as const;
export type TicketCategory = (typeof TICKET_CATEGORIES)[number];

export const TICKET_CHANNELS = [
  "Portal",
  "Email",
  "Web form",
  "Phone",
] as const;
export type TicketChannel = (typeof TICKET_CHANNELS)[number];

export const CARE_PLANS = ["None", "Essential", "Growth", "Partner"] as const;
export type CarePlan = (typeof CARE_PLANS)[number];

export type TicketSender = "Client" | "Staff" | "System";

export type TicketAttachment = {
  id: string;
  name: string;
  size: string;
  kind: "image" | "file";
};

export type TicketMessage = {
  id: string;
  author: string;
  sender: TicketSender;
  channel: TicketChannel;
  body: string;
  at: string;
  internal?: boolean;
  aiDraft?: boolean;
  unread?: boolean;
  attachments?: TicketAttachment[];
};

export type TicketEventKind =
  | "created"
  | "claimed"
  | "assigned"
  | "priority"
  | "status"
  | "escalated"
  | "snoozed"
  | "merged"
  | "sla-warning"
  | "sla-breach"
  | "cc-added"
  | "resolved"
  | "closed"
  | "reopened"
  | "rated";

export type TicketEvent = {
  id: string;
  kind: TicketEventKind;
  text: string;
  at: string;
  actor: string;
};

export type TicketLinkedItem = {
  id: string;
  type: "task" | "change" | "invoice" | "project" | "ticket";
  label: string;
  meta?: string;
  href?: string;
};

export type TicketPerson = {
  name: string;
  email?: string;
  role?: string;
  initials?: string;
};

export type TicketClient = {
  id?: string;
  company: string;
  contact: string;
  email?: string;
  address?: string;
  carePlan: CarePlan;
  hipaa?: boolean;
};

export type TicketSla = {
  firstResponseDue: string;
  resolutionDue: string;
  firstRespondedAt?: string;
  resolvedAt?: string;
};

export type TicketRating = {
  stars: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  at: string;
};

export type TicketRecord = {
  id: string;
  subject: string;
  description: string;
  requester: TicketPerson;
  client: TicketClient;
  project: string | null;
  channel: TicketChannel;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  assignee: string | null;
  followers: string[];
  cc: TicketPerson[];
  tags: string[];
  warranty: boolean;
  billableHours: number;
  sla: TicketSla;
  snoozeUntil?: string;
  linked: TicketLinkedItem[];
  rating?: TicketRating;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
  events: TicketEvent[];
  unread: number;
};

/** What the client sees for each internal status. */
export const CLIENT_STATUS_LABEL: Record<TicketStatus, string> = {
  New: "Submitted",
  Open: "In progress",
  "Waiting on client": "Waiting for you",
  "Waiting on development": "Waiting on development",
  Snoozed: "In progress",
  Resolved: "Resolved, please confirm",
  Closed: "Closed",
};

/** Statuses the client portal groups its tabs by. */
export const CLIENT_TICKET_TABS = ["Open", "Waiting for you", "Closed"] as const;

export const isOpenStatus = (status: TicketStatus) =>
  status === "New" ||
  status === "Open" ||
  status === "Waiting on client" ||
  status === "Waiting on development" ||
  status === "Snoozed";
