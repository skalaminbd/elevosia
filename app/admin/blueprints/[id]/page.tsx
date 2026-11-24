import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { DbBlueprintPage } from "@/components/admin/blueprints/DbBlueprintPage";
import { getBlueprintDetail } from "@/db/queries";
import { blueprints } from "@/lib/admin-data";

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return blueprints.map((blueprint) => ({ id: blueprint.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  return { title: `${id} | Elevosia Admin` };
}

async function BlueprintLoader({ id }: { id: string }) {
  await connection();
  const detail = await getBlueprintDetail(id);
  if (!detail) notFound();
  return <DbBlueprintPage detail={detail} />;
}

export default async function BlueprintDetailPage({ params }: { params: Params }) {
  const { id } = await params;

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
      <BlueprintLoader id={id} />
    </Suspense>
  );
}
