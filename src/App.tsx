import React, { useState } from "react";
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
import type { currentPageType } from "./types/sidebarTypes";
import TextArticleTest from "./pages/TextArticleTest";
import LoginPage from "./pages/LoginPage";
import cijlogo from "./assets/cijlogo.png";
import { Bell } from "lucide-react";
import Navigation from "./components/Navigation";

export default function App() {
  const [currentView, setCurrentView] = useState<currentPageType>("dashboard");
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [filterType, setFilterType] = useState<string>("All Type");

  const navigateToEditor = (article?: any) => {
    setSelectedArticle(article);

    // Check article type and navigate to appropriate editor
    if (article && article.type === "Audio") {
      setCurrentView("audioEditor");
    } else if (article && article.type === "Video") {
      setCurrentView("videoEditor");
    } else {
      setCurrentView("editor");
    }
  };

  const navigateToTextEditor = (article?: any) => {
    setSelectedArticle(article);
    setCurrentView("editor");
  };

  const navigateToAudioEditor = (article?: any) => {
    setSelectedArticle(article);
    setCurrentView("audioEditor");
  };

  const navigateToVideoEditor = (article?: any) => {
    setSelectedArticle(article);
    setCurrentView("videoEditor");
  };

  const createNewTextArticle = () => {
    setSelectedArticle(null); // No article means creating new
    setCurrentView("editor");
  };

  const createNewAudioArticle = () => {
    setSelectedArticle(null); // No article means creating new
    setCurrentView("audioEditor");
  };

  const createNewVideoArticle = () => {
    setSelectedArticle(null); // No article means creating new
    setCurrentView("videoEditor");
  };

  const navigateToDashboard = () => {
    setCurrentView("dashboard");
    setSelectedArticle(null);
  };

  const navigateToDrafts = () => {
    setCurrentView("drafts");
    setSelectedArticle(null);
  };

  const navigateToReverted = () => {
    setCurrentView("reverted");
    setSelectedArticle(null);
  };

  const navigateToHistory = () => {
    setCurrentView("history");
    setSelectedArticle(null);
  };

  const navigateToNewsFeeds = () => {
    setCurrentView("newsFeeds");
    setSelectedArticle(null);
  };

  const navigateToFilteredContent = (contentType: string) => {
    setFilterType(contentType);
    setCurrentView("filtered");
    setSelectedArticle(null);
  };

  return (
    <div>
      <Navigation />
      <div className="min-h-screen flex bg-background">
        <SideBar
          onNavigateToDrafts={navigateToDrafts}
          onNavigateToReverted={navigateToReverted}
          onNavigateToHistory={navigateToHistory}
          onNavigateToNewsFeeds={navigateToNewsFeeds}
          onCreateNewTextArticle={createNewTextArticle}
          onCreateNewAudioArticle={createNewAudioArticle}
          onCreateNewVideoArticle={createNewVideoArticle}
          onNavigateToDashboard={navigateToDashboard}
          currentView={currentView}
        />
        <div className="flex-1 w-full h-screen overflow-y-auto ">
          {currentView === "dashboard" && (
            <Dashboard
              onEditStory={navigateToEditor}
              onNavigateToDrafts={navigateToDrafts}
              onNavigateToReverted={navigateToReverted}
              onNavigateToHistory={navigateToHistory}
              onNavigateToNewsFeeds={navigateToNewsFeeds}
              onCreateNewTextArticle={createNewTextArticle}
              onCreateNewAudioArticle={createNewAudioArticle}
              onCreateNewVideoArticle={createNewVideoArticle}
            />
          )}
          {currentView === "editor" && (
            <TextArticleEditor
              article={selectedArticle}
              onBack={navigateToDashboard}
              onNavigateToNewsFeeds={navigateToNewsFeeds}
            />
          )}
          {currentView === "audioEditor" && (
            <AudioArticleEditor
              article={selectedArticle}
              onBack={() => setCurrentView("filtered")}
              onNavigateToNewsFeeds={navigateToNewsFeeds}
            />
          )}
          {currentView === "videoEditor" && (
            <VideoArticleEditor
              article={selectedArticle}
              onBack={navigateToDashboard}
              onNavigateToNewsFeeds={navigateToNewsFeeds}
            />
          )}
          {currentView === "drafts" && (
            <DraftsPage
              onEditDraft={navigateToEditor}
              onNavigateToDashboard={navigateToDashboard}
              onNavigateToReverted={navigateToReverted}
              onNavigateToHistory={navigateToHistory}
              onNavigateToNewsFeeds={navigateToNewsFeeds}
              onCreateNewTextArticle={createNewTextArticle}
              onCreateNewAudioArticle={createNewAudioArticle}
              onCreateNewVideoArticle={createNewVideoArticle}
            />
          )}
          {currentView === "reverted" && (
            <RevertedPostPage
              onEditReverted={navigateToEditor}
              onNavigateToDashboard={navigateToDashboard}
              onNavigateToDrafts={navigateToDrafts}
              onNavigateToHistory={navigateToHistory}
              onNavigateToFilteredContent={navigateToFilteredContent}
              onNavigateToNewsFeeds={navigateToNewsFeeds}
              onCreateNewTextArticle={createNewTextArticle}
              onCreateNewAudioArticle={createNewAudioArticle}
              onCreateNewVideoArticle={createNewVideoArticle}
            />
          )}
          {currentView === "history" && (
            <HistoryLogPage
              onViewArticle={navigateToEditor}
              onNavigateToDashboard={navigateToDashboard}
              onNavigateToDrafts={navigateToDrafts}
              onNavigateToReverted={navigateToReverted}
              onNavigateToNewsFeeds={navigateToNewsFeeds}
              onCreateNewTextArticle={createNewTextArticle}
              onCreateNewAudioArticle={createNewAudioArticle}
              onCreateNewVideoArticle={createNewVideoArticle}
            />
          )}
          {currentView === "filtered" && (
            <FilteredContentPage
              contentType={filterType}
              onViewArticle={navigateToEditor}
              onNavigateToDashboard={navigateToDashboard}
              onNavigateToDrafts={navigateToDrafts}
              onNavigateToReverted={navigateToReverted}
              onNavigateToHistory={navigateToHistory}
              onNavigateToNewsFeeds={navigateToNewsFeeds}
              onCreateNewVideoArticle={createNewVideoArticle}
            />
          )}
          {currentView === "newsFeeds" && (
            <NewsFeedsPage
              onNavigateToDashboard={navigateToDashboard}
              onNavigateToDrafts={navigateToDrafts}
              onNavigateToReverted={navigateToReverted}
              onNavigateToHistory={navigateToHistory}
              onCreateNewTextArticle={createNewTextArticle}
              onCreateNewAudioArticle={createNewAudioArticle}
              onCreateNewVideoArticle={createNewVideoArticle}
            />
          )}
        </div>
      </div>
    </div>
  );
}
