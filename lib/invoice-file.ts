import type { InvoiceDoc } from "@/components/invoices/InvoiceDocument";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Standalone invoice file, printable to PDF. */
export function invoiceHtml(invoice: InvoiceDoc): string {
  const amount = invoice.amount.toLocaleString("en-US");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Invoice ${escapeHtml(invoice.id)}</title>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body { margin: 0; padding: 48px 24px; background: #f7f5ee; color: #13291f; font: 14px/1.5 Inter, system-ui, sans-serif; }
  .sheet { max-width: 720px; margin: 0 auto; background: #fff; border: 1px solid #e3e1d6; border-radius: 10px; padding: 40px; }
  .row { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; }
  .brand { font-size: 22px; font-weight: 700; letter-spacing: -0.02em; }
  .muted { color: #5f6b63; font-size: 12px; }
  .label { font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: #5f6b63; font-weight: 600; }
  .meta { text-align: right; }
  .mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
  .divider { border-top: 1px solid #e3e1d6; margin: 24px 0; }
  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #5f6b63; padding-bottom: 8px; }
  th:last-child, td:last-child { text-align: right; }
  td { padding: 12px 0; border-top: 1px solid #e3e1d6; }
  .totals { width: 220px; margin-left: auto; margin-top: 16px; }
  .totals div { display: flex; justify-content: space-between; padding: 4px 0; color: #5f6b63; }
  .totals .total { border-top: 1px solid #e3e1d6; margin-top: 6px; padding-top: 8px; color: #13291f; font-weight: 600; font-size: 16px; }
  .status { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 500; background: ${invoice.status === "Paid" ? "#e4f0d6" : invoice.status === "Overdue" ? "#fde8e8" : "#faf0d8"}; color: ${invoice.status === "Paid" ? "#33510f" : invoice.status === "Overdue" ? "#8f1d1d" : "#8a5a00"}; }
  .foot { margin-top: 24px; padding-top: 16px; border-top: 1px solid #e3e1d6; color: #5f6b63; font-size: 11px; }
  @media print { body { background: #fff; padding: 0; } .sheet { border: 0; padding: 24px; } }
</style>
</head>
<body>
  <div class="sheet">
    <div class="row">
      <div>
        <div class="brand">Elevosia</div>
        <div class="muted">Custom client systems · elevosia.com</div>
      </div>
      <div class="meta">
        <div class="label">Invoice</div>
        <div class="mono">${escapeHtml(invoice.id)}</div>
        <div class="muted">${escapeHtml(invoice.status === "Paid" ? invoice.due : `Due ${invoice.due}`)}</div>
      </div>
    </div>
    <div class="divider"></div>
    <div class="row">
      <div>
        <div class="label">Billed to</div>
        <div><strong>${escapeHtml(invoice.client)}</strong></div>
        ${invoice.email ? `<div class="muted">${escapeHtml(invoice.email)}</div>` : ""}
      </div>
      <div class="meta">
        <div class="label">Payment status</div>
        <span class="status">${escapeHtml(invoice.status)}</span>
      </div>
    </div>
    <table>
      <thead><tr><th>Description</th><th>Amount</th></tr></thead>
      <tbody>
        <tr>
          <td><strong>${escapeHtml(invoice.kind)}</strong>${
            invoice.project
              ? `<div class="muted">${escapeHtml(invoice.project)}</div>`
              : ""
          }</td>
          <td class="mono">$${amount}</td>
        </tr>
      </tbody>
    </table>
    <div class="totals">
      <div><span>Subtotal</span><span class="mono">$${amount}</span></div>
      <div><span>Tax</span><span class="mono">$0</span></div>
      <div class="total"><span>Total</span><span class="mono">$${amount}</span></div>
    </div>
    <div class="foot">${
      invoice.status === "Paid"
        ? "Paid in full. Thank you — a receipt is on file for your records."
        : "Pay from the client portal, or by bank transfer to the account on your agreement. Questions: billing@elevosia.com."
    }</div>
  </div>
</body>
</html>`;
}

export function downloadInvoice(invoice: InvoiceDoc) {
  const blob = new Blob([invoiceHtml(invoice)], {
    type: "text/html;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${invoice.id}.html`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function printInvoice(invoice: InvoiceDoc) {
  const frame = window.open("", "_blank", "width=800,height=1000");
  if (!frame) return;
  frame.document.write(invoiceHtml(invoice));
  frame.document.close();
  frame.focus();
  window.setTimeout(() => frame.print(), 300);
}
