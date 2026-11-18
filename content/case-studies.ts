/**
 * Case study model and data, from pagecontent.md §12.5. The list is empty
 * until the first real case study is finished: with no entries, no case study
 * pages are generated and no links point at them.
 *
 * To publish one, add a CaseStudy object below and a card link wherever it
 * should appear. Every field is required except the optional quote and
 * screenshots, so a half-finished study cannot go live.
 */

export type CaseStudy = {
  slug: string;
  /** Client name, or "A [industry] company" if the name is private. */
  name: string;
  /** The result in one line, used in the H1 and the card. */
  resultLine: string;
  industry: string;
  teamSize: string;
  location: string;
  timeline: string;
  modules: string[];
  before: string;
  beforeQuote?: { text: string; author: string; role: string };
  requirements: string[];
  built: {
    portal: string;
    integrations: string[];
    ai: string[];
  };
  results: { label: string; value: string; note: string }[];
  quote?: { text: string; author: string; role: string; photo?: string };
  screenshots?: { src: string; alt: string; caption: string }[];
  weeklyBoard?: { week: string; done: string[]; next: string[] }[];
  next?: { name: string; slug: string };
};

export const caseStudies: CaseStudy[] = [];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}

export const caseStudyMeta = {
  eyebrow: "Case study",
  closing: {
    title: "Your project could be the next story.",
    body: "Tell us what slows you down. We'll come back with a plan, a timeline and a fixed price.",
    primary: { label: "Start a project", href: "/start" },
    secondary: { label: "See how it works", href: "/how-it-works" },
  },
  labels: {
    before: "Before",
    requirements: "What they asked for",
    built: "What we built",
    build: "The build, week by week",
    results: "Results",
    portal: "Client portal",
    integrations: "Integrations",
    ai: "AI and automation",
    next: "Next story",
  },
};
