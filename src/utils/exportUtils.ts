import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ── Excel Export ──────────────────────────────────────────────
export function exportToExcel(
  data: Record<string, unknown>[],
  filename: string,
  sheetName = 'Report'
): void {
  if (!data || data.length === 0) return;

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook  = XLSX.utils.book_new();

  // Auto-width columns
  const maxWidths: number[] = [];
  const keys = Object.keys(data[0]);
  keys.forEach((key, i) => {
    const maxLen = Math.max(
      key.length,
      ...data.map(row => String(row[key] ?? '').length)
    );
    maxWidths[i] = Math.min(maxLen + 2, 40);
  });
  worksheet['!cols'] = maxWidths.map(w => ({ wch: w }));

  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

// ── PDF Export ────────────────────────────────────────────────
export function exportToPDF(
  columns: { header: string; dataKey: string }[],
  data: Record<string, unknown>[],
  title: string,
  filename: string
): void {
  if (!data || data.length === 0) return;

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // Header
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 297, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('AssetIQ Enterprise', 10, 13);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(title, 297 / 2, 13, { align: 'center' });
  doc.setFontSize(8);
  doc.text(`Generated: ${new Date().toLocaleString('en-BD')}`, 287, 13, { align: 'right' });

  // Table
  const tableRows = data.map(row =>
    columns.map(col => {
      const val = row[col.dataKey];
      if (val === null || val === undefined) return '';
      if (typeof val === 'number') return val.toLocaleString('en-BD', { minimumFractionDigits: 2 });
      return String(val);
    })
  );

  autoTable(doc, {
    head: [columns.map(c => c.header)],
    body: tableRows,
    startY: 24,
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    theme: 'striped',
  });

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(150);
    doc.text(
      `Page ${i} of ${pageCount} — AssetIQ Confidential`,
      297 / 2,
      210,
      { align: 'center' }
    );
  }

  doc.save(`${filename}.pdf`);
}

// ── CSV Export (enhanced) ─────────────────────────────────────
export function exportToCSV(
  data: Record<string, unknown>[],
  filename: string
): void {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const rows = data.map(row =>
    headers.map(h => {
      const val = row[h];
      const str = val === null || val === undefined ? '' : String(val);
      return str.includes(',') || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str;
    }).join(',')
  );

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}
