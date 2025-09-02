export type currentPageType =
  | "dashboard"
  | "editor"
  | "audioEditor"
  | "videoEditor"
  | "drafts"
  | "reverted"
  | "history"
  | "filtered"
  | "newsFeeds"
  | "review-queue"
  | "publish-center"
  | "editor-history"
  | "editor-dashboard"
  | "calendar"
  | "textArticle"
  | "audio"
  | "video";

export interface SidebarTypes {
  onNavigateToNewsFeeds: () => void;
  onNavigateToDrafts: () => void;
  onNavigateToReverted: () => void;
  onNavigateToHistory: () => void;
  onCreateNewTextArticle: () => void;
  onCreateNewAudioArticle: () => void;
  onCreateNewVideoArticle: () => void;
  onNavigateToDashboard: () => void;
  currentView: currentPageType;
}
