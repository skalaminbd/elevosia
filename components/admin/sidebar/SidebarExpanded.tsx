"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronsLeft, Search } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { WorkspaceMenu } from "@/components/shared/WorkspaceMenu";
import { BriefingCard } from "./BriefingCard";
import { NavItem } from "./NavItem";
import {
  GROUP_LABELS,
  NAV_ITEMS,
  ROLE_ACCESS,
  ROLE_LABELS,
  WORKSPACE_LINKS,
  DEMO_USERS,
  getNavBadge,
  type SidebarCounts,
  type SidebarRole,
} from "./nav-config";

/** Everything inside the 272px sidebar; also used by the mobile drawer. */
export function SidebarExpanded({
  role,
  counts,
  onSearchOpen,
  onNavigate,
  onCollapse,
  inDrawer = false,
}: {
  role: SidebarRole;
  counts: SidebarCounts;
  onSearchOpen?: () => void;
  onNavigate?: () => void;
  onCollapse?: () => void;
  inDrawer?: boolean;
}) {
  const [kbd, setKbd] = useState("⌘K");
  const allowed = new Set<string>(ROLE_ACCESS[role]);

  useEffect(() => {
    const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
    const frame = window.requestAnimationFrame(() =>
      setKbd(isMac ? "⌘K" : "Ctrl K"),
    );
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="flex h-full min-h-0 flex-col bg-sb-bg text-sb-fg">
      <div className="flex shrink-0 items-center gap-2.5 px-4 pt-5 pb-4">
        <Link
          href="/admin"
          aria-label="Elevosia admin home"
          className="flex min-w-0 items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sb-focus"
        >
          <span
            aria-hidden="true"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sb-accent font-heading text-sm font-bold text-sb-accent-fg"
          >
            e
          </span>
          <span className="truncate font-heading text-base font-bold tracking-[-0.01em] text-sb-text-hover">
            Elevosia
          </span>
        </Link>
        <span className="shrink-0 rounded-md bg-sb-badge-bg px-2 py-0.5 text-xs font-semibold text-sb-badge-text">
          Admin
        </span>
        {!inDrawer ? (
          <div className="ml-auto flex shrink-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={onCollapse}
                  aria-label="Collapse sidebar"
                  className="flex size-8 items-center justify-center rounded-lg text-sb-text transition-colors hover:bg-sb-hover-bg hover:text-sb-text-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sb-focus"
                >
                  <ChevronsLeft className="size-[18px]" aria-hidden="true" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>
                Collapse sidebar
              </TooltipContent>
            </Tooltip>
          </div>
        ) : null}
      </div>

      <div className="shrink-0 px-3 pb-2">
        <button
          type="button"
          onClick={onSearchOpen}
          className="flex h-10 w-full items-center gap-2.5 rounded-lg border border-sb-surface-border bg-sb-surface px-3 text-sm text-sb-text transition-colors hover:bg-sb-hover-bg hover:text-sb-text-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sb-focus"
        >
          <Search className="size-4 shrink-0" aria-hidden="true" />
          <span className="flex-1 truncate text-left">Search or jump to</span>
          <kbd className="shrink-0 rounded-sm border border-sb-surface-border px-1.5 py-0.5 text-[11px] font-semibold text-sb-badge-text">
            {kbd}
          </kbd>
        </button>
      </div>

      <nav
        aria-label="Admin"
        className="min-h-0 flex-1 overflow-y-auto px-3 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {GROUP_LABELS.map((group) => {
          const items = NAV_ITEMS.filter(
            (item) => item.group === group.id && allowed.has(item.id),
          );
          if (items.length === 0) return null;

          return (
            <div key={group.id} className={group.label ? "mt-3" : "mt-1"}>
              {group.label ? (
                <p className="px-3.5 pt-3 pb-1.5 text-[11px] font-semibold tracking-[0.08em] text-sb-text-label uppercase">
                  {group.label}
                </p>
              ) : null}
              <ul className="flex flex-col gap-0.5">
                {items.map((item) => (
                  <NavItem
                    key={item.id}
                    item={item}
                    badge={getNavBadge(item.id, counts)}
                    onNavigate={onNavigate}
                  />
                ))}
              </ul>
            </div>
          );
        })}

        <BriefingCard counts={counts} role={role} />
      </nav>

      <div className="flex shrink-0 items-center justify-between border-t border-sb-border px-3 pt-2.5 pb-3.5">
        <div className="px-1.5">
          <WorkspaceMenu
            name={DEMO_USERS[role].name}
            role={ROLE_LABELS[role]}
            initials={DEMO_USERS[role].initials}
            photo={DEMO_USERS[role].photo}
            links={WORKSPACE_LINKS}
          />
        </div>
        <ThemeToggle className="size-8 shrink-0 rounded-lg text-sb-text hover:bg-sb-hover-bg hover:text-sb-text-hover" />
      </div>
    </div>
  );
}
