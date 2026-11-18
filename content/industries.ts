/**
 * Industries page copy, verbatim from pagecontent.md §10.
 */

export const industriesMeta = {
  title:
    "Custom Dashboards by Industry: Field Services, Agencies, Nonprofits, Care | Elevosia",
  description:
    "See what a custom dashboard looks like for your kind of business: the modules, the numbers on your screen, and where AI helps.",
};

export const industriesHero = {
  eyebrow: "Industries",
  title: "Built for businesses that run on people, schedules and clients.",
  subhead:
    "If your team goes out to do the work, juggles appointments and bills clients every month, you're who we build for. Pick your industry to see what your dashboard could look like.",
  primary: { label: "Start a project", href: "/start" },
  secondary: { label: "Try the live demo", href: "/demo" },
  orbit: [
    "Field services",
    "Agencies",
    "Nonprofits",
    "Care",
    "Cleaning",
    "Property",
    "Staffing",
    "Studios",
    "Training",
    "Logistics",
  ],
};

export const industryTabs = [
  {
    id: "field-services",
    label: "Home & field services",
    kicker: "HVAC, plumbing, cleaning, landscaping, pest control",
    hook: "Less time in the truck on the phone. More jobs done.",
    story:
      "Your crews are out all day, the office juggles calls, and quotes sit in someone's inbox. We put booking, dispatch, quotes and invoices in one place, with a simple phone view for the crew.",
    modules: [
      "online booking",
      "crew dispatch",
      "quotes to invoices",
      "job checklists and photos",
      "client portal",
      "recurring service plans",
    ],
    numbers: [
      "jobs completed per crew",
      "revenue per job and per tech",
      "quote win rate",
      "unpaid invoices",
    ],
    ai: "assigns jobs by skill and location, turns site photos into notes, follows up on quotes that went quiet",
    cta: "Plan a field service dashboard",
  },
  {
    id: "agencies",
    label: "Agencies & professional services",
    kicker: "marketing, IT, consulting, accounting",
    hook: "Know which clients make you money, and which ones don't.",
    story:
      "Projects live in one tool, hours in another, invoices in a third, and client reports take a day each month. We bring projects, time, retainers and reporting together.",
    modules: [
      "client projects",
      "time tracking",
      "retainers and billing",
      "client reporting portal",
      "resource planning",
    ],
    numbers: [
      "billable utilization",
      "margin per client",
      "retainer hours used",
      "overdue tasks",
    ],
    ai: "drafts monthly client reports, flags projects heading over budget, summarizes long client threads",
    cta: "Plan an agency dashboard",
  },
  {
    id: "nonprofits",
    label: "Nonprofits & associations",
    kicker: "foundations, member groups, scholarship programs",
    hook: "Spend your hours on the mission, not on spreadsheets.",
    story:
      "Donors in one system, applications in email, volunteers in a sheet, and the board wants an impact report by Friday. We give your team one place to run programs and prove results.",
    modules: [
      "donor and member CRM",
      "applications and reviews",
      "volunteer scheduling",
      "events",
      "impact reporting",
    ],
    numbers: [
      "funds raised vs goal",
      "applications in review",
      "member renewals",
      "people served",
    ],
    ai: "summarizes applications for reviewers, drafts donor thank-you notes, builds board-ready impact summaries",
    cta: "Plan a nonprofit dashboard",
  },
  {
    id: "care",
    label: "Care providers",
    kicker: "home care, therapy practices, senior services",
    hook: "Every visit covered. Every family informed.",
    story:
      "Caregiver schedules change daily, families call for updates, and paperwork never ends. We build scheduling, visit tracking and family updates around how your agency runs.",
    modules: [
      "caregiver scheduling",
      "visit tracking",
      "client intake",
      "family portal",
      "credential tracking",
    ],
    numbers: [
      "visits completed vs scheduled",
      "open shifts",
      "caregiver hours",
      "expiring credentials",
    ],
    ai: "fills open shifts with qualified nearby caregivers, turns visit notes into clear family updates",
    note: "Handling patient health information? We confirm HIPAA requirements in your Blueprint before any protected data is involved, and only build on hosting that supports a signed Business Associate Agreement.",
    cta: "Plan a care dashboard",
  },
] as const;

export const alsoBuiltFor = {
  title: "Also built for",
  items: [
    { name: "Cleaning companies", line: "recurring jobs, crews, checklists" },
    { name: "Training and education", line: "enrollments, classes, student portals" },
    { name: "Property management", line: "units, tenants, maintenance" },
    { name: "Staffing agencies", line: "candidates, placements, timesheets" },
    { name: "Wellness studios", line: "bookings, memberships, instructors" },
    { name: "Logistics and delivery", line: "routes, drivers, proof of delivery" },
  ],
  href: "/industries#also-built-for",
};

export const industriesClosing = {
  title: "Don't see your industry?",
  body: "If your business has staff, clients and services, we can build for it. Tell us how your week runs.",
  primary: { label: "Start a project", href: "/start" },
  secondary: { label: "Try the live demo", href: "/demo" },
};
