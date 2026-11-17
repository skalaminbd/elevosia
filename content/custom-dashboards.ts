/**
 * Custom Dashboards page copy, verbatim from pagecontent.md §4.
 */

export const dashboardsMeta = {
  title: "Custom Dashboard Development for Small Businesses | Elevosia",
  description:
    "A custom business dashboard built around your workflow: staff, scheduling, clients, invoices and reports, with a client portal and website included.",
};

export const dashboardsHero = {
  eyebrow: "Custom dashboard development",
  title: "Software that fits your business like it was made for it. Because it was.",
  subhead:
    "Off-the-shelf tools ask you to change how you work. We do the opposite. We learn how your business runs, then build the dashboard, client portal and website around it.",
  primary: { label: "Start a project", href: "/start" },
  secondary: { label: "Try the live demo", href: "/demo" },
};

export const problem = {
  title: "You've tried the tools. They each do 60% of the job.",
  body: "The scheduling app doesn't know about invoices. The CRM doesn't know who's working today. So someone on your team becomes the human glue, copying, checking and chasing. That person is usually you.",
  gaugeValue: 60,
  gaugeLabel: "at best",
  pains: [
    "Spreadsheets everywhere",
    "Software that almost fits",
    "No clear numbers without asking",
    "Busywork that eats your evenings",
  ],
};

export const included = {
  title: "The basics are never extras",
  items: [
    "Client portal with your logo",
    "Public website on the same system",
    "Roles and permissions",
    "Works on phone and desktop",
    "Data moved in from your old tools",
    "Team training",
    "30-day warranty",
    "No per-user fees",
    "You own the code",
  ],
};

export const moduleLibrary = {
  title: "Built from proven modules. Shaped to your workflow.",
  intro:
    "We don't start from a blank page, and we don't sell you a template. Each module is a tested starting point we shape to how you work. That's how we keep prices fixed and timelines short.",
  modules: [
    {
      id: "staff",
      name: "Staff & scheduling",
      features: [
        "Staff profiles, roles and certifications",
        "Drag-and-drop shift and job scheduling",
        "Availability, time off and swaps",
        "Timesheets and payroll export",
      ],
    },
    {
      id: "bookings",
      name: "Services & bookings",
      features: [
        "Service catalog with pricing",
        "Online booking from your website",
        "Job status from booked to done",
        "Email and SMS reminders",
      ],
    },
    {
      id: "crm",
      name: "Clients & CRM",
      features: [
        "Full client history",
        "Lead pipeline from first contact to signed",
        "Follow-up reminders",
        "Tags and quick search",
      ],
    },
    {
      id: "invoices",
      name: "Invoices & payments",
      features: [
        "Quotes that turn into invoices",
        "Card and bank payments",
        "Recurring billing",
        "QuickBooks or Xero sync",
      ],
    },
    {
      id: "reports",
      name: "Reports & KPIs",
      features: [
        "Live owner dashboard",
        "Reports by team, service or location",
        "Weekly report emailed automatically",
        "CSV and PDF export",
      ],
    },
    {
      id: "portal",
      name: "Client portal",
      features: [
        "Secure client login",
        "Self-service booking and payment",
        "Messages, files and updates",
        "Your brand, your domain",
      ],
    },
    {
      id: "operations",
      name: "Operations",
      features: [
        "Inventory and supplies",
        "Vendors and approvals",
        "Documents and e-signatures",
        "Multi-location",
      ],
    },
    {
      id: "ai",
      name: "AI layer",
      features: [
        "Ask-your-data assistant",
        "Daily briefing and alerts",
        "Automated follow-ups",
        "Document data extraction",
      ],
    },
  ],
};

export const views = {
  title: "Everyone gets the screen they need",
  intro:
    "Owners see the whole business. Staff see their day. Clients see their account. Same data, different doors.",
  tabs: [
    {
      id: "owner",
      label: "Owner",
      headline: "The whole business on one screen.",
      bullets: [
        "Revenue, bookings and margins live",
        "Team performance at a glance",
        "AI briefing every morning",
        "Alerts when something needs you",
      ],
    },
    {
      id: "manager",
      label: "Manager",
      headline: "Run the team without group texts.",
      bullets: [
        "Drag-and-drop scheduling",
        "Open shifts filled with AI suggestions",
        "Approve time off and expenses",
        "Team reports by location",
      ],
    },
    {
      id: "staff",
      label: "Staff",
      headline: "A clear day plan on their phone.",
      bullets: [
        "Today's jobs with addresses and notes",
        "Clock in and out",
        "Checklists and photo uploads",
        "Swap shifts",
      ],
    },
    {
      id: "client",
      label: "Client",
      headline: "Your clients help themselves.",
      bullets: [
        "Book and reschedule online",
        "Pay by card or bank",
        "See updates and documents",
        "Message your team",
      ],
    },
  ],
};

export const flow = {
  title: "Your website stops being a brochure",
  body: "Your website and dashboard share one database, so every form, booking and payment lands where your team works. No copying. No \"did anyone see this lead?\"",
  steps: [
    { id: "website", label: "Customer books online" },
    { id: "dashboard", label: "Job appears in the dashboard" },
    { id: "ai", label: "AI suggests the right person" },
    { id: "portal", label: "Client gets updates and pays in the portal" },
  ],
};

export const integrations = {
  title: "Keep the tools you love. Connect the rest.",
  body: "Your dashboard talks to the tools you already rely on. Some clients cancel three or four subscriptions after launch. Others keep them and finally get them talking.",
  tools: [
    "Google Workspace",
    "Microsoft 365",
    "QuickBooks",
    "Xero",
    "Stripe",
    "Square",
    "Slack",
    "Twilio SMS",
    "Google Calendar",
    "Outlook",
    "Mailchimp",
    "HubSpot",
    "DocuSign",
    "Zapier",
    "Any tool with an API",
  ],
};

export const built = {
  title: "Security and ownership you can explain to your accountant",
  cards: [
    {
      id: "accounts",
      title: "Your accounts, your data",
      body: "Hosting, database and code live in accounts you own.",
    },
    {
      id: "secure",
      title: "Secure by default",
      body: "Encryption, two-factor login, role-based access, activity logs.",
    },
    {
      id: "backups",
      title: "Daily backups and uptime monitoring",
      body: "Backups every night, and we hear about downtime before you do.",
    },
    {
      id: "stack",
      title: "A modern, standard stack",
      body: "Any good developer can work on it later.",
    },
  ],
  terminalLines: [
    "Hosting in client account",
    "TLS encryption on",
    "2FA enforced",
    "Role-based access active",
    "Daily backup completed 03:00",
    "Uptime 99.98%",
  ],
};

export const dashboardsClosing = {
  title: "Not sure which modules you need?",
  body: "Write down what's painful today. That's enough to start. We'll turn it into a Blueprint with a fixed price, free.",
  primary: { label: "Start a project", href: "/start" },
  secondary: { label: "Book a call", href: "/book-a-call" },
  note: "Two crews, one timesheet",
  blueprint: "Blueprint",
};

/** Sample data for the device mocks. Clearly fake, per §0.8. */
export const dashboardsDemo = {
  kpis: [
    { id: "visits", label: "Visits today", value: 18 },
    { id: "revenue", label: "Revenue", value: 4820, prefix: "$" },
    { id: "open", label: "Open shifts", value: 2 },
    { id: "overdue", label: "Overdue", value: 3 },
  ],
  bars: [42, 58, 35, 72, 64, 88, 54],
  jobs: [
    { id: "j1", title: "Gutter repair", meta: "Oak St · 9:30", done: true },
    { id: "j2", title: "AC service", meta: "Pine Ave · 11:00", done: true },
    { id: "j3", title: "Boiler check", meta: "Cedar Rd · 2:15", done: false },
  ],
};
