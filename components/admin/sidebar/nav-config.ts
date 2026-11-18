/**
 * Sidebar configuration for the admin panel.
 *
 * Colour roles → project tokens (all defined in app/globals.css):
 *   sb-bg            --primary in light, --sidebar in dark (deliberately dark in both)
 *   sb-fg            --primary-foreground in light, --sidebar-foreground in dark
 *   sb-accent        --highlight in light, --sidebar-primary in dark (lime, per brand)
 *   sb-accent-fg     --highlight-foreground / --sidebar-primary-foreground
 *   sb-warning       warning mixed toward white in light, --warning in dark
 *   sb-border        sb-fg 12%
 *   sb-text          80% · hover 95% · muted 68% · label 62%
 *   sb-hover-bg      6% · surface 4% · surface-border 9%
 *   badge-neutral    9% bg / 88% text · accent-soft 14% · warning-soft 16%
 *   focus            sb-accent
 *
 * The sidebar is dark in both themes. The light-mode primary pair is the
 * closest dark surface/foreground pair; the existing --sidebar tokens describe
 * a light panel, so they are used only in dark mode.
 */

import {
  Clock,
  FileText,
  Folder,
  FolderKanban,
  Inbox,
  LayoutGrid,
  LifeBuoy,
  Megaphone,
  MessageSquare,
  PenLine,
  Receipt,
  Settings,
  SquareCheck,
  UserPlus,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";

export type SidebarRole =
  | "admin"
  | "pm"
  | "developer"
  | "marketing"
  | "support";

export type SidebarCounts = {
  onboarding: number;
  requirementsNew: number;
  blueprintsDue: number;
  projectsActive: number;
  callsToday: number;
  ticketsOpen: number;
  ticketsNearSla: number;
  messagesUnread: number;
  invoicesOverdue: number;
};

export type NavGroupId =
  | "main"
  | "clients"
  | "delivery"
  | "support"
  | "finance"
  | "growth";

export type NavItemConfig = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  group: NavGroupId;
};

export const GROUP_LABELS: { id: NavGroupId; label: string | null }[] = [
  { id: "main", label: null },
  { id: "clients", label: "Clients" },
  { id: "delivery", label: "Delivery" },
  { id: "support", label: "Support" },
  { id: "finance", label: "Finance" },
  { id: "growth", label: "Team & growth" },
];

export const NAV_ITEMS: NavItemConfig[] = [
  { id: "dashboard", label: "Dashboard", href: "/admin", icon: LayoutGrid, group: "main" },
  { id: "clients", label: "Clients", href: "/admin/clients", icon: Users, group: "clients" },
  { id: "onboarding", label: "Onboarding", href: "/admin/onboarding", icon: UserPlus, group: "clients" },
  { id: "requirements", label: "Requirements", href: "/admin/requirements", icon: Inbox, group: "clients" },
  { id: "blueprints", label: "Blueprints", href: "/admin/blueprints", icon: FileText, group: "clients" },
  { id: "projects", label: "Projects", href: "/admin/projects", icon: FolderKanban, group: "delivery" },
  { id: "tasks", label: "Tasks", href: "/admin/tasks", icon: SquareCheck, group: "delivery" },
  { id: "calls", label: "Calls", href: "/admin/calls", icon: Video, group: "delivery" },
  { id: "files", label: "Files", href: "/admin/files", icon: Folder, group: "delivery" },
  { id: "tickets", label: "Tickets", href: "/admin/tickets", icon: LifeBuoy, group: "support" },
  { id: "messages", label: "Messages", href: "/admin/messages", icon: MessageSquare, group: "support" },
  { id: "invoices", label: "Invoices", href: "/admin/invoices", icon: Receipt, group: "finance" },
  { id: "contracts", label: "Contracts", href: "/admin/contracts", icon: PenLine, group: "finance" },
  { id: "marketing", label: "Marketing", href: "/admin/marketing", icon: Megaphone, group: "growth" },
  { id: "team", label: "Team & timesheets", href: "/admin/team", icon: Clock, group: "growth" },
];

export const SETTINGS_ITEM: NavItemConfig = {
  id: "settings",
  label: "Settings",
  href: "/admin/settings",
  icon: Settings,
  group: "main",
};

export const ALL_ITEM_IDS = [
  "dashboard",
  "clients",
  "onboarding",
  "requirements",
  "blueprints",
  "projects",
  "tasks",
  "calls",
  "files",
  "tickets",
  "messages",
  "invoices",
  "contracts",
  "marketing",
  "team",
  "settings",
] as const;

export type NavItemId = (typeof ALL_ITEM_IDS)[number];

export const ROLE_ACCESS: Record<SidebarRole, NavItemId[]> = {
  admin: [...ALL_ITEM_IDS],
  pm: ALL_ITEM_IDS.filter((id) => id !== "settings"),
  developer: ["dashboard", "projects", "tasks", "files", "tickets", "messages", "team"],
  marketing: [
    "dashboard",
    "clients",
    "projects",
    "tasks",
    "files",
    "tickets",
    "messages",
    "marketing",
    "team",
  ],
  support: [
    "dashboard",
    "clients",
    "projects",
    "tasks",
    "files",
    "tickets",
    "messages",
    "invoices",
    "team",
  ],
};

export const ROLE_LABELS: Record<SidebarRole, string> = {
  admin: "Admin",
  pm: "Project manager",
  developer: "Developer",
  marketing: "Marketing",
  support: "Support",
};

export const DEMO_USERS: Record<SidebarRole, { name: string; initials: string }> = {
  admin: { name: "Alamin", initials: "A" },
  pm: { name: "Maya Chen", initials: "MC" },
  developer: { name: "Sam Okafor", initials: "SO" },
  marketing: { name: "Lena Ortiz", initials: "LO" },
  support: { name: "Rafi Ahmed", initials: "RA" },
};

export type BadgeVariant = "neutral" | "accent" | "warning" | "text" | "warningText";

export type NavBadgeConfig = {
  variant: BadgeVariant;
  count: number;
  /** Text shown before or after the count in expanded mode. */
  prefix?: string;
  suffix?: string;
  /** Collapsed rail shows only a dot for these. */
  statusOnly?: boolean;
  /** Full accessible description, e.g. "Tickets, 7 open". */
  aria: string;
};

/** Badges for the current counts. Returns null when the count is zero. */
export function getNavBadge(
  id: string,
  counts: SidebarCounts,
): NavBadgeConfig | null {
  switch (id) {
    case "onboarding":
      return counts.onboarding > 0
        ? {
            variant: "neutral",
            count: counts.onboarding,
            aria: `Onboarding, ${counts.onboarding} clients`,
          }
        : null;
    case "requirements":
      return counts.requirementsNew > 0
        ? {
            variant: "accent",
            count: counts.requirementsNew,
            suffix: "new",
            aria: `Requirements, ${counts.requirementsNew} new`,
          }
        : null;
    case "blueprints":
      return counts.blueprintsDue > 0
        ? {
            variant: "warning",
            count: counts.blueprintsDue,
            suffix: "due",
            statusOnly: true,
            aria: `Blueprints, ${counts.blueprintsDue} due`,
          }
        : null;
    case "projects":
      return counts.projectsActive > 0
        ? {
            variant: "neutral",
            count: counts.projectsActive,
            aria: `Projects, ${counts.projectsActive} active`,
          }
        : null;
    case "calls":
      return counts.callsToday > 0
        ? {
            variant: "text",
            count: counts.callsToday,
            prefix: "Today",
            aria: `Calls, ${counts.callsToday} today`,
          }
        : null;
    case "tickets":
      return counts.ticketsOpen > 0
        ? {
            variant: counts.ticketsNearSla > 0 ? "warning" : "neutral",
            count: counts.ticketsOpen,
            aria: `Tickets, ${counts.ticketsOpen} open`,
          }
        : null;
    case "messages":
      return counts.messagesUnread > 0
        ? {
            variant: "accent",
            count: counts.messagesUnread,
            aria: `Messages, ${counts.messagesUnread} unread`,
          }
        : null;
    case "invoices":
      return counts.invoicesOverdue > 0
        ? {
            variant: "warningText",
            count: counts.invoicesOverdue,
            suffix: "overdue",
            statusOnly: true,
            aria: `Invoices, ${counts.invoicesOverdue} overdue`,
          }
        : null;
    default:
      return null;
  }
}

export const DEMO_COUNTS: SidebarCounts = {
  onboarding: 2,
  requirementsNew: 4,
  blueprintsDue: 2,
  projectsActive: 6,
  callsToday: 2,
  ticketsOpen: 7,
  ticketsNearSla: 1,
  messagesUnread: 3,
  invoicesOverdue: 3,
};

/** Search targets beyond pages: the sidebar palette finds clients and projects. */
export const SEARCH_CLIENTS = [
  { id: "brightline", label: "Brightline Care", meta: "Home care · Active" },
  { id: "northwind", label: "Northwind HVAC", meta: "Field services · Active" },
  { id: "lumen", label: "Lumen Studio", meta: "Agency · Active" },
  { id: "clearwater", label: "Clearwater Fund", meta: "Nonprofit · Lead" },
  { id: "harbor", label: "Harbor Therapy", meta: "Care · Active" },
  { id: "ridgeline", label: "Ridgeline Cleaning", meta: "Cleaning · Paused" },
];

export const SEARCH_PROJECTS = [
  { id: "brightline-portal", label: "Care dashboard + portal", meta: "Brightline Care · Building" },
  { id: "northwind-dispatch", label: "Dispatch and invoicing", meta: "Northwind HVAC · Review" },
  { id: "lumen-ops", label: "Projects, time and retainers", meta: "Lumen Studio · Building" },
  { id: "harbor-bookings", label: "Online booking", meta: "Harbor Therapy · Live" },
];
