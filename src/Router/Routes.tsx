import React, { useMemo } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Dashboard from "@/pages/Dashboard";
import ContentUploader from "@/pages/ContentUploader";
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
import LoginPage from "@/pages/LoginPage";
import { useCurrentView } from "@/hooks/useCurrentView";
import EditArticle from "@/pages/EditArticle";
const Layout = () => {
  const navigate = useNavigate();
  const getCurrentView = useCurrentView();
  const currentViewMemo = useMemo(() => getCurrentView, [getCurrentView]);

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
          currentView={currentViewMemo}
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
            <Route path="/:textArticle/:id" element={<EditArticle />} />

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
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/*" element={<Layout />} />
    </Routes>
  );
}
