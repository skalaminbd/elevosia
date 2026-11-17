"use client";

import { useEffect, useRef, useState } from "react";

type InViewLoopOptions = {
  rootMargin?: string;
  threshold?: number;
};

/**
 * Tracks whether a section is on screen so looping animation can pause off
 * screen and resume when it scrolls back.
 */
export function useInViewLoop<T extends HTMLElement = HTMLDivElement>(
  { rootMargin = "0px", threshold = 0.15 }: InViewLoopOptions = {},
) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin, threshold },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return { ref, inView } as const;
}

/**
 * Steps an index 0..count-1 on an interval while `active` is true. Used for the
 * single looping "hero moment" in a section. Freezes on the current index when
 * paused, so hovering or scrolling away never makes it jump.
 */
export function useLoopStep(
  count: number,
  { active, intervalMs }: { active: boolean; intervalMs: number },
) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!active || count < 2) return;
    const id = window.setInterval(() => {
      setStep((current) => (current + 1) % count);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [active, count, intervalMs]);

  return step;
}
