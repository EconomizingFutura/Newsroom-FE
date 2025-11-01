import { useLocation, useSearchParams } from "react-router-dom";

export type CurrentPageType =
  | "dashboard"
  | "drafts"
  | "reverted"
  | "history"
  | "textArticle"
  | "audio"
  | "video"
  | "editor-dashboard"
  | "publish-center"
  | "review-queue"
  | "editor-history"
  | "newsFeeds"
  | "calendar";

export function useCurrentView(): CurrentPageType {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const queryParams = new URLSearchParams(location.search);

  const from = searchParams.get("from") as CurrentPageType | null;

  if (location.pathname === "/dashboard") return "dashboard";
  if (location.pathname === "/drafts") return "drafts";
  if (location.pathname === "/reverted") return "reverted";
  if (location.pathname === "/history") return "history";

  if (location.pathname.startsWith("/textArticle/")) {
    return from || "newsFeeds";
  }
  if (location.pathname === "/textArticle") return "textArticle";

  if (location.pathname.startsWith("/audio/")) {
    return from || "newsFeeds";
  }
  if (location.pathname === "/audio") return "audio";

  if (location.pathname.startsWith("/video/")) {
    return from || "newsFeeds";
  }
  if (location.pathname === "/video") return "video";

  if (location.pathname.startsWith("/editor/dashboard"))
    return "editor-dashboard";
  if (location.pathname.startsWith("/editor/calendarView")) return "calendar";
  if (location.pathname.startsWith("/editor/publishCenter"))
    return "publish-center";
  if (location.pathname.startsWith("/editor/reviewQueue"))
    return "review-queue";
  if (location.pathname.startsWith("/editor/history")) return "editor-history";

  if (queryParams.get("from") === "reviewQueue") {
    return "review-queue";
  }
  if (queryParams.get("from") == "editor-history") {
    return "editor-history";
  }
  if (queryParams.get("from") === "dashboard") {
    return "editor-dashboard";
  }
  if (queryParams.get("from") === "calendar") {
    return "calendar";
  }
  if (queryParams.get("from") == "publishCenter") return "publish-center";
  return "newsFeeds";
}
