import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { PortalBlueprintTasks } from "@/components/portal/BlueprintTasksEditor";
import {
  getBlueprintDetail,
  listBlueprintSuggestions,
} from "@/db/queries";
import { blueprints } from "@/lib/admin-data";
import { requirePortalClientId } from "@/lib/portal-session";

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return blueprints.map((blueprint) => ({ id: blueprint.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  return { title: `${id} | Elevosia client portal` };
}

async function BlueprintLoader({ id }: { id: string }) {
  await connection();
  const clientId = await requirePortalClientId();
  const [detail, suggestions] = await Promise.all([
    getBlueprintDetail(id),
    listBlueprintSuggestions(id),
  ]);
  if (!detail || detail.clientId !== clientId || detail.status === "Draft") {
    notFound();
  }

  return (
    <PortalBlueprintTasks
      blueprintId={detail.id}
      blueprint={{
        id: detail.id,
        title: detail.title,
        client: detail.client,
        version: detail.version,
        status: detail.status,
      }}
      initial={detail.milestones}
      suggestions={suggestions}
    />
  );
}

export default async function PortalBlueprintTasksPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-[1920px]">
          <div className="h-3 w-24 rounded bg-secondary" />
          <div className="mt-4 h-8 w-64 rounded bg-secondary" />
          <div className="mt-6 h-64 rounded-lg border border-border bg-card" />
        </div>
      }
    >
      <BlueprintLoader id={id} />
    </Suspense>
  );
}
