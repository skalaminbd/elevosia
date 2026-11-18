/**
 * Live Demo copy and sample data, from pagecontent.md §6. Everything here is
 * fictional sample data for Brightline Care, a made-up home care company.
 */

export const demoMeta = {
  title: "Live Custom Dashboard Demo | Elevosia",
  description:
    "Click through a working custom dashboard: schedule, clients, invoices and an AI assistant, with sample data.",
};

export const demoHero = {
  eyebrow: "Live demo · sample data",
  title: "Click around. This is what Monday could feel like.",
  subhead:
    "A working dashboard for a made-up home care company called Brightline Care. Auto-fill open shifts, send invoice reminders, search clients or ask the AI a question. Yours would be built around your business.",
  cta: { label: "I want one like this", href: "/start" },
  sampleLabel: "Demo data. Not a real company.",
};

export const demoPromptsTitle = "Try this";

export const demoPrompts = [
  {
    id: "schedule",
    title: "Fill the open shifts",
    body: "Open Schedule and press Auto-fill. Then go back to Overview and watch the briefing change.",
    target: "schedule",
  },
  {
    id: "portal",
    title: "See the client's side",
    body: "Open Client portal to see exactly what your clients would see during a build.",
    target: "portal",
  },
  {
    id: "ai",
    title: "Ask about overtime",
    body: "Open Ask AI and ask who is close to overtime this week.",
    target: "ai",
  },
] as const;

export type DemoPromptId = (typeof demoPrompts)[number]["id"];

export const demoClient = {
  company: "Brightline Care",
  user: "Sarah",
  role: "Operations lead",
  initials: "S",
};

export const demoBriefing = {
  base: "3 visits need cover today, and two invoices are past due. Nothing else needs you before lunch.",
  filled:
    "All 3 open shifts are covered. Two invoices are still past due, so the afternoon is yours if you send the reminders.",
  reminders:
    "3 visits need cover today, and the two late invoices have reminders on the way. Your afternoon is clear.",
  both:
    "All 3 open shifts are covered and both late invoices have a reminder on the way. Your afternoon is clear.",
};

export type DemoKpi = {
  id: string;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
};

export const demoKpis: DemoKpi[] = [
  { id: "visits", label: "Visits today", value: 24, suffix: "" },
  { id: "revenue", label: "Revenue this month", value: 48600, prefix: "$" },
  { id: "shifts", label: "Open shifts", value: 3, suffix: "" },
  { id: "overdue", label: "Overdue invoices", value: 2, suffix: "" },
];

export const demoWeek = [
  { day: "Mon", value: 62 },
  { day: "Tue", value: 78 },
  { day: "Wed", value: 55 },
  { day: "Thu", value: 90 },
  { day: "Fri", value: 70 },
  { day: "Sat", value: 42 },
  { day: "Sun", value: 28 },
];

export const demoJobs = [
  { id: "j1", title: "Morning visit · M. Okafor", meta: "9:00 am · Nora P.", done: true },
  { id: "j2", title: "Medication check · J. Lewis", meta: "11:30 am · Sam K.", done: true },
  { id: "j3", title: "Afternoon care · A. Rivera", meta: "2:00 pm · Unassigned", done: false },
  { id: "j4", title: "Evening visit · T. Brooks", meta: "5:30 pm · Unassigned", done: false },
];

export type DemoShift = {
  id: string;
  day: string;
  date: string;
  time: string;
  client: string;
  open: boolean;
  caregiver?: string;
};

export const demoShifts: DemoShift[] = [
  { id: "s1", day: "Mon", date: "18 Nov", time: "9:00 am", client: "M. Okafor", open: false, caregiver: "Nora P." },
  { id: "s2", day: "Mon", date: "18 Nov", time: "2:00 pm", client: "A. Rivera", open: true },
  { id: "s3", day: "Tue", date: "19 Nov", time: "8:30 am", client: "J. Lewis", open: false, caregiver: "Sam K." },
  { id: "s4", day: "Wed", date: "20 Nov", time: "10:00 am", client: "T. Brooks", open: true },
  { id: "s5", day: "Thu", date: "21 Nov", time: "1:00 pm", client: "R. Chen", open: false, caregiver: "Ava M." },
  { id: "s6", day: "Fri", date: "22 Nov", time: "11:00 am", client: "D. Silva", open: false, caregiver: "Nora P." },
  { id: "s7", day: "Sat", date: "23 Nov", time: "9:30 am", client: "P. Grant", open: true },
];

export const demoCaregivers = ["Ava M.", "Nora P.", "Sam K."];

export const demoClients = [
  { id: "c1", name: "M. Okafor", area: "East Nashville", status: "Active", visits: 3 },
  { id: "c2", name: "A. Rivera", area: "Antioch", status: "Active", visits: 2 },
  { id: "c3", name: "J. Lewis", area: "Donelson", status: "Review", visits: 4 },
  { id: "c4", name: "T. Brooks", area: "Madison", status: "Active", visits: 2 },
  { id: "c5", name: "R. Chen", area: "Green Hills", status: "New", visits: 1 },
  { id: "c6", name: "D. Silva", area: "Hermitage", status: "Active", visits: 3 },
];

export const demoInvoices = [
  { id: "INV-1042", client: "M. Okafor", amount: 1240, due: "Paid 12 Nov", status: "paid" },
  { id: "INV-1043", client: "A. Rivera", amount: 860, due: "Due 9 Nov", status: "late" },
  { id: "INV-1044", client: "J. Lewis", amount: 1720, due: "Due 11 Nov", status: "late" },
  { id: "INV-1045", client: "T. Brooks", amount: 640, due: "Due 24 Nov", status: "open" },
  { id: "INV-1046", client: "R. Chen", amount: 980, due: "Paid 15 Nov", status: "paid" },
];

export const demoAiQuestions = [
  {
    id: "overtime",
    question: "Who is close to overtime?",
    answer:
      "Nora P. is at 36 hours with two shifts left this week, so she is closest. Sam K. is at 31 hours. I can move Friday's visit to Ava M. before you hit overtime pay.",
  },
  {
    id: "visits",
    question: "What's unfinished this week?",
    answer:
      "Three shifts still need cover: Mon 2:00 pm, Wed 10:00 am and Sat 9:30 am. Both late invoices have no reminder sent yet. Everything else is on track.",
  },
  {
    id: "revenue",
    question: "How is revenue tracking?",
    answer:
      "You're at $48,600 for November, 12% ahead of October. Two late invoices worth $2,580 are the only thing holding the number back.",
  },
  {
    id: "client",
    question: "Summarise this week for A. Rivera",
    answer:
      "Two visits completed, both on time, notes filed. One invoice for $860 is nine days late and a reminder has not been sent. Next visit: Tue 2:00 pm.",
  },
] as const;

export const demoPortalTasks = [
  { id: "p1", title: "Client portal design", state: "done" },
  { id: "p2", title: "Visit history imported", state: "done" },
  { id: "p3", title: "Caregiver views", state: "progress" },
  { id: "p4", title: "Invoice export", state: "progress" },
  { id: "p5", title: "Family access", state: "todo" },
] as const;

export const demoClosing = {
  title: "Every screen here is built from modules we customize.",
  body: "Yours would use your services, your words and your numbers.",
  primary: { label: "Start a project", href: "/start" },
  secondary: { label: "See all modules", href: "/custom-dashboards" },
  modules: [
    "Scheduling",
    "Client CRM",
    "Invoicing",
    "Client portal",
    "Weekly board",
    "AI briefing",
    "Reports",
    "Care plans",
    "Roles",
    "Payments",
  ],
};
