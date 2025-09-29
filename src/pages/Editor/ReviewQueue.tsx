import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  User,
  Clock,
  PenLine,
  CircleCheckBig,
  ShieldAlert,
} from "lucide-react";
import ContentHeader from "@/components/ContentHeader";
import SuccessUI from "@/components/SuccessUI";
import RemarksModal from "@/components/RemarksModal";
import { useNavigate } from "react-router";
import { formatToIST } from "@/utils/utils";
import { useEditorReviewArticle } from "@/hooks/useEditorReviewArticle";
import type { contentResponse, PaginationTypes } from "@/types/apitypes";
import { usePagination } from "@/hooks/usePagination";
import Pagination from "@/components/Pagination";
import { extractTextSummary } from "../Reporter/utils";
import Loading from "../Shared/agency-feeds/loading";
import { PendingReviewEmptyState } from "@/components/EmptyUI";

export function ReviewQueue() {
  const [activeCategory, setActiveCategory] = useState("Politics");
  const [pendingStories, setPendingStories] = useState<contentResponse[]>([]);
  const navigate = useNavigate();
  const [show, setShow] = useState({
    success: false,
    remarks: false,
    id: "",
  });
  const [pageMetaData, setPageMetaData] = useState<PaginationTypes>({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
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

  const { reviewArticle, isLoading, revertArticle } = useEditorReviewArticle();

  const fetch = async () => {
    const response = await reviewArticle(activeCategory, currentPage, pageSize);
    setPendingStories(response.data);
    if (
      response.pagination.page !== pageMetaData.page ||
      response.pagination.totalPages !== pageMetaData.totalPages
    ) {
      setPageMetaData(response.pagination);
    }
  };

  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, currentPage, pageSize]);

  const handleView = (storyId: string) => {
    const articleType =
      pendingStories.find((article: contentResponse) => article.id === storyId)
        ?.type || "Text";
    navigate(`/editor/viewcontent/${storyId}?from=reviewQueue`, {
      state: { articletype: articleType },
    });
  };

  const toggleSuccess = () => {
    setShow((prev) => ({ ...prev, success: !prev.success }));
  };

  const toggleRemarks = () => {
    setShow((prev) => ({ ...prev, remarks: !prev.remarks }));
  };

  const categories = [
    { name: "Politics", count: 4 },
    { name: "Business", count: 2 },
    { name: "Entertainment", count: 1 },
    { name: "Sports", count: 3 },
    { name: "Environment", count: 1 },
  ];

  const handleApprove = async (storyId: string) => {
    console.log("Approving and moving to publish:", storyId);
    await revertArticle(storyId, "REVIEWED", " ");
    await fetch();
    toggleSuccess();
  };

  const handleReject = (storyId: string) => {
    setShow((prev) => ({ ...prev, id: storyId }));
    toggleRemarks();
  };

  const handleRemarksConfirm = async (remarks: string) => {
    console.log("Rejecting story with remarks:", show.id, remarks);
    await revertArticle(show.id, "REVERTED", remarks);
    await fetch();
    toggleRemarks();
    setShow((prev) => ({ ...prev, id: "" }));
  };

  const handlePageSize = (val: string) => {
    const size = val.split(" ")[0];
    console.log(size, val);
    setPageSize(Number(size));
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen pt-16 bg-[#F6FAF6]">
      <div className="flex">
        <main className="flex-1 p-8">
          <ContentHeader
            text="Review Queue"
            iconName="Drafts"
            description="Review and approve content submissions from reporters."
          />

          <div className="my-6 flex items-center justify-between bg-white py-2 px-6 rounded-lg">
            <div className="flex space-x-2.5 bg-gray-100 p-1 rounded-lg w-fit">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setActiveCategory(category.name)}
                  className={`px-4 py-2  text-sm  transition-all ${
                    activeCategory === category.name
                      ? " text-black bg-[#F5FAFF] rounded-md font-bold "
                      : "text-[#999999]  hover:text-[#999999]"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Stories List */}

          {pendingStories.length === 0 ? (
            <div className=" justify-center items-center h-full w-full">
              <PendingReviewEmptyState />
            </div>
          ) : (
            <div className="space-y-4">
              {pendingStories.map((story) => (
                <div
                  key={story.id}
                  className="bg-white rounded-[12px] shadow-[0px_2px_15px_0px_#64646F1A] border border-gray-200 p-6"
                >
                  <h3 className="text-[16px] font-semibold text-[#101828] mb-3">
                    {story.title}
                  </h3>

                  <div className="flex items-center space-x-4 text-sm text-[#6A7282] mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatToIST(story.updatedAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{story?.reporter?.username}</span>
                    </div>
                  </div>

                  <p className="text-[#4A5565] text-sm leading-relaxed mb-6">
                    {extractTextSummary(story.content ?? "", 30).text}
                  </p>

                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => handleView(story.id.toString())}
                      className="text-[#6A7282] hover:text-[#6A7282] font-medium border-gray-300 hover:bg-gray-50"
                    >
                      <PenLine className="w-4 h-4 mr-2" />
                      View Story
                    </Button>

                    <Button
                      onClick={() =>
                        handleApprove(story.id.toString().toString())
                      }
                      className="bg-[#008001] font-semibold hover:bg-[#008001] text-white"
                    >
                      <CircleCheckBig className="w-4 h-4 mr-2" />
                      Approve & Move to publish
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => handleReject(story.id.toString())}
                      className="text-white bg-[#FB2C36] hover:text-white hover:bg-[#FB2C36] border-red-300 "
                    >
                      <ShieldAlert className="w-4 h-4 mr-2" />
                      Reverted
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
        {show.success && (
          <SuccessUI
            onCancel={toggleSuccess}
            label={"Article Approved and Moved to Publish Successfully!"}
          />
        )}
        {show.remarks && (
          <RemarksModal
            onCancel={toggleRemarks}
            onConfirm={handleRemarksConfirm}
          />
        )}
      </div>
      {pendingStories.length !== 0 && (
        <Pagination
          currentPage={pageMetaData.page}
          pageCount={pageMetaData.totalPages}
          onPageChange={handlePageChange}
          setCurrentPage={setCurrentPage}
          setSortConfig={handlePageSize}
        />
      )}
    </div>
  );
}
