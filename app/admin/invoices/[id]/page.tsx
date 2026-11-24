import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { InvoiceDetail } from "@/components/admin/invoices/InvoiceDetail";
import { getInvoice } from "@/db/queries";
import { adminInvoices } from "@/lib/admin-data";

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return adminInvoices.map((invoice) => ({ id: invoice.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  return { title: `${id} | Elevosia Admin` };
}

async function InvoiceLoader({ id }: { id: string }) {
  await connection();
  const invoice = await getInvoice(id);
  if (!invoice) notFound();
  return <InvoiceDetail invoice={invoice} />;
}

export default async function InvoiceDetailPage({ params }: { params: Params }) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-[1920px]">
          <div className="h-3 w-24 rounded bg-secondary" />
          <div className="mt-4 h-8 w-64 rounded bg-secondary" />
          <div className="mt-6 h-24 rounded-lg border border-border bg-card" />
        </div>
      }
    >
      <InvoiceLoader id={id} />
    </Suspense>
  );
}
