import React, { useEffect, useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import ContentHeader from "@/components/ContentHeader";
import SearchFilterTab from "@/components/SearchFilterTab";
import { DELETE_DRAFT_MODAL_ID, EDIT_DRAFT_NAVIGATE } from "@/utils/draftUtils";
import { useNavigate } from "react-router";
import type {
  DeleteArticleProps,
  RevertedArticleTypes,
} from "@/types/draftPageTypes";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import { GET } from "@/api/apiMethods";
import { API_LIST } from "@/api/endpoints";
import { RenderGridView, RenderListView } from "./Components";
import Loading from "@/pages/Shared/agency-feeds/loading";
import { usePagination } from "@/hooks/usePagination";
import Pagination from "@/components/Pagination";

const RevertedPostPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "All Type" | "TEXT" | "AUDIO" | "VIDEO"
  >("All Type");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [data, setData] = useState<RevertedArticleTypes[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [deletePost, setDeletePost] = useState<DeleteArticleProps>({
    id: null,
    isOpen: false,
  });
  const filterOptions = ["All Type", "TEXT", "AUDIO", "VIDEO"];
  const navigate = useNavigate();
  const [pageMetaData, setPageMetaData] = useState<{
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }>({
    total: 11,
    page: 1,
    pageSize: 10,
    totalPages: 2,
    hasNextPage: true,
    hasPrevPage: false,
  });

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

  const filteredArticles = useMemo(() => {
    return data.filter((article) => {
      const matchesSearch = article.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesType =
        activeFilter === "All Type" || article.type === activeFilter;
      return matchesSearch && matchesType;
    });
  }, [data, searchQuery, activeFilter]);

  useEffect(() => {
    const controller = new AbortController();

    const getRevertedPost = async () => {
      try {
        setLoading(true);
        const response: any = await GET(
          `${API_LIST.BASE_URL}${API_LIST.REVERTED_POST}?page=${currentPage}&pageSize=${pageSize}`,
          { signal: controller.signal }
        );
        setData(response.data);
        setPageMetaData(response.pagination);

        setLoading(false);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Error fetching data:", error);
        }
        setLoading(false);
      }
    };

    getRevertedPost();
    return () => controller.abort();
  }, [currentPage, pageSize]);

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

  const handlePageSize = (val: string) => {
    const size = val.split(" ")[0];
    setPageSize(Number(size));
  };
  const handleEdit = (id: string) => {
    const articleType = EDIT_DRAFT_NAVIGATE(id, filteredArticles);
    navigate(`/${articleType}/${id}?from=reverted`);
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <div className=" flex-1 py-16 h-screen bg-gray-50">
      {/* Main Content */}
      <div
        style={{ paddingTop: "32px" }}
        className=" flex flex-col gap-[24px] px-[24px] bg-[#F6FAF6]"
      >
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
            setActiveFilter(filter as "All Type" | "TEXT" | "AUDIO" | "VIDEO")
          }
        />
        {/* Content Area */}
        <div className="flex-1 bg-gray-50">
          {filteredArticles.length > 0 ? (
            viewMode === "grid" ? (
              <RenderGridView
                filteredArticles={filteredArticles}
                handleDeletePost={(id) => setDeletePost({ id, isOpen: true })}
                handleEdit={handleEdit}
                status="REVERTED"
              />
            ) : (
              <RenderListView
                handleDeletePost={(id) => setDeletePost({ id, isOpen: true })}
                handleEdit={handleEdit}
                filteredArticles={filteredArticles}
              />
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
};

export default RevertedPostPage;
