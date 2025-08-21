import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  RotateCcw,
  Search,
  Grid3X3,
  List,
  Eye,
  AlertCircle,
} from "lucide-react";
import ContentHeader from "@/components/ContentHeader";
import SearchFilterTab from "@/components/SearchFilterTab";
import SharedCard from "@/components/shared/Card";

interface RevertedPostPageProps {
  onEditReverted: (article: any) => void;
  onNavigateToDashboard: () => void;
  onNavigateToDrafts: () => void;
  onNavigateToHistory: () => void;
  onNavigateToFilteredContent: (contentType: string) => void;
  onCreateNewTextArticle: () => void;
  onCreateNewAudioArticle: () => void;
  onCreateNewVideoArticle: () => void;
}

export default function RevertedPostPage({
  onEditReverted,
  onNavigateToFilteredContent,
}: RevertedPostPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "All Type" | "Text" | "Audio" | "Video"
  >("All Type");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  type ArticleType = "Text" | "Audio" | "Video";
  type ArticleStatus = "Auto-saved" | "Reverted";
  interface RevertedArticle {
    id: number;
    title: string;
    type: ArticleType;
    status: ArticleStatus;
    wordCount: number;
    lastUpdated: string;
    timeAgo: string;
    reason: string;
    editor: string;
  }
  // Mock reverted articles data
  const revertedArticles: RevertedArticle[] = [
    {
      id: 1,
      title: "Climate Change Report: Impact on Local Communities",
      type: "Text",
      status: "Reverted",
      wordCount: 1247,
      lastUpdated: "14/01/2025",
      timeAgo: "Reverted 1 day ago",
      reason:
        "Factual inconsistencies found in paragraph 3. Sources need verification.",
      editor: "John Smith",
    },
    {
      id: 2,
      title: "Economic Impact of Local Business Closures",
      type: "Text",
      status: "Reverted",
      wordCount: 892,
      lastUpdated: "13/01/2025",
      timeAgo: "Reverted 2 days ago",
      reason: "Article lacks supporting evidence for statistical claims.",
      editor: "Sarah Johnson",
    },
    {
      id: 3,
      title: "Traffic Management Solutions for City Center",
      type: "Text",
      status: "Reverted",
      wordCount: 1156,
      lastUpdated: "12/01/2025",
      timeAgo: "Reverted 3 days ago",
      reason: "Interview quotes need verification and proper attribution.",
      editor: "Mike Davis",
    },
  ];

  const filterOptions = ["All Type", "Text", "Audio", "Video"];

  // Filter articles based on active filter
  const filteredArticles = revertedArticles.filter((article) => {
    const matchesSearch = article.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType =
      activeFilter === "All Type" || article.type === activeFilter;
    return matchesSearch && matchesType;
  });

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter as "All Type" | "Text" | "Audio" | "Video");

    // Navigate to filtered content page for specific content types
    if (filter !== "All Type") {
      onNavigateToFilteredContent(filter);
    }
  };

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

  const renderGridView = () => (
    <div className="grid grid-cols-3 gap-6">
      {filteredArticles.map((article) => (
        <SharedCard
          key={article.id}
          title={article.title}
          updatedDate={article.lastUpdated}
          wordCount={article.wordCount}
          savedTime={article.timeAgo}
          type={article.type}
          status={article.status}
          remarkMessage={article.reason}
          contentPreview={article.title}
        />
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-3">
      {filteredArticles.map((article) => (
        <Card
          key={article.id}
          className="p-4 bg-white border-red-200 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-start gap-4">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className={`text-xs ${getTypeColor(article.type)}`}>
                      {article.type}
                    </Badge>
                    <Badge className="text-xs bg-red-100 text-red-800">
                      {article.status}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      Reverted {article.lastUpdated} • {article.wordCount} words
                      • Editor: {article.editor}
                    </span>
                  </div>
                </div>

                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white gap-2 ml-4"
                  onClick={() => onEditReverted(article)}
                >
                  <Eye className="w-3 h-3" />
                  View Details
                </Button>
              </div>

              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="text-xs font-medium text-red-800 mb-1">
                  Revision Required
                </div>
                <div className="text-xs text-red-700 leading-relaxed">
                  {article.reason}
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className=" flex-1 py-16 h-screen bg-gray-50">
      {/* Main Content */}
      <div className=" flex flex-col">
        <ContentHeader
          text="Reverted Post"
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
        <SearchFilterTab
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterOptions={filterOptions}
          activeFilter={activeFilter}
          setActiveFilter={(filter: string) =>
            setActiveFilter(filter as "All Type" | "Text" | "Audio" | "Video")
          }
        />
        {/* Content Area */}
        <div className="flex-1 p-6 bg-gray-50">
          {filteredArticles.length > 0 ? (
            viewMode === "grid" ? (
              renderGridView()
            ) : (
              renderListView()
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <RotateCcw className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No reverted posts found
              </h3>
              <p className="text-sm text-gray-500">
                All your articles are in good standing
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
