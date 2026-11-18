"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CollapsedBadge, NavBadge } from "./NavBadge";
import type { NavBadgeConfig, NavItemConfig } from "./nav-config";

function isActive(href: string, pathname: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

type NavItemProps = {
  item: NavItemConfig;
  badge: NavBadgeConfig | null;
  collapsed?: boolean;
  onNavigate?: () => void;
};

/** One sidebar row. Expanded it is 40px tall; collapsed it is a 44px icon. */
export function NavItem({ item, badge, collapsed = false, onNavigate }: NavItemProps) {
  const pathname = usePathname();
  const active = isActive(item.href, pathname);
  const Icon = item.icon;
  const label = badge?.aria ?? item.label;

  if (collapsed) {
    return (
      <li className="relative flex justify-center">
        {active ? (
          <span
            aria-hidden="true"
            className="absolute top-3 left-0 h-5 w-[3px] rounded-r-full bg-sb-accent"
          />
        ) : null}
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex size-11 items-center justify-center rounded-lg transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sb-focus",
                active
                  ? "bg-sb-accent-soft text-sb-text-hover"
                  : "text-sb-text hover:bg-sb-hover-bg hover:text-sb-text-hover",
              )}
            >
              <Icon
                className={cn("size-[20px]", active && "text-sb-accent")}
                strokeWidth={1.8}
                aria-hidden="true"
              />
              {badge ? <CollapsedBadge badge={badge} /> : null}
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            <span className="font-medium">{item.label}</span>
            {badge ? (
              <span className="text-background/70">
                {badge.prefix ? `${badge.prefix} ` : ""}
                {badge.count}
                {badge.suffix ? ` ${badge.suffix}` : ""}
              </span>
            ) : null}
          </TooltipContent>
        </Tooltip>
      </li>
    );
  }

  return (
    <li>
      <Link
        href={item.href}
        onClick={onNavigate}
        aria-label={badge?.aria}
        aria-current={active ? "page" : undefined}
        className={cn(
          "relative flex h-10 items-center gap-3 rounded-lg pr-2.5 pl-3.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sb-focus",
          active
            ? "bg-sb-accent-soft text-sb-text-hover"
            : "text-sb-text hover:bg-sb-hover-bg hover:text-sb-text-hover",
        )}
      >
        {active ? (
          <span
            aria-hidden="true"
            className="absolute top-2.5 left-0 h-5 w-[3px] rounded-r-full bg-sb-accent"
          />
        ) : null}
        <Icon
          className={cn("size-[18px] shrink-0", active && "text-sb-accent")}
          strokeWidth={1.8}
          aria-hidden="true"
        />
        <span className="flex-1 truncate">{item.label}</span>
        {badge ? <NavBadge badge={badge} /> : null}
      </Link>
    </li>
  );
}
