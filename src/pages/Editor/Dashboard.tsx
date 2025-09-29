import { StatCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileStack, ChevronRight } from "lucide-react";
import ContentHeader from "@/components/ContentHeader";

export function Dashboard() {
  const statsData = [
    { title: "Stories", value: 7, color: "bg-blue-500", icon: FileStack },
    {
      title: "Approved Articles",
      value: 5,
      color: "bg-gray-500",
      icon: FileStack,
    },
    {
      title: "News Articles",
      value: 1,
      color: "bg-gray-600",
      icon: FileStack,
    },
    {
      title: "Articles Published",
      value: 10,
      color: "bg-red-500",
      icon: FileStack,
    },
    {
      title: "Editorial Articles",
      value: 5,
      color: "bg-green-500",
      icon: FileStack,
    },
  ];

  const pendingStories = [
    {
      id: 1,
      title: "Article Approval",
      description: "New Article Published. Kindly give Your Approval Comments",
      author: "Muthu",
      time: "2 days ago",
    },
    {
      id: 2,
      title: "Article Approval",
      description: "New Article Published. Kindly give Your Approval Comments",
      author: "Muthu",
      time: "2 days ago",
    },
    {
      id: 3,
      title: "Article Approval",
      description: "New Article Published. Kindly give Your Approval Comments",
      author: "Muthu",
      time: "2 days ago",
    },
    {
      id: 4,
      title: "Article Approval",
      description: "New Article Published. Kindly give Your Approval Comments",
      author: "Muthu",
      time: "2 days ago",
    },
    {
      id: 5,
      title: "Article Approval",
      description: "New Article Published. Kindly give Your Approval Comments",
      author: "Muthu",
      time: "2 days ago",
    },
    {
      id: 6,
      title: "Article Approval",
      description: "New Article Published. Kindly give Your Approval Comments",
      author: "Muthu",
      time: "2 days ago",
    },
  ];

  return (
    <div className="flex-1 py-16 h-screen bg-background">
      {/* Main Content */}
      <div
        style={{ paddingTop: "32px" }}
        className="flex flex-col gap-[24px] px-[24px] bg-[#F6FAF6]"
      >
        {/* Welcome Section */}
        <ContentHeader
          text="Welcome back, Muthu!"
          description="Here's what's happening in your newsroom today."
        />

        {/* Statistics Cards */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          {statsData.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              count={stat.value}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>

        {/* Pending for Review Section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Pending for Review
              </h3>
              <Badge variant="secondary" className="text-xs">
                {pendingStories.length} items
              </Badge>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {pendingStories.map((story) => (
              <div
                key={story.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {story.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {story.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>By {story.author}</span>
                      <span>•</span>
                      <span>{story.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {}}
                      className="text-green-700 border-green-200 hover:bg-green-50"
                    >
                      View Story
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Write Approval
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
