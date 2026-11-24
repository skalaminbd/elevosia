"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { CommandPalette } from "./CommandPalette";
import { SidebarCollapsed } from "./SidebarCollapsed";
import { SidebarExpanded } from "./SidebarExpanded";
import { SidebarMobile } from "./SidebarMobile";
import { useSidebar } from "./use-sidebar";
import type { SidebarCounts, SidebarRole } from "./nav-config";

/**
 * Admin shell: desktop sidebar (expanded or rail) plus the mobile top bar and
 * drawer. Counts come from the server and refresh every minute and on focus.
 */
export function Sidebar({
  role,
  initialCounts,
  children,
}: {
  role: SidebarRole;
  initialCounts: SidebarCounts;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebar();
  const pathname = usePathname();
  const [counts, setCounts] = useState(initialCounts);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const response = await fetch(
          `/api/admin/sidebar-counts?role=${role}`,
          { cache: "no-store" },
        );
        if (!response.ok) return;
        const data = (await response.json()) as SidebarCounts;
        if (!cancelled) setCounts(data);
      } catch {
        /* keep the last good counts */
      }
    };
    void load();
    const interval = window.setInterval(load, 60_000);
    const onFocus = () => void load();
    const onVisible = () => {
      if (document.visibilityState === "visible") void load();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [role, pathname]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex min-h-svh w-full bg-background text-foreground">
        <motion.aside
          aria-label="Admin sidebar"
          initial={false}
          animate={{ width: collapsed ? 76 : 272 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 0.2, ease: [0.22, 1, 0.36, 1] }
          }
          className="sticky top-0 hidden h-svh shrink-0 overflow-hidden border-r border-sb-border bg-sb-bg lg:block"
        >
          {collapsed ? (
            <SidebarCollapsed
              role={role}
              counts={counts}
              onSearchOpen={() => setPaletteOpen(true)}
              onExpand={() => setCollapsed(false)}
            />
          ) : (
            <SidebarExpanded
              role={role}
              counts={counts}
              onSearchOpen={() => setPaletteOpen(true)}
              onCollapse={() => setCollapsed(true)}
            />
          )}
        </motion.aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <SidebarMobile
            role={role}
            counts={counts}
            open={mobileOpen}
            onOpenChange={setMobileOpen}
            onSearchOpen={() => setPaletteOpen(true)}
            onNavigate={() => setMobileOpen(false)}
          />
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>

      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        role={role}
      />
    </TooltipProvider>
  );
}
