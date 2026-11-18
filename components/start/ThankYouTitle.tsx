"use client";

import { useSearchParams } from "next/navigation";

/**
 * Reads the first name from the URL so the page itself can stay static.
 * Wrapped in Suspense on the page.
 */
export function ThankYouTitle({ fallback }: { fallback: string }) {
  const raw = useSearchParams().get("name");
  const name = raw?.trim().slice(0, 40);

  return <>{name ? `Thanks, ${name}. You're in.` : fallback}</>;
}
