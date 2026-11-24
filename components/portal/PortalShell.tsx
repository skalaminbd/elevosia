"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  BarChart3,
  ChevronsUpDown,
  ChevronsLeft,
  ChevronsRight,
  ClipboardCheck,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Menu,
  LifeBuoy,
  Receipt,
  Video,
  X,
  type LucideIcon,
} from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { WorkspaceMenu, type WorkspaceLinks } from "@/components/shared/WorkspaceMenu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSidebar } from "@/components/admin/sidebar/use-sidebar";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { portalClient } from "@/lib/portal-data";
import { authClient } from "@/lib/auth-client";
import { usePortalContext } from "@/hooks/use-portal-context";
import { usePortalSidebarCounts } from "@/hooks/use-portal-sidebar-counts";
import { cn } from "@/lib/utils";

type PortalBadge = { label: string; count: number; tone: "accent" | "warning" | "text" };

type PortalNavItem = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: PortalBadge;
};

const NAV_GROUPS: { label: string | null; items: PortalNavItem[] }[] = [
  {
    label: null,
    items: [{ id: "home", label: "Home", href: "/portal", icon: LayoutDashboard }],
  },
  {
    label: "Project",
    items: [
      { id: "projects", label: "Projects", href: "/portal/projects", icon: FolderKanban },
      {
        id: "approvals",
        label: "Approvals",
        href: "/portal/approvals",
        icon: ClipboardCheck,
      },
      { id: "blueprints", label: "Blueprints", href: "/portal/blueprints", icon: FileText },
    ],
  },
  {
    label: "Billing",
    items: [
      {
        id: "invoices",
        label: "Invoices",
        href: "/portal/invoices",
        icon: Receipt,
      },
    ],
  },
  {
    label: "Support",
    items: [
      {
        id: "tickets",
        label: "Tickets",
        href: "/portal/tickets",
        icon: LifeBuoy,
      },
      { id: "reports", label: "Reports", href: "/portal/reports", icon: BarChart3 },
      {
        id: "calls",
        label: "Calls",
        href: "/portal/calls",
        icon: Video,
      },
    ],
  },
];

const WORKSPACE_LINKS: WorkspaceLinks = {
  profile: "/portal/profile",
  wallets: "/portal/invoices",
  settings: "/portal/account",
};

const STORAGE_KEY = "elevosia.portal.sidebar.collapsed";

function isActive(href: string, pathname: string) {
  if (href === "/portal") return pathname === "/portal";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function PortalNavRow({
  item,
  collapsed = false,
  onNavigate,
}: {
  item: PortalNavItem;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = isActive(item.href, pathname);
  const Icon = item.icon;
  const badge = item.badge;

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
              aria-label={badge ? `${item.label}, ${badge.label}` : item.label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex size-11 items-center justify-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sb-focus",
                active
                  ? "bg-sb-accent-soft text-sb-text-hover"
                  : "text-sb-text hover:bg-sb-hover-bg hover:text-sb-text-hover",
              )}
            >
              <Icon
                className={cn("size-5", active && "text-sb-accent")}
                strokeWidth={1.8}
                aria-hidden="true"
              />
              {badge ? (
                <span
                  className={cn(
                    "absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold ring-2 ring-sb-bg",
                    badge.tone === "warning"
                      ? "bg-sb-warning text-sb-bg"
                      : "bg-sb-accent text-sb-accent-fg",
                  )}
                >
                  {badge.count}
                </span>
              ) : null}
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            <span className="font-medium">{item.label}</span>
            {badge ? <span className="opacity-70">{badge.label}</span> : null}
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
        aria-label={badge ? `${item.label}, ${badge.label}` : undefined}
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
        {badge ? (
          <span
            className={cn(
              "shrink-0 text-xs font-medium",
              badge.tone === "accent" && "font-bold text-sb-accent",
              badge.tone === "warning" && "font-semibold text-sb-warning",
              badge.tone === "text" && "text-sb-text-muted",
            )}
          >
            {badge.label}
          </span>
        ) : null}
      </Link>
    </li>
  );
}

function ClientChip({ onNavigate }: { onNavigate?: () => void }) {
  const context = usePortalContext();
  const company = context.company || portalClient.company;
  const initials = company
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const projectLine = context.project
    ? `${context.project.name} · ${context.project.phase}`
    : "Project portal";

  return (
    <Link
      href="/portal/projects"
      onClick={onNavigate}
      className="mx-3 flex items-center gap-2.5 rounded-lg border border-sb-surface-border bg-sb-surface p-2.5 transition-colors hover:bg-sb-hover-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sb-focus"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sb-accent-soft font-mono text-[10px] font-bold text-sb-accent">
        {initials}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs font-semibold text-sb-text-hover">
          {company}
        </span>
        <span className="block truncate text-[10px] text-sb-text-muted">
          {projectLine}
        </span>
      </span>
      <ChevronsUpDown className="size-4 shrink-0 text-sb-text-muted" aria-hidden="true" />
    </Link>
  );
}

function Brand({ collapsed = false }: { collapsed?: boolean }) {
  if (collapsed) {
    return (
      <Link
        href="/portal"
        aria-label="Elevosia client portal"
        className="flex size-8 items-center justify-center rounded-lg bg-sb-accent font-heading text-sm font-bold text-sb-accent-fg"
      >
        e
      </Link>
    );
  }

  return (
    <Link
      href="/portal"
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
      <span className="shrink-0 rounded-md bg-sb-badge-bg px-2 py-0.5 text-xs font-semibold text-sb-badge-text">
        Portal
      </span>
    </Link>
  );
}

function SidebarContent({
  collapsed = false,
  onNavigate,
  onCollapse,
  inDrawer = false,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
  onCollapse?: () => void;
  inDrawer?: boolean;
}) {
  const { data: authData } = authClient.useSession();
  const authUser = authData?.user as { name?: string } | undefined;
  const identity = authUser?.name
    ? {
        name: authUser.name,
        role: "Client owner",
        initials: authUser.name
          .split(" ")
          .map((part) => part[0])
          .slice(0, 2)
          .join("")
          .toUpperCase(),
      }
    : {
        name: portalClient.user,
        role: portalClient.role,
        initials: portalClient.initials,
      };
  const counts = usePortalSidebarCounts();
  const groups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.map((item) => {
      if (item.id === "approvals") {
        return {
          ...item,
          badge:
            counts.approvals > 0
              ? {
                  label: String(counts.approvals),
                  count: counts.approvals,
                  tone: "accent" as const,
                }
              : undefined,
        };
      }
      if (item.id === "blueprints") {
        return {
          ...item,
          badge:
            counts.blueprints > 0
              ? {
                  label: String(counts.blueprints),
                  count: counts.blueprints,
                  tone: "accent" as const,
                }
              : undefined,
        };
      }
      if (item.id === "invoices") {
        return {
          ...item,
          badge:
            counts.invoices > 0
              ? {
                  label: `${counts.invoices} due`,
                  count: counts.invoices,
                  tone: "warning" as const,
                }
              : undefined,
        };
      }
      if (item.id === "tickets") {
        return {
          ...item,
          badge:
            counts.tickets > 0
              ? {
                  label: String(counts.tickets),
                  count: counts.tickets,
                  tone: "accent" as const,
                }
              : undefined,
        };
      }
      if (item.id === "calls") {
        return {
          ...item,
          badge: counts.nextCall
            ? { label: "Next", count: 1, tone: "text" as const }
            : undefined,
        };
      }
      return { ...item, badge: undefined };
    }),
  }));
  if (collapsed) {
    return (
      <div className="flex h-full min-h-0 flex-col items-center bg-sb-bg text-sb-fg">
        <div className="pt-5 pb-3.5">
          <Brand collapsed />
        </div>
        <nav
          aria-label="Client portal"
          className="min-h-0 flex-1 overflow-y-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {groups.map((group, index) => (
            <div key={group.label ?? "home"}>
              {index > 0 ? (
                <span
                  aria-hidden="true"
                  className="mx-auto my-2 block h-px w-6 bg-sb-surface-border"
                />
              ) : null}
              <ul className="flex flex-col gap-1">
                {group.items.map((item) => (
                  <PortalNavRow key={item.id} item={item} collapsed onNavigate={onNavigate} />
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="border-t border-sb-border px-4 pt-2.5 pb-3.5">
          <div className="flex flex-col items-center gap-1.5">
            <ThemeToggle className="size-11 rounded-lg text-sb-text hover:bg-sb-hover-bg hover:text-sb-text-hover" />
            <WorkspaceMenu
              name={identity.name}
              role={identity.role}
              initials={identity.initials}
              links={WORKSPACE_LINKS}
              className="size-11"
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={onCollapse}
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

  return (
    <div className="flex h-full min-h-0 flex-col bg-sb-bg text-sb-fg">
      <div className="flex shrink-0 items-center gap-2 px-4 pt-5 pb-3">
        <Brand />
        {!inDrawer ? (
          <button
            type="button"
            onClick={onCollapse}
            aria-label="Collapse sidebar"
            className="ml-auto flex size-8 items-center justify-center rounded-lg text-sb-text transition-colors hover:bg-sb-hover-bg hover:text-sb-text-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sb-focus"
          >
            <ChevronsLeft className="size-[18px]" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <ClientChip onNavigate={onNavigate} />

      <nav
        aria-label="Client portal"
        className="mt-2 min-h-0 flex-1 overflow-y-auto px-3 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {groups.map((group) => (
          <div key={group.label ?? "home"} className={group.label ? "mt-3" : "mt-1"}>
            {group.label ? (
              <p className="px-3.5 pt-3 pb-1.5 text-[11px] font-semibold tracking-[0.08em] text-sb-text-label uppercase">
                {group.label}
              </p>
            ) : null}
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <PortalNavRow key={item.id} item={item} onNavigate={onNavigate} />
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="flex shrink-0 items-center justify-between border-t border-sb-border px-3 pt-2.5 pb-3.5">
        <div className="px-1.5">
          <WorkspaceMenu
            name={identity.name}
            role={identity.role}
            initials={identity.initials}
            links={WORKSPACE_LINKS}
          />
        </div>
        <ThemeToggle className="size-8 shrink-0 rounded-lg text-sb-text hover:bg-sb-hover-bg hover:text-sb-text-hover" />
      </div>
    </div>
  );
}

function MobileBar({
  open,
  onOpenChange,
  onNavigate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const { data: authData } = authClient.useSession();
  const authUser = authData?.user as { name?: string } | undefined;
  const identity = authUser?.name
    ? {
        name: authUser.name,
        role: "Client owner",
        initials: authUser.name
          .split(" ")
          .map((part) => part[0])
          .slice(0, 2)
          .join("")
          .toUpperCase(),
      }
    : {
        name: portalClient.user,
        role: portalClient.role,
        initials: portalClient.initials,
      };
  const trapRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => closeRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const panel = trapRef.current;
      if (!panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-15 items-center gap-3 border-b border-border bg-background/90 px-3 backdrop-blur-md lg:hidden">
        <button
          type="button"
          onClick={() => onOpenChange(true)}
          aria-label="Open menu"
          className="flex size-11 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <Menu className="size-[22px]" aria-hidden="true" />
        </button>
        <Link
          href="/portal"
          className="flex min-w-0 items-center gap-2 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <span
            aria-hidden="true"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary font-heading text-sm font-bold text-primary-foreground"
          >
            e
          </span>
          <span className="truncate font-heading text-base font-bold tracking-[-0.01em]">
            Elevosia
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle className="size-10 rounded-lg text-foreground hover:bg-secondary" />
          <WorkspaceMenu
            name={identity.name}
            role={identity.role}
            initials={identity.initials}
            links={WORKSPACE_LINKS}
            tone="page"
            className="size-10"
          />
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <div
            ref={trapRef}
            role="dialog"
            aria-modal="true"
            aria-label="Portal menu"
            className="fixed inset-0 z-50 lg:hidden"
          >
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 bg-sb-bg/70 backdrop-blur-md"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => onOpenChange(false)}
            />
            <motion.div
              initial={reduceMotion ? false : { x: "-100%" }}
              animate={{ x: 0 }}
              exit={reduceMotion ? undefined : { x: "-100%" }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 w-68 overflow-hidden border-r border-sb-border bg-sb-bg shadow-md"
            >
              <SidebarContent inDrawer onNavigate={onNavigate} />
            </motion.div>
            <button
              ref={closeRef}
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label="Close menu"
              className="fixed top-4 left-72 z-50 flex size-11 items-center justify-center rounded-full bg-background text-foreground shadow-md transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

/** Client portal shell: 272px sidebar, 76px rail and a mobile drawer. */
export function PortalShell({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebar(STORAGE_KEY);

  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex min-h-svh w-full bg-background text-foreground">
        <motion.aside
          aria-label="Portal sidebar"
          initial={false}
          animate={{ width: collapsed ? 76 : 272 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 0.2, ease: [0.22, 1, 0.36, 1] }
          }
          className="sticky top-0 hidden h-svh shrink-0 overflow-hidden border-r border-sb-border bg-sb-bg lg:block"
        >
          <SidebarContent
            collapsed={collapsed}
            onCollapse={() => setCollapsed(!collapsed)}
          />
        </motion.aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <MobileBar
            open={mobileOpen}
            onOpenChange={setMobileOpen}
            onNavigate={() => setMobileOpen(false)}
          />
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  );
}
