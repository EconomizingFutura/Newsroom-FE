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
  const [activeFilter, setActiveFilter] = useState("All Type");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Mock reverted articles data
  const revertedArticles = [
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
    setActiveFilter(filter);

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
        <Card
          key={article.id}
          className="p-4 bg-white border-red-200 hover:shadow-md transition-shadow"
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="text-sm font-medium leading-tight pr-2">
                {article.title}
              </h3>
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            </div>

            <div className="flex gap-2">
              <Badge className={`text-xs ${getTypeColor(article.type)}`}>
                {article.type}
              </Badge>
              <Badge className="text-xs bg-red-100 text-red-800">
                {article.status}
              </Badge>
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <div>Reverted {article.lastUpdated}</div>
              <div>{article.wordCount} words</div>
              <div className="text-red-600">Editor: {article.editor}</div>
            </div>

            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="text-xs font-medium text-red-800 mb-1">
                Revision Required
              </div>
              <div className="text-xs text-red-700 leading-relaxed">
                {article.reason}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                className="flex-1 bg-red-600 hover:bg-red-700 text-white gap-2"
                onClick={() => onEditReverted(article)}
              >
                <Eye className="w-3 h-3" />
                View Details
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
        />

        {/* Search and Filters */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search Reverted Posts..."
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
                    onClick={() => handleFilterClick(filter)}
                    className={
                      activeFilter === filter ? "bg-gray-900 text-white" : ""
                    }
                  >
                    {filter}
                  </Button>
                ))}
              </div>
            </div>

            <div className="hidden items-center gap-2">
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
