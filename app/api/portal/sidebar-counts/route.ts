import { getSessionUser } from "@/lib/portal-session";
import { getPortalSidebarCounts } from "@/db/queries";

/** Live sidebar counts for the signed-in client. */
export async function GET() {
  const user = await getSessionUser();
  if (!user?.clientId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return Response.json(await getPortalSidebarCounts(user.clientId));
}
