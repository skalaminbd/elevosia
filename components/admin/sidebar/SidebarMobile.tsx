"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { SidebarExpanded } from "./SidebarExpanded";
import { UserAvatarMenu } from "./UserCard";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import type { SidebarCounts, SidebarRole } from "./nav-config";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Mobile: a 60px top bar and a 272px drawer. The drawer closes on Escape, the
 * backdrop, the close button and route change; use-sidebar locks body scroll.
 */
export function SidebarMobile({
  role,
  counts,
  open,
  onOpenChange,
  onSearchOpen,
  onNavigate,
}: {
  role: SidebarRole;
  counts: SidebarCounts;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSearchOpen: () => void;
  onNavigate: () => void;
}) {
  const reduceMotion = useReducedMotion();
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
          href="/admin"
          aria-label="Elevosia admin home"
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
          <UserAvatarMenu role={role} tone="page" className="size-9" />
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <div
            ref={trapRef}
            role="dialog"
            aria-modal="true"
            aria-label="Admin menu"
            className="fixed inset-0 z-50 lg:hidden"
          >
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 bg-black/30 backdrop-blur-md dark:bg-black/45"
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
              <SidebarExpanded
                role={role}
                counts={counts}
                inDrawer
                onSearchOpen={() => {
                  onOpenChange(false);
                  onSearchOpen();
                }}
                onNavigate={() => {
                  onOpenChange(false);
                  onNavigate();
                }}
              />
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
