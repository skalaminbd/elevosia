"use client";

import Link from "next/link";
import { ChevronsRight, Search } from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { WorkspaceMenu } from "@/components/shared/WorkspaceMenu";
import { NavItem } from "./NavItem";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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

/** The 76px icon rail. Tooltips carry the label and badge. */
export function SidebarCollapsed({
  role,
  counts,
  onSearchOpen,
  onExpand,
}: {
  role: SidebarRole;
  counts: SidebarCounts;
  onSearchOpen?: () => void;
  onExpand?: () => void;
}) {
  const allowed = new Set<string>(ROLE_ACCESS[role]);

  return (
    <div className="flex h-full min-h-0 flex-col items-center bg-sb-bg text-sb-fg">
      <div className="flex shrink-0 pt-5 pb-3.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/admin"
              aria-label="Elevosia admin home"
              className="flex size-8 items-center justify-center rounded-lg bg-sb-accent font-heading text-sm font-bold text-sb-accent-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sb-focus"
            >
              e
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            Elevosia admin
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="shrink-0 px-4 pb-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={onSearchOpen}
              aria-label="Search or jump to"
              className="flex size-11 items-center justify-center rounded-lg border border-sb-surface-border bg-sb-surface text-sb-text transition-colors hover:bg-sb-hover-bg hover:text-sb-text-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sb-focus"
            >
              <Search className="size-4" aria-hidden="true" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            Search or jump to
          </TooltipContent>
        </Tooltip>
      </div>

      <nav
        aria-label="Admin"
        className="min-h-0 flex-1 overflow-y-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {GROUP_LABELS.map((group, index) => {
          const items = NAV_ITEMS.filter(
            (item) => item.group === group.id && allowed.has(item.id),
          );
          if (items.length === 0) return null;

          return (
            <div key={group.id}>
              {index > 0 && items.length > 0 ? (
                <span
                  aria-hidden="true"
                  className="mx-auto my-2 block h-px w-6 bg-sb-surface-border"
                />
              ) : null}
              <ul className="flex flex-col gap-1">
                {items.map((item) => (
                  <NavItem
                    key={item.id}
                    item={item}
                    badge={getNavBadge(item.id, counts)}
                    collapsed
                  />
                ))}
              </ul>
            </div>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-sb-border px-4 pt-2.5 pb-3.5">
        <div className="flex flex-col items-center gap-1.5">
          <ThemeToggle className="size-11 rounded-lg text-sb-text hover:bg-sb-hover-bg hover:text-sb-text-hover" />
          <WorkspaceMenu
            name={DEMO_USERS[role].name}
            role={ROLE_LABELS[role]}
            initials={DEMO_USERS[role].initials}
            photo={DEMO_USERS[role].photo}
            links={WORKSPACE_LINKS}
            className="size-11"
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={onExpand}
                aria-label="Expand sidebar"
                className="flex h-8 w-11 items-center justify-center rounded-lg text-sb-text transition-colors hover:bg-sb-hover-bg hover:text-sb-text-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sb-focus"
              >
                <ChevronsRight className="size-[18px]" aria-hidden="true" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={8}>
              Expand sidebar
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
