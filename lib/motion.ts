/**
 * One easing curve for the whole homepage.
 * UI timing stays between 300 and 700ms, ambient loops between 8s and 30s.
 */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const UI_DURATION = 0.55;
export const STAGGER = 0.07;

/** Shared inline-style helper for measured, non-animated positions. */
export type BandBox = { top: number; height: number };
