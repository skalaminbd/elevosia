import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user } from "@/db/auth-schema";
import { createClient } from "@/app/admin/clients/actions";

const STAFF_ROLES = ["admin", "pm", "developer", "marketing", "support"];

/** Sends a signed-in user to the admin panel or the client portal. */
export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const current = session.user as { role?: string | null; clientId?: string | null };
  const role = current.role ?? "client";

  if (STAFF_ROLES.includes(role)) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  let clientId = current.clientId ?? null;
  if (!clientId) {
    const result = await createClient({
      contact: session.user.name || session.user.email,
      email: session.user.email,
      phone: "",
      status: "Onboarding",
      industry: "",
      pm: "Alamin",
      timezone: "America/New_York",
      source: "Website",
      companies: [
        {
          name: session.user.name || session.user.email,
          address: "",
          city: "",
          region: "",
          zip: "",
          phone: "",
          website: "",
        },
      ],
    });
    if (result.ok) {
      clientId = result.id;
      await db
        .update(user)
        .set({ clientId, role: "client" })
        .where(eq(user.id, session.user.id));
    }
  }

  return NextResponse.redirect(new URL("/portal", request.url));
}
