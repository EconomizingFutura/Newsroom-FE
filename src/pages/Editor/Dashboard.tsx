import StoryCard, { StatCard } from "@/components/ui/card";
import {  SquareChartGantt } from "lucide-react";
import ContentHeader from "@/components/ContentHeader";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useEditorReviewArticle } from "@/hooks/useEditorReviewArticle";
import type { contentResponse } from "@/types/apitypes";
import Loading from "../Shared/agency-feeds/loading";
import {
  statusConfig,
  type ApiStats,
  type StatusType,
} from "@/utils/editorUtils";
import { extractTextSummary } from "../Reporter/utils";
import { PendingReviewEmptyState } from "@/components/EmptyUI";

export function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<(StatusType & { value: number })[]>([]);
  const [pendingStories, setPendingStories] = useState<contentResponse[]>([]);
  const USERNAME = window.localStorage.getItem("username") ?? "";
  const { reviewArticle, isLoading, getEditorArticleStats } =
    useEditorReviewArticle();

  useEffect(() => {
    const fetch = async () => {
      const response = await reviewArticle("", 1, 6);
      const status = await getEditorArticleStats();
      const statdata = status.data as ApiStats;
      setPendingStories(response.data);
      const mappedStats = statusConfig.map((a) => ({
        ...a,
        value: statdata[a.key],
      }));
      setStats(mappedStats);
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const handleNavigate = (id: string) => {
  //   navigate(`/textArticle/${id}?from=dashboard`);
  // };

  const handleNavigate = (storyId: string) => {
    const articleType =
      pendingStories.find((article: contentResponse) => article.id === storyId)
        ?.type || "Text";
    navigate(`/editor/viewcontent/${storyId}?from=dashboard`, {
      state: { articletype: articleType },
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex-1 font-openSans py-16 h-screen bg-[#F6FAF6]">
      <div
        style={{ paddingTop: "32px" }}
        className="flex flex-col gap-[24px] px-[24px] bg-[#F6FAF6]"
      >
        <ContentHeader
          text={`Welcome back, ${USERNAME ?? "Editor"}!`}
          description="Here's what's happening in your newsroom today."
        />
        <div className="flex flex-col sm:flex-row flex-1 w-full sm:flex-wrap gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              count={stat.value}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>
        {pendingStories.length == 0 ? (
          <PendingReviewEmptyState />
        ) : (
          <div className="space-y-3">
            <div
              style={{ borderLeftWidth: "2px" }}
              className="border-[#2676FE] bg-white rounded-2xl px-[24px] py-[16px] shadow-md"
            >
              <div className="flex flex-col gap-[16px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[16px] flex gap-2 font-semibold text-[#1E2939]">
                      <SquareChartGantt color="#2676FE" />{" "}
                      <span> Pending for Review</span>
                      <span className="px-3 py-0.5 rounded-full bg-blue-100 text-blue-500 border border-blue-200 text-sm font-medium">
                        {pendingStories.length}
                      </span>
                    </h3>
                  </div>
                </div>

                <hr className="border-t border-gray-200" />

                <div className="flex flex-col w-full sm:flex-row sm:flex-wrap gap-[12px] mb-8">
                  {pendingStories.map((story) => (
                    <div
                      key={story.id}
                      className=" w-full hover:bg-gray-50 transition-colors"
                    >
                      <StoryCard
                        title={story.title}
                        description={
                          extractTextSummary(story.content ?? "", 30).text
                        }
                        key={story.id}
                        onView={() => handleNavigate(story.id.toString())}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
