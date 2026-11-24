/**
 * Minimal PDF writer: one A4 page of text and rules, built with the PDF
 * built-in Helvetica fonts. No dependencies, so downloads stay instant.
 */

export type PdfLine = {
  text: string;
  x: number;
  y: number;
  size?: number;
  bold?: boolean;
  color?: [number, number, number];
  right?: number;
};

export type PdfRule = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  thickness?: number;
  color?: [number, number, number];
};

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;

function ascii(value: string): string {
  return value
    .replace(/[—–]/g, "-")
    .replace(/·/g, "-")
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[^\x20-\x7e]/g, "");
}

function escapeText(value: string): string {
  return ascii(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function textWidth(text: string, size: number, bold: boolean): number {
  return ascii(text).length * size * (bold ? 0.56 : 0.5);
}

function number(value: number): string {
  return Number(value.toFixed(2)).toString();
}

export function buildPdf({
  lines,
  rules,
}: {
  lines: PdfLine[];
  rules: PdfRule[];
}): Blob {
  const commands: string[] = [];

  rules.forEach((rule) => {
    const [r, g, b] = rule.color ?? [0.86, 0.85, 0.79];
    commands.push(
      `${number(r)} ${number(g)} ${number(b)} RG`,
      `${number(rule.thickness ?? 0.7)} w`,
      `${number(rule.x1)} ${number(rule.y1)} m`,
      `${number(rule.x2)} ${number(rule.y2)} l S`,
    );
  });

  lines.forEach((line) => {
    const size = line.size ?? 11;
    const [r, g, b] = line.color ?? [0.07, 0.16, 0.12];
    const x = line.right
      ? line.right - textWidth(line.text, size, Boolean(line.bold))
      : line.x;
    commands.push(
      "BT",
      `/${line.bold ? "F2" : "F1"} ${number(size)} Tf`,
      `${number(r)} ${number(g)} ${number(b)} rg`,
      `${number(x)} ${number(line.y)} Td`,
      `(${escapeText(line.text)}) Tj`,
      "ET",
    );
  });

  const content = commands.join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
}

export function downloadPdf(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Give slow browsers time to start the download before releasing the blob.
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
