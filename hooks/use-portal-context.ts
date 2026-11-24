"use client";

import { useEffect, useState } from "react";

export type PortalContext = {
  company: string;
  project: { name: string; phase: string } | null;
};

const EMPTY: PortalContext = { company: "", project: null };

/** Client and active project for the portal chrome. */
export function usePortalContext(): PortalContext {
  const [context, setContext] = useState<PortalContext>(EMPTY);

  useEffect(() => {
    let active = true;
    fetch("/api/portal-context")
      .then((response) => response.json())
      .then((data: Partial<PortalContext>) => {
        if (!active) return;
        setContext({
          company: data.company ?? "",
          project: data.project ?? null,
        });
      })
      .catch(() => {
        // Keep the fallback labels if the request fails.
      });
    return () => {
      active = false;
    };
  }, []);

  return context;
}
