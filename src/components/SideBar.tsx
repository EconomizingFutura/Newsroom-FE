import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  FileText,
  Heart,
  History,
  Mic,
  Plus,
  RotateCcw,
  Rss,
  Users,
  Video,
} from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import type { currentPageType } from "../types/sidebarTypes";
import { cn } from "./ui/utils";

export type UserRole = "reporter" | "editor";

export interface SidebarTypes {
  onNavigateToNewsFeeds: () => void;
  onNavigateToDrafts: () => void;
  onNavigateToReverted: () => void;
  onNavigateToHistory: () => void;
  onCreateNewTextArticle: () => void;
  onCreateNewAudioArticle: () => void;
  onCreateNewVideoArticle: () => void;
  onNavigateToDashboard: () => void;
  onNavigateEditorDashboard: () => void;
  onNavigateEditorCalendarView: () => void;
  onNavigateEditorPublishCenter: () => void;
  onNavigateEditorReviewQueue: () => void;
  onNavigateEditorHistory: () => void;
  currentView: currentPageType;
}

const menuConfig = {
  reporter: [
    {
      key: "newsFeeds",
      label: "Agency Feeds",
      icon: <Rss className="w-4 h-4" />,
      action: "onNavigateToNewsFeeds",
    },
    {
      key: "dashboard",
      label: "Dashboard",
      icon: <Users className="w-4 h-4" />,
      action: "onNavigateToDashboard",
    },
    {
      key: "drafts",
      label: "Drafts",
      icon: <FileText className="w-4 h-4" />,
      action: "onNavigateToDrafts",
      badge: 4,
    },
    {
      key: "reverted",
      label: "Reverted Post",
      icon: <RotateCcw className="w-4 h-4" />,
      action: "onNavigateToReverted",
      badge: 4,
    },
    {
      key: "history",
      label: "History Log",
      icon: <History className="w-4 h-4" />,
      action: "onNavigateToHistory",
    },
  ],
  editor: [
    {
      key: "newsFeeds",
      label: "Agency Feeds",
      icon: <Rss className="w-4 h-4" />,
      action: "onNavigateToNewsFeeds",
    },
    {
      key: "editor-dashboard",
      label: "Dashboard",
      icon: <Users className="w-4 h-4" />,
      action: "onNavigateEditorDashboard",
    },
    {
      key: "review-queue",
      label: "Review Queue",
      icon: <FileText className="w-4 h-4" />,
      action: "onNavigateEditorReviewQueue",
      badge: 4,
    },
    {
      key: "publish-center",
      label: "Publish Center",
      icon: <RotateCcw className="w-4 h-4" />,
      action: "onNavigateEditorPublishCenter",
      badge: 4,
    },
    {
      key: "calendar",
      label: "Calendar",
      icon: <Users className="w-4 h-4" />,
      action: "onNavigateEditorCalendarView",
    },
    {
      key: "editor-history",
      label: "History Log",
      icon: <History className="w-4 h-4" />,
      action: "onNavigateEditorHistory",
    },
  ],
};

const SideBar: React.FC<SidebarTypes> = (props) => {
  const {
    onCreateNewTextArticle,
    onCreateNewAudioArticle,
    onCreateNewVideoArticle,
    currentView,
  } = props;
  const currentRole: UserRole = "reporter";
  const [multiWindow, setMultiWindow] = useState({
    newsFeeds: false,
    createArticle: false,
    reverted: false,
    drafts: false,
    favourites: false,
  });

  const toggleCheckbox = (key: keyof typeof multiWindow) => {
    setMultiWindow((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isActive = (view: currentPageType) =>
    currentView === view
      ? "bg-[#00A652] hover:bg-[#00A652] hover:text-white text-white rounded-md"
      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900";

  return (
    <div className="w-60 mt-16 py-4 bg-[#F8FAF9] border-r border-gray-200 flex flex-col">
      <div className="flex-1 px-4">
        {/* Top Menu */}
        <div className="space-y-1">
          {menuConfig[currentRole].map((item) => {
            return (
              <Button
                variant="ghost"
                size="sm"
                key={item.key}
                className={`w-full justify-between px-3 py-2 ${isActive(
                  item.key as currentPageType
                )}`}
                onClick={props[item.action as keyof SidebarTypes] as () => void}
              >
                <span className="flex items-center gap-2">
                  {item.icon}
                  {item.label}
                </span>
                {item.badge && (
                  <span
                    className={cn(
                      "bg-green-600 text-white text-xs font-medium px-2 rounded-full",
                      item.key === "reverted"
                        ? "border border-[#FFC9C9] bg-[#ffe2e2] text-red-500"
                        : "bg-[#D9F2D9] border border-[#B3E6B3] text-[#006601]"
                    )}
                  >
                    4
                  </span>
                )}
              </Button>
            );
          })}
        </div>

        {/* Quick Create */}
        {currentRole === "reporter" && (
          <>
            <Separator className="my-4 bg-gray-200 h-px" />
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-1">
                Quick Create
              </h4>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                    isActive("textArticle")
                  )}
                  onClick={onCreateNewTextArticle}
                >
                  <FileText className="w-4 h-4" />
                  Text Article
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                    isActive("audio")
                  )}
                  onClick={onCreateNewAudioArticle}
                >
                  <Mic className="w-4 h-4" />
                  Audio Post
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                    isActive("video")
                  )}
                  onClick={onCreateNewVideoArticle}
                >
                  <Video className="w-4 h-4" />
                  Video Post
                </Button>
              </div>
            </div>
          </>
        )}

        <Separator className="my-4 bg-gray-200 h-px" />

        {/* Multi Window */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-1">
            Multi Window
          </h4>
          <div className="space-y-1 text-sm text-gray-700">
            {[
              {
                key: "newsFeeds",
                label: "News Feeds",
                icon: <Rss className="w-4 h-4" />,
              },
              {
                key: "createArticle",
                label: "Create Article",
                icon: <Plus className="w-4 h-4" />,
              },
              {
                key: "reverted",
                label: "Reverted Post",
                icon: <RotateCcw className="w-4 h-4" />,
              },
              {
                key: "drafts",
                label: "Drafts",
                icon: <FileText className="w-4 h-4" />,
              },
              {
                key: "favourites",
                label: "Favourites",
                icon: <Heart className="w-4 h-4" />,
              },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 rounded-md"
              >
                <input
                  type="checkbox"
                  checked={multiWindow[item.key as keyof typeof multiWindow]}
                  onChange={() =>
                    toggleCheckbox(item.key as keyof typeof multiWindow)
                  }
                  className="w-4 h-4 accent-green-600"
                />
                {item.icon}
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
