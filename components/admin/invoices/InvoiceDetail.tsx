import Link from "next/link";
import { ArrowLeft, Check, CreditCard, Receipt } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { InvoiceActions } from "@/components/admin/invoices/InvoiceActions";
import { InvoiceHeaderActions } from "@/components/invoices/InvoiceHeaderActions";
import type { InvoiceDetailRow } from "@/db/queries";

/** One invoice from Postgres. */
export function InvoiceDetail({ invoice }: { invoice: InvoiceDetailRow }) {
  const project = invoice.projectName ?? "No project linked";

  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <Link
        href="/admin/invoices"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        All invoices
      </Link>
      <PageHeader
        title={`Invoice ${invoice.id}`}
        meta={`${invoice.client} · ${invoice.kind}`}
        description={`Due ${invoice.due}`}
        className="mt-3"
      >
        <StatusBadge
          tone={
            invoice.status === "Paid"
              ? "success"
              : invoice.status === "Overdue"
                ? "danger"
                : "warning"
          }
        >
          {invoice.status}
        </StatusBadge>
        <InvoiceHeaderActions
          invoice={{
            id: invoice.id,
            client: invoice.client,
            kind: invoice.kind,
            amount: invoice.amount,
            due: invoice.due,
            status: invoice.status,
            project: invoice.projectName ?? undefined,
          }}
        />
      </PageHeader>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Amount"
          value={`$${invoice.amount.toLocaleString("en-US")}`}
          note={invoice.kind}
          icon={Receipt}
        />
        <StatCard
          label="Due"
          value={invoice.due}
          note="US Eastern"
          icon={Receipt}
        />
        <StatCard
          label="Status"
          value={invoice.status}
          note={invoice.status === "Paid" ? "No action" : "Needs payment"}
          tone={invoice.status === "Overdue" ? "danger" : "default"}
          icon={Receipt}
        />
        <StatCard label="Project" value={project} note={invoice.client} icon={Receipt} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <SectionCard
          title="Invoice"
          description={invoice.client}
          className="xl:col-span-2"
          bodyClassName="p-5"
        >
          <div className="rounded-md border border-border">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <p className="text-sm font-medium">{invoice.kind}</p>
                <p className="text-xs text-muted-foreground">{project}</p>
              </div>
              <span className="font-mono text-sm">
                ${invoice.amount.toLocaleString("en-US")}
              </span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-mono text-base font-semibold">
                ${invoice.amount.toLocaleString("en-US")}
              </span>
            </div>
          </div>
          {invoice.status === "Paid" ? (
            <div className="mt-4 flex items-start gap-2 rounded-md bg-success/5 p-3">
              <Check className="mt-0.5 size-4 text-success" aria-hidden="true" />
              <p className="text-xs text-muted-foreground">
                Paid {invoice.due.replace("Paid ", "")} by card. Receipt sent to
                the billing email.
              </p>
            </div>
          ) : (
            <div className="mt-4 flex items-start gap-2 rounded-md bg-secondary/60 p-3">
              <CreditCard
                className="mt-0.5 size-4 text-primary"
                aria-hidden="true"
              />
              <p className="text-xs text-muted-foreground">
                {invoice.status === "Overdue"
                  ? "Overdue. A reminder has been sent."
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
                <span className="text-muted-foreground">Project</span>
                <span className="truncate text-xs">{project}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Kind</span>
                <span className="text-xs">{invoice.kind}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Time zone</span>
                <span className="text-xs">Client profile</span>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
