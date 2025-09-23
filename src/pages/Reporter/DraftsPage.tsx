import { useEffect, useMemo, useState } from "react";
import ContentHeader from "@/components/ContentHeader";
import SearchFilterTab from "@/components/SearchFilterTab";
import {
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
  RenderListViewDraft,
} from "./RevertedPost/Components";
import Pagination from "@/components/Pagination";
import { usePagination } from "@/hooks/usePagination";

export default function DraftsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "All Type" | "TEXT" | "AUDIO" | "VIDEO"
  >("All Type");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [data, setData] = useState<RevertedArticleTypes[]>([]);
  const [pageMetaData, setPageMetaData] = useState<{
    "total": number,
    "page": number,
    "pageSize": number,
    "totalPages": number,
    "hasNextPage": boolean,
    "hasPrevPage": boolean

  }>({
    "total": 11,
    "page": 1,
    "pageSize": 10,
    "totalPages": 2,
    "hasNextPage": true,
    "hasPrevPage": false
  });

  const navigate = useNavigate();
  const filterOptions = ["All Type", "TEXT", "AUDIO", "VIDEO"];
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

  const {
    currentPage,
    setPageSize,
    setCurrentPage,
    handlePageChange,
    pageSize,
  } = usePagination({
    initialPage: 1,
    totalPages: pageMetaData.totalPages,
    initialPageSize: 10,
  });



  const handlePageSize = (val: string) => {
    const size = val.split(" ")[0];
    setPageSize(Number(size));
  };
  const renderEmptyState = () => {
    const isAudio =
      activeFilter === "AUDIO"
        ? "audio"
        : activeFilter === "VIDEO"
          ? "video"
          : "textArticle";
    const handleNav = () => {
      navigate(`/${isAudio}`);
    };

    return (
      <EmptyStateComponent
        state={activeFilter === "All Type" ? "TEXT" : activeFilter}
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
      (filteredArticles) => {
        const revertedArticles = filteredArticles.map((draft) => ({
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
    const articleType = EDIT_DRAFT_NAVIGATE(id, filteredArticles);
    navigate(`/${articleType}/${id}?from=drafts`);
  };

  useEffect(() => {
    const controller = new AbortController();

    const getDraftArticle = async () => {
      try {
        const response: any = await GET(
          `${API_LIST.BASE_URL}${API_LIST.DRAFT_ARTICLE
          }?page=${currentPage}&pageSize=${pageSize}`,
          { signal: controller.signal }
        );
        setData(response.drafts);
        setPageMetaData(response.pagination)
        console.log("repose", response);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Error fetching reverted posts:", error);
        }
      }
    };

    getDraftArticle();
    return () => controller.abort();
  }, [currentPage, pageSize]);

  return (
    <div className="flex-1 py-16 h-screen bg-gray-50">
      <div
        style={{ paddingTop: "32px" }}
        className=" flex flex-col gap-[24px] px-[24px] bg-[#F6FAF6]"
      >
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
            setActiveFilter(filter as "All Type" | "TEXT" | "AUDIO" | "VIDEO")
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
            <RenderListViewDraft
              handleDeletePost={(id) => setDeletePost({ id, isOpen: true })}
              handleEdit={handleEdit}
              filteredArticles={filteredArticles} />
          )}
        </div>

        <Pagination
          currentPage={pageMetaData.page}
          pageCount={pageMetaData.totalPages}
          onPageChange={handlePageChange}
          setCurrentPage={setCurrentPage}
          setSortConfig={handlePageSize}
        />
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
