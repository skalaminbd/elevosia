import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Hourglass, PenLine, Stamp } from "lucide-react";
import { Avatar } from "@/components/admin/ui/Avatar";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge, type BadgeTone } from "@/components/admin/ui/StatusBadge";
import { NewBlueprintDialog } from "@/components/admin/blueprints/NewBlueprintDialog";
import { Table, TBody, TD, TH, THead, TR } from "@/components/admin/ui/Table";
import { blueprints, type BlueprintStatus } from "@/lib/admin-data";

export const metadata: Metadata = {
  title: "Blueprints | Elevosia Admin",
};

const TONE: Record<BlueprintStatus, BadgeTone> = {
  Draft: "neutral",
  "Waiting for approval": "warning",
  Approved: "success",
  Expired: "danger",
};

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

export default function BlueprintsPage() {
  const total = blueprints.reduce((sum, blueprint) => sum + blueprint.price, 0);

  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="Blueprints"
        meta="Clients"
        description="Every plan sent to a client, with its version, expiry and fixed price."
      >
        <NewBlueprintDialog />
      </PageHeader>

      <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="Waiting for approval" value={2} note="$44,000 on the table" icon={Hourglass} tone="warning" />
        <StatCard label="Draft" value={1} note="Cedarbrook Schools" icon={PenLine} />
        <StatCard label="Approved" value={1} note="Brightline Care" icon={Stamp} tone="success" />
        <StatCard
          label="Total value"
          value={`$${total.toLocaleString("en-US")}`}
          note="Across all Blueprints"
          icon={FileText}
        />
      </div>

      <Table className="mt-4">
        <THead>
          <tr>
            <TH>Client</TH>
            <TH>Blueprint</TH>
            <TH>Version</TH>
            <TH>Status</TH>
            <TH>Valid until</TH>
            <TH>Milestones</TH>
            <TH>Price</TH>
            <TH className="w-10" />
          </tr>
        </THead>
        <TBody>
          {blueprints.map((blueprint) => (
            <TR key={blueprint.id}>
              <TD>
                <div className="flex items-center gap-2.5">
                  <Avatar initials={initials(blueprint.client)} />
                  <span className="font-medium">{blueprint.client}</span>
                </div>
              </TD>
              <TD>
                <Link href={`/admin/blueprints/${blueprint.id}`} className="font-medium hover:underline">
                  {blueprint.title}
                </Link>
                <p className="font-mono text-[10px] text-muted-foreground">
                  {blueprint.id}
                </p>
              </TD>
              <TD className="font-mono text-xs text-muted-foreground">
                {blueprint.version}
              </TD>
              <TD>
                <StatusBadge tone={TONE[blueprint.status]}>
                  {blueprint.status}
                </StatusBadge>
              </TD>
              <TD className="text-xs text-muted-foreground">
                {blueprint.validUntil}
              </TD>
              <TD className="font-mono text-xs tabular-nums">
                {blueprint.milestones}
              </TD>
              <TD className="font-mono text-xs font-semibold tabular-nums">
                ${blueprint.price.toLocaleString("en-US")}
              </TD>
              <TD>
                <Link href={`/admin/blueprints/${blueprint.id}`} aria-label={`Open ${blueprint.client} Blueprint`} className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground">
                  <span aria-hidden="true">›</span>
                </Link>
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <SectionCard
          title="Payment schedule"
          description="Default for every Blueprint"
          bodyClassName="p-5"
        >
          <div className="flex h-2 overflow-hidden rounded-full bg-secondary">
            <span className="h-full bg-primary" style={{ width: "40%" }} />
            <span className="h-full bg-primary/60" style={{ width: "30%" }} />
            <span className="h-full bg-primary/30" style={{ width: "30%" }} />
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>40% to start</span>
            <span>30% at the demo</span>
            <span>30% at launch</span>
          </div>
        </SectionCard>

        <SectionCard
          title="Expiring soon"
          description="Send a nudge before the date"
          bodyClassName="p-5"
        >
          <p className="text-sm">
            <span className="font-medium">Lumen Studio</span> · v2 expires 8 Dec
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Waiting 1 day. The old version stays available after it expires.
          </p>
        </SectionCard>

        <SectionCard
          title="Next version"
          description="When a client asks for changes"
          bodyClassName="p-5"
        >
          <p className="text-sm">
            <span className="font-medium">Ridgeline Cleaning</span> · v1 expired 2 Nov
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Create v2 to reopen the plan; v1 stays in history.
          </p>
        </SectionCard>
      </div>
    </div>
  );
}
