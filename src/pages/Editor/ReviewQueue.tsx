import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileStack, User, Eye, Check, X, Clock } from "lucide-react";

export function ReviewQueue() {
  const [activeCategory, setActiveCategory] = useState("Politics");

  const categories = [
    { name: "Politics", count: 4 },
    { name: "Business", count: 2 },
    { name: "Entertainment", count: 1 },
    { name: "Sports", count: 3 },
    { name: "Environment", count: 1 },
  ];

  const pendingStories = [
    {
      id: 1,
      title: "Breaking: City Council Votes on New Housing Development",
      author: "Sarah Chen",
      date: "15/01/2025 at 16:00:00",
      content:
        "The city council convened today to discuss the controversial housing development proposal that has divided the community for months. After heated debate, the council voted 5-4 in favor of the development, which will bring 200 new affordable housing units to the downtown area.",
      category: "Politics",
    },
    {
      id: 2,
      title: "Breaking: City Council Votes on New Housing Development",
      author: "Sarah Chen",
      date: "15/01/2025 at 16:00:00",
      content:
        "The city council convened today to discuss the controversial housing development proposal that has divided the community for months. After heated debate, the council voted 5-4 in favor of the development, which will bring 200 new affordable housing units to the downtown area.",
      category: "Politics",
    },
    {
      id: 3,
      title: "Breaking: City Council Votes on New Housing Development",
      author: "Sarah Chen",
      date: "15/01/2025 at 16:00:00",
      content:
        "The city council convened today to discuss the controversial housing development proposal that has divided the community for months. After heated debate, the council voted 5-4 in favor of the development, which will bring 200 new affordable housing units to the downtown area.",
      category: "Politics",
    },
  ];

  const handleApprove = (storyId: number) => {
    console.log("Approving and moving to publish:", storyId);
  };

  const handleReject = (storyId: number) => {
    console.log("Rejecting story:", storyId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-8 max-w-5xl">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <FileStack className="w-6 h-6 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">Review Queue</h1>
              <Badge className="bg-green-600 text-white px-2 py-1 text-sm">
                4
              </Badge>
            </div>
            <p className="text-gray-600">
              Review and approve content submissions from reporters.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="mb-6">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setActiveCategory(category.name)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeCategory === category.name
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Stories List */}
          <div className="space-y-4">
            {pendingStories.map((story) => (
              <div
                key={story.id}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {story.title}
                </h3>

                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{story.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{story.author}</span>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed mb-6">
                  {story.content}
                </p>

                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {}}
                    className="text-gray-700 border-gray-300 hover:bg-gray-50"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Story
                  </Button>

                  <Button
                    onClick={() => handleApprove(story.id)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve & Move to publish
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleReject(story.id)}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
