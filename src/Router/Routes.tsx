import React, { useEffect, useMemo } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";

import Dashboard from "@/pages/Reporter/Dashboard";
import ContentUploader from "@/pages/Reporter/ArticleCreation/ContentUploader";
import DraftsPage from "@/pages/Reporter/DraftsPage";
import RevertedPostPage from "@/pages/Reporter/RevertedPost/RevertedPostPage";
import HistoryLogPage from "@/pages/HistoryLogPage";
import NewsFeedsPage from "@/pages/NewsFeedsPage";
import SideBar from "@/components/SideBar";
import Navigation from "@/components/Navigation";
import { HistoryLog } from "@/pages/Editor/HistoryLog";
import { PublishCenter } from "@/pages/Editor/PublishCenter";
import { ReviewQueue } from "@/pages/Editor/ReviewQueue";
import { Dashboard as EditorDashboard } from "@/pages/Editor/Dashboard";
import LoginPage from "@/pages/Shared/LoginPage";
import { useCurrentView } from "@/hooks/useCurrentView";
import EditArticle from "@/pages/EditArticle";
import AuthRoute from "./AuthRoutes";
import ProtectedRoutes from "./ProtectedRoutes";
import PublicRoute from "./PublicRoutes";
import ViewContent from "@/pages/Editor/ViewContent";
import CalendarPage from "@/pages/Editor/CalendarPage";
const Layout: React.FC = () => {
  const navigate = useNavigate();
  const getCurrentView = useCurrentView();
  const currentViewMemo = useMemo(() => getCurrentView, [getCurrentView]);
  const location = useLocation();
  const routeTitles: Record<string, string> = {
    "/news-feeds": "Agency Feeds",
    "/dashboard": "Dashboard",
    "/drafts": "Drafts",
    "/reverted": "Reverted Post",
    "/history": "History Log",
    "/textArticle": "Text Article",
    "/audio": "Audio",
    "/video": "Video",
    "/login": "Login",
    "/reviewQueue": "Review Queue",
    "/calendarView": "calendar",
    "/publishCenter": "Publish Center",
  };

  useEffect(() => {
    function getTitle(pathname: string, fallback = "CIJ NewsRoom") {
      const path = pathname.toLowerCase();
      const match = Object.entries(routeTitles).find(([key]) => {
        const k = key.toLowerCase();
        return path === k || path.startsWith(k + "/");
      });
      return match?.[1] ?? fallback;
    }
    const title = "CIJ NewsRoom - " + getTitle(location.pathname);
    document.title = title;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);
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
            <Route
              path="/dashboard"
              element={
                <AuthRoute>
                  <ProtectedRoutes allowedRoles="REPORTER">
                    <Dashboard />
                  </ProtectedRoutes>
                </AuthRoute>
              }
            />
            <Route
              path="/textArticle"
              element={
                <AuthRoute>
                  <ProtectedRoutes allowedRoles="REPORTER">
                    <ContentUploader />
                  </ProtectedRoutes>
                </AuthRoute>
              }
            />
            <Route
              path="/audio"
              element={
                <AuthRoute>
                  <ProtectedRoutes allowedRoles="REPORTER">
                    <ContentUploader />
                  </ProtectedRoutes>
                </AuthRoute>
              }
            />
            <Route
              path="/video"
              element={
                <AuthRoute>
                  <ProtectedRoutes allowedRoles="REPORTER">
                    <ContentUploader />
                  </ProtectedRoutes>
                </AuthRoute>
              }
            />
            <Route
              path="/drafts"
              element={
                <AuthRoute>
                  <ProtectedRoutes allowedRoles="REPORTER">
                    <DraftsPage />
                  </ProtectedRoutes>
                </AuthRoute>
              }
            />

            <Route
              path="/reverted"
              element={
                <AuthRoute>
                  <ProtectedRoutes allowedRoles="REPORTER">
                    <RevertedPostPage />
                  </ProtectedRoutes>
                </AuthRoute>
              }
            />

            <Route
              path="/history"
              element={
                <AuthRoute>
                  <ProtectedRoutes allowedRoles="REPORTER">
                    <HistoryLogPage />
                  </ProtectedRoutes>
                </AuthRoute>
              }
            />

            <Route
              path="/news-feeds"
              element={
                <AuthRoute>
                  {/* <ProtectedRoutes allowedRoles="REPORTER"> */}
                  <NewsFeedsPage />
                  {/* </ProtectedRoutes> */}
                </AuthRoute>
              }
            />

            <Route
              path="/:textArticle/:id"
              element={
                <AuthRoute>
                  <ProtectedRoutes allowedRoles="REPORTER">
                    <EditArticle />
                  </ProtectedRoutes>
                </AuthRoute>
              }
            />

            {/* Editor */}
            <Route
              path="/editor/dashboard"
              element={
                <AuthRoute>
                  <ProtectedRoutes allowedRoles="EDITOR">
                    <EditorDashboard />
                  </ProtectedRoutes>
                </AuthRoute>
              }
            />

            <Route
              path="/editor/news-feeds"
              element={
                <AuthRoute>
                  <ProtectedRoutes allowedRoles="EDITOR">
                    <NewsFeedsPage />
                  </ProtectedRoutes>
                </AuthRoute>
              }
            />
            <Route
              path="/editor/calendarView"
              element={
                <AuthRoute>
                  <ProtectedRoutes allowedRoles="EDITOR">
                    <CalendarPage />
                  </ProtectedRoutes>
                </AuthRoute>
              }
            />

            <Route
              path="/editor/history"
              element={
                <AuthRoute>
                  <ProtectedRoutes allowedRoles="EDITOR">
                    <HistoryLog />
                  </ProtectedRoutes>
                </AuthRoute>
              }
            />

            <Route
              path="/editor/publishCenter"
              element={
                <AuthRoute>
                  <ProtectedRoutes allowedRoles="EDITOR">
                    <PublishCenter />
                  </ProtectedRoutes>
                </AuthRoute>
              }
            />

            <Route
              path="/editor/reviewQueue"
              element={
                <AuthRoute>
                  <ProtectedRoutes allowedRoles="EDITOR">
                    <ReviewQueue />
                  </ProtectedRoutes>
                </AuthRoute>
              }
            />
            <Route
              path="/editor/viewcontent/:id"
              element={
                <AuthRoute>
                  <ProtectedRoutes allowedRoles="EDITOR">
                    <ViewContent />
                  </ProtectedRoutes>
                </AuthRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/*" element={<Layout />} />
    </Routes>
  );
}
