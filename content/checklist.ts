/**
 * Blueprint checklist copy, from pagecontent.md §15.2. The PDF is an open item,
 * so the download box asks for an email and promises it when it's ready.
 */

export const checklistMeta = {
  title: "Have You Outgrown Your Tools? Free 2-Minute Check | Elevosia",
  description:
    "Tick what's true for your business and see whether a custom dashboard makes sense. Then take the full checklist with you.",
};

export const checklistHero = {
  eyebrow: "Free resource",
  title: "Have you outgrown your tools? Find out in two minutes.",
  subhead:
    "Tick what's true for your business. You'll see whether a custom dashboard makes sense, and you can take the full checklist with you.",
};

export const checklistGroups = [
  {
    id: "tools",
    label: "Tools",
    items: [
      "We pay for 5 or more tools to run daily work",
      "Our tools don't share data",
      "Per-user fees grow every time we hire",
      "We've bent our process to fit software that almost works",
    ],
  },
  {
    id: "time",
    label: "Time",
    items: [
      "People type the same data into more than one place",
      "Reports take hours every week or month",
      "Leads sometimes wait a day for a reply",
      "Only one person really understands the spreadsheet",
    ],
  },
  {
    id: "growth",
    label: "Growth",
    items: [
      "We plan to grow the team in the next 12 months",
      "Clients ask for a portal or online booking we can't offer",
      "We can't see how the business is doing without asking someone",
      "Our way of working is part of what makes us different",
    ],
  },
] as const;

export const checklistResults = [
  {
    max: 3,
    title: "Your tools are probably fine.",
    body: "Keep this checklist for when that changes. If one task still eats hours, a single module can fix it.",
  },
  {
    max: 7,
    title: "You're starting to outgrow them.",
    body: "A single module could remove your biggest pain, without replacing everything you use today.",
  },
  {
    max: 12,
    title: "You've outgrown your tools.",
    body: "A custom dashboard will likely pay for itself. The next step is a free Blueprint with a fixed price.",
  },
] as const;

export const downloadBox = {
  title: "Get the full Blueprint checklist.",
  body: "A 4-page PDF to map your workflow, roles and must-have features before you talk to any developer, us included. It's being finished now; leave your email and we'll send it the day it's ready.",
  fields: { firstName: "First name", email: "Work email" },
  submit: "Notify me",
  success: "You're on the list. We'll email it the day it's ready.",
  cta: { label: "Turn this into a free Blueprint", href: "/start" },
};
