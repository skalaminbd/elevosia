"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CornerDownLeft, Search } from "lucide-react";
import {
  NAV_ITEMS,
  ROLE_ACCESS,
  SEARCH_CLIENTS,
  SEARCH_PROJECTS,
  SETTINGS_ITEM,
  type SidebarRole,
} from "./nav-config";
import { AppDialog } from "@/components/ui/app-dialog";
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
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

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
      href: "/admin/clients",
      group: "Clients" as const,
    }));
    const projects = SEARCH_PROJECTS.map((project) => ({
      id: `project-${project.id}`,
      label: project.label,
      meta: project.meta,
      href: "/admin/projects",
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
    const frame = window.requestAnimationFrame(() => {
      setQuery("");
      setActive(0);
    });
    return () => window.cancelAnimationFrame(frame);
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
  }

  const grouped = (["Pages", "Clients", "Projects"] as const)
    .map((group) => ({
      group,
      items: results.filter((entry) => entry.group === group),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      initialFocus="first"
    >
      <AppDialog.Header
        icon={Search}
        title="Search or jump to"
        subtitle="Pages, clients and projects"
      />
      <AppDialog.Body>
        <div
          className="flex items-center gap-3 rounded-[var(--radius-dialog-control)] border border-input bg-card px-3.5 focus-within:border-ring focus-within:ring-4 focus-within:ring-ring/10"
          onKeyDown={onKeyDown}
        >
          <Search
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            placeholder="Search pages, clients and projects"
            aria-label="Search pages, clients and projects"
            className="h-11 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground sm:text-[15px]"
          />
          <kbd className="rounded-sm border border-border px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
            Esc
          </kbd>
        </div>

        <div>
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
                        "flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-left text-sm transition-colors",
                        isActive
                          ? "bg-primary/10 text-foreground"
                          : "text-foreground hover:bg-secondary",
                      )}
                    >
                      <span className="min-w-0 flex-1 truncate">
                        {entry.label}
                      </span>
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

        <div className="flex items-center justify-between border-t border-border pt-3 text-[11px] text-muted-foreground">
          <span>↑↓ to move · ↵ to open</span>
          <span className="font-mono">Sample data</span>
        </div>
      </AppDialog.Body>
    </AppDialog>
  );
}
