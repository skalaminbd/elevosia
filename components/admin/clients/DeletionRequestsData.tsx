import { connection } from "next/server";
import { DeletionRequests } from "@/components/admin/clients/DeletionRequests";
import { listDeletionRequests } from "@/db/queries";

/** Deletion requests from Postgres. */
export async function DeletionRequestsData() {
  await connection();
  const requests = await listDeletionRequests();
  return <DeletionRequests requests={requests} />;
}
