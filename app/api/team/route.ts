import { NextResponse } from "next/server";
import { listTeam } from "@/db/queries";

/** Team list for client-side pickers. */
export async function GET() {
  const team = await listTeam();
  return NextResponse.json({ team });
}
