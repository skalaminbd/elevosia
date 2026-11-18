/**
 * Why Custom page copy, verbatim from pagecontent.md §8.
 */

export const whyMeta = {
  title: "Custom Software vs SaaS for Small Business: Cost Calculator | Elevosia",
  description:
    "Should you build or buy? An honest comparison of custom software and SaaS, plus a calculator that shows your 3-year cost and break-even point.",
};

export const whyHero = {
  eyebrow: "Build or buy?",
  title: "Should you build custom software? An honest answer.",
  subhead:
    "We build custom dashboards, so you'd expect us to say \"build.\" Sometimes we don't. Here's how to tell what's right for your business, plus a calculator to check the math.",
  primary: { label: "Check the math", href: "#calculator" },
  secondary: { label: "Start a project", href: "/start" },
};

export const honestLists = {
  buy: {
    title: "Stick with off-the-shelf if:",
    items: [
      "your team is under about 10 people",
      "your process is standard and the tool fits it",
      "you need something running this week",
      "you use one or two tools and they work fine",
    ],
  },
  build: {
    title: "Go custom if:",
    items: [
      "you pay for many tools that each do part of the job",
      "per-user fees grow every time you hire",
      "your team types the same data into several places",
      "your way of working is what makes you different",
      "you want to own your software and data",
    ],
  },
};

export const hiddenCosts = {
  title: "SaaS looks cheap in month one",
  body: "The sticker price is per user, per month. The real price includes everything around it.",
  cards: [
    {
      id: "seats",
      title: "Per-seat fees",
      body: "every hire adds a monthly cost to every tool",
    },
    {
      id: "increases",
      title: "Yearly price increases",
      body: "often 5 to 12 percent",
    },
    {
      id: "addons",
      title: "Paid add-ons",
      body: "AI, extra users and reports sold separately",
    },
    {
      id: "workarounds",
      title: "Workaround time",
      body: "hours spent copying data between tools",
    },
  ],
  charges: [
    "+$45 new seat",
    "+7% yearly increase",
    "+$29 AI add-on",
    "+3 hrs workaround",
  ],
  source:
    "Price increase range: Kolonell, Custom Software vs Off-the-Shelf SaaS, 2026.",
};

export const calculator = {
  title: "Check the math for your business",
  intro:
    "Move the sliders to match your team. We compare three years of subscriptions with a custom build plus our Essential care plan.",
  sliders: [
    {
      id: "people",
      label: "People using software",
      min: 3,
      max: 100,
      step: 1,
      default: 20,
      hint: "staff who log into your tools",
      suffix: "",
    },
    {
      id: "cost",
      label: "Software cost per person, per month",
      min: 20,
      max: 400,
      step: 5,
      default: 120,
      hint: "add up scheduling, CRM, invoicing and forms tools, divided by people",
      prefix: "$",
      suffix: "",
    },
    {
      id: "increase",
      label: "Yearly price increase",
      min: 0,
      max: 15,
      step: 1,
      default: 7,
      hint: "the average across your tools",
      suffix: "%",
    },
    {
      id: "hours",
      label: "Hours lost per person, per week",
      min: 0,
      max: 6,
      step: 0.5,
      default: 1.5,
      hint: "double entry and switching tools",
      suffix: "h",
    },
  ],
  labels: {
    saas: "3-year subscriptions total",
    custom: "3-year custom total",
    hours: "hours lost per year",
  },
  cta: { label: "Get a real fixed price", href: "/start" },
  finePrint:
    "Estimates only. Custom total uses starting prices (Launch $8,500 up to 10 people, Operate $16,000 up to 40, Scale $28,000 above) plus Essential care at $299 a month. Your real price comes in your free Blueprint.",
};

export const middlePath = {
  title: "You don't have to replace everything",
  body: "Most clients keep a few tools they love, like QuickBooks or Google Workspace, and replace the rest.",
  columns: [
    { id: "keep", label: "Keep", items: ["accounting", "email", "documents"] },
    { id: "replace", label: "Replace", items: ["scheduling", "CRM", "forms", "trackers"] },
    { id: "add", label: "Add", items: ["client portal", "reports", "AI"] },
  ],
};

export const whyClosing = {
  title: "Still not sure? We'll tell you straight.",
  body: "On a call we'll look at your tools. If off-the-shelf is the better choice, we'll say so and point you to the right one.",
  primary: { label: "Book a call", href: "/book-a-call" },
  secondary: { label: "Start a project", href: "/start" },
};
