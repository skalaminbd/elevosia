"use client";

import { useEffect } from "react";

/**
 * Smooth scrolling for same-page anchors only.
 *
 * The global `scroll-behavior: smooth` broke Next's route-transition scroll
 * reset (it fires scrollIntoView on the page fragments, so the page glided to
 * the footer). Keeping CSS at `auto` and smoothing anchor clicks here gives the
 * same feel without touching navigation.
 */
export function SmoothAnchors() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey) return;

      const anchor = (event.target as Element | null)?.closest?.(
        'a[href*="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.pathname !== window.location.pathname || url.hash.length < 2) {
        return;
      }

      const target = document.querySelector(url.hash);
      if (!target) return;

      event.preventDefault();
      window.history.pushState(null, "", url.hash);
      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
