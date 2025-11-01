import type { ArticleStatus } from "@/types/apitypes";

export const returnType = (type: string) => {
  let route: string;

  switch (type) {
    case "Text":
      route = "textArticle";
      break;
    case "AUDIO":
      route = "audio";
      break;
    case "VIDEO":
      route = "video";
      break;
    default:
      route = "textArticle";
  }
  return route;
};

export const TOKEN = () => {
  return localStorage.getItem("token");
};

export const USER_ROLE = () => {
  return localStorage.getItem("role");
};

export const LOGOUT = () => {
  localStorage.clear();
  window.location.href = "/login";
};

// ✅ Format absolute date: DD/MM/YYYY
export const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB"); // gives DD/MM/YYYY
};

// ✅ Format relative time: "Saved 2 mins ago"
export const formatRelativeTime = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Saved just now";
  if (diffMins < 60)
    return `Saved ${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24)
    return `Saved ${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7)
    return `Saved ${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  // fallback absolute date
  return `Saved on ${date.toLocaleDateString("en-GB")}`;
};

export const getWordCount = (content: string): number => {
  if (!content) return 0;

  // strip HTML tags
  const text = content.replace(/<[^>]*>/g, " ").trim();

  if (!text) return 0;

  return text.split(/\s+/).length;
};

export function formatToIST(dateString: string): string {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  const formatter = new Intl.DateTimeFormat("en-GB", options);
  const parts = formatter.formatToParts(date);

  const day = parts.find((p) => p.type === "day")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const year = parts.find((p) => p.type === "year")?.value;
  const hour = parts.find((p) => p.type === "hour")?.value;
  const minute = parts.find((p) => p.type === "minute")?.value;
  const dayPeriod = parts.find((p) => p.type === "dayPeriod")?.value;

  return `${day}/${month}/${year} at ${hour}:${minute} ${dayPeriod}`;
}

export function getInitials(name: string): string {
  if (!name) return "";

  // Remove extra spaces and special chars
  const cleaned = name
    .trim()
    .replace(/[_\W]+/g, " ") // replace underscores or special chars with space
    .split(" ")
    .filter(Boolean);

  if (cleaned.length === 0) return "";
  if (cleaned.length === 1) return cleaned[0].charAt(0).toUpperCase();

  // Take first letter of first and last words
  const first = cleaned[0].charAt(0).toUpperCase();
  const last = cleaned[cleaned.length - 1].charAt(0).toUpperCase();

  return first + last;
}

export const CALENDAR_COLOR = Object.freeze({
  scheduled: "#03528F1A",
  scheduledBorder: "#03528F",
  posted: "#2DA94F1A",
  postedBorder: "#2DA94F",
});

export const CALENDAR_BG = (type: "posted" | "scheduled") => {
  return CALENDAR_COLOR[type];
};

export const CALENDAR_BORDER = (type: "posted" | "scheduled") => {
  return CALENDAR_COLOR[`${type}Border` as keyof typeof CALENDAR_COLOR];
};

export const formatDateForInput = (dateString: string): string => {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  const formattedDate = date.toLocaleString("en-US", options);
  const uiDate = formattedDate.replace(",", " at");
  return uiDate;
};

export function convertISOToReadable(isoString: string): string {
  const date = new Date(isoString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} at ${hours}:${minutes}:${seconds}`;
}

export type HistoryStatus = Record<ArticleStatus, number>;

export interface HistoryTstatus {
  title: string;
  value: number;
  pillBg: string;
  pillText: string;
}

export interface ReturnStatus {
  title: string;
  value: number;
  pillBg: string;
  pillText: string;
}

export const transformHistoryStats = (data: HistoryStatus): ReturnStatus[] => {
  const STATUS_COLORS: Record<
    ArticleStatus,
    { pillBg: string; pillText: string }
  > = {
    DRAFT: { pillBg: "bg-gray-100", pillText: "text-gray-700" },
    SUBMITTED: { pillBg: "bg-blue-100", pillText: "text-blue-700" },
    REVIEWED: { pillBg: "bg-[#E0E7FF]", pillText: "text-[#3730A3]" },
    REVERTED: { pillBg: "bg-[#FEE2E0]", pillText: "text-[#F41D28]" },
    PUBLISHED: { pillBg: "bg-green-100", pillText: "text-green-700" },
    SCHEDULED: { pillBg: "bg-[#E6F4EA]", pillText: "text-[#2DA94F]" },
    POSTED: { pillBg: "bg-[#F2F4F6]", pillText: "text-[#4A5565]" },
  };

  const transformed = (Object.keys(data) as ArticleStatus[]).map((status) => ({
    title: status === "REVIEWED" ? "APPROVED" : status,
    value: data[status] ?? 0,
    pillBg: STATUS_COLORS[status].pillBg,
    pillText: STATUS_COLORS[status].pillText,
  }));

  const ORDER: ArticleStatus[] = [
    "POSTED",
    "REVIEWED",
    "SCHEDULED",
    "REVERTED",
  ];
  const filtered = transformed.filter((item) =>
    ORDER.includes(
      item.title === "APPROVED" ? "REVIEWED" : (item.title as ArticleStatus)
    )
  );

  const ordered = filtered.sort(
    (a, b) =>
      ORDER.indexOf(
        a.title === "APPROVED" ? "REVIEWED" : (a.title as ArticleStatus)
      ) -
      ORDER.indexOf(
        b.title === "APPROVED" ? "REVIEWED" : (b.title as ArticleStatus)
      )
  );

  return ordered;
};
