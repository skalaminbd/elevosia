/**
 * AI & Automation page copy, from pagecontent.md §9. The spec's demo button
 * points at /how-it-works until the Live Demo page is built.
 */

export const aiMeta = {
  title:
    "AI Automation for Service Businesses, Built Into Your Dashboard | Elevosia",
  description:
    "Practical AI inside your custom dashboard: daily briefings, lead follow-up, smart scheduling and payment reminders, measured in hours saved.",
};

export const aiHero = {
  eyebrow: "AI & automation, inside your dashboard",
  title: "AI that does real work. Not a chatbot in the corner.",
  subhead:
    "We build AI into the place your team already works: your dashboard. Every automation has one job, and we measure it in hours saved.",
  primary: { label: "Start a project", href: "/start" },
  secondary: { label: "See how it works", href: "/how-it-works" },
  actions: [
    { label: "Filled 3 open shifts", meta: "Scheduling · 6:02 am", tone: "success" },
    { label: "Sent 4 payment reminders", meta: "Billing · 8:15 am", tone: "info" },
    { label: "Drafted weekly report", meta: "Reports · 8:30 am", tone: "primary" },
    { label: "Scored new lead: high intent", meta: "Leads · 9:12 am", tone: "warning" },
  ],
};

export const aiRules = {
  title: "Four rules we build by",
  intro:
    "AI is easy to add and easy to add badly. These four rules keep it useful.",
  rules: [
    {
      id: "job",
      number: "01",
      title: "Start with the job",
      body: "We find the task eating hours first, then pick the simplest tool that fixes it.",
    },
    {
      id: "approve",
      number: "02",
      title: "People approve what matters",
      body: "AI drafts and suggests. Your team approves anything that touches money or clients.",
    },
    {
      id: "measure",
      number: "03",
      title: "Measured, not promised",
      body: "We track time saved from day one and turn off what doesn't pay off.",
    },
    {
      id: "data",
      number: "04",
      title: "Your data stays yours",
      body: "We use business-grade AI services that don't train public models on your data.",
    },
  ],
};

export const automate = {
  title: "What we automate",
  intro:
    "Three places AI earns its keep. Each one is a task, not a feature list.",
  groups: [
    {
      id: "dashboard",
      label: "Inside your dashboard",
      items: [
        {
          title: "Morning briefing",
          body: "one summary instead of checking five screens",
        },
        {
          title: "Ask your data",
          body: "plain questions, answers from your live numbers, no report queue",
        },
        {
          title: "Smart scheduling",
          body: "gaps filled in minutes, using skills, travel and history",
        },
      ],
    },
    {
      id: "website",
      label: "On your website and portal",
      items: [
        {
          title: "Website assistant",
          body: "answers from your service info and books calls",
        },
        {
          title: "Lead scoring and routing",
          body: "high-intent enquiries reach the right person first",
        },
        {
          title: "Instant personal replies",
          body: "drafted in your voice from templates you approve",
        },
      ],
    },
    {
      id: "operations",
      label: "Across operations",
      items: [
        {
          title: "Documents into data",
          body: "invoices, intake forms and PDFs read into the system",
        },
        {
          title: "Polite payment follow-ups",
          body: "they stop the moment the client pays",
        },
        {
          title: "Weekly reports",
          body: "written and emailed every Monday morning",
        },
      ],
    },
  ],
  flow: {
    inputs: ["Website", "Email", "PDF", "Form"],
    core: "AI core",
    outputs: ["Dashboard", "Calendar", "Client inbox", "Report"],
  },
};

export const nightStory = {
  title: "From website enquiry to booked job, while you sleep",
  intro:
    "This is one lead, one night, with nobody at a keyboard. The same flow runs for every enquiry.",
  steps: [
    {
      time: "11:42 pm",
      title: "A visitor fills in your quote form",
      body: "A homeowner requests a roof repair for next week.",
      phase: "night",
    },
    {
      time: "11:42 pm",
      title: "AI reads it and scores it",
      body: "High intent, in your area, good fit. It writes the score into the enquiry.",
      phase: "night",
    },
    {
      time: "11:43 pm",
      title: "A lead appears in your dashboard",
      body: "Every detail filled in, matched to the right crew and the right service.",
      phase: "night",
    },
    {
      time: "11:44 pm",
      title: "A personal reply goes out",
      body: "With a booking link, from a template you approved.",
      phase: "night",
    },
    {
      time: "8:05 am",
      title: "A call is on your calendar",
      body: "Booked before you open, with a one-line summary ready.",
      phase: "morning",
    },
  ],
};

export const rollout = {
  title: "How we roll it out",
  intro:
    "AI goes in slowly enough to trust. Most clients see the first automation live in under a month.",
  steps: [
    { id: "audit", label: "Audit", body: "we find your top three time sinks" },
    {
      id: "pilot",
      label: "Pilot",
      body: "one automation live in two to three weeks, with a human checking results",
    },
    {
      id: "measure",
      label: "Measure",
      body: "hours saved, response times and errors against the old way",
    },
    {
      id: "scale",
      label: "Scale",
      body: "roll out what works, drop what doesn't",
    },
  ],
};

export const audit = {
  eyebrow: "Already have a system?",
  title: "The AI audit",
  price: 750,
  body: "A focused week looking at how work flows, ending with a written plan for your three biggest automation wins, time saved and cost. The fee is credited if we build them.",
  cta: { label: "Book an AI audit", href: "/book-a-call" },
  checklist: [
    "One week, no build required",
    "Written plan you can keep",
    "Three wins, ranked by hours saved",
    "Fee credited against the work",
  ],
};

export const aiClosing = {
  title: "Where is your team losing the most hours?",
  body: "Tell us, and we'll show you the first thing worth automating.",
  primary: { label: "Start a project", href: "/start" },
  secondary: { label: "Book a call", href: "/book-a-call" },
};
