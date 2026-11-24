import { connection } from "next/server";
import { FileCheck, FileText, Upload } from "lucide-react";
import { StatCard } from "@/components/admin/ui/StatCard";
import { PortalFilesView } from "@/components/portal/PortalFilesView";
import { listPortalContracts, listPortalFiles } from "@/db/queries";
import { requirePortalClientId } from "@/lib/portal-session";

/** Client files and contracts from Postgres, read at request time. */
export async function PortalFilesData() {
  await connection();
  const clientId = await requirePortalClientId();
  const [files, contracts] = await Promise.all([
    listPortalFiles(clientId),
    listPortalContracts(clientId),
  ]);
  const signed = contracts.filter(
    (contract) => contract.status === "Signed",
  ).length;
  const pending = contracts.length - signed;

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard
          label="Shared files"
          value={files.length}
          note={`Across ${new Set(files.map((file) => file.project)).size} projects`}
          icon={FileText}
        />
        <StatCard
          label="Signed"
          value={signed}
          note={`${pending} waiting for signature`}
          icon={FileCheck}
          tone="success"
        />
        <StatCard
          label="This month"
          value={files.length}
          note="Shared by your team"
          icon={Upload}
        />
      </div>

      <div className="mt-4">
        <PortalFilesView files={files} contracts={contracts} />
      </div>
    </>
  );
}
