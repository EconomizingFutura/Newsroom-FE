import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Mic,
  Video,
  Search,
  Grid3X3,
  List,
  Eye,
  Bell,
  ArrowLeft,
  Filter,
} from "lucide-react";

interface FilteredContentPageProps {
  contentType: string;
  onViewArticle: (article: any) => void;
  onNavigateToDashboard: () => void;
  onNavigateToDrafts: () => void;
  onNavigateToReverted: () => void;
  onNavigateToHistory: () => void;
  onCreateNewVideoArticle?: () => void;
}

export default function FilteredContentPage({
  contentType,
  onViewArticle,
  onNavigateToReverted,
}: FilteredContentPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState("All Status");

  // Mock filtered content data based on content type
  const getFilteredContent = () => {
    if (contentType === "Text") {
      return [
        {
          id: 1,
          title: "Climate Change Report: Impact on Local Communities",
          type: "Text",
          status: "Approved",
          wordCount: 1247,
          lastUpdated: "15/01/2025",
          timeAgo: "2 minutes ago",
          category: "Environment",
        },
        {
          id: 2,
          title: "Economic Impact Analysis of New Policies",
          type: "Text",
          status: "Draft",
          wordCount: 892,
          lastUpdated: "14/01/2025",
          timeAgo: "1 day ago",
          category: "Economics",
        },
        {
          id: 3,
          title: "Local Elections: Candidate Profiles",
          type: "Text",
          status: "Submitted",
          wordCount: 1156,
          lastUpdated: "13/01/2025",
          timeAgo: "2 days ago",
          category: "Politics",
        },
      ];
    } else if (contentType === "Audio") {
      return [
        {
          id: 1,
          title: "Weekly News Podcast - Episode 15",
          type: "Audio",
          status: "Approved",
          duration: "25:34",
          lastUpdated: "15/01/2025",
          timeAgo: "3 hours ago",
          category: "Podcast",
        },
        {
          id: 2,
          title: "Interview with Mayor Johnson",
          type: "Audio",
          status: "Draft",
          duration: "18:42",
          lastUpdated: "14/01/2025",
          timeAgo: "1 day ago",
          category: "Interview",
        },
      ];
    } else if (contentType === "Video") {
      return [
        {
          id: 1,
          title: "Breaking News: City Council Meeting",
          type: "Video",
          status: "Approved",
          duration: "12:45",
          lastUpdated: "15/01/2025",
          timeAgo: "5 hours ago",
          category: "News",
        },
        {
          id: 2,
          title: "Feature Story: Local Artist Spotlight",
          type: "Video",
          status: "Submitted",
          duration: "8:30",
          lastUpdated: "13/01/2025",
          timeAgo: "2 days ago",
          category: "Feature",
        },
      ];
    }
    return [];
  };

  const filteredContent = getFilteredContent();

  const getContentIcon = () => {
    switch (contentType) {
      case "Text":
        return <FileText className="w-5 h-5" />;
      case "Audio":
        return <Mic className="w-5 h-5" />;
      case "Video":
        return <Video className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getContentColor = () => {
    switch (contentType) {
      case "Text":
        return "text-blue-600";
      case "Audio":
        return "text-purple-600";
      case "Video":
        return "text-orange-600";
      default:
        return "text-blue-600";
    }
  };

  const getContentBgColor = () => {
    switch (contentType) {
      case "Text":
        return "bg-blue-100";
      case "Audio":
        return "bg-purple-100";
      case "Video":
        return "bg-orange-100";
      default:
        return "bg-blue-100";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Submitted":
        return "bg-blue-100 text-blue-800";
      case "Draft":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewArticle = (item: any) => {
    // Ensure the item has the correct type for proper navigation
    const articleWithType = {
      ...item,
      type: contentType,
    };
    onViewArticle(articleWithType);
  };

  const renderGridView = () => (
    <div className="grid grid-cols-3 gap-6">
      {filteredContent.map((item) => (
        <Card
          key={item.id}
          className="p-4 bg-white hover:shadow-md transition-shadow"
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="text-sm font-medium leading-tight pr-2">
                {item.title}
              </h3>
              <div
                className={`w-6 h-6 rounded flex items-center justify-center ${getContentBgColor()}`}
              >
                <span className={getContentColor()}>{getContentIcon()}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Badge
                className={`text-xs bg-${
                  contentType === "Text"
                    ? "blue"
                    : contentType === "Audio"
                    ? "purple"
                    : "orange"
                }-100 text-${
                  contentType === "Text"
                    ? "blue"
                    : contentType === "Audio"
                    ? "purple"
                    : "orange"
                }-800`}
              >
                {item.type}
              </Badge>
              <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                {item.status}
              </Badge>
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <div>Updated {item.lastUpdated}</div>
              <div>
                {item.wordCount
                  ? `${item.wordCount} words`
                  : `Duration: ${item.duration}`}
              </div>
              <div className="text-gray-400">{item.timeAgo}</div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-2"
                onClick={() => handleViewArticle(item)}
              >
                <Eye className="w-3 h-3" />
                View
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-3">
      {filteredContent.map((item) => (
        <Card
          key={item.id}
          className="p-4 bg-white hover:shadow-sm transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded flex items-center justify-center ${getContentBgColor()}`}
              >
                <span className={getContentColor()}>{getContentIcon()}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {item.title}
                  </h3>
                  <div className="flex gap-2 flex-shrink-0">
                    <Badge
                      className={`text-xs bg-${
                        contentType === "Text"
                          ? "blue"
                          : contentType === "Audio"
                          ? "purple"
                          : "orange"
                      }-100 text-${
                        contentType === "Text"
                          ? "blue"
                          : contentType === "Audio"
                          ? "purple"
                          : "orange"
                      }-800`}
                    >
                      {item.type}
                    </Badge>
                    <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                      {item.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Updated {item.lastUpdated}</span>
                  <span>
                    {item.wordCount
                      ? `${item.wordCount} words`
                      : `Duration: ${item.duration}`}
                  </span>
                  <span>{item.category}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4">
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white gap-2"
                onClick={() => handleViewArticle(item)}
              >
                <Eye className="w-3 h-3" />
                View
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className=" flex-1 h-screen bg-gray-50">
      {/* Main Content */}
      <div className=" flex flex-col">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onNavigateToReverted}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div
              className={`w-6 h-6 rounded flex items-center justify-center ${getContentBgColor()}`}
            >
              <span className={getContentColor()}>{getContentIcon()}</span>
            </div>
            <div>
              <h1 className="text-lg font-medium">{contentType} Content</h1>
              <p className="text-sm text-gray-500">
                Filtered view of {contentType.toLowerCase()} articles and posts
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-400" />
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">U</span>
            </div>
            <span className="text-sm text-gray-600">User Reporter</span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={`Search ${contentType} content...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Showing {filteredContent.length} {contentType.toLowerCase()}{" "}
                  items
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
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
          {filteredContent.length > 0 ? (
            viewMode === "grid" ? (
              renderGridView()
            ) : (
              renderListView()
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div
                className={`w-16 h-16 ${getContentBgColor()} rounded-lg flex items-center justify-center mb-6`}
              >
                <span className={`${getContentColor()} text-2xl`}>
                  {getContentIcon()}
                </span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No {contentType.toLowerCase()} content found
              </h3>
              <p className="text-sm text-gray-500">
                Start creating your first {contentType.toLowerCase()} article
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
