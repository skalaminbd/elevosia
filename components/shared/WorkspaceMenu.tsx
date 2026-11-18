"use client";

import Link from "next/link";
import {
  LogOut,
  Settings2,
  ShieldCheck,
  User,
  Users,
  Wallet,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type WorkspaceLinks = {
  profile: string;
  teams: string;
  security: string;
  wallets: string;
  settings: string;
};

/**
 * Settings/workspace trigger with the account menu: profile header, then
 * profile, teams, security, wallets, settings and logout.
 */
export function WorkspaceMenu({
  name,
  role,
  initials,
  links,
  className,
  tone = "sidebar",
}: {
  name: string;
  role: string;
  initials: string;
  links: WorkspaceLinks;
  className?: string;
  tone?: "sidebar" | "page";
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Workspace and settings"
          className={cn(
            "flex size-9 items-center justify-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
            tone === "sidebar"
              ? "text-sb-text hover:bg-sb-hover-bg hover:text-sb-text-hover focus-visible:outline-sb-focus"
              : "text-foreground hover:bg-secondary focus-visible:outline-ring",
            className,
          )}
        >
          <Settings2 className="size-4" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        side="top"
        sideOffset={8}
        className="w-64 rounded-lg border border-border p-1.5 shadow-md"
      >
        <div className="flex items-center gap-3 rounded-lg p-2">
          <span className="relative shrink-0">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {initials}
            </span>
            <span className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-popover bg-success" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium">{name}</span>
            <span className="block truncate text-xs text-muted-foreground">
              {role}
            </span>
          </span>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          asChild
          className="group flex items-center gap-3 rounded-lg p-2"
        >
          <Link href={links.profile}>
            <User
              className="size-4 text-muted-foreground transition-transform group-hover:scale-110 group-hover:text-foreground"
              aria-hidden="true"
            />
            <span className="text-sm font-medium">My profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          asChild
          className="group flex items-center gap-3 rounded-lg p-2"
        >
          <Link href={links.teams}>
            <Users
              className="size-4 text-muted-foreground transition-transform group-hover:scale-110 group-hover:text-foreground"
              aria-hidden="true"
            />
            <span className="text-sm font-medium">Teams</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          asChild
          className="group flex items-center gap-3 rounded-lg p-2"
        >
          <Link href={links.security}>
            <ShieldCheck
              className="size-4 text-muted-foreground transition-transform group-hover:scale-110 group-hover:text-foreground"
              aria-hidden="true"
            />
            <span className="text-sm font-medium">Security</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          asChild
          className="group flex items-center gap-3 rounded-lg p-2"
        >
          <Link href={links.wallets}>
            <Wallet
              className="size-4 text-muted-foreground transition-transform group-hover:scale-110 group-hover:text-foreground"
              aria-hidden="true"
            />
            <span className="text-sm font-medium">Wallets</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          asChild
          className="group flex items-center gap-3 rounded-lg p-2"
        >
          <Link href={links.settings}>
            <Settings2
              className="size-4 text-muted-foreground transition-transform group-hover:rotate-45 group-hover:text-foreground"
              aria-hidden="true"
            />
            <span className="text-sm font-medium">Settings</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          asChild
          variant="destructive"
          className="group flex items-center gap-3 rounded-lg p-2"
        >
          <Link href="/login">
            <LogOut
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
            <span className="text-sm font-medium">Logout</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
