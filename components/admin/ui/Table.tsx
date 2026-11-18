import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Table({
  children,
  className,
  minWidth = true,
  bare = false,
}: {
  children: ReactNode;
  className?: string;
  minWidth?: boolean;
  bare?: boolean;
}) {
  return (
    <div
      className={cn(
        "overflow-x-auto",
        !bare && "rounded-lg border border-border bg-card",
        className,
      )}
    >
      <table
        className={cn(
          "w-full text-left text-sm",
          minWidth && "min-w-[720px]",
        )}
      >
        {children}
      </table>
    </div>
  );
}

export function THead({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-secondary/40 text-xs text-muted-foreground">
      {children}
    </thead>
  );
}

export function TBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function TR({ children }: { children: ReactNode }) {
  return (
    <tr className="border-t border-border transition-colors hover:bg-secondary/30">
      {children}
    </tr>
  );
}

export function TH({ children }: { children: ReactNode }) {
  return <th className="px-4 py-2.5 font-medium">{children}</th>;
}

export function TD({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <td className={cn("px-4 py-3 align-middle", className)}>{children}</td>;
}
