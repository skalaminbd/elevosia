"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  blueprintsStatusRaw,
  blueprintOverridesRaw,
  blueprintSuggestionsRaw,
  parseOverrides,
  parseStatuses,
  parseSuggestions,
  subscribeBlueprint,
  type BlueprintSuggestion,
  type BlueprintTaskChange,
} from "@/lib/blueprint-store";

export function useBlueprintOverrides(
  blueprintId: string,
): Record<string, BlueprintTaskChange> {
  const raw = useSyncExternalStore(
    subscribeBlueprint,
    blueprintOverridesRaw,
    () => null,
  );
  const all = useMemo(() => parseOverrides(raw), [raw]);
  return all[blueprintId] ?? {};
}

export function useBlueprintSuggestions(
  blueprintId: string,
): BlueprintSuggestion[] {
  const raw = useSyncExternalStore(
    subscribeBlueprint,
    blueprintSuggestionsRaw,
    () => null,
  );
  const all = useMemo(() => parseSuggestions(raw), [raw]);
  return useMemo(
    () => all.filter((item) => item.blueprintId === blueprintId),
    [all, blueprintId],
  );
}

export function useBlueprintStatus(
  blueprintId: string,
  fallback: string,
): string {
  const raw = useSyncExternalStore(
    subscribeBlueprint,
    blueprintsStatusRaw,
    () => null,
  );
  const statuses = useMemo(() => parseStatuses(raw), [raw]);
  return statuses[blueprintId] ?? fallback;
}
