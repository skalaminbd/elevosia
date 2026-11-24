import type { InvoiceDoc } from "@/components/invoices/InvoiceDocument";
import { buildPdf, downloadPdf, type PdfLine, type PdfRule } from "@/lib/pdf";

const LEFT = 56;
const RIGHT = 539;

function money(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}

/** The invoice as a real PDF file. */
export function invoicePdf(invoice: InvoiceDoc): Blob {
  const lines: PdfLine[] = [];
  const rules: PdfRule[] = [];
  const full = (invoice.status === "Paid" ? "Paid" : `Due ${invoice.due}`);

  lines.push({ text: "Elevosia", x: LEFT, y: 786, size: 22, bold: true });
  lines.push({
    text: "Custom client systems - elevosia.com",
    x: LEFT,
    y: 770,
    size: 9,
    color: [0.37, 0.42, 0.39],
  });
  lines.push({ text: "INVOICE", x: RIGHT, y: 788, size: 9, bold: true, right: RIGHT });
  lines.push({ text: invoice.id, x: RIGHT, y: 774, size: 12, right: RIGHT });
  lines.push({ text: full, x: RIGHT, y: 760, size: 9, color: [0.37, 0.42, 0.39], right: RIGHT });

  rules.push({ x1: LEFT, y1: 746, x2: RIGHT, y2: 746 });
  lines.push({ text: "BILLED TO", x: LEFT, y: 724, size: 8, bold: true, color: [0.37, 0.42, 0.39] });
  lines.push({ text: invoice.client, x: LEFT, y: 708, size: 12, bold: true });
  if (invoice.email) {
    lines.push({ text: invoice.email, x: LEFT, y: 694, size: 9, color: [0.37, 0.42, 0.39] });
  }
  lines.push({ text: "PAYMENT STATUS", x: RIGHT, y: 724, size: 8, bold: true, color: [0.37, 0.42, 0.39], right: RIGHT });
  lines.push({ text: invoice.status, x: RIGHT, y: 708, size: 11, bold: true, right: RIGHT });

  rules.push({ x1: LEFT, y1: 670, x2: RIGHT, y2: 670 });
  lines.push({ text: "DESCRIPTION", x: LEFT, y: 652, size: 8, bold: true, color: [0.37, 0.42, 0.39] });
  lines.push({ text: "AMOUNT", x: RIGHT, y: 652, size: 8, bold: true, color: [0.37, 0.42, 0.39], right: RIGHT });
  lines.push({ text: invoice.kind, x: LEFT, y: 630, size: 11, bold: true });
  if (invoice.project) {
    lines.push({ text: invoice.project, x: LEFT, y: 616, size: 9, color: [0.37, 0.42, 0.39] });
  }
  lines.push({ text: money(invoice.amount), x: RIGHT, y: 630, size: 11, right: RIGHT });
  rules.push({ x1: LEFT, y1: 600, x2: RIGHT, y2: 600 });

  lines.push({ text: "Subtotal", x: 380, y: 574, size: 10, color: [0.37, 0.42, 0.39] });
  lines.push({ text: money(invoice.amount), x: RIGHT, y: 574, size: 10, right: RIGHT });
  lines.push({ text: "Tax", x: 380, y: 558, size: 10, color: [0.37, 0.42, 0.39] });
  lines.push({ text: "$0", x: RIGHT, y: 558, size: 10, right: RIGHT });
  rules.push({ x1: 380, y1: 546, x2: RIGHT, y2: 546 });
  lines.push({ text: "Total", x: 380, y: 528, size: 13, bold: true });
  lines.push({ text: money(invoice.amount), x: RIGHT, y: 528, size: 13, bold: true, right: RIGHT });

  rules.push({ x1: LEFT, y1: 100, x2: RIGHT, y2: 100 });
  const note =
    invoice.status === "Paid"
      ? "Paid in full. Thank you - a receipt is on file for your records."
      : "Pay from the client portal, or by bank transfer to the account on your agreement.";
  lines.push({ text: note, x: LEFT, y: 84, size: 8.5, color: [0.37, 0.42, 0.39] });
  lines.push({
    text: "Questions: billing@elevosia.com",
    x: LEFT,
    y: 72,
    size: 8.5,
    color: [0.37, 0.42, 0.39],
  });

  return buildPdf({ lines, rules });
}

export function downloadInvoicePdf(invoice: InvoiceDoc) {
  downloadPdf(`${invoice.id}.pdf`, invoicePdf(invoice));
}
