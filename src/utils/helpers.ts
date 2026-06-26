export const buildQueryString = (params: Record<string, unknown>) =>
  Object.entries(params)
    .filter(([, v]) => v != null && v !== '')
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
    .join('&');

export const formatCurrencyIDR = (v: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(v);

export const formatCompactIDR = (v: number): string => {
  if (v >= 1_000_000_000) {
    const formatted = (v / 1_000_000_000).toFixed(1).replace(/\.0$/, "").replace(".", ",");
    return `Rp. ${formatted} M`;
  }
  if (v >= 1_000_000) {
    const formatted = (v / 1_000_000).toFixed(1).replace(/\.0$/, "").replace(".", ",");
    return `Rp. ${formatted} JT`;
  }
  return formatCurrencyIDR(v);
};

export const formatDate = (d: string | Date | null) => {
  if (!d) return '';
  let date: Date;
  if (d instanceof Date) {
    date = d;
  } else if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
    const [y, m, day] = d.split('-').map(Number);
    date = new Date(y, m - 1, day);
  } else {
    date = new Date(d);
  }
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const wordCount = (text?: string) =>
  text?.trim().split(/\s+/).filter(Boolean).length ?? 0;

import toast from "react-hot-toast";

export const downloadFile = async (url: string, filename: string) => {
  const toastId = toast.loading("Downloading file...");
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
    toast.success("Download complete!", { id: toastId });
  } catch (error) {
    console.error("Failed to download file:", error);
    toast.error("Download failed, opening in new tab...", { id: toastId });
    window.open(url, "_blank");
  }
};

export const formatDateEN = (d: string | Date | null) => {
  if (!d) return '';
  const date = d instanceof Date ? d : new Date(d);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

