"use server";

import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user } from "@/db/auth-schema";

export type AttachResult = { ok: true } | { ok: false; error: string };

/** Links the signed-in auth user to the client record they just created. */
export async function attachClientToUser(clientId: string): Promise<AttachResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { ok: false, error: "Your session expired. Sign in again." };
  }

  try {
    await db
      .update(user)
      .set({ clientId, role: "client" })
      .where(eq(user.id, session.user.id));
  } catch (error) {
    console.error("attachClientToUser failed", error);
    return { ok: false, error: "Could not link the client record." };
  }

  return { ok: true };
}
