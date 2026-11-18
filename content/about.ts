/**
 * About page copy, verbatim from pagecontent.md §11.
 */

export const aboutMeta = {
  title: "About Elevosia | Custom Dashboards for Growing Businesses",
  description:
    "A small senior team building custom dashboards for US service businesses. Founded by Alamin after years of web, SEO and automation work for US organizations.",
};

export const aboutHero = {
  eyebrow: "About Elevosia",
  title:
    "We started by building websites. We kept seeing the same problem behind them.",
};

export const chapters = [
  {
    id: "pattern",
    index: "01",
    title: "The pattern.",
    body: "For years, our work was websites, SEO and automation for US organizations: nonprofits, care providers, associations and service companies. The websites got better and the traffic went up. But behind the website, the same thing kept happening. Leads waited in an inbox. Schedules lived in a spreadsheet only one person understood. Reports took a full Friday. Smart, hard-working teams lost hours every week to tools that were never built for them.",
  },
  {
    id: "idea",
    index: "02",
    title: "The idea.",
    body: "Growing businesses were stuck between two bad options: software that almost fits, priced per seat, or a custom build from a big agency, priced for companies ten times their size. We thought there should be a third option. Custom software built from proven modules, at a fixed price a growing business can plan around, with a client portal that shows progress every week.",
  },
  {
    id: "elevosia",
    index: "03",
    title: "Elevosia.",
    body: "So we built it. Elevosia makes custom dashboards for service businesses that have outgrown their tools. One system for the team, the clients and the website, owned by the business that uses it. We're a small, senior, remote team in Dhaka, Bangladesh, working US hours. Small on purpose: you talk to the people building your software, not an account manager.",
  },
] as const;

export const beliefs = [
  {
    id: "honest",
    title: "Honest over hype.",
    body: "If off-the-shelf fits you better, we'll say so. If AI won't help, we won't sell it.",
  },
  {
    id: "ownership",
    title: "You own your tools.",
    body: "Your software and data belong to you. No lock-in, ever.",
  },
  {
    id: "show",
    title: "Show, don't tell.",
    body: "You see every week of work on your board, not in a status meeting.",
  },
  {
    id: "after",
    title: "Here after launch.",
    body: "Launch is the start. We stick around to keep it working and growing.",
  },
] as const;

export const team = {
  eyebrow: "The team",
  founder: {
    name: "Alamin",
    role: "Founder",
    line: "Web development, technical SEO and automation for US organizations.",
    linkedin: { label: "LinkedIn", href: "https://www.linkedin.com/in/alamin" },
    photo: "/founder/alamin.svg",
    photoAlt: "Alamin, founder of Elevosia",
  },
  /** Add real people here; the block stays hidden while this is empty. */
  people: [] as { name: string; role: string; photo: string }[],
};

export const experience = {
  title: "Where our team has done the work",
  body: "Before Elevosia, our team built and grew digital systems for organizations in these sectors across the US.",
  sectors: [
    "Nonprofits",
    "Hospice and home care",
    "Member associations",
    "Advocacy groups",
    "Professional services",
    "Sports and recreation",
    "Financial services",
  ],
};

export const dhaka = {
  title: "Senior talent, fair prices, your hours",
  body: "Bangladesh has a deep pool of skilled developers and designers. Working from here lets us offer senior work at prices growing businesses can afford, while shifting our day to overlap with yours.",
  link: {
    label: "See how we keep remote projects on track",
    href: "/how-it-works",
  },
};

export const aboutClosing = {
  title: "Let's talk about your business.",
  body: "Thirty minutes, no pitch deck. Just your workflow and our honest take.",
  primary: { label: "Book a call", href: "/book-a-call" },
  secondary: { label: "Start a project", href: "/start" },
};

/** Sample data for the inbox and calendar items. Clearly fake, per §0.8. */
export const aboutDemo = {
  leads: [
    { id: "form", source: "Website form", name: "Sample lead A", meta: "Bathroom quote" },
    { id: "email", source: "Email", name: "Sample lead B", meta: "Invoice question" },
    { id: "call", source: "Voicemail", name: "Sample lead C", meta: "Booked 9:12 am" },
    { id: "referral", source: "Referral", name: "Sample lead D", meta: "Weekend callout" },
  ],
  calendar: {
    weekday: "Thursday",
    date: "20 March",
    time: "10:00 am",
    duration: "30 min",
    title: "Call with your team",
  },
};

/* Added for the redesign. No new factual claims: every line is supported by
   the existing copy (ownership, fixed price, no per-seat fees, US overlap). */

export const heroLead =
  "Now we build the system behind it: one dashboard for the team, the clients and the website.";

export const facts = [
  {
    title: "Small on purpose",
    body: "You talk to the people building your software, not an account manager.",
  },
  {
    title: "Senior team",
    body: "The people who scope the work are the people who build it.",
  },
  {
    title: "US hours",
    body: "4+ hours of live overlap with US Eastern, every weekday.",
  },
  {
    title: "You own it",
    body: "Code, data and designs are yours, written into the contract.",
  },
];

export const board = {
  eyebrow: "Show, don't tell",
  title: "You watch it happen, week by week.",
  body: "Every project runs on a shared board. When a task moves, you see it that day, not in a status call.",
  week: "Week 3 of 8",
  update: "Weekly update sent Monday",
  columns: [
    {
      id: "week",
      label: "This week",
      tasks: [
        { id: "portal", text: "Client portal — approvals" },
        { id: "shifts", text: "Scheduling — shift rules" },
      ],
    },
    {
      id: "progress",
      label: "In progress",
      tasks: [
        { id: "invoices", text: "Invoices — testing" },
        { id: "reports", text: "Reports — first pass" },
      ],
    },
    {
      id: "done",
      label: "Completed",
      tasks: [
        { id: "blueprint", text: "Blueprint signed off" },
        { id: "shell", text: "Dashboard shell" },
        { id: "roles", text: "Login + roles" },
      ],
    },
  ],
};

export const principlesTitle = "Four rules we don't break.";

export const principlesLead =
  "If a project needs something different, we'll say so before the contract, not after.";

export const honesty = {
  eyebrow: "What we won't do",
  title: "The short list.",
  lead: "Check every one of these before you sign anything.",
  items: [
    {
      wont: "Sell you AI you don't need",
      will: "If it won't save you hours, we don't build it.",
    },
    {
      wont: "Charge per seat",
      will: "Add your whole team for free.",
    },
    {
      wont: "Lock in your data",
      will: "Code, data and designs are yours, in writing.",
    },
    {
      wont: "Disappear after launch",
      will: "A 30-day warranty, then a care plan if you want one.",
    },
  ],
};

export const teamFacts = ["Remote, based in Dhaka", "US working hours", "Senior only"];

export const dhakaFacts = [
  "Dhaka, Bangladesh",
  "4+ hours with US Eastern",
  "Weekday overlap",
];

export const aboutTimeline = {
  title: "How we got here",
  intro:
    "A short history, because the way we work now comes straight out of it.",
  stages: [
    {
      id: "websites",
      label: "Where we started",
      title: "Websites and search",
      body: "Sites, technical SEO and content for US nonprofits, care providers and service companies.",
    },
    {
      id: "automation",
      label: "Then",
      title: "Automation",
      body: "The same teams asked us to connect the tools behind the website: forms, email, invoices.",
    },
    {
      id: "pattern",
      label: "The pattern",
      title: "The same wall",
      body: "Every project ended at one spreadsheet that only one person understood. The website was never the problem.",
    },
    {
      id: "now",
      label: "Now",
      title: "Elevosia",
      body: "One system for the team, the clients and the website, at a fixed price a growing business can plan around.",
    },
  ],
};
