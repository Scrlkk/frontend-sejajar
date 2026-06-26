/**
 * Helper functions for formatting dates and currency in contract forms.
 */

export function formatDateToDisplay(dateStr?: string): string {
  if (!dateStr) return "";
  let date: Date;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split("-").map(Number);
    date = new Date(y, m - 1, d);
  } else {
    date = new Date(dateStr);
  }
  if (isNaN(date.getTime())) return "";
  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

/**
 * Format number input value into Indonesian Rupiah (Rp. XX,XXX,XXX)
 */
export function formatRupiah(value: string): string {
  const numberString = value.replace(/[^0-9]/g, "");
  if (!numberString) return "";
  const formatted = Number(numberString).toLocaleString("en-US");
  return `Rp. ${formatted}`;
}

/**
 * Parse initial database values (e.g. "Rp 15M" or "Rp. 15,000,000") to expanded formatted Rupiah strings
 */
export function parseInitialValue(value?: string): string {
  if (!value) return "";
  const clean = value.replace(/[^0-9mM]/g, "");
  if (clean.toLowerCase().endsWith("m")) {
    const num = parseFloat(clean);
    if (!isNaN(num)) {
      return `Rp. ${(num * 1000000).toLocaleString("en-US")}`;
    }
  }
  const numOnly = clean.replace(/[^0-9]/g, "");
  if (numOnly) {
    return `Rp. ${Number(numOnly).toLocaleString("en-US")}`;
  }
  return value;
}
