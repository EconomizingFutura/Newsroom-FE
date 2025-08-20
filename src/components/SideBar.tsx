import React from "react";
import { Button } from "./ui/button";
import {
  FileText,
  Heart,
  History,
  Mic,
  Plus,
  Radio,
  RotateCcw,
  Rss,
  Users,
  Video,
} from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import type { currentPageType, SidebarTypes } from "../types/sidebarTypes";

const SideBar: React.FC<SidebarTypes> = ({
  onNavigateToNewsFeeds,
  onNavigateToDrafts,
  onNavigateToReverted,
  onNavigateToHistory,
  onCreateNewTextArticle,
  onCreateNewAudioArticle,
  onCreateNewVideoArticle,
  onNavigateToDashboard,
  currentView,
}) => {
  const isActive = (view: currentPageType) =>
    currentView === view
      ? "bg-green-600 text-white hover:bg-green-700"
      : "hover:bg-accent hover:text-accent-foreground";
  return (
    <div className="w-64 mt-16 py-2 bg-[#F8FAF9] border-r border-border flex flex-col">
      <div className="flex-1 p-4">
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className={`w-full justify-start gap-2 ${isActive("newsFeeds")}}`}
            onClick={onNavigateToNewsFeeds}
          >
            <Radio className="w-4 h-4" />
            Agency Feeds
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onNavigateToDashboard}
            className={`w-full justify-start gap-2 ${isActive("dashboard")}}`}
          >
            <Users className="w-4 h-4" />
            Dashboard
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`w-full justify-start gap-2 ${isActive("drafts")}}`}
            onClick={onNavigateToDrafts}
          >
            <FileText className="w-4 h-4" />
            Drafts
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`w-full justify-start gap-2 ${isActive("reverted")}}`}
            onClick={onNavigateToReverted}
          >
            <RotateCcw className="w-4 h-4" />
            Reverted Post
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`w-full justify-start gap-2 ${isActive("history")}}`}
            onClick={onNavigateToHistory}
          >
            <History className="w-4 h-4" />
            History Log
          </Button>
        </div>

        <Separator className="my-4" />

        {/* Quick Create */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Quick Create
          </h4>
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={onCreateNewTextArticle}
            >
              <FileText className="w-4 h-4" />
              Text Article
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`w-full justify-start gap-2 ${isActive(
                "audioEditor"
              )}}`}
              onClick={onCreateNewAudioArticle}
            >
              <Mic className="w-4 h-4" />
              Audio Post
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`w-full justify-start gap-2 ${isActive(
                "videoEditor"
              )}}`}
              onClick={onCreateNewVideoArticle}
            >
              <Video className="w-4 h-4" />
              Video Post
            </Button>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Multi Window */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Multi Window
          </h4>
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className={`w-full justify-start gap-2 ${isActive("newsFeeds")}}`}
              onClick={onNavigateToNewsFeeds}
            >
              <Rss className="w-4 h-4" />
              News Feeds
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`w-full justify-start gap-2 ${isActive("drafts")}}`}
              onClick={onCreateNewTextArticle}
            >
              <Plus className="w-4 h-4" />
              Create Article
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`w-full justify-start gap-2 ${isActive("reverted")}}`}
              onClick={onNavigateToReverted}
            >
              <RotateCcw className="w-4 h-4" />
              Reverted Post
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`w-full justify-start gap-2 ${isActive("drafts")}}`}
              onClick={onNavigateToDrafts}
            >
              <FileText className="w-4 h-4" />
              Drafts
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2"
            >
              <Heart className="w-4 h-4" />
              Favourites
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
