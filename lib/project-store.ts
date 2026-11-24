/**
 * Converted projects. Approved Blueprints become projects whose milestones and
 * tasks live here until the database lands. Stored per browser.
 */

export type StoredTask = {
  id: string;
  name: string;
  description: string;
  hours: number;
  visible: boolean;
  done?: boolean;
  status?: "todo" | "progress" | "review" | "done";
};

export type StoredMilestone = {
  id: string;
  title: string;
  tasks: StoredTask[];
  due?: string;
  approval?: "requested" | "approved";
};

export type ProjectScopePoint = {
  text: string;
  must: boolean;
  milestoneId: string;
  milestoneTitle: string;
};

/**
 * Approved requirement scope kept on the project after conversion, so the
 * work can be billed with its own custom invoice.
 */
export type ProjectScope = {
  requirementId: string;
  requirementTitle: string;
  blueprintId: string;
  approvedAt: string;
  points: ProjectScopePoint[];
  invoiceId?: string;
  invoiceAmount?: number;
};

export type StoredProject = {
  id: string;
  name: string;
  client: string;
  clientId: string;
  blueprintId: string;
  pm: string;
  start: string;
  createdAt: string;
  milestones: StoredMilestone[];
  scope?: ProjectScope;
};

export const STORED_PROJECTS_KEY = "elevosia.converted-projects";
const EVENT = "elevosia:projects";

export function parseStoredProjects(raw: string | null): StoredProject[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredProject[]) : [];
  } catch {
    return [];
  }
}

function read(): StoredProject[] {
  if (typeof window === "undefined") return [];
  return parseStoredProjects(window.localStorage.getItem(STORED_PROJECTS_KEY));
}

export function listStoredProjects(): StoredProject[] {
  return read();
}

export function getStoredProject(id: string): StoredProject | null {
  return read().find((project) => project.id === id) ?? null;
}

export function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return slug || "project";
}

export function uniqueProjectId(prefix: string, name: string): string {
  const base = `${prefix.toLowerCase()}-${slugify(name)}`;
  const taken = new Set(read().map((project) => project.id));
  if (!taken.has(base)) return base;
  let index = 2;
  while (taken.has(`${base}-${index}`)) index += 1;
  return `${base}-${index}`;
}

export function addStoredProject(project: StoredProject) {
  if (typeof window === "undefined") return;
  const all = read().filter((item) => item.id !== project.id);
  window.localStorage.setItem(
    STORED_PROJECTS_KEY,
    JSON.stringify([...all, project]),
  );
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeStoredProjects(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}
