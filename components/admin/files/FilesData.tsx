import { connection } from "next/server";
import { Eye, FileText, Folder, Upload } from "lucide-react";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/admin/ui/Table";
import { listFiles } from "@/db/queries";

/** Files and folders from Postgres, read at request time. */
export async function FilesData() {
  await connection();
  const { files, folders } = await listFiles();
  const visible = files.filter((file) => file.visible).length;

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-3">
        <StatCard
          label="Files"
          value={files.length}
          note={`Across ${folders.length} folders`}
          icon={FileText}
        />
        <StatCard
          label="Client-visible"
          value={visible}
          note="Rest stay internal"
          icon={Eye}
        />
        <StatCard
          label="Added this week"
          value={files.length}
          note="Shown newest first"
          icon={Upload}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
        {folders.map((folder) => (
          <div
            key={folder.id}
            className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30"
          >
            <span className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Folder className="size-4" aria-hidden="true" />
            </span>
            <p className="mt-3 text-sm font-medium">{folder.label}</p>
            <p className="text-xs text-muted-foreground">
              {folder.count} files
            </p>
          </div>
        ))}
      </div>

      <SectionCard
        title="Recent files"
        description="Newest first"
        className="mt-4"
        bodyClassName="overflow-x-auto"
      >
        <Table minWidth={false} bare>
          <THead>
            <tr>
              <TH>File</TH>
              <TH>Client</TH>
              <TH>Folder</TH>
              <TH>Updated</TH>
              <TH>Size</TH>
              <TH>Visibility</TH>
            </tr>
          </THead>
          <TBody>
            {files.map((file) => (
              <TR key={file.id}>
                <TD>
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-7 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                      <FileText className="size-3.5" aria-hidden="true" />
                    </span>
                    <span className="font-medium">{file.name}</span>
                  </div>
                </TD>
                <TD className="text-xs text-muted-foreground">{file.client}</TD>
                <TD className="text-xs text-muted-foreground">{file.folder}</TD>
                <TD className="text-xs text-muted-foreground">{file.updated}</TD>
                <TD className="font-mono text-xs text-muted-foreground">
                  {file.size}
                </TD>
                <TD>
                  <StatusBadge tone={file.visible ? "success" : "neutral"}>
                    {file.visible ? "Client-visible" : "Internal"}
                  </StatusBadge>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </SectionCard>
    </>
  );
}
