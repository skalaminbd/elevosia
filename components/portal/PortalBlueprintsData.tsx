import Link from "next/link";
import { connection } from "next/server";
import { ArrowUpRight, FileText, Layers, ShieldCheck } from "lucide-react";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { listPortalBlueprints } from "@/db/queries";
import { requirePortalClientId } from "@/lib/portal-session";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Every Blueprint shared with this client, read from Postgres. */
export async function PortalBlueprintsData() {
  await connection();
  const clientId = await requirePortalClientId();
  const blueprints = await listPortalBlueprints(clientId);

  const waiting = blueprints.filter(
    (blueprint) => blueprint.status === "Waiting for approval",
  ).length;
  const approved = blueprints.filter(
    (blueprint) => blueprint.status === "Approved",
  ).length;

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Shared with you"
          value={blueprints.length}
          note="Everything your PM sent"
          icon={Layers}
        />
        <StatCard
          label="Waiting for you"
          value={waiting}
          note={waiting > 0 ? "Open one to approve" : "Nothing to approve"}
          icon={ShieldCheck}
          tone={waiting > 0 ? "warning" : "success"}
        />
        <StatCard
          label="Approved"
          value={approved}
          note="Locked plans"
          icon={FileText}
          tone="success"
        />
        <StatCard
          label="Total value"
          value={`$${blueprints
            .reduce((total, blueprint) => total + blueprint.price, 0)
            .toLocaleString("en-US")}`}
          note="Fixed prices"
          icon={FileText}
        />
      </div>

      {blueprints.length === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No Blueprint is shared with you yet. It appears here the moment your PM
          presses Send to client.
        </div>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {blueprints.map((blueprint) => (
            <Link
              key={blueprint.id}
              href={`/portal/blueprints/${blueprint.id}`}
              className="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/30"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {blueprint.title}
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                    {blueprint.id} · {blueprint.version}
                  </p>
                </div>
                <StatusBadge
                  tone={
                    blueprint.status === "Approved"
                      ? "success"
                      : blueprint.status === "Waiting for approval"
                        ? "warning"
                        : "neutral"
                  }
                >
                  {blueprint.status}
                </StatusBadge>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <span className="font-mono text-lg font-semibold">
                  ${blueprint.price.toLocaleString("en-US")}
                </span>
                <span className="text-xs text-muted-foreground">
                  {blueprint.milestones.length}{" "}
                  {blueprint.milestones.length === 1
                    ? "milestone"
                    : "milestones"}
                </span>
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                Valid until {formatDate(blueprint.validUntil)}
              </p>

              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
                Open blueprint
                <ArrowUpRight className="size-3" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
