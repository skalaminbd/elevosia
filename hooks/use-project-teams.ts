"use client";

import { useMemo, useSyncExternalStore } from "react";
import { parseTeams, subscribeTeams, teamsRaw } from "@/lib/team-store";

/** Project teams keyed by project id. */
export function useProjectTeams(): Record<string, string[]> {
  const raw = useSyncExternalStore(subscribeTeams, teamsRaw, () => null);
  return useMemo(() => parseTeams(raw), [raw]);
}
