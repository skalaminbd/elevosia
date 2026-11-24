import { NextResponse } from "next/server";
import { getClient, listPortalProjects, PORTAL_CLIENT_ID } from "@/db/queries";

/** Client name and active project for the portal chrome. */
export async function GET() {
  const [client, projects] = await Promise.all([
    getClient(PORTAL_CLIENT_ID),
    listPortalProjects(),
  ]);
  const project =
    projects.find((item) => item.status === "Active") ?? projects[0] ?? null;

  return NextResponse.json({
    company: client?.name ?? "",
    project: project ? { name: project.name, phase: project.phase } : null,
  });
}
