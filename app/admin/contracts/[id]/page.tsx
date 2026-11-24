import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { getContract } from "@/db/queries";
import { ContractDetail } from "@/components/admin/contracts/ContractDetail";
import { contracts } from "@/lib/admin-data";

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return contracts.map((contract) => ({ id: contract.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  return { title: `${id} | Elevosia Admin` };
}

async function ContractLoader({ id }: { id: string }) {
  await connection();
  const contract = await getContract(id);
  if (!contract) notFound();
  return <ContractDetail contract={contract} />;
}

export default async function ContractDetailPage({ params }: { params: Params }) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-[1920px]">
          <div className="h-3 w-24 rounded bg-secondary" />
          <div className="mt-4 h-8 w-64 rounded bg-secondary" />
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="h-24 rounded-lg border border-border bg-card"
              />
            ))}
          </div>
        </div>
      }
    >
      <ContractLoader id={id} />
    </Suspense>
  );
}
