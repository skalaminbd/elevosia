"use client";

import Link from "next/link";
import { Bell, ChevronsUpDown, Clock, LogOut, Shield } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { DEMO_USERS, ROLE_LABELS, type SidebarRole } from "./nav-config";

function AccountMenu({ role, children }: { role: SidebarRole; children: React.ReactNode }) {
  const user = DEMO_USERS[role];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top" sideOffset={8} className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-semibold">{user.name}</p>
          <p className="text-xs text-muted-foreground">{ROLE_LABELS[role]}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/admin/team">
            <Clock aria-hidden="true" />
            My timesheet
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/admin/settings?tab=notifications">
            <Bell aria-hidden="true" />
            Notifications
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/admin/settings?tab=security">
            <Shield aria-hidden="true" />
            Security
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild variant="destructive">
          <Link href="/login">
            <LogOut aria-hidden="true" />
            Log out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Expanded footer: avatar, name, role and the account menu trigger. */
export function UserCard({ role }: { role: SidebarRole }) {
  const user = DEMO_USERS[role];

  return (
    <div className="mt-1.5 flex items-center gap-2.5 px-1.5 pt-2">
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sb-accent-soft text-[13px] font-bold text-sb-accent"
        aria-hidden="true"
      >
        {user.initials}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-sb-text-hover">{user.name}</p>
        <p className="truncate text-xs text-sb-text-muted">{ROLE_LABELS[role]}</p>
      </div>
      <ThemeToggle className="size-8 shrink-0 rounded-lg text-sb-text hover:bg-sb-hover-bg hover:text-sb-text-hover" />
      <AccountMenu role={role}>
        <button
          type="button"
          aria-label="Account menu"
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-sb-text transition-colors hover:bg-sb-hover-bg hover:text-sb-text-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sb-focus"
        >
          <ChevronsUpDown className="size-4" aria-hidden="true" />
        </button>
      </AccountMenu>
    </div>
  );
}

/** Collapsed footer: just the avatar trigger. */
export function UserAvatarMenu({
  role,
  className,
  tone = "sidebar",
}: {
  role: SidebarRole;
  className?: string;
  tone?: "sidebar" | "page";
}) {
  const user = DEMO_USERS[role];

  return (
    <AccountMenu role={role}>
      <button
        type="button"
        aria-label={`Account menu, ${user.name}`}
        className={cn(
          "relative flex size-10 items-center justify-center rounded-full text-[13px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
          tone === "sidebar"
            ? "bg-sb-accent-soft text-sb-accent hover:bg-sb-accent-soft/80 focus-visible:outline-sb-focus"
            : "bg-primary/10 text-primary hover:bg-primary/15 focus-visible:outline-ring",
          className,
        )}
      >
        {user.initials}
      </button>
    </AccountMenu>
  );
}
