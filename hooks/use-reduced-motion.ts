"use client";

import { useReducedMotion as useMotionReducedMotion } from "motion/react";

/**
 * Thin wrapper around motion's hook so every section reads the same flag and
 * renders a clean static final state when reduced motion is requested.
 */
export function useReducedMotion(): boolean {
  return Boolean(useMotionReducedMotion());
}
