"use client";

import { useEffect, useState } from "react";

export type PortalCounts = {
  approvals: number;
  blueprints: number;
  invoices: number;
  tickets: number;
  nextCall: string | null;
};

const EMPTY: PortalCounts = {
  approvals: 0,
  blueprints: 0,
  invoices: 0,
  tickets: 0,
  nextCall: null,
};

/** Live counts for the client portal sidebar. */
export function usePortalSidebarCounts(): PortalCounts {
  const [counts, setCounts] = useState<PortalCounts>(EMPTY);

  useEffect(() => {
    let active = true;
    const load = () => {
      fetch("/api/portal/sidebar-counts", { cache: "no-store" })
        .then((response) => (response.ok ? response.json() : null))
        .then((data: PortalCounts | null) => {
          if (active && data) setCounts(data);
        })
        .catch(() => {
          /* keep the last good counts */
        });
    };
    load();
    const interval = window.setInterval(load, 60_000);
    window.addEventListener("focus", load);
    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener("focus", load);
    };
  }, []);

  return counts;
}
