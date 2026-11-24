"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ChevronRight,
  FileSignature,
  FileText,
  PenLine,
  Search,
  Send,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilterDisclosure } from "@/components/shared/FilterDisclosure";
import { StatusBadge, type BadgeTone } from "@/components/admin/ui/StatusBadge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/admin/ui/Table";
import type { Contract, ContractStatus } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

const TONE: Record<ContractStatus, BadgeTone> = {
  Signed: "success",
  Sent: "warning",
  Draft: "neutral",
};

const STATUS_OPTIONS = [
  { id: "Signed", label: "Signed", icon: CheckCircle2 },
  { id: "Sent", label: "Sent", icon: Send },
  { id: "Draft", label: "Draft", icon: PenLine },
];

export type ContractTemplateRow = {
  id: string;
  name: string;
  body: string;
  used: number;
  updated: string;
};

function projectLabel(contract: Contract) {
  if (!contract.projectId) return null;
  return contract.projectName ?? "Project";
}

/** All contracts, newest first, plus the same contracts grouped by client. */
export function ContractsView({
  contracts: contractRows,
  templates,
}: {
  contracts: Contract[];
  templates: ContractTemplateRow[];
}) {
  const [query, setQuery] = useState("");
  const [statuses, setStatuses] = useState<string[]>([]);

  const allContracts = useMemo<Contract[]>(
    () =>
      [...contractRows].sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt),
      ),
    [contractRows],
  );

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return allContracts.filter((contract) => {
      const matchesStatus =
        statuses.length === 0 || statuses.includes(contract.status);
      const project = projectLabel(contract) ?? "";
      const matchesQuery =
        needle.length === 0 ||
        contract.id.toLowerCase().includes(needle) ||
        contract.client.toLowerCase().includes(needle) ||
        contract.type.toLowerCase().includes(needle) ||
        project.toLowerCase().includes(needle);
      return matchesStatus && matchesQuery;
    });
  }, [allContracts, query, statuses]);

  const byClient = useMemo(() => {
    const groups = new Map<string, { client: string; items: Contract[] }>();
    for (const contract of allContracts) {
      const group = groups.get(contract.clientId) ?? {
        client: contract.client,
        items: [],
      };
      group.items.push(contract);
      groups.set(contract.clientId, group);
    }
    return [...groups.entries()]
      .map(([clientId, group]) => ({
        clientId,
        client: group.client,
        items: group.items,
        signed: group.items.filter((item) => item.status === "Signed").length,
      }))
      .sort((a, b) => a.client.localeCompare(b.client));
  }, [allContracts]);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card">
        <Tabs defaultValue="all" className="gap-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
            <TabsList>
              <TabsTrigger value="all">All contracts</TabsTrigger>
              <TabsTrigger value="clients">By client</TabsTrigger>
            </TabsList>
            <p className="text-xs text-muted-foreground">
              {allContracts.length} contracts · newest first
            </p>
          </div>

          <TabsContent value="all">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
              <div className="relative w-full sm:w-64">
                <Search
                  className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search contracts"
                  aria-label="Search contracts"
                  className="h-9 pl-8 text-sm"
                />
              </div>
              <FilterDisclosure
                label="Filter"
                values={statuses}
                options={STATUS_OPTIONS}
                onChange={setStatuses}
              />
            </div>

            <Table bare>
              <THead>
                <tr>
                  <TH className="pl-5">Contract</TH>
                  <TH>Client</TH>
                  <TH>Project</TH>
                  <TH>Type</TH>
                  <TH>Status</TH>
                  <TH>Date</TH>
                  <TH className="w-10 pr-5" />
                </tr>
              </THead>
              <TBody>
                {rows.length === 0 ? (
                  <tr className="border-t border-border">
                    <td
                      colSpan={7}
                      className="px-5 py-10 text-center text-sm text-muted-foreground"
                    >
                      No contracts match that search.
                    </td>
                  </tr>
                ) : (
                  rows.map((contract) => {
                    const project = projectLabel(contract);
                    return (
                      <TR key={contract.id}>
                        <TD className="pl-5 font-mono text-xs">
                          <Link
                            href={`/admin/contracts/${contract.id}`}
                            className="hover:underline"
                          >
                            {contract.id}
                          </Link>
                        </TD>
                        <TD className="font-medium">{contract.client}</TD>
                        <TD>
                          {contract.projectId && project ? (
                            <Link
                              href={`/admin/projects/${contract.projectId}`}
                              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                            >
                              {project}
                              <ChevronRight className="size-3" aria-hidden="true" />
                            </Link>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              No project yet
                            </span>
                          )}
                        </TD>
                        <TD className="text-xs text-muted-foreground">
                          {contract.type}
                        </TD>
                        <TD>
                          <StatusBadge tone={TONE[contract.status]}>
                            {contract.status}
                          </StatusBadge>
                        </TD>
                        <TD className="text-xs whitespace-nowrap text-muted-foreground">
                          {contract.date}
                        </TD>
                        <TD className="pr-5">
                          <Link
                            href={`/admin/contracts/${contract.id}`}
                            aria-label={`Open ${contract.id}`}
                            className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary"
                          >
                            <ChevronRight className="size-4" aria-hidden="true" />
                          </Link>
                        </TD>
                      </TR>
                    );
                  })
                )}
              </TBody>
            </Table>
          </TabsContent>

          <TabsContent value="clients">
            {byClient.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-muted-foreground">
                No contracts yet. Create one to group it by client here.
              </p>
            ) : (
              <Accordion type="single" collapsible>
                {byClient.map((group) => (
                  <AccordionItem key={group.clientId} value={group.clientId}>
                    <AccordionTrigger className="px-5 py-4 hover:no-underline">
                      <span className="flex min-w-0 flex-1 items-center gap-2.5 pr-2">
                        <span className="truncate">{group.client}</span>
                        <span className="rounded-full bg-secondary px-2 py-0.5 font-mono text-[10px] font-normal text-muted-foreground">
                          {group.items.length}
                        </span>
                        <span className="ml-auto hidden text-xs font-normal text-muted-foreground sm:block">
                          {group.signed} signed · {group.items.length - group.signed} pending
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-0">
                      <div className="border-t border-border">
                        {group.items.map((contract) => {
                          const project = projectLabel(contract);
                          return (
                            <div
                              key={contract.id}
                              className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3 last:border-b-0"
                            >
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <Link
                                    href={`/admin/contracts/${contract.id}`}
                                    className="font-mono text-xs hover:underline"
                                  >
                                    {contract.id}
                                  </Link>
                                  <StatusBadge tone={TONE[contract.status]}>
                                    {contract.status}
                                  </StatusBadge>
                                </div>
                                <p className="mt-1 text-sm font-medium">
                                  {contract.type}
                                </p>
                                <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                                  {contract.projectId && project ? (
                                    <Link
                                      href={`/admin/projects/${contract.projectId}`}
                                      className="font-medium text-primary hover:underline"
                                    >
                                      {project}
                                    </Link>
                                  ) : (
                                    <span>No project yet</span>
                                  )}
                                  <span aria-hidden="true">·</span>
                                  <span>{contract.date}</span>
                                </p>
                              </div>
                              <Link
                                href={`/admin/contracts/${contract.id}`}
                                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                              >
                                View
                                <ChevronRight className="size-3.5" aria-hidden="true" />
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="flex items-center gap-1.5 text-sm font-medium">
              <FileSignature className="size-4 text-muted-foreground" aria-hidden="true" />
              Contract templates
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Start every new contract from one of these. Templates are read only here.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/contracts/templates">Open templates</Link>
          </Button>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className={cn(
                "rounded-lg border border-border bg-background p-4",
                template.used === 0 && "border-dashed",
              )}
            >
              <p className="flex items-center gap-1.5 text-sm font-medium">
                <FileText className="size-3.5 text-muted-foreground" aria-hidden="true" />
                {template.name}
              </p>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                {template.body}
              </p>
              <p className="mt-3 font-mono text-[10px] text-muted-foreground">
                {template.used === 0
                  ? `New · ${template.updated}`
                  : `Used in ${template.used} · ${template.updated}`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
