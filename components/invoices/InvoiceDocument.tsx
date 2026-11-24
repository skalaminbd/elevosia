import { cn } from "@/lib/utils";

export type InvoiceDoc = {
  id: string;
  client: string;
  kind: string;
  amount: number;
  due: string;
  status: string;
  project?: string;
  email?: string;
};

/** The printable invoice sheet. Shared by the preview, print and download. */
export function InvoiceDocument({
  invoice,
  className,
}: {
  invoice: InvoiceDoc;
  className?: string;
}) {
  const total = invoice.amount;
  const paid = invoice.status === "Paid";

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-6 text-foreground sm:p-8",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-heading text-xl font-bold tracking-tight">
            Elevosia
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Custom client systems · elevosia.com
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            Invoice
          </p>
          <p className="font-mono text-sm">{invoice.id}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {invoice.status === "Paid" ? invoice.due : `Due ${invoice.due}`}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            Billed to
          </p>
          <p className="mt-1.5 text-sm font-medium">{invoice.client}</p>
          {invoice.email ? (
            <p className="text-xs text-muted-foreground">{invoice.email}</p>
          ) : null}
        </div>
        <div className="sm:text-right">
          <p className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            Payment status
          </p>
          <p
            className={cn(
              "mt-1.5 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
              paid
                ? "bg-success/10 text-success"
                : invoice.status === "Overdue"
                  ? "bg-destructive/10 text-destructive"
                  : "bg-warning/10 text-warning",
            )}
          >
            {invoice.status}
          </p>
        </div>
      </div>

      <table className="mt-6 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
            <th className="pb-2 font-semibold">Description</th>
            <th className="pb-2 text-right font-semibold">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border">
            <td className="py-3">
              <p className="font-medium">{invoice.kind}</p>
              {invoice.project ? (
                <p className="text-xs text-muted-foreground">
                  {invoice.project}
                </p>
              ) : null}
            </td>
            <td className="py-3 text-right font-mono text-sm tabular-nums">
              ${total.toLocaleString("en-US")}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="mt-4 ml-auto w-full max-w-56 space-y-1.5 text-sm">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span className="font-mono tabular-nums">
            ${total.toLocaleString("en-US")}
          </span>
        </div>
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Tax</span>
          <span className="font-mono tabular-nums">$0</span>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-1.5 text-base font-semibold">
          <span>Total</span>
          <span className="font-mono tabular-nums">
            ${total.toLocaleString("en-US")}
          </span>
        </div>
      </div>

      <p className="mt-6 border-t border-border pt-4 text-[11px] text-muted-foreground">
        {paid
          ? "Paid in full. Thank you — a receipt is on file for your records."
          : "Pay from the client portal, or by bank transfer to the account on your agreement. Questions: billing@elevosia.com."}
      </p>
    </div>
  );
}
