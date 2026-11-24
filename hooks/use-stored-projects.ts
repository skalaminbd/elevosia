"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  parseStoredProjects,
  STORED_PROJECTS_KEY,
  subscribeStoredProjects,
  type StoredProject,
} from "@/lib/project-store";

/** Projects converted from Blueprints, read from this browser's storage. */
export function useStoredProjects(): StoredProject[] {
  const raw = useSyncExternalStore(
    subscribeStoredProjects,
    () => window.localStorage.getItem(STORED_PROJECTS_KEY),
    () => null,
  );
  return useMemo(() => parseStoredProjects(raw), [raw]);
}
