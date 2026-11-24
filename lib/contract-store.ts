/** Contract templates new contracts start from. Seeded into Postgres. */

export type ContractTemplate = {
  id: string;
  name: string;
  body: string;
  used: number;
  updated: string;
};

export const CONTRACT_TEMPLATES: ContractTemplate[] = [
  {
    id: "T-1",
    name: "Service agreement",
    body: "Scope, milestones, payments, ownership on final payment, liability limits.",
    used: 12,
    updated: "12 Oct 2026",
  },
  {
    id: "T-2",
    name: "NDA",
    body: "Mutual confidentiality before requirements or files are shared.",
    used: 4,
    updated: "2 Sep 2026",
  },
  {
    id: "T-3",
    name: "Change request",
    body: "New scope after approval, with price and timeline impact.",
    used: 6,
    updated: "18 Oct 2026",
  },
  {
    id: "T-4",
    name: "Care plan agreement",
    body: "Hours, response time, billing on the 1st and cancellation terms.",
    used: 5,
    updated: "1 Nov 2026",
  },
];
