"use client";

import { useEffect, useState } from "react";

/**
 * Resolves a CSS custom property to a real color string, so canvas and SVG
 * libraries that cannot read `var(--token)` still follow the theme.
 * Re-reads on theme change (the `.dark` class on <html>).
 */
export function useTokenColor(variable: string): string | undefined {
  const [color, setColor] = useState<string | undefined>(undefined);

  useEffect(() => {
    const read = () => {
      const value = getComputedStyle(document.documentElement)
        .getPropertyValue(variable)
        .trim();
      if (value) setColor(value);
    };

    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [variable]);

  return color;
}
