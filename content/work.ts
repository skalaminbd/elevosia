/**
 * Work page copy, from pagecontent.md §12. The live demo card is replaced with
 * links to the parts of the site that exist today.
 */

export const workMeta = {
  title: "Custom Dashboard Projects and Case Studies | Elevosia",
  description:
    "See how growing businesses replaced scattered tools with one custom dashboard, and what changed for their teams.",
};

export const workHero = {
  eyebrow: "Our work",
  title: "Real businesses. One system each.",
  subhead:
    "Every story follows the same shape: what wasn't working, what we built, and what changed for the team.",
  primary: { label: "Start a project", href: "/start" },
  secondary: { label: "See how it works", href: "/how-it-works" },
  steps: [
    { id: "before", label: "What wasn't working", meta: "scattered tools, double entry" },
    { id: "build", label: "What we built", meta: "one dashboard, your process" },
    { id: "after", label: "What changed", meta: "fewer tools, hours back" },
  ],
};

export const whatYouGet = {
  title: "See exactly what you'd get",
  intro:
    "Case studies are being written. Until they're live, look at the real thing: the dashboard, the plan and the weekly board.",
  cards: [
    {
      id: "dashboard",
      title: "The dashboard",
      body: "The modules, the views and the numbers your team would see every day.",
      cta: { label: "See the dashboard", href: "/custom-dashboards" },
      meta: "Sample data",
    },
    {
      id: "blueprint",
      title: "A sample Blueprint",
      body: "The real format your plan comes in: milestones, tasks, timeline and a fixed price.",
      cta: { label: "See how the Blueprint works", href: "/pricing" },
      meta: "Free, in 5 business days",
    },
    {
      id: "board",
      title: "A sample weekly board",
      body: "What your client portal shows during the build, updated every week.",
      cta: { label: "See the portal", href: "/how-it-works#weekly-board" },
      meta: "Updated weekly",
    },
  ],
};

export const founding = {
  title: "Be one of our first five dashboard clients",
  body: "We're opening five founding-client spots. You get founding pricing and the founder on every weekly call. In return, we ask for an honest case study once you're live.",
  perks: [
    "founding price on any package",
    "founder on every weekly call",
    "first access to new modules",
  ],
  cta: { label: "Ask about a founding spot", href: "/start" },
  seats: 5,
};

export const workClosing = {
  title: "Your project could be the next story.",
  body: "Tell us what slows you down. We'll come back with a plan, a timeline and a fixed price.",
  primary: { label: "Start a project", href: "/start" },
  secondary: { label: "See how it works", href: "/how-it-works" },
};

export const workProcess = {
  title: "The shape of every project",
  intro:
    "The same four steps, whether you start with one module or all of them. You see each one on your weekly board.",
  steps: [
    {
      id: "requirements",
      label: "Requirements",
      body: "A short form and a call. We write down what slows you down, in your words.",
      meta: "1 conversation",
    },
    {
      id: "blueprint",
      label: "Blueprint",
      body: "Milestones, tasks, timeline and a fixed price. Free, and yours to keep.",
      meta: "5 business days",
    },
    {
      id: "build",
      label: "Build",
      body: "A weekly board, a working demo and a call every week. No status meetings.",
      meta: "6 to 10 weeks",
    },
    {
      id: "launch",
      label: "Launch and care",
      body: "Training on a real week of work, a 30-day warranty, then care if you want it.",
      meta: "Day one onward",
    },
  ],
};

export const caseStudyCta = {
  label: "Read the sample weekly board",
  href: "/how-it-works#weekly-board",
};
