import { GET } from "@/api/apiMethods";
import { API_LIST } from "@/api/endpoints";
import ContentHeader from "@/components/ContentHeader";
import { StatCard, DashboardListCard } from "@/components/ui/card";
import type { RevertedArticleTypes } from "@/types/draftPageTypes";
import { Clock, CheckCircle, RotateCcw, FilePen } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import Loading from "../Shared/agency-feeds/loading";

type StatCardProps = {
  title: string;
  count: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
};

const INITIAL_STATS: StatCardProps[] = [
  { title: "Total", count: 0, icon: FilePen, color: "#155DFC" },
  { title: "Draft", count: 0, icon: FilePen, color: "#4A5565" },
  { title: "Submitted", count: 0, icon: Clock, color: "#2B7FFF" },
  { title: "Approved", count: 0, icon: CheckCircle, color: "#008001" },
  { title: "Need Revision", count: 0, icon: RotateCcw, color: "#E7000B" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const username = useMemo(() => localStorage.getItem("username"), []);
  const [stats, setStats] = useState<StatCardProps[]>(INITIAL_STATS);
  const [revertedPost, setRevertedPost] = useState<RevertedArticleTypes[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleNavigate = (id: number) => {
    navigate(`/textArticle/${id}?from=dashboard`);
  };

  useEffect(() => {
    const controller = new AbortController();

    const getStatsData = async () => {
      try {
        const response: unknown = await GET(
          API_LIST.BASE_URL + API_LIST.STATS,
          {
            signal: controller.signal,
          }
        );

        const statsResponse = response as Record<string, number>;
        const updatedStats = INITIAL_STATS.map((item) => {
          const key =
            item.title.toUpperCase() === "NEED REVISION"
              ? "REVERTED"
              : item.title.toUpperCase();

          return { ...item, count: statsResponse[key] ?? 0 };
        });

        setStats(updatedStats);
      } catch (error: never) {
        if (error.name !== "AbortError") {
          console.error("Error fetching stats:", error);
        }
      }
    };

    getStatsData();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const getRevertedPost = async () => {
      try {
        setLoading(true);
        const response: any = await GET(
          API_LIST.BASE_URL + API_LIST.REVERTED_POST,
          { signal: controller.signal }
        );
        setRevertedPost(response.data);
        setLoading(false);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Error fetching reverted posts:", error);
        }
        setLoading(false);
      }
    };

    getRevertedPost();
    return () => controller.abort();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex-1 py-16 h-screen bg-[#F6FAF6] ">
      <div
        style={{ paddingTop: "32px" }}
        className="flex flex-col gap-[24px] px-[24px] bg-[#F6FAF6]"
      >
        <ContentHeader
          text={`Welcome back, ${username ?? "Guest"}!`}
          description="Here's what's happening in your newsroom today."
        />

        {/* Stats Section */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-6 mb-8">
          {stats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              count={stat.count}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>

        {/* Urgent Actions Section */}

        {revertedPost.length == 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 p-4  rounded-full">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h3 className="text-4xl font-semibold text-gray-900 mb-2">
              All caught up!
            </h3>
            <p className="text-gray-500 text-lg max-w-md">
              Great news! You don't have any articles that need revision right
              now. Keep up the excellent work!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div
              style={{ borderLeftWidth: "2px" }}
              className="border-red-500 bg-white rounded-2xl px-[24px] py-[16px] shadow-md"
            >
              <div className="flex flex-col gap-[16px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 warning-color font-semibold text-lg">
                    <RotateCcw className="w-5 h-5 warning-color" />
                    Urgent Actions Required
                    <span className="ml-2 bg-red-100 warning-color text-sm px-2 py-0.5 rounded-full">
                      {revertedPost.length}
                    </span>
                  </div>
                </div>

                <hr className="border-t border-gray-200" />

                <div className="flex flex-col gap-[12px]">
                  {revertedPost.map((note, index) => (
                    <DashboardListCard
                      key={note.id ?? index}
                      id={index}
                      title={note.title}
                      message={note.remarks}
                      buttonText="Edit Story"
                      onClick={handleNavigate}
                    />
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
