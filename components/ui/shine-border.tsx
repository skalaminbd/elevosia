"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

interface ShineBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Width of the border in pixels
   * @default 1
   */
  borderWidth?: number;
  /**
   * Duration of the animation in seconds
   * @default 14
   */
  duration?: number;
  /**
   * Color of the border, can be a single color or an array of colors
   * @default "var(--highlight)"
   */
  shineColor?: string | string[];
}

/**
 * Shine Border
 *
 * An animated background border effect component with configurable properties.
 */
export function ShineBorder({
  borderWidth = 1,
  duration = 14,
  shineColor = "var(--highlight)",
  className,
  style,
  ...props
}: ShineBorderProps) {
  return (
    <div
      style={
        {
          "--border-width": `${borderWidth}px`,
          "--duration": `${duration}s`,
          "--shine-tone": Array.isArray(shineColor)
            ? shineColor.join(",")
            : shineColor,
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        "motion-safe:animate-shine shine-mask pointer-events-none absolute inset-0 z-10 size-full rounded-lg will-change-[background-position]",
        className,
      )}
      {...props}
    />
  );
}
