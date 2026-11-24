/** Canned replies with variables, categories, shortcuts and scope. */

export type CannedScope = "Team" | "Personal";

export type CannedReply = {
  id: string;
  title: string;
  category: string;
  shortcut: string;
  scope: CannedScope;
  uses: number;
  body: string;
};

export const CANNED_CATEGORIES = [
  "Acknowledgment",
  "Information",
  "Resolution",
  "Billing",
  "Access",
];

export const cannedReplySeeds: CannedReply[] = [
  {
    id: "CR-1",
    title: "Acknowledged, looking now",
    category: "Acknowledgment",
    shortcut: "/ack",
    scope: "Team",
    uses: 214,
    body: "Hi {first_name}, thanks for flagging this. I have picked it up and will come back with a fix or an exact next step today.",
  },
  {
    id: "CR-2",
    title: "Need one more detail",
    category: "Information",
    shortcut: "/detail",
    scope: "Team",
    uses: 156,
    body: "Hi {first_name}, to move this forward I need one more detail. Which page or device does it happen on, and roughly what time?",
  },
  {
    id: "CR-3",
    title: "Fixed, please confirm",
    category: "Resolution",
    shortcut: "/fixed",
    scope: "Team",
    uses: 188,
    body: "Hi {first_name}, this is fixed on {project}. Can you confirm it looks right on your side? If it does, I will close the ticket.",
  },
  {
    id: "CR-4",
    title: "Invoice sent",
    category: "Billing",
    shortcut: "/billing-sent",
    scope: "Team",
    uses: 97,
    body: "Hi {first_name}, the invoice is in your portal under Invoices and a copy is on the way by email. Reply here if anything looks off.",
  },
  {
    id: "CR-5",
    title: "Access invite sent",
    category: "Access",
    shortcut: "/invite",
    scope: "Team",
    uses: 61,
    body: "Hi {first_name}, the invite is on its way to the address you shared. It expires in 7 days; {pm_name} can resend it if it lapses.",
  },
  {
    id: "CR-6",
    title: "Escalated to development",
    category: "Resolution",
    shortcut: "/dev",
    scope: "Team",
    uses: 73,
    body: "Hi {first_name}, I have escalated this to development and linked it to {project}. I will update you here as soon as there is a fix to test.",
  },
];

/** Replace {first_name}, {project} and {pm_name} with this ticket's values. */
export function applyVariables(
  body: string,
  values: { first_name: string; project: string; pm_name: string },
): string {
  return body
    .replaceAll("{first_name}", values.first_name)
    .replaceAll("{project}", values.project)
    .replaceAll("{pm_name}", values.pm_name);
}
