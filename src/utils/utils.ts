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
