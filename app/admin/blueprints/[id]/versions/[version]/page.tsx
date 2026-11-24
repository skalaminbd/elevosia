import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { BlueprintVersionView } from "@/components/admin/blueprints/BlueprintVersionView";
import { getBlueprintDetail } from "@/db/queries";
import { blueprints } from "@/lib/admin-data";

type Params = Promise<{ id: string; version: string }>;

export function generateStaticParams() {
  return blueprints.flatMap((blueprint) => [
    { id: blueprint.id, version: blueprint.version },
    ...(blueprint.version === "v2" ? [{ id: blueprint.id, version: "v1" }] : []),
  ]);
}

export const metadata: Metadata = { title: "Blueprint history | Elevosia Admin" };

async function VersionLoader({
  id,
  version,
}: {
  id: string;
  version: string;
}) {
  await connection();
  const detail = await getBlueprintDetail(id);
  if (!detail) notFound();
  return <BlueprintVersionView detail={detail} version={version} />;
}

export default async function BlueprintVersionPage({ params }: { params: Params }) {
  const { id, version } = await params;

  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-[1920px]">
          <div className="h-3 w-32 rounded bg-secondary" />
          <div className="mt-4 h-8 w-64 rounded bg-secondary" />
          <div className="mt-6 h-24 rounded-lg border border-border bg-card" />
        </div>
      }
    >
      <VersionLoader id={id} version={version} />
    </Suspense>
  );
}
