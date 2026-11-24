/** Initial sidebar counts: zero until the live API responds. */

import type { SidebarCounts } from "@/components/admin/sidebar/nav-config";

/** Nothing is known before the live counts load. */
export function getSidebarCounts(): SidebarCounts {
  return {
    requirementsNew: 0,
    blueprintsDue: 0,
    projectsActive: 0,
    callsToday: 0,
    ticketsOpen: 0,
    ticketsNearSla: 0,
    messagesUnread: 0,
    invoicesOverdue: 0,
  };
}
