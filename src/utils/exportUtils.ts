/**
 * Utility for exporting table and financial datasets to CSV and Excel-compatible formats.
 */

export function exportToCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const escapeCell = (val: string | number | undefined | null) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvContent = [
    headers.map(escapeCell).join(';'),
    ...rows.map(row => row.map(escapeCell).join(';'))
  ].join('\r\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportFinancialStatementToCSV(
  symbol: string,
  statementTitle: string,
  currency: string,
  periods: string[],
  items: { label: string; values: Record<string, number>; isHeader?: boolean; yoyChanges?: Record<string, number> }[]
) {
  const headers = ['Finansal Kalem', ...periods.map(p => `${p} (${currency})`), 'YoY Değişim (%)'];
  const rows = items.map(item => {
    const rowValues: (string | number)[] = [
      item.isHeader ? `[ANA KALEM] ${item.label}` : item.label
    ];
    periods.forEach(p => {
      rowValues.push(item.values[p] !== undefined ? item.values[p] : 0);
    });
    const latestPeriod = periods[0];
    rowValues.push(item.yoyChanges?.[latestPeriod] !== undefined ? `%${item.yoyChanges[latestPeriod]}` : '-');
    return rowValues;
  });

  exportToCSV(`${symbol}_${statementTitle}_Finansal_Tablo`, headers, rows);
}
