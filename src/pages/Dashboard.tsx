import { GET } from "@/api/apiMethods";
import { API_LIST } from "@/api/endpoints";
import ContentHeader from "@/components/ContentHeader";
import { StatCard, DashboardListCard } from "@/components/ui/card";
import { Clock, CheckCircle, RotateCcw, FilePen } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

type StatCardProps = {
  title: string;
  count: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
};

export default function Dashboard() {
  const username = localStorage.getItem('username');
  const navigate = useNavigate();
  const initialStats: StatCardProps[] = [
    { title: "Total Posts", count: 0, icon: FilePen, color: "#155DFC" }, // blue
    { title: "Draft", count: 0, icon: FilePen, color: "#4A5565" }, // gray
    { title: "Submitted", count: 0, icon: Clock, color: "#2B7FFF" }, // blue
    { title: "Approved", count: 0, icon: CheckCircle, color: "#008001" }, // green
    { title: "Need Revision", count: 0, icon: RotateCcw, color: "#E7000B" }, // red
  ];
  const [stats, setStats] = useState(initialStats);

  const notificationList = [
    {
      id: "1",
      title: "Article Approved",
      message:
        'Your article "Tech Conference Interview" has been approved and published',
      buttonText: "Edit Story",
    },
    {
      id: "2",
      title: "Article Approved",
      message: 'Your article "AI in 2025" has been approved and published',
      buttonText: "Edit Story",
    },
    {
      id: "3",
      title: "Article Approved",
      message:
        'Your article "Blockchain Future" has been approved and published',
      buttonText: "Edit Story",
    },
  ];

  const handleNavigate = (id: string) => {
    navigate(`/textArticle/${id}?from=dashboard`);
  };

  useEffect(() => {
    const getStatsData = async () => {
      try {
        const response: any = await GET (API_LIST.BASE_URL + API_LIST.STATS);
        const updatedStats = stats.map((item) => {
          let key = item.title.toUpperCase();
          return {
            ...item,
            count: response[key] ?? 0,
          };
        })
        setStats(updatedStats);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    getStatsData();
  }, []);

  return (
    <div className="flex-1 py-16 h-screen bg-background">
      {/* Left Sidebar */}

      {/* Main Content */}
      <div
        style={{ paddingTop: "32px" }}
        className="flex flex-col gap-[24px] px-[24px] bg-[#F6FAF6]"
      >
        {/* Top Bar */}
        <ContentHeader
          text={`Welcome back, ${username}!`}
          description="Here's what's happening in your newsroom today."
        />

        {/* Stats Section */}
        <div>
          <div className="grid gap-4 mb-8">
            <div className="flex gap-4">
              {stats.map((stat, index) => (
                <StatCard
                  key={index}
                  title={stat.title}
                  count={stat.count}
                  icon={stat.icon}
                  color={stat.color}
                />
              ))}
            </div>
          </div>
          <div>
            <div className="space-y-3">
              <div
                style={{ borderLeftWidth: "2px" }}
                className="border-red-500 bg-white rounded-2xl px-[24px] py-[16px] shadow-md"
              >
                <div className="flex flex-col gap-[16px]">
                  <div className="flex flex-col gap-[24px]">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 warning-color font-semibold text-lg">
                        <RotateCcw className="w-5 h-5 warning-color" />
                        Urgent Actions Required
                        <span className="ml-2 bg-red-100 warning-color text-sm px-2 py-0.5 rounded-full">
                          {notificationList.length}
                        </span>
                      </div>
                    </div>

                    {/* Divider */}
                    <hr className="border-t border-gray-200" />
                  </div>
                  <div className="flex flex-col gap-[12px]">
                    {/* Notifications */}
                    {notificationList.map((note, index) => (
                      <DashboardListCard
                        key={index}
                        {...note}
                        onClick={handleNavigate}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
