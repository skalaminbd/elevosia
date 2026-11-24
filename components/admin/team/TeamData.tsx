import { connection } from "next/server";
import { TeamManagement } from "@/components/admin/team/TeamManagement";
import { listTeamMembers } from "@/db/queries";

/** Team members from Postgres, read at request time. */
export async function TeamData() {
  await connection();
  const members = await listTeamMembers();
  return <TeamManagement initialMembers={members} />;
}
