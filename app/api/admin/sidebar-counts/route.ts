import { getSessionUser, STAFF_ROLES } from "@/lib/portal-session";
import { getAdminSidebarCounts } from "@/db/queries";

/** Live sidebar counts from Postgres for signed-in staff. */
export async function GET() {
  const user = await getSessionUser();
  if (!user || !STAFF_ROLES.includes(user.role as (typeof STAFF_ROLES)[number])) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return Response.json(await getAdminSidebarCounts());
}
