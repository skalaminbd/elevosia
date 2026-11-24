/**
 * Blueprint task edits and client suggestions. Admin edits apply at once;
 * client edits wait in a suggestion queue until admin or PM approves them.
 * Stored per browser until the database lands.
 */

export type BlueprintTaskChange = {
  name: string;
  description: string;
  hours: number;
  visible: boolean;
};

export type SuggestionStatus = "pending" | "approved" | "dismissed";

export type BlueprintSuggestion = {
  id: string;
  blueprintId: string;
  milestoneId: string;
  taskId: string;
  changes: BlueprintTaskChange;
  note?: string;
  status: SuggestionStatus;
  by: string;
  createdAt: string;
};

const TASK_KEY = "elevosia.blueprint-tasks";
const STATUS_KEY = "elevosia.blueprint-status";
const SUGGESTION_KEY = "elevosia.blueprint-suggestions";
const EVENT = "elevosia:blueprint";

type TaskOverrides = Record<string, Record<string, BlueprintTaskChange>>;

function parseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    const parsed: unknown = JSON.parse(raw);
    return (parsed ?? fallback) as T;
  } catch {
    return fallback;
  }
}

function readOverrides(): TaskOverrides {
  if (typeof window === "undefined") return {};
  return parseJson<TaskOverrides>(
    window.localStorage.getItem(TASK_KEY),
    {},
  );
}

function readSuggestions(): BlueprintSuggestion[] {
  if (typeof window === "undefined") return [];
  const value = parseJson<BlueprintSuggestion[]>(
    window.localStorage.getItem(SUGGESTION_KEY),
    [],
  );
  return Array.isArray(value) ? value : [];
}

function notify() {
  window.dispatchEvent(new Event(EVENT));
}

export function blueprintOverridesRaw(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TASK_KEY);
}

export function blueprintSuggestionsRaw(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(SUGGESTION_KEY);
}

export function parseOverrides(raw: string | null): TaskOverrides {
  return parseJson<TaskOverrides>(raw, {});
}

export function parseSuggestions(raw: string | null): BlueprintSuggestion[] {
  const value = parseJson<BlueprintSuggestion[]>(raw, []);
  return Array.isArray(value) ? value : [];
}

export function subscribeBlueprint(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Admin (or approved client) values for a Blueprint's tasks. */
export function saveBlueprintTask(
  blueprintId: string,
  taskId: string,
  changes: BlueprintTaskChange,
) {
  if (typeof window === "undefined") return;
  const all = readOverrides();
  const next: TaskOverrides = {
    ...all,
    [blueprintId]: { ...(all[blueprintId] ?? {}), [taskId]: changes },
  };
  window.localStorage.setItem(TASK_KEY, JSON.stringify(next));
  notify();
}

export function addSuggestion(
  input: Omit<BlueprintSuggestion, "id" | "status" | "createdAt">,
) {
  if (typeof window === "undefined") return;
  const suggestions = readSuggestions();
  const next: BlueprintSuggestion[] = [
    ...suggestions.filter(
      (item) =>
        !(
          item.status === "pending" &&
          item.blueprintId === input.blueprintId &&
          item.taskId === input.taskId
        ),
    ),
    {
      ...input,
      id: `sug-${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    },
  ];
  window.localStorage.setItem(SUGGESTION_KEY, JSON.stringify(next));
  notify();
}

export function blueprintsStatusRaw(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STATUS_KEY);
}

export function parseStatuses(raw: string | null): Record<string, string> {
  return parseJson<Record<string, string>>(raw, {});
}

export function setBlueprintStatus(blueprintId: string, status: string) {
  if (typeof window === "undefined") return;
  const all = parseStatuses(
    window.localStorage.getItem(STATUS_KEY),
  );
  window.localStorage.setItem(
    STATUS_KEY,
    JSON.stringify({ ...all, [blueprintId]: status }),
  );
  notify();
}

export function listSuggestions(blueprintId: string): BlueprintSuggestion[] {
  return readSuggestions().filter(
    (item) => item.blueprintId === blueprintId,
  );
}

/** Admin approves — optionally with their own tweaks — and the task saves. */
export function approveSuggestion(
  suggestionId: string,
  finalChanges: BlueprintTaskChange,
) {
  if (typeof window === "undefined") return;
  const suggestion = readSuggestions().find(
    (item) => item.id === suggestionId,
  );
  if (!suggestion) return;
  saveBlueprintTask(
    suggestion.blueprintId,
    suggestion.taskId,
    finalChanges,
  );
  const next = readSuggestions().map((item) =>
    item.id === suggestionId
      ? { ...item, changes: finalChanges, status: "approved" as const }
      : item,
  );
  window.localStorage.setItem(SUGGESTION_KEY, JSON.stringify(next));
  notify();
}

export function dismissSuggestion(suggestionId: string) {
  if (typeof window === "undefined") return;
  const next = readSuggestions().map((item) =>
    item.id === suggestionId
      ? { ...item, status: "dismissed" as const }
      : item,
  );
  window.localStorage.setItem(SUGGESTION_KEY, JSON.stringify(next));
  notify();
}
