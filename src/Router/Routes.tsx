import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";

import Dashboard from "@/pages/Dashboard";import ContentUploader from "@/pages/ContentUploader";
import DraftsPage from "@/pages/DraftsPage";
import RevertedPostPage from "@/pages/RevertedPostPage";
import HistoryLogPage from "@/pages/HistoryLogPage";
import FilteredContentPage from "@/pages/FilteredContentPage";
import NewsFeedsPage from "@/pages/NewsFeedsPage";
import SideBar from "@/components/SideBar";
import Navigation from "@/components/Navigation";
import { CalendarView } from "@/pages/Editor/CalendarView";
import { HistoryLog } from "@/pages/Editor/HistoryLog";
import { PublishCenter } from "@/pages/Editor/PublishCenter";
import { ReviewQueue } from "@/pages/Editor/ReviewQueue";
import { Dashboard as EditorDashboard } from "@/pages/Editor/Dashboard";
import type { currentPageType } from "@/types/sidebarTypes";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentView = (): currentPageType => {
    if (location.pathname.startsWith("/dashboard")) return "dashboard";
    if (location.pathname.startsWith("/drafts")) return "drafts";
    if (location.pathname.startsWith("/reverted")) return "reverted";
    if (location.pathname.startsWith("/history")) return "history";
    if (location.pathname.startsWith("/editor/dashboard"))
      return "editor-dashboard";
    if (location.pathname.startsWith("/editor/calendarView")) return "calendar";
    if (location.pathname.startsWith("/editor/publishCenter"))
      return "publish-center";
    if (location.pathname.startsWith("/editor/reviewQueue"))
      return "review-queue";
    if (location.pathname.startsWith("/editor/history"))
      return "editor-history";
    return "newsFeeds"; // default fallback
  };

  const currentViewMemo = React.useMemo(
    () => getCurrentView(),
    [location.pathname]
  );

  return (
    <div>
      <Navigation />
      <div className="min-h-screen flex bg-background">
        <SideBar
          onNavigateToDrafts={() => navigate("/drafts")}
          onNavigateToReverted={() => navigate("/reverted")}
          onNavigateToHistory={() => navigate("/history")}
          onNavigateToNewsFeeds={() => navigate("/news-feeds")}
          onCreateNewTextArticle={() => navigate("/textArticle")}
          onCreateNewAudioArticle={() => navigate("/audio")}
          onCreateNewVideoArticle={() => navigate("/video")}
          onNavigateToDashboard={() => navigate("/dashboard")}
          onNavigateEditorDashboard={() => navigate("/editor/dashboard")}
          onNavigateEditorCalendarView={() => navigate("/editor/calendarView")}
          onNavigateEditorPublishCenter={() =>
            navigate("/editor/publishCenter")
          }
          onNavigateEditorReviewQueue={() => navigate("/editor/reviewQueue")}
          onNavigateEditorHistory={() => navigate("/editor/history")}
          currentView={currentViewMemo} // optional, can highlight active based on location
        />
        <div className="flex-1 w-full h-screen overflow-y-auto">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/textArticle" element={<ContentUploader />} />
        <Route path="/audio" element={<ContentUploader />} />
        <Route path="/video" element={<ContentUploader />} />
            <Route path="/drafts" element={<DraftsPage />} />
            <Route path="/reverted" element={<RevertedPostPage />} />
            <Route path="/history" element={<HistoryLogPage />} />
            <Route path="/filtered/:type" element={<FilteredContentPage />} />
            <Route path="/news-feeds" element={<NewsFeedsPage />} />

            {/* Editor */}
            <Route path="/editor/dashboard" element={<EditorDashboard />} />
            <Route path="/editor/calendarView" element={<CalendarView />} />
            <Route path="/editor/history" element={<HistoryLog />} />
            <Route path="/editor/publishCenter" element={<PublishCenter />} />
            <Route path="/editor/reviewQueue" element={<ReviewQueue />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
