import type { ReactNode } from "react";

/**
 * Layout wrapper kept for section markup. Entrance animation was removed at the
 * client's request, so this now renders its children as-is.
 */
export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
