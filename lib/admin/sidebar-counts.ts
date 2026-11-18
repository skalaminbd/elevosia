/**
 * Sidebar counts. Demo data until the database and auth land; the API route
 * serves the same shape so the client can refresh it every minute.
 */

import {
  DEMO_COUNTS,
  type SidebarCounts,
  type SidebarRole,
} from "@/components/admin/sidebar/nav-config";

const BY_ROLE: Partial<Record<SidebarRole, Partial<SidebarCounts>>> = {
  admin: {},
  pm: {},
  developer: {
    projectsActive: 2,
    callsToday: 1,
    ticketsOpen: 2,
    ticketsNearSla: 1,
    messagesUnread: 1,
    onboarding: 0,
    requirementsNew: 0,
    blueprintsDue: 0,
    invoicesOverdue: 0,
  },
  marketing: {
    projectsActive: 3,
    callsToday: 1,
    ticketsOpen: 2,
    ticketsNearSla: 0,
    messagesUnread: 1,
    onboarding: 0,
    requirementsNew: 1,
    blueprintsDue: 0,
    invoicesOverdue: 0,
  },
  support: {
    projectsActive: 4,
    callsToday: 2,
    ticketsOpen: 7,
    ticketsNearSla: 1,
    messagesUnread: 3,
    onboarding: 0,
    requirementsNew: 0,
    blueprintsDue: 0,
    invoicesOverdue: 3,
  },
};

export function getSidebarCounts(role: SidebarRole): SidebarCounts {
  return { ...DEMO_COUNTS, ...BY_ROLE[role] };
}
