/**
 * Booking page copy. The calendar link is still an open item, so the page
 * offers sample availability and falls back to email.
 */

export const bookingMeta = {
  title: "Book a 30-Minute Call | Elevosia",
  description:
    "Pick a time and talk through your tools with the people who build the software. Thirty minutes, no pitch deck, an honest answer.",
};

export const bookingHero = {
  eyebrow: "Book a call",
  title: "Thirty minutes. A straight answer.",
  subhead:
    "Pick a time that works. We'll ask a lot of questions, look at your tools with you, and tell you honestly whether a custom dashboard makes sense.",
  primary: { label: "Pick a time", href: "#booking" },
  secondary: { label: "Start a project instead", href: "/start" },
  trust: ["Founder on the call", "No pitch deck", "No pressure"],
};

export const cover = {
  eyebrow: "What happens",
  title: "A working call, not a sales call",
  intro:
    "We use the half hour to understand how your week actually runs. You leave with a clear next step either way.",
  steps: [
    {
      id: "tools",
      title: "We look at your tools",
      body: "Share your screen or just describe it. Scheduling, invoicing, the spreadsheet everyone is afraid to touch.",
    },
    {
      id: "math",
      title: "We do the honest math",
      body: "Sometimes off-the-shelf is the right answer. If it is, we'll say so and point you to it.",
    },
    {
      id: "next",
      title: "You get a next step",
      body: "A free Blueprint, a single module, or nothing at all. You decide after the call, not during it.",
    },
  ],
};

export const booking = {
  title: "Pick a time",
  intro:
    "Thirty minutes, US Eastern. We'll send a calendar invite and two short questions so the time is useful.",
  days: [
    { id: "mon", label: "Mon", date: "18 Nov" },
    { id: "tue", label: "Tue", date: "19 Nov" },
    { id: "wed", label: "Wed", date: "20 Nov" },
    { id: "thu", label: "Thu", date: "21 Nov" },
    { id: "fri", label: "Fri", date: "22 Nov" },
  ],
  times: ["9:00 am", "10:00 am", "1:00 pm", "3:30 pm"],
  fields: { name: "Full name", email: "Work email", company: "Company (optional)" },
  submit: "Book this time",
  note: "We'll confirm by email within one business day.",
  bring: [
    "Roughly how many people use your current tools",
    "The one task that eats the most hours",
    "Anything you already know you want to keep",
  ],
  fallback: "Prefer email? hello@elevosia.com",
};

export const bookingClosing = {
  title: "Not ready to talk? That's fine.",
  body: "Take the two-minute check or start a project whenever it suits you. Both are free.",
  primary: { label: "Take the check", href: "/checklist" },
  secondary: { label: "Start a project", href: "/start" },
};
