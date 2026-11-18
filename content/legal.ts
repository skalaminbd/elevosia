/**
 * Privacy and Terms outlines, from pagecontent.md §15.6. Structural drafts:
 * the final legal text is still being reviewed, and the pages say so.
 */

export const legalNote =
  "This is a structural draft. Final wording is being reviewed, and the live policy will replace this page before we take real client data.";

export const privacy = {
  title: "Privacy",
  updated: "Last updated November 2026",
  intro:
    "What the Elevosia website and client portal collect, why we collect it, and how to ask us to delete it.",
  sections: [
    {
      id: "what",
      title: "What we collect",
      body: [
        "When you submit a form, we collect the details you type: your name, work email, company, team size, budget range and anything you write in your requirements.",
        "When you use the client portal, we store the account, project and message data needed to run your build.",
      ],
    },
    {
      id: "why",
      title: "Why we collect it",
      body: [
        "To reply to your enquiry, prepare your Blueprint, run your project and support the software after launch.",
        "To understand how the website is used so we can improve it. We do not sell personal data.",
      ],
    },
    {
      id: "retention",
      title: "How long we keep it",
      body: [
        "Enquiry details are kept while we discuss a project and for a reasonable period afterward.",
        "Client project and portal data are kept for the length of the engagement and any period required by law or by our contract.",
      ],
    },
    {
      id: "processors",
      title: "Which services process it",
      body: [
        "Hosting and infrastructure providers, payment processing (Stripe), email delivery, analytics, and the AI providers used inside your dashboard.",
        "Each provider is used for a specific job. Our contract with you lists the ones that touch your data.",
      ],
    },
    {
      id: "cookies",
      title: "Cookies",
      body: [
        "We use the cookies needed to keep you signed in and to measure site usage. Details will be listed here in the final policy.",
      ],
    },
    {
      id: "choices",
      title: "Your choices",
      body: [
        "You can ask us to correct or delete your data, and to stop sending you email.",
        "Email hello@elevosia.com and we will action the request.",
      ],
    },
    {
      id: "contact",
      title: "Contact",
      body: ["hello@elevosia.com · Elevosia, Dhaka, Bangladesh."],
    },
  ],
};

export const terms = {
  title: "Terms",
  updated: "Last updated November 2026",
  intro:
    "The rules for using this website and the client portal, and how quotes, payment and ownership work.",
  sections: [
    {
      id: "use",
      title: "Using this website and portal",
      body: [
        "You may use this website to learn about our work and to contact us. The client portal is for you and the people you invite.",
        "Do not attempt to break, overload or misuse either service.",
      ],
    },
    {
      id: "quotes",
      title: "Quotes and Blueprints",
      body: [
        "A Blueprint is a plan and a fixed price. It is not a binding contract.",
        "Neither side is committed until a contract is signed. The price changes only if the scope changes, and we agree it in writing.",
      ],
    },
    {
      id: "payment",
      title: "Payment terms",
      body: [
        "Projects start with a deposit, with further payments at agreed milestones and at launch. Payment plans are available on request.",
        "Care plans are billed monthly and can be changed or cancelled for the following month.",
      ],
    },
    {
      id: "ip",
      title: "Intellectual property",
      body: [
        "When the final payment is made, the software we built for you and its data belong to you.",
        "We keep the right to reuse the general techniques and internal libraries that are not specific to your business.",
      ],
    },
    {
      id: "liability",
      title: "Limits of liability",
      body: [
        "We do our work carefully, but we do not guarantee uninterrupted service from third-party providers.",
        "Liability limits and warranties are set out in the signed contract.",
      ],
    },
    {
      id: "law",
      title: "Governing law",
      body: [
        "The signed contract sets the governing law and where disputes are handled.",
      ],
    },
    {
      id: "contact",
      title: "Contact",
      body: ["hello@elevosia.com · Elevosia, Dhaka, Bangladesh."],
    },
  ],
};
