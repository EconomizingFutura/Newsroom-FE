import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Grid3X3,
  List,
  Edit,
  Trash2,
  FolderOpen,
} from "lucide-react";
import ContentHeader from "@/components/ContentHeader";

interface DraftsPageProps {
  onEditDraft: (article: any) => void;
  onCreateNewTextArticle: () => void;
  onCreateNewAudioArticle: () => void;
  onCreateNewVideoArticle: () => void;
}

export default function DraftsPage({
  onEditDraft,
  onCreateNewTextArticle,
  onCreateNewAudioArticle,
  onCreateNewVideoArticle,
}: DraftsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Type");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Mock draft articles data
  const draftArticles = [
    {
      id: 1,
      title: "Climate Change Report: Impact on Local Communities",
      type: "Text",
      status: "Auto-saved",
      wordCount: 1247,
      lastUpdated: "15/01/2025",
      timeAgo: "Saved 2 minutes ago",
    },
    {
      id: 2,
      title: "Climate Change Report: Impact on Local Communities",
      type: "Text",
      status: "Auto-saved",
      wordCount: 1247,
      lastUpdated: "15/01/2025",
      timeAgo: "Saved 2 minutes ago",
    },
    {
      id: 3,
      title: "Climate Change Report: Impact on Local Communities",
      type: "Text",
      status: "Auto-saved",
      wordCount: 1247,
      lastUpdated: "15/01/2025",
      timeAgo: "Saved 2 minutes ago",
    },
    // Note: Removed Audio and Video articles to show empty state
  ];

  const filterOptions = ["All Type", "Text", "Audio", "Video"];

  // Filter articles based on active filter
  const filteredArticles = draftArticles.filter((article) => {
    const matchesSearch = article.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType =
      activeFilter === "All Type" || article.type === activeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Text":
        return "bg-blue-100 text-blue-800";
      case "Audio":
        return "bg-purple-100 text-purple-800";
      case "Video":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Auto-saved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderEmptyState = () => {
    const isAudio = activeFilter === "Audio";
    const isVideo = activeFilter === "Video";

    if (!isAudio && !isVideo) return null;

    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
          <FolderOpen className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No {activeFilter} drafts created yet
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Start creating your first draft
        </p>
        <Button
          className="bg-green-600 hover:bg-green-700 text-white gap-2"
          onClick={
            isAudio
              ? onCreateNewAudioArticle
              : isVideo
              ? onCreateNewVideoArticle
              : onCreateNewTextArticle
          }
        >
          <Plus className="w-4 h-4" />
          Create
        </Button>
      </div>
    );
  };

  const renderGridView = () => (
    <div className="grid grid-cols-3 gap-6">
      {filteredArticles.map((article) => (
        <Card
          key={article.id}
          className="p-4 bg-white hover:shadow-md transition-shadow"
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="text-sm font-medium leading-tight pr-2">
                {article.title}
              </h3>
            </div>

            <div className="flex gap-2">
              <Badge className={`text-xs ${getTypeColor(article.type)}`}>
                {article.type}
              </Badge>
              <Badge className={`text-xs ${getStatusColor(article.status)}`}>
                {article.status}
              </Badge>
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              {article.type === "Text" && (
                <div>Updated {article.lastUpdated}</div>
              )}
              <div>
                {article.wordCount > 0
                  ? `${article.wordCount} words`
                  : "Updated 15/01/2025"}
              </div>
              <div className="text-gray-400">{article.timeAgo}</div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-2"
                onClick={() => onEditDraft(article)}
              >
                <Edit className="w-3 h-3" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-3">
      {filteredArticles.map((article) => (
        <Card
          key={article.id}
          className="p-4 bg-white hover:shadow-sm transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {article.title}
                </h3>
                <div className="flex gap-2 flex-shrink-0">
                  <Badge className={`text-xs ${getTypeColor(article.type)}`}>
                    {article.type}
                  </Badge>
                  <Badge
                    className={`text-xs ${getStatusColor(article.status)}`}
                  >
                    {article.status}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>Updated {article.lastUpdated}</span>
                {article.wordCount > 0 && (
                  <span>{article.wordCount} words</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4">
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white gap-2"
                onClick={() => onEditDraft(article)}
              >
                <Edit className="w-3 h-3" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 w-8 h-8 p-0"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="flex-1 py-16 h-screen bg-gray-50">
      {/* Main Content */}
      <div className=" flex flex-col">
        {/* Top Header */}
        <ContentHeader
          text="Drafts"
          description="Your saved drafts and work in progress."
          number={filteredArticles.length}
          iconName="Drafts"
          showGrid
          onClickGridList={[
            () => setViewMode("grid"),
            () => setViewMode("list"),
            viewMode,
          ]}
        />

        {/* Search and Filters */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search Drafts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>

              <div className="flex gap-2">
                {filterOptions.map((filter) => (
                  <Button
                    key={filter}
                    variant={activeFilter === filter ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter(filter)}
                    className={
                      activeFilter === filter ? "bg-gray-900 text-white" : ""
                    }
                  >
                    {filter}
                  </Button>
                ))}
              </div>
            </div>

            <div className=" hidden items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area - Show empty state or filtered content */}
        <div className="flex-1 p-6 bg-gray-50">
          {filteredArticles.length === 0
            ? renderEmptyState()
            : viewMode === "grid"
            ? renderGridView()
            : renderListView()}
        </div>
      </div>
    </div>
  );
}
