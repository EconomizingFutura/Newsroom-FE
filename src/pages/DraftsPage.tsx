import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card as UICard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, FolderOpen } from "lucide-react";
import ContentHeader from "@/components/ContentHeader";
import SearchFilterTab from "@/components/SearchFilterTab";
import SharedCard from "@/components/shared/Card";

interface DraftsPageProps {
  onEditDraft?: (article: any) => void;
  onCreateNewTextArticle?: () => void;
  onCreateNewAudioArticle?: () => void;
  onCreateNewVideoArticle?: () => void;
}

export default function DraftsPage({
  onEditDraft,
  onCreateNewTextArticle,
  onCreateNewAudioArticle,
  onCreateNewVideoArticle,
}: DraftsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "All Type" | "Text" | "Audio" | "Video"
  >("All Type");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Mock draft articles data
  type ArticleType = "Text" | "Audio" | "Video";
  type ArticleStatus = "Auto-saved" | "Reverted";
  interface DraftArticle {
    id: number;
    title: string;
    type: ArticleType;
    status: ArticleStatus;
    wordCount: number;
    lastUpdated: string;
    timeAgo: string;
  }

  const draftArticles: DraftArticle[] = [
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredArticles.map((article) => (
        <SharedCard
          key={article.id}
          title={article.title}
          updatedDate={article.lastUpdated}
          wordCount={article.wordCount}
          savedTime={article.timeAgo}
          type={article.type}
          status={article.status}
          remarkMessage={""}
          contentPreview={article.title}
        />
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-3">
      {filteredArticles.map((article) => (
        <UICard
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
        </UICard>
      ))}
    </div>
  );

  return (
    <div className="flex-1 py-16 h-screen bg-gray-50">
      {/* Main Content */}
      <div style={{paddingTop: '32px'}} className=" flex flex-col gap-[24px] px-[24px] bg-[#F6FAF6]">
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

        <SearchFilterTab
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterOptions={filterOptions}
          activeFilter={activeFilter}
          setActiveFilter={(filter: string) =>
            setActiveFilter(filter as "All Type" | "Text" | "Audio" | "Video")
          }
        />

        {/* Content Area - Show empty state or filtered content */}
        <div className="flex-1 bg-gray-50">
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
