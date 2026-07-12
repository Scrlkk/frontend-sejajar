export const buildQueryString = (params: Record<string, unknown>) =>
  new URLSearchParams(
    Object.entries(params).filter(([, v]) => v != null && v !== '') as [string, string][]
  ).toString();

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

const formatDateWithIntl = (
  d: string | number | Date | null | undefined,
  options: Intl.DateTimeFormatOptions,
  locale: string
): string => {
  if (!d) return '';
  let date: Date;
  if (d instanceof Date) {
    date = d;
  } else if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) {
    const [y, m, day] = d.split('-').map(Number);
    date = new Date(y, m - 1, day);
  } else {
    date = safeNewDate(d);
  }
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString(locale, {
    timeZone: 'Asia/Jakarta',
    ...options,
  });
};

export const formatDate = (d: string | number | Date | null | undefined) =>
  formatDateWithIntl(d, { day: 'numeric', month: 'short', year: 'numeric' }, 'id-ID');

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

export const formatDateEN = (d: string | number | Date | null | undefined) =>
  formatDateWithIntl(d, { month: 'short', day: 'numeric', year: 'numeric' }, 'en-US');

export const formatDateLongEN = (d: string | number | Date | null | undefined): string =>
  formatDateWithIntl(d, { month: 'long', day: 'numeric', year: 'numeric' }, 'en-US');

export const formatChartDate = (d: string | number | Date | null | undefined): string =>
  formatDateWithIntl(d, { month: 'short', day: 'numeric' }, 'id-ID');


/**
 * Converts any Date/ISO datetime string to separate Date (YYYY-MM-DD)
 * and Time (HH:mm) strings in WIB timezone (Asia/Jakarta).
 */
export const getWIBParts = (dateInput: string | Date | null | undefined): { date: string; time: string } => {
  if (!dateInput) return { date: "", time: "" };
  const d = safeNewDate(dateInput);
  if (isNaN(d.getTime())) return { date: "", time: "" };

  const formatterDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const date = formatterDate.format(d); // "YYYY-MM-DD"

  const formatterTime = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const time = formatterTime.format(d); // "HH:mm"

  return { date, time };
};

export const getFileUrl = (url?: string | null) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  let apiBase = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
  if (apiBase.endsWith("/api")) {
    apiBase = apiBase.substring(0, apiBase.length - 4);
  }

  const parts = url.split("/");
  const filename = parts[parts.length - 1];
  const dotIndex = filename.lastIndexOf(".");
  const basename = dotIndex !== -1 ? filename.substring(0, dotIndex) : filename;
  return `${apiBase}/stream-media/${basename}`;
};

/**
 * Builds a datetime string from separate date (YYYY-MM-DD) and time (HH:mm) inputs,
 * always using WIB (UTC+7 / +07:00) offset.
 * e.g. "2026-07-11" + "00:00" → "2026-07-11T00:00:00+07:00"
 */
export const toLocalISOWithOffset = (date: string, time: string): string => {
  return `${date}T${time}:00+07:00`;
};
/**
 * Safely creates a new Date object from a string or Date.
 * If the string is a raw PostgreSQL timestamp (e.g. "YYYY-MM-DD HH:mm:ss"),
 * it replaces the space with "T" (e.g. "YYYY-MM-DDTHH:mm:ss") so all browsers (including Safari)
 * can parse it correctly.
 */
export const safeNewDate = (d: string | number | Date | null | undefined): Date => {
  if (d === null || d === undefined || d === '') return new Date(NaN);
  if (d instanceof Date) return d;
  if (typeof d === 'number') return new Date(d);
  const formattedStr = typeof d === 'string' && d.includes(" ") && !d.includes("T") ? d.replace(" ", "T") : d;
  return new Date(formattedStr);
};

export const isTaskOverdue = (deadline: string | null, status: string) =>
  !!deadline &&
  safeNewDate(deadline) < new Date() &&
  !['published', 'approved'].includes(status);

export const formatCommentTimestamp = (dateStr: string) => {
  try {
    const date = safeNewDate(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);

    if (diffSec < 60) {
      return "just now";
    } else if (diffMin === 1) {
      return "a minute ago";
    } else if (diffMin < 60) {
      return `${diffMin} minutes ago`;
    } else if (diffHr === 1) {
      return "an hour ago";
    } else if (diffHr < 24) {
      return `${diffHr} hours ago`;
    }

    return date.toLocaleDateString("id-ID", {
      timeZone: "Asia/Jakarta",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

export interface DeadlineTask {
  id: number;
  title: string;
  status: string;
  deadline: string;
  content_title?: string;
  assigned_to_name?: string;
}

export const mapTaskToDeadlineItem = (task: DeadlineTask) => ({
  id: task.id,
  title: task.title,
  category: task.content_title || "General",
  categoryBg: "bg-blue-50 text-blue-600 border-blue-200/60",
  categoryDot: "bg-blue-500",
  status: task.status,
  statusBg: "bg-gray-50/60 text-gray-600 hover:bg-gray-50/60",
  statusDot: "bg-gray-600",
  dueDateText: formatDate(task.deadline),
  dueDate: task.deadline ? safeNewDate(task.deadline) : undefined,
});

