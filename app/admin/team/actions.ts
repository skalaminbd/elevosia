"use server";

import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { user } from "@/db/auth-schema";
import { auth } from "@/lib/auth";

export type InviteResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

const ROLE_MAP: Record<string, string> = {
  Admin: "admin",
  "Project manager": "pm",
  Developer: "developer",
  Marketing: "marketing",
  Support: "support",
};

/** Invites a staff member. Their work email can sign in with Google or a code. */
export async function inviteStaff(input: {
  name: string;
  email: string;
  role: string;
}): Promise<InviteResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  const callerRole = (session?.user as { role?: string } | undefined)?.role;
  if (!session || callerRole !== "admin") {
    return { ok: false, error: "Only an admin can invite staff." };
  }

  const email = input.email.trim().toLowerCase();
  if (!email.includes("@") || input.name.trim().length < 2) {
    return { ok: false, error: "Add a name and a valid work email." };
  }
  const role = ROLE_MAP[input.role] ?? "developer";

  try {
    const [existing] = await db
      .select()
      .from(user)
      .where(eq(user.email, email));

    let id = existing?.id;
    if (existing) {
      await db
        .update(user)
        .set({ name: input.name.trim(), role, emailVerified: true })
        .where(eq(user.id, existing.id));
    } else {
      id = randomUUID();
      await db.insert(user).values({
        id,
        name: input.name.trim(),
        email,
        emailVerified: true,
        role,
      });
    }

    try {
      await auth.api.sendVerificationOTP({
        body: { email, type: "sign-in" },
      });
    } catch (error) {
      console.error("inviteStaff OTP failed", error);
    }

    return { ok: true, id: id as string };
  } catch (error) {
    console.error("inviteStaff failed", error);
    return { ok: false, error: "Could not invite that person. Try again." };
  }
}
