"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

/**
 * Ends the better-auth session before leaving for the login page. A plain link
 * to /login would keep the session cookie alive, so the proxy would still let
 * the visitor back into /admin and /portal.
 */
export function LogoutMenuItem({
  label = "Logout",
  className,
}: {
  label?: string;
  className?: string;
}) {
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    if (pending) return;
    setPending(true);

    const { error } = await authClient.signOut();
    if (error) {
      setPending(false);
      toast.error("Could not log out. Please try again.");
      return;
    }

    // Full navigation so no cached admin/portal payload survives the sign out.
    window.location.replace("/login");
  }

  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={pending}
      className={cn("group", className)}
      onSelect={(event) => {
        event.preventDefault();
        void handleLogout();
      }}
    >
      <LogOut
        className="size-4 transition-transform group-hover:translate-x-0.5"
        aria-hidden="true"
      />
      <span className="text-sm font-medium">
        {pending ? "Logging out…" : label}
      </span>
    </DropdownMenuItem>
  );
}
