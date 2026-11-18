/**
 * Thank-you pages, from pagecontent.md §15.3 and §15.4. The demo link is
 * replaced with pages that exist until the Live Demo is built.
 */

export const thankYou = {
  eyebrow: "You're in",
  titleFallback: "Thanks. You're in.",
  body: "Check your inbox for your client portal login. Write your requirements whenever you're ready, and your draft saves itself.",
  primary: { label: "Continue to requirements", href: "/start#start-form" },
  secondary: { label: "Book a call instead", href: "/book-a-call" },
  note: "While you wait, see what your dashboard would include.",
  noteHref: "/custom-dashboards",
  noteLabel: "See custom dashboards",
};

export const booked = {
  eyebrow: "Booked",
  title: "You're booked.",
  body: "We'll send a calendar invite and two or three short questions so we can make the most of your 30 minutes.",
  primary: { label: "See how it works", href: "/how-it-works" },
  secondary: { label: "Start a project instead", href: "/start" },
  note: "Before we talk, it helps to know what a build looks like week by week.",
  noteHref: "/how-it-works",
  noteLabel: "Read the process",
};
