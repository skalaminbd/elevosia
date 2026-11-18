/**
 * Sample data for the client portal. Brightline Care, a home care company,
 * mid-way through its care dashboard build.
 */

export const portalClient = {
  company: "Brightline Care",
  user: "Sarah Whitfield",
  firstName: "Sarah",
  role: "Owner",
  initials: "SW",
  email: "sarah@brightlinecare.com",
  contact: "Sarah Whitfield",
  timezone: "US Central (CT)",
  plan: "Operate + Growth care",
  planSla: "Same-business-day support",
};

export type PortalProject = {
  id: string;
  name: string;
  status: "Active" | "Completed" | "On hold";
  progress: number;
  start: string;
  end: string;
  health: "On track" | "Needs attention";
  phase: string;
  nextMilestone: string;
  modules: number;
};

export const portalProjects: PortalProject[] = [
  {
    id: "care-dashboard",
    name: "Care dashboard and client portal",
    status: "Active",
    progress: 62,
    start: "21 Oct 2026",
    end: "12 Dec 2026",
    health: "On track",
    phase: "Week 3 of 6",
    nextMilestone: "Clients + portal · 22 Nov",
    modules: 6,
  },
  {
    id: "online-booking",
    name: "Online booking",
    status: "Completed",
    progress: 100,
    start: "2 Jun 2026",
    end: "18 Sep 2026",
    health: "On track",
    phase: "Live · warranty to 18 Dec",
    nextMilestone: "Warranty ends 18 Dec",
    modules: 2,
  },
];

export const portalMilestones = [
  { id: "m1", label: "Foundation", due: "4 Nov", state: "done", tasks: 4 },
  { id: "m2", label: "Scheduling", due: "11 Nov", state: "done", tasks: 5 },
  { id: "m3", label: "Clients and portal", due: "22 Nov", state: "current", tasks: 5 },
  { id: "m4", label: "Billing", due: "2 Dec", state: "next", tasks: 4 },
  { id: "m5", label: "Launch", due: "12 Dec", state: "next", tasks: 3 },
] as const;

export type BoardTask = {
  id: string;
  title: string;
  state: "done" | "progress" | "carried" | "next";
};

export const boardWeeks: {
  id: string;
  label: string;
  dates: string;
  tasks: BoardTask[];
  demo?: { note: string };
}[] = [
  {
    id: "week-3",
    label: "Week 3",
    dates: "18–22 Nov",
    tasks: [
      { id: "b1", title: "Client portal layout", state: "done" },
      { id: "b2", title: "Visit history imported", state: "done" },
      { id: "b3", title: "Caregiver phone view", state: "progress" },
      { id: "b4", title: "Invoice export", state: "progress" },
      { id: "b5", title: "Family access", state: "next" },
    ],
    demo: { note: "Friday demo recording is shared after the 10:00 call." },
  },
  {
    id: "week-2",
    label: "Week 2",
    dates: "11–15 Nov",
    tasks: [
      { id: "b6", title: "Weekly board", state: "done" },
      { id: "b7", title: "Caregiver roles", state: "done" },
      { id: "b8", title: "Auto-fill rules", state: "done" },
      { id: "b9", title: "Visit types", state: "done" },
    ],
    demo: { note: "Staging link shared with the week 2 update." },
  },
  {
    id: "week-1",
    label: "Week 1",
    dates: "4–8 Nov",
    tasks: [
      { id: "b10", title: "Workshop and roles", state: "done" },
      { id: "b11", title: "Client import", state: "done" },
      { id: "b12", title: "Care plan fields", state: "done" },
    ],
  },
];

export type PortalApproval = {
  id: string;
  type: "Milestone" | "Design" | "Change request";
  title: string;
  detail: string;
  due: string;
  amount?: number;
};

export const portalApprovals: PortalApproval[] = [
  {
    id: "ap1",
    type: "Milestone",
    title: "Week 3 plan",
    detail: "Clients and portal screens, ready to start Monday. This unlocks the next milestone invoice.",
    due: "Due today",
  },
  {
    id: "ap2",
    type: "Change request",
    title: "Family access additions",
    detail: "Add a second family contact per client and let them see invoices but not care notes.",
    due: "Due Friday",
    amount: 900,
  },
];

export const approvalHistory = [
  { id: "h1", title: "Week 2 plan", action: "Approved", who: "Sarah Whitfield", date: "14 Nov 2026" },
  { id: "h2", title: "Scheduling designs", action: "Approved", who: "Sarah Whitfield", date: "6 Nov 2026" },
  { id: "h3", title: "Blueprint v1", action: "Approved", who: "Sarah Whitfield", date: "28 Oct 2026" },
];

export type PortalInvoice = {
  id: string;
  project: string;
  kind: string;
  amount: number;
  due: string;
  status: "Due" | "Paid" | "Overdue";
};

export const portalInvoices: PortalInvoice[] = [
  {
    id: "INV-1048",
    project: "Care dashboard and client portal",
    kind: "Milestone 3 of 3",
    amount: 4800,
    due: "2 Dec 2026",
    status: "Due",
  },
  {
    id: "INV-1044",
    project: "Care dashboard and client portal",
    kind: "Milestone 2 of 3",
    amount: 6400,
    due: "Paid 5 Nov 2026",
    status: "Paid",
  },
  {
    id: "INV-1040",
    project: "Care dashboard and client portal",
    kind: "Milestone 1 of 3",
    amount: 4800,
    due: "Paid 28 Oct 2026",
    status: "Paid",
  },
  {
    id: "INV-1032",
    project: "Online booking",
    kind: "Final invoice",
    amount: 2550,
    due: "Paid 18 Sep 2026",
    status: "Paid",
  },
];

export const retainer = {
  plan: "Growth care",
  price: 699,
  hours: 6,
  used: 2.5,
  next: "1 Dec 2026",
  sla: "Same-business-day support",
  work: [
    { id: "w1", title: "Small copy changes on the booking page", hours: 0.5, date: "12 Nov" },
    { id: "w2", title: "Add a second calendar rule", hours: 1.5, date: "8 Nov" },
    { id: "w3", title: "Review invoice reminder wording", hours: 0.5, date: "5 Nov" },
  ],
};

export type PortalFile = {
  id: string;
  name: string;
  folder: string;
  project: string;
  size: string;
  updated: string;
  version: string;
};

export const portalFiles: PortalFile[] = [
  { id: "f1", name: "Care dashboard Blueprint v1.pdf", folder: "Blueprints", project: "Care dashboard", size: "1.8 MB", updated: "28 Oct", version: "v1" },
  { id: "f2", name: "Scheduling designs.pdf", folder: "Designs", project: "Care dashboard", size: "3.2 MB", updated: "6 Nov", version: "v2" },
  { id: "f3", name: "Week 2 board export.xlsx", folder: "Weekly boards", project: "Care dashboard", size: "184 KB", updated: "15 Nov", version: "v1" },
  { id: "f4", name: "Service agreement.pdf", folder: "Contracts", project: "Care dashboard", size: "420 KB", updated: "18 Sep", version: "Signed" },
  { id: "f5", name: "Booking launch checklist.pdf", folder: "Launch", project: "Online booking", size: "310 KB", updated: "16 Sep", version: "v2" },
];

export const portalContracts = [
  { id: "c1", name: "Service agreement", status: "Signed", date: "18 Sep 2026" },
  { id: "c2", name: "NDA", status: "Signed", date: "24 Sep 2026" },
  { id: "c3", name: "Blueprint v1 approval", status: "Signed", date: "28 Oct 2026" },
  { id: "c4", name: "Growth care agreement", status: "Pending signature", date: "Sent 18 Nov 2026" },
];

export const portalThreads = [
  {
    id: "pt1",
    title: "Care dashboard",
    with: "Alamin · Elevosia",
    preview: "The portal screens look right. One question on family access.",
    time: "12 min",
    unread: 2,
    messages: [
      { id: "pm1", from: "Sarah Whitfield", self: true, body: "The portal screens look right. One question on the family access step.", time: "9:12 am" },
      { id: "pm2", from: "Alamin", self: false, body: "Ask away. We can show it on the 9:30 call too.", time: "9:20 am" },
      { id: "pm3", from: "Sarah Whitfield", self: true, body: "Can a family member see invoices but not care notes?", time: "9:26 am" },
      { id: "pm4", from: "Alamin", self: false, body: "Yes. Roles are separate: billing, care notes and approvals can each be on or off.", time: "9:31 am" },
      { id: "pm5", from: "Sarah Whitfield", self: true, body: "Perfect. Approved week 3 — thanks!", time: "9:40 am" },
    ],
  },
  {
    id: "pt2",
    title: "Billing",
    with: "Maya · Elevosia",
    preview: "Invoice INV-1048 is due on 2 December.",
    time: "Yesterday",
    unread: 0,
    messages: [
      { id: "pm6", from: "Maya", self: false, body: "Invoice INV-1048 is due on 2 December. Let me know if you want a different schedule.", time: "4:02 pm" },
    ],
  },
  {
    id: "pt3",
    title: "Support · ticket TKT-812",
    with: "Elevosia support",
    preview: "We are looking at the duplicate reminder.",
    time: "Yesterday",
    unread: 0,
    messages: [
      { id: "pm7", from: "Elevosia support", self: false, body: "We are looking at the duplicate reminder. No action needed from you.", time: "11:15 am" },
    ],
  },
];

export const portalReports = [
  {
    id: "r1",
    title: "Care dashboard · October",
    period: "October 2026",
    published: "1 Nov 2026",
    highlights: ["Week 1 and 2 delivered", "12 client-visible tasks completed", "No change requests"],
  },
  {
    id: "r2",
    title: "Search and website report",
    period: "Q3 2026",
    published: "6 Oct 2026",
    highlights: ["Organic sessions +18%", "31 quote form submissions", "Booking page live"],
  },
  {
    id: "r3",
    title: "Online booking · launch report",
    period: "September 2026",
    published: "19 Sep 2026",
    highlights: ["Launched 18 Sep", "Warranty to 18 Dec", "107 bookings in week one"],
  },
];

export const portalCalls = {
  upcoming: {
    id: "call1",
    title: "Weekly call · Care dashboard",
    when: "Friday 22 Nov, 10:00 am CT",
    with: "Alamin, your PM",
    join: "Meet link in your calendar invite",
  },
  past: [
    {
      id: "call2",
      title: "Weekly call · Week 2",
      when: "Friday 15 Nov, 10:00 am CT",
      notes: "Approved the scheduling designs. Asked for invoice reminders to be polite, not pushy.",
      actions: ["Reminder copy shared in Files", "Week 3 plan sent for approval"],
    },
    {
      id: "call3",
      title: "Weekly call · Week 1",
      when: "Friday 8 Nov, 10:00 am CT",
      notes: "Walked through the care plan fields and family roles.",
      actions: ["Care plan fields agreed", "Second contact added to the list"],
    },
  ],
};

export const portalTickets = [
  {
    id: "TKT-812",
    subject: "Invoice reminder sent twice",
    status: "In progress",
    updated: "2 hrs ago",
    warranty: true,
    messages: 3,
  },
  {
    id: "TKT-807",
    subject: "Where do I download my files?",
    status: "Resolved",
    updated: "6 days ago",
    warranty: false,
    messages: 4,
  },
];

export const portalTeam = [
  { id: "t1", name: "Sarah Whitfield", email: "sarah@brightlinecare.com", role: "Owner", initials: "SW", projects: "All" },
  { id: "t2", name: "James Whitfield", email: "james@brightlinecare.com", role: "Member", initials: "JW", projects: "Care dashboard" },
  { id: "t3", name: "Nora Patel", email: "nora@brightlinecare.com", role: "Billing", initials: "NP", projects: "Invoices only" },
];

export const portalBlueprint = {
  id: "BP-309",
  title: "Care dashboard and client portal",
  status: "Approved",
  version: "v1",
  validUntil: "1 Dec 2026",
  price: 16000,
  milestones: portalMilestones.map((milestone) => milestone.label),
  schedule: [
    { id: "s1", label: "Deposit", amount: 6400, due: "Paid 28 Oct", state: "Paid" },
    { id: "s2", label: "Milestone 2", amount: 6400, due: "Paid 5 Nov", state: "Paid" },
    { id: "s3", label: "At launch", amount: 3200, due: "12 Dec", state: "Scheduled" },
  ],
};
