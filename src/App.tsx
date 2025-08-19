import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import TextArticleEditor from "./components/TextArticleEditor";
import AudioArticleEditor from "./components/AudioArticleEditor";
import VideoArticleEditor from "./components/VideoArticleEditor";
import DraftsPage from "./components/DraftsPage";
import RevertedPostPage from "./components/RevertedPostPage";
import HistoryLogPage from "./components/HistoryLogPage";
import FilteredContentPage from "./components/FilteredContentPage";
import NewsFeedsPage from "./components/NewsFeedsPage";

export default function App() {
  const [currentView, setCurrentView] = useState<
    | "dashboard"
    | "editor"
    | "audioEditor"
    | "videoEditor"
    | "drafts"
    | "reverted"
    | "history"
    | "filtered"
    | "newsFeeds"
  >("dashboard");
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
    <div className="min-h-screen bg-background">
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
  );
}
