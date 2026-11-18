import type { Metadata } from "next";
import { Eye, FileText, Folder, Upload } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/admin/ui/Table";
import { files, folders } from "@/lib/admin-data";

export const metadata: Metadata = {
  title: "Files | Elevosia Admin",
};

export default function FilesPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px]">
      <PageHeader
        title="Files"
        meta="Delivery"
        description="Folders, versions and client visibility. Internal by default; switch a file on to show it in the portal."
      />

      <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-3">
        <StatCard label="Files" value={105} note="Across 5 folders" icon={FileText} />
        <StatCard label="Client-visible" value={62} note="Rest stay internal" icon={Eye} />
        <StatCard label="Added this week" value={8} note="3 from clients" icon={Upload} />
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
            <p className="text-xs text-muted-foreground">{folder.count} files</p>
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
                <TD className="font-mono text-xs text-muted-foreground">{file.size}</TD>
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
    </div>
  );
}
