/**
 * Start a Project copy, from pagecontent.md §14. The booking door points at
 * /book-a-call, the site-wide placeholder until the calendar link is set.
 */

export const startMeta = {
  title: "Start a Project | Free Blueprint for Your Custom Dashboard | Elevosia",
  description:
    "Share what your business needs and get a free Blueprint with milestones, timeline and a fixed price in 5 business days. Or book a 30-minute call.",
};

export const startHero = {
  eyebrow: "Start a project",
  title: "Tell us what slows you down. We'll send back a plan.",
  subhead:
    "Two ways to start. Both are free, and neither commits you to anything.",
  primary: { label: "Start my Blueprint", href: "#start-form" },
  secondary: { label: "Book a call", href: "/book-a-call" },
};

export const doors = [
  {
    id: "blueprint",
    title: "Get a free Blueprint",
    body: "Best if you can describe what you need. Answer 5 quick questions, then write your requirements in our simple builder, or upload a doc. You'll get milestones, a timeline and a fixed price within 5 business days.",
    cta: { label: "Start my Blueprint", href: "#start-form" },
    meta: "5 business days",
  },
  {
    id: "call",
    title: "Book a 30-minute call",
    body: "Best if you'd rather talk it through. We ask a lot of questions and give you an honest take, even if the answer is \"you don't need us.\"",
    cta: { label: "Pick a time", href: "/book-a-call" },
    meta: "30 minutes, free",
  },
] as const;

export const doorsIntro = {
  title: "Choose how you start",
  body: "A written plan in five business days, or thirty minutes on a call. Both are free.",
};

export const startForm = {
  title: "What do you need?",
  intro:
    "Five quick answers. The next step is your requirements, and you can save that draft any time.",
  needs: [
    "Custom dashboard",
    "Add AI to what we have",
    "A website for now",
    "Not sure yet",
  ],
  teamSizes: ["1 to 10", "11 to 40", "41 to 200", "200+"],
  budgets: [
    "Under $5,000",
    "$5,000 to $10,000",
    "$10,000 to $20,000",
    "$20,000+",
    "Not sure yet",
  ],
  submit: "Continue to requirements",
  privacy: "We'll never share your details. Happy to sign an NDA first.",
  progressLabel: "Form complete",
  side: {
    nextTitle: "What happens next",
    next: [
      "We read your requirements within one business day.",
      "Your project manager asks questions beside your points.",
      "Your free Blueprint arrives within 5 business days.",
      "Approve it, or ask for changes. No pressure.",
    ],
    notReadyTitle: "Not ready yet?",
    notReadyBody: "Take the 2-minute check to see if you've outgrown your tools.",
    notReadyCta: { label: "Take the check", href: "/checklist" },
    contactTitle: "Other ways to reach us",
    email: "hello@elevosia.com",
    location: "Based in Dhaka, Bangladesh",
    live: "Live 8 am to 12 pm US Eastern, Mon to Fri",
  },
};

export const reassurance = [
  "Free Blueprint",
  "No per-user fees",
  "You own the code",
  "NDA on request",
];
