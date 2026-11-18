/**
 * How It Works page copy, verbatim from pagecontent.md §5.
 */

export const hiwMeta = {
  title: "How We Build Your Custom Dashboard | Elevosia",
  description:
    "Share your requirements, approve a free Blueprint with a fixed price, then watch your dashboard get built on a live weekly board.",
};

export const hiwHero = {
  eyebrow: "How it works",
  title: "No surprises. You see every step.",
  subhead:
    "Hiring a team you've never met is a real risk. So we made the whole process visible: what you get before you pay, what happens each week, and what's written into the contract.",
  primary: { label: "Start a project", href: "/start" },
  secondary: { label: "Book a call", href: "/book-a-call" },
};

export const timeline = {
  title: "Here's what working with us actually looks like",
  milestones: [
    {
      id: "day-1",
      when: "Day 1",
      title: "You share what you need.",
      body: "Open our requirement builder and write it the way you'd explain it to a new manager: a section for each part of the business, a few points under each. Or upload a doc you already have. Stuck? Book a call and we'll write it together.",
    },
    {
      id: "day-2-5",
      when: "Days 2 to 5",
      title: "We ask good questions.",
      body: "Your project manager reads every point and leaves comments right beside them. You answer in the same place. No long email threads.",
    },
    {
      id: "day-5",
      when: "Day 5",
      title: "Your free Blueprint arrives.",
      body: "Milestones, the tasks inside each one, a timeline and a fixed price. Ask for changes as many times as you need. Nothing is charged until you approve.",
    },
    {
      id: "week-1",
      when: "Week 1",
      title: "You approve and we start.",
      body: "You e-sign the contract and pay the deposit in your portal. Your project manager plans the first weeks of work.",
    },
    {
      id: "week-2-9",
      when: "Weeks 2 to 9",
      title: "You watch it get built.",
      body: "Your weekly board fills up as we work. Every Friday you get a short recorded demo and a link to try it yourself.",
    },
    {
      id: "week-10",
      when: "Week 10",
      title: "You go live.",
      body: "We move your data in, train your team role by role, and stay close while everyone switches over.",
    },
    {
      id: "after",
      when: "After launch",
      title: "A 30-day warranty, then an optional care plan.",
      body: "New ideas go through the same simple path.",
    },
  ],
};

export const portal = {
  title: "One place for everything about your project",
  intro:
    "From the day you sign up, you get your own portal. No more digging through email for the latest file or invoice.",
  features: [
    {
      id: "board",
      title: "Weekly board",
      body: "Each week has its own box. Tasks show In progress when we start and turn green when they're done. You see the work, not who's doing it, so you always talk to one person: your project manager.",
    },
    {
      id: "approvals",
      title: "Approvals",
      body: "Designs and milestones wait for your OK. Approve or ask for changes with one click.",
    },
    {
      id: "messages",
      title: "Messages",
      body: "One thread per project, with your project manager.",
    },
    {
      id: "files",
      title: "Files and contracts",
      body: "Every deliverable, signed contract and invoice in one spot.",
    },
    {
      id: "tickets",
      title: "Tickets",
      body: "After launch, report anything and track the fix.",
    },
    {
      id: "invoices",
      title: "Invoices",
      body: "Pay by card or bank transfer, and download receipts.",
    },
  ],
  feed: [
    "Task moved to Completed",
    "Design waiting for approval",
    "New message from PM",
    "Invoice #3 paid",
    "Ticket #12 resolved",
  ],
};

export const normalWeek = {
  title: "You'll always know where things stand",
  intro:
    "You need about one hour a week from one person on your side. We handle the rest.",
  days: [
    { id: "mon", day: "Monday", body: "The week's tasks appear on your weekly board." },
    { id: "tue", day: "Every day", body: "Tasks move to In progress and Completed as we work. Questions answered within one business day." },
    { id: "wed", day: "Wednesday", body: "Optional 30-minute live call in US morning hours." },
    { id: "fri", day: "Friday", body: "A short recorded demo of what's working, with a link to try it." },
  ],
};

export const timeZones = {
  title: "Remote team. Your business hours.",
  body: "We're based in Dhaka, Bangladesh, and we shift our day so your mornings overlap with our evenings. You get live answers when you need them and finished work waiting when you wake up.",
  clocks: [
    { id: "dhaka", label: "Dhaka", timeZone: "Asia/Dhaka" },
    { id: "eastern", label: "US Eastern", timeZone: "America/New_York" },
    { id: "central", label: "US Central", timeZone: "America/Chicago" },
    { id: "pacific", label: "US Pacific", timeZone: "America/Los_Angeles" },
  ],
  windows: [
    "US Eastern: 8 am to 12 pm live, Monday to Friday",
    "US Central: 7 am to 11 am live",
    "US Pacific: 5 am to 9 am, plus messages any time",
    "While you sleep: we build, test and update your weekly board.",
  ],
};

export const contract = {
  title: "Promises in writing, not on a slide",
  points: [
    {
      id: "own",
      title: "You own everything",
      body: "Code, designs, data and accounts are yours on payment. No license fees, no lock-in.",
    },
    {
      id: "price",
      title: "Fixed price",
      body: "The Blueprint price is the price. Changes need a written change request you approve first.",
    },
    {
      id: "nda",
      title: "Confidentiality",
      body: "We sign an NDA before you share anything sensitive.",
    },
    {
      id: "pay",
      title: "Pay as you see progress",
      body: "40% to start, 30% at the mid-project demo, 30% at launch. Payment plans available.",
    },
    {
      id: "warranty",
      title: "30-day warranty",
      body: "Anything that doesn't work as agreed, we fix free.",
    },
    {
      id: "handover",
      title: "Clean handover",
      body: "If we ever part ways, you get every password, document and line of code.",
    },
  ],
  payments: ["40% to start", "30% at the demo", "30% at launch"],
};

export const security = {
  title: "How we handle your data",
  points: [
    {
      id: "accounts",
      title: "Your accounts, your access",
      body: "Code and hosting live in accounts you own, and our access can be removed any time.",
    },
    {
      id: "encryption",
      title: "Encrypted everywhere",
      body: "Encrypted connections and storage.",
    },
    {
      id: "2fa",
      title: "Two-factor login",
      body: "For your team and ours.",
    },
    {
      id: "roles",
      title: "Role-based permissions",
      body: "With activity logs so every change has a name.",
    },
    {
      id: "backups",
      title: "Daily backups",
      body: "With tested restores, not just a checkbox.",
    },
    {
      id: "hipaa",
      title: "HIPAA up front",
      body: "Requirements confirmed up front for care providers.",
    },
  ],
};

export const faq = {
  eyebrow: "FAQ",
  items: [
    {
      id: "dont-know",
      question: "What if I don't know exactly what I need?",
      answer:
        "Most clients don't. Write down what's painful today, or book a call. Your project manager turns it into requirements with you.",
    },
    {
      id: "dont-like",
      question: "What if I don't like the Blueprint?",
      answer: "Ask for changes, or walk away. It costs you nothing.",
    },
    {
      id: "slips",
      question: "What if the project slips?",
      answer:
        "You'll see it on your weekly board before we tell you. Your project manager explains why and what we're changing.",
    },
    {
      id: "disappear",
      question: "What if you disappear?",
      answer:
        "The code lives in your accounts from day one, and the contract gives you every password and document.",
    },
  ],
};

export const hiwClosing = {
  title: "The first step takes 15 minutes.",
  body: "Write down what you need. We'll send a plan and a fixed price within 5 business days, free.",
  primary: { label: "Start a project", href: "/start" },
  secondary: { label: "Book a call", href: "/book-a-call" },
  timer: "15 min",
};

/** Sample data for the live items. Clearly fake, per §0.8. */
export const hiwDemo = {
  board: {
    week: "Week 3",
    columns: [
      {
        id: "progress",
        label: "In progress",
        tasks: ["Invoices — testing", "Reports — first pass"],
      },
      {
        id: "done",
        label: "Completed",
        tasks: ["Blueprint signed off", "Dashboard shell", "Login + roles"],
      },
    ],
  },
};
