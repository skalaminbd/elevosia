/**
 * All homepage copy for sections 8 to 15 lives here, so text can be edited
 * without touching a component. Values are verbatim from the brief.
 */

export type ComparisonOptionId = "saas" | "freelancer" | "agency" | "elevosia";

export type ComparisonOption = {
  id: ComparisonOptionId;
  label: string;
};

export type ComparisonRow = {
  criterion: string;
  values: Record<ComparisonOptionId, string>;
};

export const comparison = {
  eyebrow: "Your options, honestly",
  title: "Why not just buy software or hire a freelancer?",
  intro:
    "Sometimes you should. If off-the-shelf software fits your workflow and your team is small, keep it. Custom wins when you've outgrown your tools, or they never fit in the first place.",
  options: [
    { id: "saas", label: "SaaS" },
    { id: "freelancer", label: "Freelancer" },
    { id: "agency", label: "Big agency" },
    { id: "elevosia", label: "Elevosia" },
  ] satisfies ComparisonOption[],
  /** Options shown in the mobile switch, always compared against Elevosia. */
  compareOptions: [
    { id: "saas", label: "SaaS" },
    { id: "freelancer", label: "Freelancer" },
    { id: "agency", label: "Big agency" },
  ] satisfies ComparisonOption[],
  rows: [
    {
      criterion: "Fits your workflow",
      values: {
        saas: "You adapt to it",
        freelancer: "Yes",
        agency: "Yes",
        elevosia: "Yes, mapped in your Blueprint",
      },
    },
    {
      criterion: "Upfront cost",
      values: {
        saas: "Low",
        freelancer: "Low",
        agency: "$30k to $150k+",
        elevosia: "Fixed, from $4,500",
      },
    },
    {
      criterion: "Per-user fees",
      values: {
        saas: "Every seat, every month",
        freelancer: "None",
        agency: "None",
        elevosia: "None",
      },
    },
    {
      criterion: "Who owns it",
      values: {
        saas: "The vendor",
        freelancer: "Often unclear",
        agency: "You",
        elevosia: "You, in writing",
      },
    },
    {
      criterion: "Seeing progress",
      values: {
        saas: "Not applicable",
        freelancer: "When they reply",
        agency: "Status meetings",
        elevosia: "Live weekly board",
      },
    },
    {
      criterion: "After launch",
      values: {
        saas: "Support tickets",
        freelancer: "If they're still around",
        agency: "Expensive retainers",
        elevosia: "Monthly care plan",
      },
    },
  ] satisfies ComparisonRow[],
  link: {
    label: "See the full cost comparison and calculator",
    href: "/why-custom#calculator",
  },
} as const;

export const ai = {
  eyebrow: "AI that earns its place",
  title: "Less busywork. Not more buzzwords.",
  body: "We only add AI where it saves real time, and we measure it in hours saved.",
  cta: { label: "Explore AI & automation", href: "/ai-automation" },
  briefing: {
    title: "Morning briefing",
    caption: "what needs your attention today",
    items: [
      {
        id: "invoices",
        text: "3 invoices are overdue",
        meta: "$2,140 outstanding",
      },
      {
        id: "shift",
        text: "Ana's shift is uncovered",
        meta: "Today, 9:00 am",
      },
      {
        id: "leads",
        text: "2 leads are waiting on a reply",
        meta: "Oldest: 11 minutes",
      },
    ],
  },
  lead: {
    title: "Lead follow-up",
    caption: "a personal reply in minutes, day or night",
    incoming: "Hi! Do you cover weekend callouts in Salem?",
    reply:
      "Hi Priya — yes, Saturdays until 2pm. Want me to hold 9am for you? — Ana",
    sender: "Ana R.",
  },
  scheduling: {
    title: "Smart scheduling",
    caption: "open shifts matched to the right person",
    slots: [
      { id: "am", label: "Today", hours: "9am–1pm" },
      { id: "pm", label: "Today", hours: "2pm–6pm" },
    ],
    matches: [
      { id: "ana", initials: "AR", name: "Ana R.", note: "Free all morning" },
      { id: "luis", initials: "LM", name: "Luis M.", note: "Free from 2pm" },
    ],
  },
  data: {
    title: "Ask your data",
    caption: '"Which service grew most this quarter?"',
    question: "Which service grew most this quarter?",
    bars: [
      { label: "Maintenance", value: 34, display: "+34%" },
      { label: "Repairs", value: 52, display: "+52%" },
      { label: "Installs", value: 88, display: "+88%" },
      { label: "Emergency", value: 41, display: "+41%" },
    ],
    highlight: "Installs",
  },
} as const;

export const industries = {
  eyebrow: "Who we build for",
  title: "Service businesses with 5 to 200 people",
  counter: { value: "04", label: "industries we know inside out" },
  cta: { label: "See all industries", href: "/industries" },
  items: [
    {
      id: "field",
      title: "Home & field services",
      blurb: "Plumbing, HVAC, landscaping, cleaning and electrical crews.",
    },
    {
      id: "agencies",
      title: "Agencies & professional services",
      blurb: "Marketing, design, consulting and accounting teams.",
    },
    {
      id: "nonprofits",
      title: "Nonprofits & associations",
      blurb: "Membership, programs, grants and volunteer coordination.",
    },
    {
      id: "care",
      title: "Care providers",
      blurb: "Home care, clinics, therapy and childcare providers.",
    },
  ],
  previews: {
    field: {
      routeLabel: "Crew B route · 3 stops",
      jobs: [
        {
          id: "gutter",
          title: "Gutter repair, Oak St",
          meta: "Crew B · 9:30 AM",
          chip: "En route",
          tone: "muted",
        },
        {
          id: "ac",
          title: "AC service, Pine Ave",
          meta: "Crew A · 8:00 AM",
          chip: "Job completed",
          tone: "success",
        },
      ],
    },
    agencies: {
      label: "Hours logged this week",
      hours: 312,
      suffix: "hrs across 4 projects",
      projects: [
        { id: "brand", name: "Brand refresh", pct: 100, chip: "Delivered" },
        { id: "web", name: "Website build", pct: 72, chip: "" },
        { id: "seo", name: "SEO retainer", pct: 54, chip: "" },
        { id: "q4", name: "Q4 campaign", pct: 31, chip: "" },
      ],
    },
    nonprofits: {
      label: "Active members",
      members: 1284,
      chartLabel: "Grants received, by month",
      bars: [
        { month: "Jun", pct: 38 },
        { month: "Jul", pct: 52 },
        { month: "Aug", pct: 46 },
        { month: "Sep", pct: 64 },
        { month: "Oct", pct: 72 },
        { month: "Nov", pct: 92 },
      ],
      volunteersLabel: "Volunteers this weekend",
      volunteers: ["AR", "LM", "PK", "JD", "SB"],
      volunteerExtra: "+12",
    },
    care: {
      heading: "Today's visits",
      caregivers: "4 caregivers",
      visits: [
        { id: "carter", initials: "JC", name: "J. Carter", time: "8:00 AM" },
        { id: "nguyen", initials: "LN", name: "L. Nguyen", time: "9:30 AM" },
        { id: "patel", initials: "RP", name: "R. Patel", time: "11:00 AM" },
        { id: "brooks", initials: "DB", name: "D. Brooks", time: "1:15 PM" },
      ],
      statusLabel: "Checked in",
      banner: "All visits covered",
    },
  },
} as const;

export const pricing = {
  eyebrow: "Pricing",
  title: "Fixed prices. No per-user fees. Ever.",
  note: "Payment plans available. Your Blueprint is free.",
  cta: { label: "See full pricing", href: "/pricing" },
  seatTag: "per seat",
  popularLabel: "Most popular",
  plans: [
    { id: "single-module", name: "Single module", price: 4500, popular: false },
    { id: "launch", name: "Launch", price: 8500, popular: false },
    { id: "operate", name: "Operate", price: 16000, popular: true },
    { id: "scale", name: "Scale", price: 28000, popular: false },
  ],
} as const;

export const remote = {
  eyebrow: "Working with a remote team",
  title: "Built in Dhaka. Run on your hours.",
  body: "We're a remote team based in Bangladesh, and we're upfront about it. You get senior work at fair prices, with the safeguards you'd expect from a US firm.",
  points: [
    {
      id: "overlap",
      title: "Live overlap every weekday",
      detail: "4+ hours with US Eastern",
    },
    {
      id: "ownership",
      title: "You own everything",
      detail: "code, data and designs, in the contract",
    },
    {
      id: "nda",
      title: "NDA before you share anything",
      detail: "signed before the first call",
    },
    {
      id: "board",
      title: "Your weekly board",
      detail: "see progress without asking",
    },
  ],
  clocks: [
    { id: "dhaka", label: "Dhaka", timeZone: "Asia/Dhaka" },
    { id: "eastern", label: "US Eastern", timeZone: "America/New_York" },
  ],
  overlapLabel: "Overlap",
} as const;

export const founder = {
  quote:
    "For years I built websites, SEO and automations for US nonprofits, care providers and service companies. The same story kept showing up. Great teams, losing hours every week to tools that didn't fit them. Elevosia exists to fix that. We build the one system your business actually needs, at a price that makes sense for a growing company.",
  name: "Alamin",
  role: "Founder, Elevosia",
  linkedin: { label: "LinkedIn", href: "https://www.linkedin.com/in/alamin" },
  photo: "/founder/alamin.svg",
  photoAlt: "Alamin, founder of Elevosia",
} as const;

export const faq = {
  eyebrow: "FAQ",
  title: "Questions, answered.",
  cta: { label: "Book a call", href: "/book-a-call" },
  items: [
    {
      id: "cost",
      question: "How much does a custom dashboard cost?",
      answer:
        "Most projects land between $8,500 and $28,000. A single module starts at $4,500. Your free Blueprint gives you a fixed price before you commit.",
    },
    {
      id: "timeline",
      question: "How long does it take?",
      answer:
        "Most dashboards go live in 6 to 10 weeks after you approve the Blueprint.",
    },
    {
      id: "blueprint",
      question: "Do I pay for the Blueprint?",
      answer:
        "No. Share your requirements and we send a plan with a fixed price within 5 business days.",
    },
    {
      id: "off-the-shelf",
      question: "Why not just use off-the-shelf software?",
      answer:
        "If it fits and your team is small, use it. Custom makes sense when you pay for many tools that each do part of the job, or per-user fees keep climbing. Our calculator shows your break-even point.",
    },
    {
      id: "tracking",
      question: "How will I know the project is on track?",
      answer:
        "You get a client portal with a weekly board. Every task shows In progress or Completed the moment it changes.",
    },
    {
      id: "ownership",
      question: "Who owns the code and data?",
      answer:
        "You do, written into the contract. You're never locked in.",
    },
    {
      id: "integrations",
      question: "Can it connect to tools we already use?",
      answer:
        "Yes. Google Workspace, Microsoft 365, QuickBooks, Stripe, Slack and most tools with an API.",
    },
    {
      id: "after-launch",
      question: "What happens after launch?",
      answer:
        "A 30-day warranty, then an optional monthly care plan. Or take the code and run it yourself.",
    },
  ],
} as const;

export const closing = {
  title: "Now picture next Monday.",
  body: "7:40. You open one screen. Today's jobs, who's working, what's unpaid and what needs you, already there. Your coffee's still hot.",
  primary: { label: "Start a project", href: "/start" },
  secondary: { label: "Book a call", href: "/book-a-call" },
  checklist: {
    label: "Not ready? Get the free Dashboard Blueprint checklist",
    href: "/pricing#blueprint",
  },
  day: "Monday",
  clock: "7:40",
  widgets: [
    { id: "jobs", label: "Today's jobs", value: 8, prefix: "", suffix: "" },
    { id: "staff", label: "Who's working", value: 5, prefix: "", suffix: "" },
    { id: "unpaid", label: "Unpaid", value: 3240, prefix: "$", suffix: "" },
    { id: "needs", label: "Needs you", value: 3, prefix: "", suffix: "" },
  ],
} as const;
