import { NextResponse } from "next/server";
import { listHelpArticles } from "@/db/queries";

/** Help articles for the ticket sidebar. */
export async function GET() {
  const articles = await listHelpArticles();
  return NextResponse.json({ articles });
}
