import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const STAFF_ROLES = ["admin", "pm", "developer", "marketing", "support"];

/** Redirects signed-out visitors and keeps each role in its own area. */
export async function proxy(request: Request) {
  const { pathname } = new URL(request.url);
  const isAdmin = pathname.startsWith("/admin");
  const isPortal = pathname.startsWith("/portal");
  if (!isAdmin && !isPortal) return NextResponse.next();

  if (!getSessionCookie(request)) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  const { auth } = await import("@/lib/auth");
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  const role =
    (session.user as { role?: string | null }).role ?? "client";

  if (isAdmin && !STAFF_ROLES.includes(role)) {
    return NextResponse.redirect(new URL("/portal", request.url));
  }
  if (isPortal && STAFF_ROLES.includes(role)) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*"],
};
