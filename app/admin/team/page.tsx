import type { Metadata } from "next";
import { TeamManagement } from "@/components/admin/team/TeamManagement";

export const metadata: Metadata = {
  title: "Team management | Elevosia Admin",
};

export default function TeamPage() {
  return <TeamManagement />;
}
