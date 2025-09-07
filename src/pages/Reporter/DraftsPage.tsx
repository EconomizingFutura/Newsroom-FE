import { useEffect, useMemo, useState } from "react";
import ContentHeader from "@/components/ContentHeader";
import SearchFilterTab from "@/components/SearchFilterTab";
import {
  draftArticles,
  type DeleteArticleProps,
  type RevertedArticleTypes,
} from "@/types/draftPageTypes";
import { DELETE_DRAFT_MODAL_ID, EDIT_DRAFT_NAVIGATE } from "@/utils/draftUtils";
import { useNavigate } from "react-router";
import EmptyStateComponent from "@/components/EmptyStateComponent";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import { API_LIST } from "@/api/endpoints";
import { GET } from "@/api/apiMethods";
import {
  RenderGridView,
  RenderListView,
  RenderListViewDraft,
} from "./RevertedPost/Components";

export default function DraftsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "All Type" | "Text" | "Audio" | "Video"
  >("All Type");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [data, setData] = useState<RevertedArticleTypes[]>([]);
  const navigate = useNavigate();
  const filterOptions = ["All Type", "Text", "Audio", "Video"];
  const [deletePost, setDeletePost] = useState<DeleteArticleProps>({
    id: null,
    isOpen: false,
  });

  const filteredArticles = useMemo(() => {
    return data?.filter((article) => {
      const matchesSearch = article.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesType =
        activeFilter === "All Type" || article.type === activeFilter;
      return matchesSearch && matchesType;
    });
  }, [data, searchQuery, activeFilter]);

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

  const handleDelete = () => {
    if (!deletePost.id) {
      return;
    }
    DELETE_DRAFT_MODAL_ID(
      deletePost.id,
      (draftArticles) => {
        const revertedArticles = draftArticles.map((draft) => ({
          ...draft,
          remarks: "",
          editor: "",
        }));
        setData(revertedArticles);
      },
      data
    );
    setDeletePost((pre) => ({
      id: null,
      isOpen: !pre.isOpen,
    }));
  };

  const handleEdit = (id: string) => {
    const articleType = EDIT_DRAFT_NAVIGATE(id, draftArticles);
    navigate(`/${articleType}/${id}?from=drafts`);
  };

  useEffect(() => {
    const controller = new AbortController();

    const getDraftArticle = async () => {
      try {
        const response: any = await GET(
          `${API_LIST.BASE_URL}${
            API_LIST.DRAFT_ARTICLE
          }?page=${1}&pageSize=${10}`,
          { signal: controller.signal }
        );
        setData(response.drafts);
        console.log("repose", response);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Error fetching reverted posts:", error);
        }
      }
    };

    getDraftArticle();
    return () => controller.abort();
  }, []);

  console.log(data, filteredArticles, "as");

  return (
    <div className="flex-1 py-16 h-screen bg-gray-50">
      <div
        style={{ paddingTop: "32px" }}
        className=" flex flex-col gap-[24px] px-[24px] bg-[#F6FAF6]"
      >
        {console.log(filteredArticles, "cdraft")}
        <ContentHeader
          text="Drafts"
          description="Your saved drafts and work in progress."
          number={filteredArticles?.length}
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
          {filteredArticles?.length === 0 ? (
            renderEmptyState()
          ) : viewMode === "grid" ? (
            <RenderGridView
              filteredArticles={filteredArticles}
              handleDeletePost={(id) => setDeletePost({ id, isOpen: true })}
              handleEdit={handleEdit}
              status="DRAFT"
            />
          ) : (
            <RenderListViewDraft filteredArticles={filteredArticles} />
          )}
        </div>
      </div>
      {deletePost.isOpen && (
        <DeleteConfirmation
          onConfirm={handleDelete}
          onCancel={() =>
            setDeletePost((pre) => ({
              id: null,
              isOpen: !pre.isOpen,
            }))
          }
        />
      )}
    </div>
  );
}
