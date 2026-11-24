import { connection } from "next/server";
import {
  getApprovedScopeRows,
  getBlueprintDetail,
  listBlueprintSuggestions,
} from "@/db/queries";
import {
  BlueprintTasks,
  type BlueprintConvertInfo,
} from "@/components/admin/blueprints/BlueprintTasks";

/** Blueprint tasks plus the approved requirement scope, read at request time. */
export async function BlueprintTasksSection({
  blueprintId,
  convert,
}: {
  blueprintId: string;
  convert?: BlueprintConvertInfo;
}) {
  await connection();
  const [approvedScope, detail, suggestions] = await Promise.all([
    getApprovedScopeRows(blueprintId),
    getBlueprintDetail(blueprintId),
    listBlueprintSuggestions(blueprintId),
  ]);

  const planVersion = JSON.stringify(detail?.milestones ?? []);

  return (
    <BlueprintTasks
      key={planVersion}
      blueprintId={blueprintId}
      initial={detail?.milestones ?? []}
      status={detail?.status ?? "Draft"}
      convert={convert}
      approvedScope={approvedScope}
      suggestions={suggestions}
    />
  );
}
