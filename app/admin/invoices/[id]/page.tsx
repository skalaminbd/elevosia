import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, CreditCard, Receipt } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { InvoiceActions } from "@/components/admin/invoices/InvoiceActions";
import { adminInvoices } from "@/lib/admin-data";

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return adminInvoices.map((invoice) => ({ id: invoice.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const invoice = adminInvoices.find((item) => item.id === id);
  return invoice ? { title: `${invoice.id} | Elevosia Admin` } : {};
}

export default async function InvoiceDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const invoice = adminInvoices.find((item) => item.id === id);
  if (!invoice) notFound();

  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <Link href="/admin/invoices" className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        All invoices
      </Link>
      <PageHeader
        title={`Invoice ${invoice.id}`}
        meta={`${invoice.client} · ${invoice.kind}`}
        description={`Due ${invoice.due}`}
        className="mt-3"
      >
        <StatusBadge tone={invoice.status === "Paid" ? "success" : invoice.status === "Overdue" ? "danger" : "warning"}>
          {invoice.status}
        </StatusBadge>
      </PageHeader>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Amount" value={`$${invoice.amount.toLocaleString("en-US")}`} note={invoice.kind} icon={Receipt} />
        <StatCard label="Due" value={invoice.due} note="US Eastern" icon={Receipt} />
        <StatCard label="Status" value={invoice.status} note={invoice.status === "Paid" ? "No action" : "Needs payment"} tone={invoice.status === "Overdue" ? "danger" : "default"} icon={Receipt} />
        <StatCard label="Project" value="Care dashboard" note={invoice.client} icon={Receipt} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <SectionCard title="Invoice" description={invoice.client} className="xl:col-span-2" bodyClassName="p-5">
          <div className="rounded-md border border-border">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <p className="text-sm font-medium">{invoice.kind}</p>
                <p className="text-xs text-muted-foreground">Care dashboard and client portal</p>
              </div>
              <span className="font-mono text-sm">${invoice.amount.toLocaleString("en-US")}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-mono text-base font-semibold">${invoice.amount.toLocaleString("en-US")}</span>
            </div>
          </div>
          {invoice.status === "Paid" ? (
            <div className="mt-4 flex items-start gap-2 rounded-md bg-success/5 p-3">
              <Check className="mt-0.5 size-4 text-success" aria-hidden="true" />
              <p className="text-xs text-muted-foreground">
                Paid {invoice.due.replace("Paid ", "")} by card. Receipt sent to the billing
                email.
              </p>
            </div>
          ) : (
            <div className="mt-4 flex items-start gap-2 rounded-md bg-secondary/60 p-3">
              <CreditCard className="mt-0.5 size-4 text-primary" aria-hidden="true" />
              <p className="text-xs text-muted-foreground">
                {invoice.status === "Overdue"
                  ? "Overdue by 7 days. Reminder sent 14 Nov."
                  : "Not paid yet. The client sees it in the portal."}
              </p>
            </div>
          )}
        </SectionCard>

        <div className="space-y-4">
          <InvoiceActions status={invoice.status} />
          <SectionCard title="Billing details" description="From the client profile">
            <div className="space-y-2 p-5 text-sm">
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Billing email</span>
                <span className="truncate text-xs">sarah@brightlinecare.com</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Time zone</span>
                <span className="text-xs">US Central (CT)</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Care plan</span>
                <span className="text-xs">Growth</span>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
