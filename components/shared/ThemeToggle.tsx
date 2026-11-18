"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  // False during SSR and hydration, true afterwards. Keeps the first client
  // render identical to the server markup instead of flipping on hydration.
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const theme = isClient && resolvedTheme === "dark" ? "dark" : "light";

  return (
    <AnimatedThemeToggler
      theme={theme}
      onThemeChange={setTheme}
      aria-label="Toggle theme"
      className={cn(
        buttonVariants({ variant: "ghost", size: "icon" }),
        "[&_svg]:size-4",
        className,
      )}
    />
  );
}
