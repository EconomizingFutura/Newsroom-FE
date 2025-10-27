import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { BookOpen, Search } from "lucide-react";
import ContentHeader from "@/components/ContentHeader";
import ScheduleArticle from "@/components/ScheduleArticle";
import { POST } from "@/api/apiMethods";
import { API_LIST } from "@/api/endpoints";
import type {
  PaginationTypes,
  scheduledPost,
  scheduledPostsResponse,
} from "@/types/apitypes";
import { usePagination } from "@/hooks/usePagination";
import Pagination from "@/components/Pagination";
import StoryCard from "@/components/StoryCard";
import { getPriorityColor } from "@/utils/PublishCenter";
import Loading from "../Shared/agency-feeds/loading";
import SaveDraftsUI from "@/components/SaveDraftUI";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import type { AxiosError } from "axios";
import { useCancelEvent } from "@/hooks/useCalendarAPI";
import { useNavigate } from "react-router";

const FILTER_TABS = [
  "Politics",
  "Business",
  "Entertainment",
  "Sports",
  "Environment",
] as const;
const CONTENT_TABS = ["All", "Scheduled"] as const;

export function PublishCenter() {
  const [state, setState] = useState({
    activeTab: "All",
    activeFilterTab: "Politics",
    searchQuery: "",
    scheduleModalOpen: false,
    showPopup: false,
    cancelPopup: false,
    type: "" as "PUBLISHED" | "DRAFT" | "SUBMIT" | "SCHEDULE",
    cancelPopId: "",
  });

  const [pageMetaData, setPageMetaData] = useState<PaginationTypes>({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<scheduledPost[]>([]);
  const { handleCancelAPI } = useCancelEvent();
  const navigate = useNavigate();

  const {
    currentPage,
    setPageSize,
    setCurrentPage,
    handlePageChange,
    pageSize,
  } = usePagination({
    initialPage: 1,
    totalPages: 1,
    initialPageSize: 10,
  });

  console.log(pageMetaData);

  const handlePageSize = (val: string) => {
    const size = Number(val.split(" ")[0]);
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleViewStory = (
    storyId: string,
    type: "TEXT" | "AUDIO" | "VIDEO"
  ) => {
    navigate(`/editor/viewcontent/${storyId}?from=publishCenter`, {
      state: { articletype: type, editable: true },
    });
  };

  const getPublishCenterData = async (
    page: number,
    size: number,
    articleType: string,
    category: string
  ): Promise<scheduledPostsResponse> => {
    const url = API_LIST.BASE_URL + API_LIST.PUBLISH_CENTER;
    return await POST<scheduledPostsResponse>(url, {
      page,
      pageSize: size,
      articleType,
      category,
    });
  };

  const getDraftArticle = async () => {
    try {
      const response = await getPublishCenterData(
        currentPage,
        pageSize,
        state.activeTab.toUpperCase(),
        state.activeFilterTab
      );

      setData(response?.data?.articles ?? []);
      console.log(response.data);
      const pagination = response.data?.pagination ?? {};
      setPageMetaData((prev) => ({
        ...prev,
        total: Number(pagination.total ?? 0),
        page: Number(pagination.page ?? prev.page),
        pageSize,
        totalPages: Number(pagination.totalPages ?? prev.totalPages),
        hasNextPage: Boolean(pagination.hasNextPage),
        hasPrevPage: Boolean(pagination.hasPrevPage),
      }));
    } catch (error) {
      const err = error as AxiosError;
      if (err.name !== "AbortError") {
        console.error("Error fetching posts:", error);
      }
    }
  };
  useEffect(() => {
    getDraftArticle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pageSize,
    pageMetaData?.page,
    pageMetaData?.pageSize,
    state.activeFilterTab,
    state.activeTab,
    currentPage,
  ]);

  const handlePublishNow = async (storyId: string, platforms: string[]) => {
    const controller = new AbortController();
    const now = new Date();
    const futureTime = new Date(now.getTime() + 3 * 60 * 1000);

    try {
      setLoading(true);
      const url = API_LIST.BASE_URL + API_LIST.SCHEDULED_POST;
      await POST(
        url,
        {
          id: storyId,
          date: futureTime,
          time: futureTime.toLocaleTimeString("en-GB", { hour12: false }),
          platforms,
        },
        { signal: controller.signal }
      );
      getDraftArticle();

      console.log("Story scheduled successfully!");
    } catch (error: unknown) {
      const err = error as AxiosError;
      if (err.name === "AbortError") {
        console.warn("Request aborted");
      } else {
        console.error("Error scheduling story:", error);
      }
    } finally {
      setLoading(false);
      setState((p) => ({
        ...p,
        showPopup: !p.showPopup,
        type: "PUBLISHED",
      }));
    }
  };

  const handleSchedulePublish = (story: scheduledPost) => {
    setState((prev) => ({
      ...prev,
      scheduleModalOpen: true,
      scheduling: { ...prev, selectedStory: story },
      cancelPopId: story.id,
    }));
  };
  const handlePublish = async (
    platforms: string[],
    time: string,
    date: string
  ) => {
    const controller = new AbortController();
    try {
      setLoading(true);
      const url = API_LIST.BASE_URL + API_LIST.SCHEDULED_POST;
      await POST(
        url,
        {
          id: state.cancelPopId,
          date: date,
          time: time,
          platforms,
        },
        { signal: controller.signal }
      );
      getDraftArticle();

      console.log("Story scheduled successfully!");
    } catch (error: unknown) {
      const err = error as AxiosError;
      if (err.name === "AbortError") {
        console.warn("Request aborted");
      } else {
        console.error("Error scheduling story:", error);
      }
    } finally {
      setLoading(false);
      setState((p) => ({
        ...p,
        id: "",
      }));
    }
  };

  const handleCancelPopup = async () => {
    await handleCancelAPI(state.cancelPopId);
    setState((p) => ({
      ...p,
      cancelPopup: !p.cancelPopup,
    }));
  };

  if (loading) return <Loading />;

  const showPagination = Number(pageMetaData.totalPages) >= 1;
  console.log(showPagination, pageMetaData);

  return (
    <div className="min-h-screen flex flex-col pt-16 bg-[#F6FAF6]">
      <main className="flex-1 p-8 flex flex-col">
        <ContentHeader
          text="Publish Center"
          description="Finalize and publish approved content across platforms."
          iconName="Publish Center"
        />

        <section className="sticky top-16 bg-gray-50 z-10">
          <div className="my-3 flex items-center justify-between bg-white py-2 px-6 rounded-lg">
            <div className="flex space-x-2.5 bg-[#6A72821A] p-1 rounded-lg w-fit">
              {CONTENT_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setState((prev) => ({ ...prev, activeTab: tab }));
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    state.activeTab === tab
                      ? "font-bold bg-white"
                      : "text-gray-500"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search..."
                value={state.searchQuery}
                onChange={(e) =>
                  setState((prev) => ({ ...prev, searchQuery: e.target.value }))
                }
                className="pl-10"
              />
            </div>
          </div>

          <div className="my-3 bg-white py-2 px-6 rounded-lg">
            <div className="flex space-x-2.5 bg-[#6A72821A] p-1 rounded-lg w-fit">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setState((prev) => ({ ...prev, activeFilterTab: tab }));
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-md text-sm ${
                    state.activeFilterTab === tab
                      ? "font-bold bg-white"
                      : "text-gray-500"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* === STORY LIST === */}
        <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-2">
          {data.length > 0 ? (
            data.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                getPriorityColor={getPriorityColor}
                handleViewStory={handleViewStory}
                handlePublishNow={handlePublishNow}
                handleSchedulePublish={handleSchedulePublish}
                handleCancel={(id) =>
                  setState((p) => ({
                    ...p,
                    cancelPopup: !p.cancelPopup,
                    cancelPopId: id,
                  }))
                }
              />
            ))
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No articles in {state.activeTab.toLowerCase()}
              </h3>
              <p className="text-gray-500">
                {state.activeTab === "Ready to Publish"
                  ? "Articles approved for publication will appear here."
                  : state.activeTab === "Scheduled"
                  ? "Scheduled articles will appear here."
                  : "Published articles will appear here."}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* === PAGINATION SECTION === */}
      {showPagination && (
        <div className="sticky bottom-0 bg-gray-50 border-t py-5 z-20">
          <Pagination
            currentPage={pageMetaData.page}
            pageCount={pageMetaData.totalPages}
            onPageChange={handlePageChange}
            setCurrentPage={setCurrentPage}
            setSortConfig={handlePageSize}
          />
        </div>
      )}

      {/* === MODALS === */}
      {state.scheduleModalOpen && (
        <ScheduleArticle
          onCancel={() =>
            setState((prev) => ({ ...prev, scheduleModalOpen: false }))
          }
          handlePublish={handlePublish}
        />
      )}

      {state.showPopup && (
        <SaveDraftsUI
          saveType={state.type}
          onCancel={() =>
            setState((p) => ({
              ...p,
              showPopup: !p.showPopup,
            }))
          }
        />
      )}
      {state.cancelPopup && (
        <DeleteConfirmation
          onCancel={() =>
            setState((p) => ({
              ...p,
              cancelPopup: !p.cancelPopup,
            }))
          }
          wordings={true}
          onConfirm={handleCancelPopup}
        />
      )}
    </div>
  );
}
