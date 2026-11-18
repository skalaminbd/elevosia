import type { NextRequest } from "next/server";
import { z } from "zod";
import { getSidebarCounts } from "@/lib/admin/sidebar-counts";

const roleSchema = z.enum(["admin", "pm", "developer", "marketing", "support"]);

export async function GET(request: NextRequest) {
  const parsed = roleSchema.safeParse(
    request.nextUrl.searchParams.get("role") ?? "admin",
  );
  const role = parsed.success ? parsed.data : "admin";
  return Response.json(getSidebarCounts(role));
}
