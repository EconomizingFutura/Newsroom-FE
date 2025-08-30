import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card as UICard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import ContentHeader from "@/components/ContentHeader";
import SearchFilterTab from "@/components/SearchFilterTab";
import SharedCard from "@/components/shared/Card";
import { draftArticles, type DraftArticle } from "@/types/draftPageTypes";
import {
  DELETE_DRAFT_MODAL_ID,
  EDIT_DRAFT_NAVIGATE,
  getStatusColor,
  getTypeColor,
} from "@/utils/draftUtils";
import { useNavigate } from "react-router";
import EmptyStateComponent from "@/components/EmptyStateComponent";

export default function DraftsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "All Type" | "Text" | "Audio" | "Video"
  >("All Type");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [data, setData] = useState<DraftArticle[]>(draftArticles);
  const navigate = useNavigate();
  const filterOptions = ["All Type", "Text", "Audio", "Video"];

  const filteredArticles = data.filter((article) => {
    const matchesSearch = article.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType =
      activeFilter === "All Type" || article.type === activeFilter;
    return matchesSearch && matchesType;
  });

  const renderEmptyState = () => {
    const isAudio =
      activeFilter === "Audio"
        ? "audio"
        : activeFilter === "Video"
        ? "video"
        : "textArticle";
    const handleNav = () => {
      navigate(`/${isAudio}`);
    };

    return (
      <EmptyStateComponent
        state={activeFilter === "All Type" ? "Text" : activeFilter}
        onCreateNew={handleNav}
      />
    );
  };

  const handleDelete = (id: string) => {
    DELETE_DRAFT_MODAL_ID(id, setData, data);
  };

  const handleEdit = (id: string) => {
    const articleType = EDIT_DRAFT_NAVIGATE(id, draftArticles);
    navigate(`/${articleType}`, { state: { draftId: id } });
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredArticles.map((article) => (
        <SharedCard
          id={article.id}
          key={article.id}
          title={article.title}
          updatedDate={article.lastUpdated}
          wordCount={article.wordCount}
          savedTime={article.timeAgo}
          type={article.type}
          status={article.status}
          remarkMessage={""}
          contentPreview={article.title}
          handleDelete={() => handleDelete(article.id)}
          handleEdit={() => handleEdit(article.id)}
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
                onClick={() => handleEdit(article.id)}
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
      <div
        style={{ paddingTop: "32px" }}
        className=" flex flex-col gap-[24px] px-[24px] bg-[#F6FAF6]"
      >
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
