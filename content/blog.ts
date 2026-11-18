/**
 * Blog index and post data, from pagecontent.md §13. Only the first guide is
 * written; the other eleven are listed as in progress and are not linked.
 */

export const blogMeta = {
  title: "Blog: Running a Smoother Service Business | Elevosia",
  description:
    "Practical guides on custom dashboards, build vs buy, client portals and AI automation for growing service businesses.",
};

export const blogHero = {
  eyebrow: "The Elevosia blog",
  title: "Run a smoother business.",
  subhead:
    "Practical guides for owners who are tired of juggling tools. No jargon, no fluff.",
  searchPlaceholder: "Search articles",
  topics: [
    "scheduling",
    "invoicing",
    "client portals",
    "per-seat pricing",
    "weekly boards",
    "AI follow-ups",
    "spreadsheets",
    "build vs buy",
    "data migration",
    "care plans",
  ],
};

export const categories = [
  "All",
  "Build vs buy",
  "Operations",
  "Client experience",
  "AI & automation",
  "Industry playbooks",
] as const;

export type Category = (typeof categories)[number];

export type PostSection = {
  id: string;
  title: string;
  paragraphs: string[];
};

export type Post = {
  slug: string;
  title: string;
  category: Exclude<Category, "All">;
  summary: string;
  date: string;
  readingTime: string;
  published: boolean;
  takeaways?: string[];
  pullQuote?: { text: string; afterSection: string };
  body?: PostSection[];
  faq?: { question: string; answer: string }[];
};

export const posts: Post[] = [
  {
    slug: "9-signs-outgrown-spreadsheets",
    title: "9 Signs Your Business Has Outgrown Spreadsheets",
    category: "Operations",
    summary:
      "Spreadsheets are a good first tool. Here are the nine signals that yours has stopped being one.",
    date: "18 Nov 2026",
    readingTime: "7 min read",
    published: true,
    pullQuote: {
      text: "If the person who built the spreadsheet is on holiday and the team waits, you don't have a system. You have a person with a system in their head.",
      afterSection: "one-person",
    },
    takeaways: [
      "Spreadsheets stop fitting when only one person understands them.",
      "The clearest sign is being afraid to change the file.",
      "You do not have to replace everything: start with the task that eats the most hours.",
    ],
    body: [
      {
        id: "why",
        title: "Spreadsheets are not the problem",
        paragraphs: [
          "Every business starts somewhere. A spreadsheet is cheap, flexible and everyone knows the basics. It can run scheduling, quotes and invoicing for years.",
          "The problem starts when the spreadsheet becomes the business: when only one person understands it, when the same number is typed twice, or when the file is the only record of work you were paid for.",
          "Here are the nine signs we see most often. None of them is a disaster on its own. Together, they mean the tool has stopped fitting the job.",
        ],
      },
      {
        id: "one-person",
        title: "1. Only one person understands the file",
        paragraphs: [
          "If the person who built the spreadsheet is on holiday and the team waits, you don't have a system. You have a person with a system in their head.",
        ],
      },
      {
        id: "double-entry",
        title: "2. The same data is typed more than once",
        paragraphs: [
          "A booking lands in one sheet, the invoice in another, and the client's address in a third. Every retype is a chance for a mistake, and a minute nobody gets back.",
        ],
      },
      {
        id: "per-seat",
        title: "3. Hiring gets more expensive than it should",
        paragraphs: [
          "When every new person needs a paid seat in three tools, growth has a tax. The cost rises before the new hire has done a day of work.",
        ],
      },
      {
        id: "reports",
        title: "4. Reports take an afternoon",
        paragraphs: [
          "If a Friday afternoon disappears into copy-paste and formulas, the report is running the business instead of the other way round.",
        ],
      },
      {
        id: "leads",
        title: "5. Leads wait for a human to notice them",
        paragraphs: [
          "An enquiry that sits in an inbox over the weekend is often an enquiry that calls someone else on Monday.",
        ],
      },
      {
        id: "version",
        title: "6. There are several versions of the truth",
        paragraphs: [
          "Two files, three tabs, no agreement on which number is real. Decisions get made on whichever version is open.",
        ],
      },
      {
        id: "process",
        title: "7. Your process bends to fit the sheet",
        paragraphs: [
          "The way you work is part of what makes you different. When the tool cannot show it, the team quietly stops doing it.",
        ],
      },
      {
        id: "clients",
        title: "8. Clients ask for something you can't give them",
        paragraphs: [
          "A portal, online booking or a status page. These are normal requests now, and a spreadsheet cannot answer them.",
        ],
      },
      {
        id: "growth",
        title: "9. You're afraid to change anything",
        paragraphs: [
          "When editing a formula feels risky, the tool is holding the business still. That is the clearest sign that it's time to replace it.",
        ],
      },
      {
        id: "next",
        title: "What to do about it",
        paragraphs: [
          "You don't have to replace everything at once. Start with the one task that eats the most hours, move that into a single module, and keep the tools that still work. Most of our clients keep their accounting and email, and replace the rest.",
          "If you're not sure where you stand, take our two-minute check. It scores twelve honest statements and tells you whether a custom dashboard makes sense for you yet.",
        ],
      },
    ],
    faq: [
      {
        question: "Do I have to replace my spreadsheets all at once?",
        answer:
          "No. Most projects start with one module, usually scheduling, quotes or billing. You keep the tools that still work and replace the ones that don't.",
      },
      {
        question: "How long does it take to move off a spreadsheet?",
        answer:
          "A single module is usually about three to four weeks. We migrate your existing data as part of the build.",
      },
      {
        question: "What if my team isn't technical?",
        answer:
          "That's the normal case. The dashboard is built around the way your team already works, with training and a 30-day warranty after launch.",
      },
    ],
  },
  {
    slug: "real-cost-of-per-user-software",
    title: "The Real Cost of Per-User Software as Your Team Grows",
    category: "Build vs buy",
    summary:
      "Per-seat pricing looks small on a card. Here's what it does over three years of hiring.",
    date: "In progress",
    readingTime: "6 min read",
    published: false,
  },
  {
    slug: "custom-vs-off-the-shelf",
    title: "Custom Software vs Off-the-Shelf: An Honest Guide for Small Business",
    category: "Build vs buy",
    summary:
      "When buying is the right answer, when building is, and how to tell the difference without a sales call.",
    date: "In progress",
    readingTime: "8 min read",
    published: false,
  },
  {
    slug: "what-is-a-client-portal",
    title: "What Is a Client Portal, and Does Your Service Business Need One?",
    category: "Client experience",
    summary:
      "What a portal actually does, what it doesn't, and the signs your clients would use one.",
    date: "In progress",
    readingTime: "5 min read",
    published: false,
  },
  {
    slug: "7-ai-automations",
    title: "7 AI Automations That Save Service Businesses Hours Every Week",
    category: "AI & automation",
    summary:
      "Seven jobs worth automating first, and the ones to leave alone for now.",
    date: "In progress",
    readingTime: "7 min read",
    published: false,
  },
  {
    slug: "custom-dashboard-cost",
    title: "How Much Does a Custom Business Dashboard Cost?",
    category: "Build vs buy",
    summary:
      "The ranges, the line items and the questions that change the price before you sign anything.",
    date: "In progress",
    readingTime: "6 min read",
    published: false,
  },
  {
    slug: "how-to-write-software-requirements",
    title: "How to Write Software Requirements When You're Not Technical",
    category: "Operations",
    summary:
      "A plain-language way to describe what you need, section by section, with examples.",
    date: "In progress",
    readingTime: "6 min read",
    published: false,
  },
  {
    slug: "how-to-choose-a-software-partner",
    title: "How to Choose a Custom Software Partner (and the Red Flags)",
    category: "Build vs buy",
    summary:
      "What to ask, what the answers should sound like, and the phrases that should make you pause.",
    date: "In progress",
    readingTime: "7 min read",
    published: false,
  },
  {
    slug: "offshore-team-buyers-checklist",
    title: "Working With an Offshore Development Team: A Buyer's Checklist",
    category: "Operations",
    summary:
      "Time zones, contracts, communication and the details that decide whether remote work feels easy.",
    date: "In progress",
    readingTime: "6 min read",
    published: false,
  },
  {
    slug: "field-service-scheduling-build-or-buy",
    title: "Field Service Scheduling Software: Build or Buy?",
    category: "Industry playbooks",
    summary:
      "What off-the-shelf scheduling gets right, where it breaks for growing crews, and the middle path.",
    date: "In progress",
    readingTime: "6 min read",
    published: false,
  },
  {
    slug: "home-care-dashboard",
    title: "What a Home Care Agency Dashboard Should Include",
    category: "Industry playbooks",
    summary:
      "Visits, caregivers, credentials and family updates: the screens that matter and why.",
    date: "In progress",
    readingTime: "7 min read",
    published: false,
  },
  {
    slug: "agency-projects-time-retainers",
    title: "One Dashboard for Agency Projects, Time and Retainers",
    category: "Industry playbooks",
    summary:
      "How agencies stop billing from guesswork and see margin per client before the month ends.",
    date: "In progress",
    readingTime: "6 min read",
    published: false,
  },
];

export const publishedPosts = posts.filter((post) => post.published);

export const blogBand = {
  title: "Have you outgrown your tools?",
  body: "Twelve honest statements and a two-minute answer. No email needed to see the score.",
  cta: { label: "Take the check", href: "/checklist" },
};

export const newsletter = {
  title: "One useful email a month.",
  body: "New guides and real numbers from our projects. No spam, unsubscribe any time.",
  fields: { firstName: "First name", email: "Work email" },
  submit: "Subscribe",
  success: "You're on the list. One useful email a month.",
};

export const postEndCta = {
  title: "Want a plan for your business?",
  body: "Share what you need and get a free Blueprint with a fixed price in 5 business days.",
  primary: { label: "Start a project", href: "/start" },
  secondary: { label: "Get the checklist", href: "/checklist" },
};

export const inlineCta = {
  title: "Not sure if custom is right for you?",
  body: "Put your team size and software costs into the calculator. It takes a minute and it's honest about the answer.",
  cta: { label: "Try the cost calculator", href: "/why-custom#calculator" },
};

export const blogClosing = {
  title: "Read something useful?",
  body: "The next step is a plan: your free Blueprint, with milestones, a timeline and a fixed price.",
  primary: { label: "Start a project", href: "/start" },
  secondary: { label: "Book a call", href: "/book-a-call" },
};
