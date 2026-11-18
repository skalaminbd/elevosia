/**
 * Sample records for the admin panel. Fictional, and shared by several pages
 * so a client or project reads the same wherever it appears.
 */

export type ClientStatus = "Lead" | "Onboarding" | "Active" | "Paused" | "Former";

export type AdminClient = {
  id: string;
  name: string;
  initials: string;
  industry: string;
  contact: string;
  email: string;
  status: ClientStatus;
  source: string;
  since: string;
  projects: number;
  plan: string;
  balance: number;
  pm: string;
  timezone: string;
};

export const adminClients: AdminClient[] = [
  {
    id: "brightline",
    name: "Brightline Care",
    initials: "BC",
    industry: "Home care",
    contact: "Sarah Whitfield",
    email: "sarah@brightlinecare.com",
    status: "Active",
    source: "Referral",
    since: "Sep 2026",
    projects: 1,
    plan: "Operate · $16,000",
    balance: 4800,
    pm: "Alamin",
    timezone: "America/Chicago",
  },
  {
    id: "northwind",
    name: "Northwind HVAC",
    initials: "NH",
    industry: "Field services",
    contact: "Dale Mercer",
    email: "dale@northwindhvac.com",
    status: "Active",
    source: "Website",
    since: "Oct 2026",
    projects: 1,
    plan: "Launch · $8,500",
    balance: 2550,
    pm: "Alamin",
    timezone: "America/New_York",
  },
  {
    id: "lumen",
    name: "Lumen Studio",
    initials: "LS",
    industry: "Agency",
    contact: "Priya Raman",
    email: "priya@lumenstudio.co",
    status: "Active",
    source: "Website",
    since: "Aug 2026",
    projects: 1,
    plan: "Operate · $16,000",
    balance: 4800,
    pm: "Maya",
    timezone: "America/Los_Angeles",
  },
  {
    id: "clearwater",
    name: "Clearwater Fund",
    initials: "CF",
    industry: "Nonprofit",
    contact: "Tom Bailey",
    email: "tom@clearwaterfund.org",
    status: "Lead",
    source: "Website",
    since: "Nov 2026",
    projects: 0,
    plan: "Scale enquiry",
    balance: 0,
    pm: "Alamin",
    timezone: "America/New_York",
  },
  {
    id: "harbor",
    name: "Harbor Therapy",
    initials: "HT",
    industry: "Care",
    contact: "Nina Patel",
    email: "nina@harbortherapy.com",
    status: "Active",
    source: "Google",
    since: "Jun 2026",
    projects: 1,
    plan: "Care · Growth",
    balance: 0,
    pm: "Maya",
    timezone: "America/Denver",
  },
  {
    id: "ridgeline",
    name: "Ridgeline Cleaning",
    initials: "RC",
    industry: "Cleaning",
    contact: "Marco Reyes",
    email: "marco@ridgelineclean.com",
    status: "Paused",
    source: "Referral",
    since: "May 2026",
    projects: 1,
    plan: "Single module · $4,500",
    balance: 1350,
    pm: "Alamin",
    timezone: "America/Chicago",
  },
  {
    id: "cedarbrook",
    name: "Cedarbrook Schools",
    initials: "CS",
    industry: "Education",
    contact: "Elaine Ford",
    email: "elaine@cedarbrook.edu",
    status: "Onboarding",
    source: "Event",
    since: "Nov 2026",
    projects: 0,
    plan: "Scale",
    balance: 0,
    pm: "Maya",
    timezone: "America/New_York",
  },
  {
    id: "atlas",
    name: "Atlas Property",
    initials: "AP",
    industry: "Property",
    contact: "Ray Khan",
    email: "ray@atlasproperty.co",
    status: "Former",
    source: "Website",
    since: "Mar 2026",
    projects: 0,
    plan: "Launch · handed over",
    balance: 0,
    pm: "Alamin",
    timezone: "America/Chicago",
  },
];

export type AdminActivity = {
  id: string;
  title: string;
  detail: string;
  time: string;
  kind: "file" | "client" | "invoice" | "comment" | "approval";
};

export const activity: AdminActivity[] = [
  { id: "A-1", title: "Sarah approved week 3", detail: "Brightline Care · client portal", time: "12 min ago", kind: "approval" },
  { id: "A-2", title: "Maya uploaded the visit import", detail: "Brightline Care · data migration", time: "48 min ago", kind: "file" },
  { id: "A-3", title: "Invoice INV-1045 paid", detail: "Harbor Therapy · $640", time: "2 hrs ago", kind: "invoice" },
  { id: "A-4", title: "Comment from Priya Raman", detail: "Lumen Studio · weekly board", time: "Yesterday", kind: "comment" },
  { id: "A-5", title: "New lead: Clearwater Fund", detail: "Nonprofit · Scale enquiry", time: "Yesterday", kind: "client" },
];

export type RequirementStatus =
  | "Submitted"
  | "In review"
  | "Changes needed"
  | "Converted"
  | "Declined";

export type Requirement = {
  id: string;
  client: string;
  title: string;
  submitted: string;
  due: string;
  overdue?: boolean;
  status: RequirementStatus;
  points: number;
  budget: string;
};

export const requirements: Requirement[] = [
  {
    id: "REQ-2051",
    client: "Clearwater Fund",
    title: "Donor CRM and impact reporting",
    submitted: "17 Nov",
    due: "21 Nov",
    status: "Submitted",
    points: 18,
    budget: "$20,000+",
  },
  {
    id: "REQ-2050",
    client: "Cedarbrook Schools",
    title: "Enrollment and family portal",
    submitted: "16 Nov",
    due: "20 Nov",
    status: "In review",
    points: 24,
    budget: "$20,000+",
  },
  {
    id: "REQ-2049",
    client: "Lumen Studio",
    title: "Retainer and time reporting",
    submitted: "12 Nov",
    due: "16 Nov",
    overdue: true,
    status: "Changes needed",
    points: 11,
    budget: "$10,000 to $20,000",
  },
  {
    id: "REQ-2048",
    client: "Brightline Care",
    title: "Scheduling, portal and reminders",
    submitted: "6 Nov",
    due: "12 Nov",
    status: "Converted",
    points: 31,
    budget: "$10,000 to $20,000",
  },
  {
    id: "REQ-2047",
    client: "Ridgeline Cleaning",
    title: "Crew checklists",
    submitted: "3 Nov",
    due: "9 Nov",
    status: "Converted",
    points: 7,
    budget: "Under $5,000",
  },
];

export type BlueprintStatus = "Draft" | "Waiting for approval" | "Approved" | "Expired";

export type Blueprint = {
  id: string;
  client: string;
  title: string;
  status: BlueprintStatus;
  version: string;
  validUntil: string;
  price: number;
  milestones: number;
};

export const blueprints: Blueprint[] = [
  {
    id: "BP-312",
    client: "Cedarbrook Schools",
    title: "Enrollment and family portal",
    status: "Draft",
    version: "v1",
    validUntil: "19 Dec 2026",
    price: 28000,
    milestones: 4,
  },
  {
    id: "BP-311",
    client: "Clearwater Fund",
    title: "Donor CRM and impact reporting",
    status: "Waiting for approval",
    version: "v1",
    validUntil: "12 Dec 2026",
    price: 28000,
    milestones: 5,
  },
  {
    id: "BP-310",
    client: "Lumen Studio",
    title: "Retainer and time reporting",
    status: "Waiting for approval",
    version: "v2",
    validUntil: "8 Dec 2026",
    price: 16000,
    milestones: 4,
  },
  {
    id: "BP-309",
    client: "Brightline Care",
    title: "Care dashboard and portal",
    status: "Approved",
    version: "v1",
    validUntil: "1 Dec 2026",
    price: 16000,
    milestones: 5,
  },
  {
    id: "BP-308",
    client: "Ridgeline Cleaning",
    title: "Crew checklists",
    status: "Expired",
    version: "v1",
    validUntil: "2 Nov 2026",
    price: 4500,
    milestones: 2,
  },
];

export type ProjectHealth = "On track" | "At risk" | "Late";

export type AdminProject = {
  id: string;
  client: string;
  name: string;
  status: string;
  health: ProjectHealth;
  progress: number;
  due: string;
  pm: string;
  price: number;
  used: number;
  modules: number;
};

export const adminProjects: AdminProject[] = [
  {
    id: "brightline-portal",
    client: "Brightline Care",
    name: "Care dashboard + portal",
    status: "Building",
    health: "On track",
    progress: 62,
    due: "12 Dec 2026",
    pm: "Alamin",
    price: 16000,
    used: 9900,
    modules: 6,
  },
  {
    id: "northwind-dispatch",
    client: "Northwind HVAC",
    name: "Dispatch and invoicing",
    status: "Review",
    health: "On track",
    progress: 88,
    due: "21 Nov 2026",
    pm: "Alamin",
    price: 8500,
    used: 7900,
    modules: 3,
  },
  {
    id: "lumen-ops",
    client: "Lumen Studio",
    name: "Projects, time and retainers",
    status: "Building",
    health: "At risk",
    progress: 34,
    due: "9 Jan 2027",
    pm: "Maya",
    price: 16000,
    used: 7300,
    modules: 5,
  },
  {
    id: "harbor-bookings",
    client: "Harbor Therapy",
    name: "Online booking",
    status: "Live · warranty",
    health: "On track",
    progress: 100,
    due: "Warranty to 18 Dec",
    pm: "Maya",
    price: 8500,
    used: 8500,
    modules: 2,
  },
  {
    id: "ridgeline-checklist",
    client: "Ridgeline Cleaning",
    name: "Job checklists",
    status: "On hold",
    health: "Late",
    progress: 12,
    due: "Paused at request",
    pm: "Alamin",
    price: 4500,
    used: 900,
    modules: 1,
  },
  {
    id: "cedarbrook-enrolment",
    client: "Cedarbrook Schools",
    name: "Enrollment and family portal",
    status: "Planning",
    health: "On track",
    progress: 8,
    due: "6 Feb 2027",
    pm: "Maya",
    price: 28000,
    used: 1500,
    modules: 6,
  },
];

export type TaskStatus = "todo" | "progress" | "review" | "done";

export type AdminTask = {
  id: string;
  title: string;
  project: string;
  client: string;
  assignee: string;
  week: string;
  status: TaskStatus;
  due: string;
  priority: "High" | "Normal";
  estimate: number;
  logged: number;
  clientVisible: boolean;
};

export const adminTasks: AdminTask[] = [
  {
    id: "T-901",
    title: "Approve reminder email wording",
    project: "Care dashboard + portal",
    client: "Brightline Care",
    assignee: "Alamin",
    week: "This week",
    status: "review",
    due: "Today",
    priority: "High",
    estimate: 0.5,
    logged: 0.3,
    clientVisible: false,
  },
  {
    id: "T-902",
    title: "Family access roles",
    project: "Care dashboard + portal",
    client: "Brightline Care",
    assignee: "Sam",
    week: "This week",
    status: "progress",
    due: "Thu",
    priority: "High",
    estimate: 8,
    logged: 5,
    clientVisible: true,
  },
  {
    id: "T-903",
    title: "Invoice export mapping",
    project: "Care dashboard + portal",
    client: "Brightline Care",
    assignee: "Ava",
    week: "This week",
    status: "progress",
    due: "Fri",
    priority: "Normal",
    estimate: 6,
    logged: 2.5,
    clientVisible: true,
  },
  {
    id: "T-904",
    title: "Northwind launch checklist",
    project: "Dispatch and invoicing",
    client: "Northwind HVAC",
    assignee: "Alamin",
    week: "This week",
    status: "todo",
    due: "Tomorrow",
    priority: "High",
    estimate: 2,
    logged: 0,
    clientVisible: false,
  },
  {
    id: "T-905",
    title: "Retainer view copy review",
    project: "Projects, time and retainers",
    client: "Lumen Studio",
    assignee: "Maya",
    week: "This week",
    status: "todo",
    due: "Wed",
    priority: "Normal",
    estimate: 1,
    logged: 0,
    clientVisible: false,
  },
  {
    id: "T-906",
    title: "Scheduling rules test pass",
    project: "Care dashboard + portal",
    client: "Brightline Care",
    assignee: "Sam",
    week: "Last week",
    status: "done",
    due: "Done Fri",
    priority: "Normal",
    estimate: 4,
    logged: 3.5,
    clientVisible: true,
  },
  {
    id: "T-907",
    title: "Add client portal layout",
    project: "Care dashboard + portal",
    client: "Brightline Care",
    assignee: "Sam",
    week: "Last week",
    status: "done",
    due: "Done Tue",
    priority: "Normal",
    estimate: 6,
    logged: 6,
    clientVisible: true,
  },
  {
    id: "T-908",
    title: "Clearwater requirements read",
    project: "Donor CRM",
    client: "Clearwater Fund",
    assignee: "Maya",
    week: "This week",
    status: "todo",
    due: "Fri",
    priority: "High",
    estimate: 1.5,
    logged: 0,
    clientVisible: false,
  },
];

export type CallRecord = {
  id: string;
  day: string;
  time: string;
  title: string;
  client: string;
  kind: "Weekly" | "Discovery" | "Launch" | "Internal" | "Care review";
  owner: string;
};

export const calls: CallRecord[] = [
  { id: "C-1", day: "Today", time: "9:30 am", title: "Brightline weekly", client: "Brightline Care", kind: "Weekly", owner: "Alamin" },
  { id: "C-2", day: "Today", time: "11:00 am", title: "Northwind launch", client: "Northwind HVAC", kind: "Launch", owner: "Alamin" },
  { id: "C-3", day: "Today", time: "2:00 pm", title: "Clearwater discovery", client: "Clearwater Fund", kind: "Discovery", owner: "Maya" },
  { id: "C-4", day: "Today", time: "4:30 pm", title: "Team review", client: "Internal", kind: "Internal", owner: "Alamin" },
  { id: "C-5", day: "Tomorrow", time: "10:00 am", title: "Lumen weekly", client: "Lumen Studio", kind: "Weekly", owner: "Maya" },
  { id: "C-6", day: "Thu", time: "1:30 pm", title: "Harbor care review", client: "Harbor Therapy", kind: "Care review", owner: "Maya" },
];

export type FileRecord = {
  id: string;
  name: string;
  folder: string;
  client: string;
  size: string;
  updated: string;
  visible: boolean;
};

export const files: FileRecord[] = [
  { id: "F-1", name: "Brightline requirements v3.pdf", folder: "Requirements", client: "Brightline Care", size: "2.4 MB", updated: "Today", visible: true },
  { id: "F-2", name: "Weekly board export.xlsx", folder: "Weekly boards", client: "Brightline Care", size: "184 KB", updated: "Yesterday", visible: true },
  { id: "F-3", name: "Northwind launch checklist.pdf", folder: "Launch", client: "Northwind HVAC", size: "412 KB", updated: "Yesterday", visible: false },
  { id: "F-4", name: "Lumen retainer schedule.pdf", folder: "Contracts", client: "Lumen Studio", size: "1.1 MB", updated: "17 Nov", visible: true },
  { id: "F-5", name: "Harbor handover notes.doc", folder: "Handover", client: "Harbor Therapy", size: "96 KB", updated: "14 Nov", visible: false },
];

export const folders = [
  { id: "requirements", label: "Requirements", count: 18 },
  { id: "weekly", label: "Weekly boards", count: 42 },
  { id: "contracts", label: "Contracts", count: 12 },
  { id: "design", label: "Design files", count: 27 },
  { id: "handover", label: "Handover", count: 6 },
];

export type TicketPriority = "P1" | "P2" | "P3";

export type Ticket = {
  id: string;
  subject: string;
  client: string;
  priority: TicketPriority;
  sla: string;
  close?: boolean;
  status: "New" | "Open" | "Waiting on client" | "Resolved";
  care: string;
  warranty: boolean;
  assignee: string | null;
};

export const tickets: Ticket[] = [
  { id: "TKT-812", subject: "Invoice reminder sent twice", client: "Brightline Care", priority: "P1", sla: "48 min", close: true, status: "New", care: "Growth", warranty: false, assignee: null },
  { id: "TKT-811", subject: "Crew cannot see Thursday jobs", client: "Northwind HVAC", priority: "P1", sla: "1 hr 20", close: true, status: "Open", care: "Essential", warranty: true, assignee: "Rafi" },
  { id: "TKT-810", subject: "Export to QuickBooks mismatch", client: "Lumen Studio", priority: "P2", sla: "3 hrs", status: "Open", care: "Growth", warranty: false, assignee: "Alamin" },
  { id: "TKT-809", subject: "Add a second contact to the portal", client: "Harbor Therapy", priority: "P3", sla: "1 day", status: "Waiting on client", care: "Growth", warranty: false, assignee: "Maya" },
  { id: "TKT-808", subject: "Payment did not show as paid", client: "Brightline Care", priority: "P2", sla: "2 hrs", status: "Open", care: "Growth", warranty: false, assignee: null },
  { id: "TKT-807", subject: "Where do I download my files?", client: "Ridgeline Cleaning", priority: "P3", sla: "2 days", status: "Resolved", care: "None", warranty: false, assignee: "Rafi" },
  { id: "TKT-806", subject: "Homepage form not sending", client: "Northwind HVAC", priority: "P1", sla: "Breached", status: "Open", care: "Essential", warranty: true, assignee: "Rafi" },
];

export type Thread = {
  id: string;
  client: string;
  preview: string;
  time: string;
  unread: number;
  messages: { id: string; from: string; self: boolean; body: string; time: string }[];
};

export const threads: Thread[] = [
  {
    id: "TH-1",
    client: "Brightline Care",
    preview: "Sarah: Approved week 3 — thanks!",
    time: "12 min",
    unread: 2,
    messages: [
      { id: "M-1", from: "Sarah Whitfield", self: false, body: "The portal screens look right. One question on the family access step.", time: "9:12 am" },
      { id: "M-2", from: "Alamin", self: true, body: "Ask away. We can show it on the 9:30 call too.", time: "9:20 am" },
      { id: "M-3", from: "Sarah Whitfield", self: false, body: "Can a family member see invoices but not care notes?", time: "9:26 am" },
      { id: "M-4", from: "Alamin", self: true, body: "Yes. Roles are separate: billing, care notes and approvals can each be on or off.", time: "9:31 am" },
      { id: "M-5", from: "Sarah Whitfield", self: false, body: "Perfect. Approved week 3 — thanks!", time: "9:40 am" },
    ],
  },
  {
    id: "TH-2",
    client: "Northwind HVAC",
    preview: "Dale: launch on Friday still ok?",
    time: "48 min",
    unread: 0,
    messages: [
      { id: "M-6", from: "Dale Mercer", self: false, body: "Launch on Friday still ok?", time: "8:55 am" },
      { id: "M-7", from: "Alamin", self: true, body: "Yes. Checklist is with you today and training is Thursday.", time: "9:02 am" },
    ],
  },
  {
    id: "TH-3",
    client: "Lumen Studio",
    preview: "Priya: retainer view needs one change",
    time: "2 hrs",
    unread: 1,
    messages: [
      { id: "M-8", from: "Priya Raman", self: false, body: "The retainer view needs one change: show used hours before the bar.", time: "7:40 am" },
    ],
  },
  {
    id: "TH-4",
    client: "Clearwater Fund",
    preview: "Tom: requirements submitted",
    time: "Yesterday",
    unread: 0,
    messages: [
      { id: "M-9", from: "Tom Bailey", self: false, body: "Requirements are in. Looking forward to the Blueprint.", time: "4:15 pm" },
    ],
  },
];

export type InvoiceStatus = "Paid" | "Due" | "Overdue";

export type AdminInvoice = {
  id: string;
  client: string;
  kind: "Milestone" | "Care plan" | "Retainer" | "Change request";
  amount: number;
  due: string;
  status: InvoiceStatus;
};

export const adminInvoices: AdminInvoice[] = [
  { id: "INV-1048", client: "Brightline Care", kind: "Milestone", amount: 4800, due: "2 Dec 2026", status: "Due" },
  { id: "INV-1047", client: "Lumen Studio", kind: "Milestone", amount: 4800, due: "12 Nov 2026", status: "Overdue" },
  { id: "INV-1046", client: "Northwind HVAC", kind: "Milestone", amount: 2550, due: "28 Nov 2026", status: "Due" },
  { id: "INV-1045", client: "Harbor Therapy", kind: "Care plan", amount: 640, due: "Paid 17 Nov", status: "Paid" },
  { id: "INV-1044", client: "Brightline Care", kind: "Milestone", amount: 6400, due: "Paid 5 Nov", status: "Paid" },
  { id: "INV-1043", client: "Ridgeline Cleaning", kind: "Milestone", amount: 1350, due: "30 Nov 2026", status: "Due" },
  { id: "INV-1042", client: "Lumen Studio", kind: "Retainer", amount: 2400, due: "1 Dec 2026", status: "Due" },
];

export const installments = [
  { id: "IP-18", client: "Cedarbrook Schools", total: 28000, paid: 11200, next: "1 Dec 2026", months: 4, missed: 0 },
  { id: "IP-17", client: "Clearwater Fund", total: 28000, paid: 0, next: "15 Dec 2026", months: 5, missed: 0 },
  { id: "IP-16", client: "Lumen Studio", total: 16000, paid: 8000, next: "12 Nov 2026", months: 4, missed: 1 },
];

export const contracts = [
  { id: "CT-41", client: "Brightline Care", type: "Service agreement", status: "Signed", date: "18 Sep 2026" },
  { id: "CT-42", client: "Northwind HVAC", type: "Service agreement", status: "Sent", date: "12 Nov 2026" },
  { id: "CT-43", client: "Lumen Studio", type: "Change request", status: "Signed", date: "3 Nov 2026" },
  { id: "CT-44", client: "Clearwater Fund", type: "NDA", status: "Signed", date: "14 Nov 2026" },
  { id: "CT-45", client: "Cedarbrook Schools", type: "NDA", status: "Draft", date: "—" },
];

export const campaigns = [
  { id: "MK-1", name: "Care dashboard case study", channel: "Blog", status: "Writing", due: "28 Nov", owner: "Lena", progress: 45 },
  { id: "MK-2", name: "November newsletter", channel: "Email", status: "Review", due: "22 Nov", owner: "Lena", progress: 80 },
  { id: "MK-3", name: "Field services landing page", channel: "Website", status: "Live", due: "Live since 4 Nov", owner: "Lena", progress: 100 },
  { id: "MK-4", name: "AI automation explainer", channel: "Social", status: "Planned", due: "5 Dec", owner: "Lena", progress: 10 },
];

export const team = [
  { id: "TM-1", name: "Alamin", role: "Founder · PM", initials: "A", planned: 34, capacity: 40, projects: 2 },
  { id: "TM-2", name: "Maya Chen", role: "Project manager", initials: "MC", planned: 38, capacity: 40, projects: 3 },
  { id: "TM-3", name: "Sam Okafor", role: "Developer", initials: "SO", planned: 41, capacity: 40, projects: 2 },
  { id: "TM-4", name: "Ava Martins", role: "Developer", initials: "AM", planned: 29, capacity: 40, projects: 2 },
  { id: "TM-5", name: "Rafi Ahmed", role: "Support", initials: "RA", planned: 24, capacity: 40, projects: 4 },
  { id: "TM-6", name: "Lena Ortiz", role: "Marketing", initials: "LO", planned: 18, capacity: 40, projects: 3 },
];

export const timesheet = [
  { id: "TS-1", member: "Sam Okafor", project: "Brightline Care", task: "Family access roles", hours: 5, week: "This week" },
  { id: "TS-2", member: "Ava Martins", project: "Brightline Care", task: "Invoice export mapping", hours: 2.5, week: "This week" },
  { id: "TS-3", member: "Maya Chen", project: "Lumen Studio", task: "Retainer view copy review", hours: 1, week: "This week" },
  { id: "TS-4", member: "Alamin", project: "Northwind HVAC", task: "Launch checklist", hours: 2, week: "This week" },
  { id: "TS-5", member: "Rafi Ahmed", project: "Support", task: "Ticket queue", hours: 6, week: "This week" },
];

export type OnboardingStage =
  | "Invited"
  | "Profile done"
  | "NDA signed"
  | "Requirements"
  | "Blueprint approved"
  | "Contract signed"
  | "Deposit paid"
  | "Ready";

export const onboardingPipeline: {
  stage: OnboardingStage;
  cards: { id: string; client: string; missing: string; days: string }[];
}[] = [
  {
    stage: "Invited",
    cards: [
      { id: "OB-1", client: "Cedarbrook Schools", missing: "Waiting on set-password", days: "2 days" },
    ],
  },
  {
    stage: "Profile done",
    cards: [
      { id: "OB-2", client: "Atlas Property", missing: "NDA and requirements", days: "4 days" },
    ],
  },
  {
    stage: "NDA signed",
    cards: [
      { id: "OB-3", client: "Clearwater Fund", missing: "Requirements submitted", days: "1 day" },
    ],
  },
  {
    stage: "Requirements",
    cards: [
      { id: "OB-4", client: "Cedarbrook Schools", missing: "Blueprint review", days: "3 days" },
    ],
  },
  {
    stage: "Blueprint approved",
    cards: [
      { id: "OB-5", client: "Harbor Therapy", missing: "Contract signature", days: "1 day" },
    ],
  },
  {
    stage: "Contract signed",
    cards: [
      { id: "OB-6", client: "Brightline Care", missing: "Deposit payment", days: "Today" },
    ],
  },
  {
    stage: "Deposit paid",
    cards: [],
  },
  {
    stage: "Ready",
    cards: [],
  },
];


/** Sample submission detail for each requirement, used by the requirement page. */
export const requirementDetails: Record<
  string,
  {
    sections: {
      id: string;
      title: string;
      points: { text: string; must: boolean; comment?: string }[];
    }[];
    attachments: string[];
    deadline: string;
    nda: string;
  }
> = {
  "REQ-2051": {
    sections: [
      {
        id: "donors",
        title: "Donors and members",
        points: [
          { text: "One record per donor with gifts, notes and contact history.", must: true },
          { text: "Membership renewals tracked with reminders.", must: true },
          { text: "Tags for programs and campaigns.", must: false },
        ],
      },
      {
        id: "applications",
        title: "Applications",
        points: [
          { text: "Online application form with attachments.", must: true, comment: "Can reviewers see applications without an account?" },
          { text: "Two-stage review with scores.", must: true },
        ],
      },
      {
        id: "reporting",
        title: "Impact reporting",
        points: [
          { text: "Board-ready impact summary each quarter.", must: true },
          { text: "Funds raised against goal by program.", must: true },
        ],
      },
    ],
    attachments: ["donor-list-export.xlsx", "current-application-form.pdf"],
    deadline: "Before the spring campaign",
    nda: "Signed 14 Nov 2026",
  },
  "REQ-2050": {
    sections: [
      {
        id: "enrolment",
        title: "Enrolment",
        points: [
          { text: "Families apply online and upload documents.", must: true },
          { text: "Waitlist by grade and start date.", must: true },
        ],
      },
      {
        id: "families",
        title: "Family portal",
        points: [
          { text: "One login per family, with every child in one place.", must: true },
          { text: "Teachers post updates only to their class.", must: true },
          { text: "Calendar of events per class.", must: false },
        ],
      },
    ],
    attachments: ["enrolment-workflow.docx"],
    deadline: "Before the January intake",
    nda: "Requested, not signed",
  },
  "REQ-2049": {
    sections: [
      {
        id: "time",
        title: "Time and retainers",
        points: [
          { text: "Time logged per client, project and person.", must: true },
          { text: "Retainer hours used shown before the month end.", must: true },
        ],
      },
      {
        id: "reports",
        title: "Client reporting",
        points: [
          { text: "Monthly client report generated from logged work.", must: true },
          { text: "White-label option for the agency brand.", must: false },
        ],
      },
    ],
    attachments: ["retainer-tracker.xlsx", "client-report-example.pdf"],
    deadline: "Q1 2027",
    nda: "Signed 24 Sep 2026",
  },
  "REQ-2048": {
    sections: [
      {
        id: "scheduling",
        title: "Scheduling",
        points: [
          { text: "Clients book visits online and get a reminder the day before.", must: true },
          { text: "Open shifts appear in one weekly board.", must: true },
          { text: "Caregivers see their day on a phone.", must: false },
        ],
      },
      {
        id: "billing",
        title: "Billing and portal",
        points: [
          { text: "Invoices go out from completed visits.", must: true },
          { text: "Families can see visit updates in a portal.", must: true },
        ],
      },
    ],
    attachments: ["care-process-notes.pdf"],
    deadline: "Before the winter season",
    nda: "Signed 24 Sep 2026",
  },
  "REQ-2047": {
    sections: [
      {
        id: "checklists",
        title: "Crew checklists",
        points: [
          { text: "A checklist per job type with photos.", must: true },
          { text: "Crews see today's jobs on a phone.", must: true },
        ],
      },
    ],
    attachments: [],
    deadline: "No fixed deadline",
    nda: "Not requested",
  },
};


export type WorkRequest = {
  id: string;
  client: string;
  title: string;
  detail: string;
  hours: number;
  submitted: string;
  status: "Submitted" | "Accepted" | "Converted" | "Declined";
  pm: string;
};

export const workRequests: WorkRequest[] = [
  {
    id: "WR-31",
    client: "Lumen Studio",
    title: "Add a retainer report export",
    detail: "A monthly PDF with hours used per client, ready to send to their clients.",
    hours: 3,
    submitted: "17 Nov 2026",
    status: "Submitted",
    pm: "Maya",
  },
  {
    id: "WR-30",
    client: "Harbor Therapy",
    title: "Second booking calendar",
    detail: "A separate calendar for the east-side clinic with the same rules.",
    hours: 2,
    submitted: "13 Nov 2026",
    status: "Accepted",
    pm: "Maya",
  },
  {
    id: "WR-29",
    client: "Brightline Care",
    title: "Weekly report email",
    detail: "Send the board summary every Monday at 7 am in the client's time zone.",
    hours: 1.5,
    submitted: "6 Nov 2026",
    status: "Converted",
    pm: "Alamin",
  },
];

export const cannedReplies = [
  {
    id: "CR-1",
    title: "We are on it",
    category: "Acknowledgment",
    body: "Thanks for the details. We have picked this up and will update you within one business day.",
  },
  {
    id: "CR-2",
    title: "Need a screenshot",
    category: "Information",
    body: "Could you send a screenshot of the screen and the time it happened? That will help us find it faster.",
  },
  {
    id: "CR-3",
    title: "Fixed",
    category: "Resolution",
    body: "This is fixed and live now. Please refresh the page and let us know if you see it again.",
  },
  {
    id: "CR-4",
    title: "Under warranty",
    category: "Billing",
    body: "This one is covered by your warranty, so there is no charge. We will keep you posted here.",
  },
];
