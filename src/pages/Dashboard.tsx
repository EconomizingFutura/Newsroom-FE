import ContentHeader from "@/components/ContentHeader";
import { StatCard, DashboardListCard } from "@/components/ui/card";
import { Clock, CheckCircle, RotateCcw, FilePen } from "lucide-react";

type StatCardProps = {
  title: string;
  count: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
};

interface DashboardProps {
  onEditStory: (article: any) => void;
  onNavigateToDrafts: () => void;
  onNavigateToReverted: () => void;
  onNavigateToHistory: () => void;
  onNavigateToNewsFeeds: () => void;
  onCreateNewTextArticle: () => void;
  onCreateNewAudioArticle: () => void;
  onCreateNewVideoArticle: () => void;
}

export default function Dashboard({ onEditStory }: DashboardProps) {
  // Mock data for demonstration
  const stats: StatCardProps[] = [
    { title: "Total Posts", count: 7, icon: FilePen, color: "#155DFC" }, // blue
    { title: "Draft", count: 5, icon: FilePen, color: "#4A5565" },       // gray
    { title: "Submitted", count: 1, icon: Clock, color: "#2B7FFF" },    // blue
    { title: "Approved", count: 10, icon: CheckCircle, color: "#008001" }, // green
    { title: "Need Revision", count: 5, icon: RotateCcw, color: "#E7000B" }, // red
  ];

  const notificationList = [
    {
      title: "Article Approved",
      message: 'Your article "Tech Conference Interview" has been approved and published',
      buttonText: "Edit Story",
      onClick: () => alert("Editing story..."),
    },
    {
      title: "Article Approved",
      message: 'Your article "AI in 2025" has been approved and published',
      buttonText: "Edit Story",
      onClick: () => alert("Editing AI article..."),
    },
    {
      title: "Article Approved",
      message: 'Your article "Blockchain Future" has been approved and published',
      buttonText: "Edit Story",
      onClick: () => alert("Editing blockchain article..."),
    }
  ];

  return (
    <div className="flex-1 py-16 h-screen bg-background">
      {/* Left Sidebar */}

      {/* Main Content */}
      <div className=" flex flex-col bg-[#F6FAF6]">
        {/* Top Bar */}
        <ContentHeader
          text="Welcome back, Muthu!"
          description="Here's what's happening in your newsroom today."
        />

        {/* Stats Section */}
        <div className="p-6">
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
            <div style={{ borderLeftWidth: "2px"}} className="border-red-500 bg-white rounded-2xl px-[24px] py-[16px] shadow-md">
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
                      <DashboardListCard key={index} {...note} />
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
