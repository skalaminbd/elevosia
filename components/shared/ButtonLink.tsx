import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { VariantProps } from "class-variance-authority";
import { Button, buttonVariants } from "@/components/ui/button";

type ButtonLinkProps = VariantProps<typeof buttonVariants> & {
  href: string;
  children: ReactNode;
  className?: string;
  /** Hide the trailing arrow for utility links. */
  arrow?: boolean;
};

/**
 * The one CTA button on the site: a link button with the same top-right arrow
 * everywhere, so every action reads the same way.
 */
export function ButtonLink({
  href,
  children,
  className,
  arrow = true,
  variant,
  size,
}: ButtonLinkProps) {
  return (
    <Button asChild variant={variant} size={size} className={className}>
      <Link href={href}>
        {children}
        {arrow ? <ArrowUpRight data-icon="inline-end" aria-hidden="true" /> : null}
      </Link>
    </Button>
  );
}
