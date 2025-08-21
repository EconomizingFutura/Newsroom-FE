import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";

import Dashboard from "@/pages/Dashboard";
import TextArticleEditor from "@/pages/TextArticleEditor";
import AudioArticleEditor from "@/pages/AudioArticleEditor";
import VideoArticleEditor from "@/pages/VideoArticleEditor";
import DraftsPage from "@/pages/DraftsPage";
import RevertedPostPage from "@/pages/RevertedPostPage";
import HistoryLogPage from "@/pages/HistoryLogPage";
import FilteredContentPage from "@/pages/FilteredContentPage";
import NewsFeedsPage from "@/pages/NewsFeedsPage";
import SideBar from "@/components/SideBar";
import Navigation from "@/components/Navigation";

export type currentPageType =
  | "dashboard"
  | "newsFeeds"
  | "drafts"
  | "reverted"
  | "history";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentView = (): currentPageType => {
    if (location.pathname.startsWith("/dashboard")) return "dashboard";
    if (location.pathname.startsWith("/drafts")) return "drafts";
    if (location.pathname.startsWith("/reverted")) return "reverted";
    if (location.pathname.startsWith("/history")) return "history";
    return "newsFeeds"; // default fallback
  };
  return (
    <div>
      <Navigation />
      <div className="min-h-screen flex bg-background">
        <SideBar
          onNavigateToDrafts={() => navigate("/drafts")}
          onNavigateToReverted={() => navigate("/reverted")}
          onNavigateToHistory={() => navigate("/history")}
          onNavigateToNewsFeeds={() => navigate("/news-feeds")}
          onCreateNewTextArticle={() => navigate("/editor")}
          onCreateNewAudioArticle={() => navigate("/editor/audio")}
          onCreateNewVideoArticle={() => navigate("/editor/video")}
          onNavigateToDashboard={() => navigate("/dashboard")}
          currentView={getCurrentView()} // optional, can highlight active based on location
        />
        <div className="flex-1 w-full h-screen overflow-y-auto">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/editor" element={<TextArticleEditor />} />
            <Route path="/editor/audio" element={<AudioArticleEditor />} />
            <Route path="/editor/video" element={<VideoArticleEditor />} />
            <Route path="/drafts" element={<DraftsPage />} />
            <Route path="/reverted" element={<RevertedPostPage />} />
            <Route path="/history" element={<HistoryLogPage />} />
            <Route path="/filtered/:type" element={<FilteredContentPage />} />
            <Route path="/news-feeds" element={<NewsFeedsPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
