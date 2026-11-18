"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { CornerDownLeft, Search } from "lucide-react";
import {
  NAV_ITEMS,
  ROLE_ACCESS,
  SEARCH_CLIENTS,
  SEARCH_PROJECTS,
  SETTINGS_ITEM,
  type SidebarRole,
} from "./nav-config";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type Entry = {
  id: string;
  label: string;
  meta?: string;
  href: string;
  group: "Pages" | "Clients" | "Projects";
};

/** Command palette: pages, clients and projects. ⌘K opens it from the shell. */
export function CommandPalette({
  open,
  onOpenChange,
  role,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: SidebarRole;
}) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const entries = useMemo<Entry[]>(() => {
    const allowed = new Set<string>(ROLE_ACCESS[role]);
    const pages = [...NAV_ITEMS, SETTINGS_ITEM]
      .filter((item) => allowed.has(item.id))
      .map((item) => ({
        id: `page-${item.id}`,
        label: item.label,
        href: item.href,
        group: "Pages" as const,
      }));
    const clients = SEARCH_CLIENTS.map((client) => ({
      id: `client-${client.id}`,
      label: client.label,
      meta: client.meta,
      href: `/admin/clients/${client.id}`,
      group: "Clients" as const,
    }));
    const projects = SEARCH_PROJECTS.map((project) => ({
      id: `project-${project.id}`,
      label: project.label,
      meta: project.meta,
      href: `/admin/projects/${project.id}`,
      group: "Projects" as const,
    }));
    return [...pages, ...clients, ...projects];
  }, [role]);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return entries;
    return entries.filter(
      (entry) =>
        entry.label.toLowerCase().includes(needle) ||
        entry.meta?.toLowerCase().includes(needle),
    );
  }, [entries, query]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = window.requestAnimationFrame(() => {
      setQuery("");
      setActive(0);
      inputRef.current?.focus();
    });
    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previous;
    };
  }, [open]);

  function choose(entry: Entry | undefined) {
    if (!entry) return;
    onOpenChange(false);
    router.push(entry.href);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      onOpenChange(false);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((current) => (results.length ? (current + 1) % results.length : 0));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((current) =>
        results.length ? (current - 1 + results.length) % results.length : 0,
      );
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      choose(results[active]);
      return;
    }
    if (event.key === "Tab") {
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'input, button, [href], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  const grouped = (["Pages", "Clients", "Projects"] as const)
    .map((group) => ({
      group,
      items: results.filter((entry) => entry.group === group),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <AnimatePresence>
      {open ? (
        <div
          className="fixed inset-0 z-60 flex items-start justify-center p-4 pt-[12vh] sm:pt-[16vh]"
          role="dialog"
          aria-modal="true"
          aria-label="Search Elevosia"
          onKeyDown={onKeyDown}
        >
          <motion.button
            type="button"
            aria-label="Close search"
            className="absolute inset-0 bg-sb-bg/55 backdrop-blur-sm"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => onOpenChange(false)}
          />

          <motion.div
            ref={panelRef}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.98, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="relative w-full max-w-lg overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-md"
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActive(0);
                }}
                placeholder="Search pages, clients and projects"
                aria-label="Search pages, clients and projects"
                className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <kbd className="rounded-sm border border-border px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                Esc
              </kbd>
            </div>

            <div className="max-h-[360px] overflow-y-auto p-2">
              {grouped.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                  Nothing matches “{query}”.
                </p>
              ) : (
                grouped.map((section) => (
                  <div key={section.group} className="py-1">
                    <p className="px-2 py-1 text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                      {section.group}
                    </p>
                    {section.items.map((entry) => {
                      const index = results.indexOf(entry);
                      const isActive = index === active;
                      return (
                        <button
                          key={entry.id}
                          type="button"
                          onMouseEnter={() => setActive(index)}
                          onClick={() => choose(entry)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors",
                            isActive
                              ? "bg-accent text-accent-foreground"
                              : "text-foreground hover:bg-secondary",
                          )}
                        >
                          <span className="min-w-0 flex-1 truncate">{entry.label}</span>
                          {entry.meta ? (
                            <span className="shrink-0 truncate text-xs text-muted-foreground">
                              {entry.meta}
                            </span>
                          ) : null}
                          {isActive ? (
                            <CornerDownLeft
                              className="size-3.5 shrink-0 text-muted-foreground"
                              aria-hidden="true"
                            />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-between border-t border-border px-4 py-2 text-[11px] text-muted-foreground">
              <span>↑↓ to move · ↵ to open</span>
              <span className="font-mono">Sample data</span>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
