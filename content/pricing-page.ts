/**
 * Pricing page copy, verbatim from pagecontent.md §7.
 */

export const pricingMeta = {
  title: "Custom Dashboard Pricing | Fixed Price, No Per-User Fees | Elevosia",
  description:
    "Custom dashboards from $4,500. Free Blueprint, fixed price before we build, no per-user fees, and payment plans available.",
};

export const pricingHero = {
  eyebrow: "Pricing",
  title: "Know the price before you commit. For free.",
  subhead:
    "No hourly meters and no surprise invoices. Share your requirements and get a fixed-price Blueprint in 5 business days. The price only changes if you change the scope.",
  primary: { label: "Start a project", href: "/start" },
  secondary: { label: "Try the cost calculator", href: "/why-custom#calculator" },
  struck: "$1,500",
  free: "Free",
};

export const blueprint = {
  label: "Step 1 for every project",
  title: "Your Blueprint",
  body: "We turn your requirements into a clear plan before any code is written. It's how we keep prices fixed and projects on time.",
  includes: [
    "Milestones and the tasks inside each one",
    "Timeline week by week",
    "Fixed price and payment schedule",
    "Changes until you're happy",
  ],
  price: "Free.",
  priceNote: "Delivered in 5 business days.",
  cta: { label: "Start a project", href: "/start" },
  days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
};

export const packages = {
  title: "Pick a starting point. We shape it to you.",
  intro:
    "Every package includes your client portal with weekly board, roles and permissions, data migration, team training and a 30-day warranty. No per-user fees on any plan.",
  plans: [
    {
      id: "single-module",
      name: "Single module",
      price: 4500,
      timeline: "about 3 to 4 weeks",
      body: "Fix your biggest pain first. One module (for example scheduling, client portal or invoicing), up to 2 user roles, 1 integration. Add more modules later at module prices.",
      popular: false,
    },
    {
      id: "launch",
      name: "Launch",
      price: 8500,
      timeline: "about 6 weeks",
      body: "For teams up to about 10 people replacing spreadsheets. Website + dashboard, up to 3 modules, 2 roles, 1 integration, weekly report email.",
      popular: false,
    },
    {
      id: "operate",
      name: "Operate",
      price: 16000,
      timeline: "about 8 weeks",
      body: "For growing teams running clients, staff and billing. Everything in Launch, up to 6 modules, client portal with payments, up to 4 roles, 3 integrations, 2 AI automations.",
      popular: true,
    },
    {
      id: "scale",
      name: "Scale",
      price: 28000,
      timeline: "about 10 to 12 weeks",
      body: "For multi-location teams and complex workflows. Everything in Operate, all modules in scope, multi-location and advanced roles, custom integrations, AI assistant on your data.",
      popular: false,
    },
  ],
  paymentTitle: "How you pay",
  payment: "40% to start, 30% at the mid-project demo, 30% at launch. Prefer smaller payments? Ask about a monthly payment plan.",
  segments: [
    { label: "40% to start", width: 40 },
    { label: "30% at the demo", width: 30 },
    { label: "30% at launch", width: 30 },
  ],
  context:
    "Small business apps from US agencies are often quoted at $30,000 to $150,000 or more.",
};

export const carePlans = {
  title: "We don't disappear after launch",
  intro:
    "Pick a plan, change it any month, or cancel and run it yourself. Hosting is billed to you directly by the provider.",
  plans: [
    {
      id: "essential",
      name: "Essential",
      price: 299,
      features: [
        "monitoring and daily backups",
        "security updates",
        "bug fixes",
        "2 hours of small changes",
        "next-business-day support",
      ],
      highlight: false,
    },
    {
      id: "growth",
      name: "Growth",
      price: 699,
      features: [
        "everything in Essential",
        "6 hours of changes and new features",
        "one automation tune-up a month",
        "same-business-day support",
        "quarterly review call",
      ],
      highlight: true,
    },
    {
      id: "partner",
      name: "Partner",
      price: 1500,
      features: [
        "everything in Growth",
        "20 hours of development",
        "new modules on a rolling roadmap",
        "shared Slack channel",
        "monthly strategy call",
      ],
      highlight: false,
    },
  ],
  recommended: "Recommended",
};

export const addOns = {
  title: "Add-ons",
  items: [
    { name: "Extra module", price: 2500 },
    { name: "AI automation", price: 1500 },
    { name: "Integration", price: 1000 },
    { name: "AI audit", price: 750, note: "credited toward the work" },
  ],
};

export const websiteBand = {
  body: "Need a website first? Website projects start at $3,500 and are built so they can grow into a full dashboard later.",
  link: { label: "See website projects", href: "/website-projects" },
};

export const pricingFaq = {
  eyebrow: "Pricing FAQ",
  items: [
    {
      id: "free",
      question: "Is the Blueprint really free?",
      answer: "Yes. You pay nothing until you approve the plan and sign.",
    },
    {
      id: "changes",
      question: "What if our needs change during the build?",
      answer:
        "Small tweaks are included. Bigger changes get a written change request with a price, and nothing starts until you approve.",
    },
    {
      id: "per-user",
      question: "Are there per-user or license fees?",
      answer: "No. Add as many staff and clients as you like.",
    },
    {
      id: "care",
      question: "Do I have to buy a care plan?",
      answer:
        "No. You get a 30-day warranty. After that it's optional, and you can hire any developer since you own the code.",
    },
    {
      id: "smaller",
      question: "Can we start smaller?",
      answer: "Yes. Start with a single module and add more as you grow.",
    },
    {
      id: "monthly",
      question: "Can we pay monthly?",
      answer:
        "Ask about a payment plan. We'll find a schedule that works for your cash flow.",
    },
  ],
};

export const pricingClosing = {
  title: "Want a number for your business?",
  body: "Share what you need and get a fixed price in 5 business days. Or try the calculator first.",
  primary: { label: "Start a project", href: "/start" },
  secondary: { label: "Try the cost calculator", href: "/why-custom#calculator" },
  calculator: {
    rows: [
      { label: "Tools you'd replace", value: 4 },
      { label: "Per-seat fees a year", value: 3240 },
      { label: "Your fixed price", value: 8500 },
    ],
  },
};
