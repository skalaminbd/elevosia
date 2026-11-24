/**
 * Project teams. Members added in Project settings are the only people who can
 * be assigned tasks on that project. Stored per browser.
 */

import { adminProjects } from "@/lib/admin-data";

const KEY = "elevosia.project-teams";

export const DEFAULT_TEAM = ["Alamin", "Maya Chen"];

type Teams = Record<string, string[]>;

export function parseTeams(raw: string | null): Teams {
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as Teams;
  } catch {
    return {};
  }
}

function read(): Teams {
  if (typeof window === "undefined") return {};
  return parseTeams(window.localStorage.getItem(KEY));
}

export function getProjectTeam(projectId: string): string[] {
  return read()[projectId] ?? DEFAULT_TEAM;
}

export function setProjectTeam(projectId: string, members: string[]) {
  if (typeof window === "undefined") return;
  const all = read();
  window.localStorage.setItem(
    KEY,
    JSON.stringify({ ...all, [projectId]: members }),
  );
  window.dispatchEvent(new Event("elevosia:teams"));
}

/** Resolve a task's project name to its team. */
export function projectTeamForName(projectName: string): string[] {
  const project = adminProjects.find((item) => item.name === projectName);
  return getProjectTeam(project?.id ?? projectName);
}

export function teamsRaw(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(KEY);
}

export function subscribeTeams(onChange: () => void) {
  window.addEventListener("elevosia:teams", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener("elevosia:teams", onChange);
    window.removeEventListener("storage", onChange);
  };
}
