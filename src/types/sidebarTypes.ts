export type currentPageType =
  | "dashboard"
  | "editor"
  | "audioEditor"
  | "videoEditor"
  | "drafts"
  | "reverted"
  | "history"
  | "filtered"
  | "newsFeeds";

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
