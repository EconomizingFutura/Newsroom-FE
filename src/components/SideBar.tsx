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
      ? "bg-[#00A652] text-white rounded-md"
      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900";

  return (
    <div className="w-60 mt-16 py-4 bg-[#F8FAF9] border-r border-gray-200 flex flex-col">
      <div className="flex-1 px-4">
        {/* Top Menu */}
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className={`w-full justify-between px-3 py-2 ${isActive(
              "newsFeeds"
            )}`}
            onClick={onNavigateToNewsFeeds}
          >
            <span className="flex items-center gap-2">
              <Rss className="w-4 h-4" />
              Agency Feeds
            </span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onNavigateToDashboard}
            className={`w-full justify-start px-3 py-2 ${isActive(
              "dashboard"
            )}`}
          >
            <Users className="w-4 h-4 mr-2" />
            Dashboard
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={`w-full justify-between px-3 py-2 ${isActive("drafts")}`}
            onClick={onNavigateToDrafts}
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Drafts
            </span>
            <span className="bg-green-600 text-white text-xs font-medium px-2 rounded-full">
              4
            </span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={`w-full justify-between px-3 py-2 ${isActive(
              "reverted"
            )}`}
            onClick={onNavigateToReverted}
          >
            <span className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Reverted Post
            </span>
            <span className="bg-red-500 text-white text-xs font-medium px-2 rounded-full">
              4
            </span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={`w-full justify-start px-3 py-2 ${isActive("history")}`}
            onClick={onNavigateToHistory}
          >
            <History className="w-4 h-4 mr-2" />
            History Log
          </Button>
        </div>

        <Separator className="my-4 bg-gray-200 h-px" />

        {/* Quick Create */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-1">
            Quick Create
          </h4>
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              onClick={onCreateNewTextArticle}
            >
              <FileText className="w-4 h-4" />
              Text Article
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              onClick={onCreateNewAudioArticle}
            >
              <Mic className="w-4 h-4" />
              Audio Post
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              onClick={onCreateNewVideoArticle}
            >
              <Video className="w-4 h-4" />
              Video Post
            </Button>
          </div>
        </div>

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
