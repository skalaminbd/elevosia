import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const STAFF_ROLES = [
  "admin",
  "pm",
  "developer",
  "marketing",
  "support",
] as const;

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role?: string | null;
  clientId?: string | null;
};

/** Current Better Auth user, or null when signed out. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  return (session?.user as SessionUser | undefined) ?? null;
}

/** Client id for the signed-in client user; sends them to onboarding if none. */
export async function requirePortalClientId(): Promise<string> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (!user.clientId) redirect("/auth/redirect");
  return user.clientId;
}

/** Staff-only guard for server components and actions. */
export async function requireStaffUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (!STAFF_ROLES.includes(user.role as (typeof STAFF_ROLES)[number])) {
    redirect("/portal");
  }
  return user;
}
