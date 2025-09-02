import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Calendar,
  User,
  Eye,
  Clock,
  Globe,
  Printer,
  X,
} from "lucide-react";

export function PublishCenter() {
  const [activeTab, setActiveTab] = useState("Ready to Publish");
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedStoryForScheduling, setSelectedStoryForScheduling] =
    useState<any>(null);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [scheduleRepeat, setScheduleRepeat] = useState("");
  const [notifySubscribers, setNotifySubscribers] = useState(true);
  const [priorityPublish, setPriorityPublish] = useState(false);

  const tabs = [
    { name: "Ready to Publish", count: 3 },
    { name: "Scheduled", count: 2 },
    { name: "Published", count: 15 },
  ];

  const readyToPublishStories = [
    {
      id: 1,
      title: "Breaking: City Council Votes on New Housing Development",
      author: "Sarah Chen",
      category: "Politics",
      approvedDate: "15/01/2025 at 16:00:00",
      priority: "High",
      content:
        "The city council convened today to discuss the controversial housing development proposal...",
      status: "ready",
    },
    {
      id: 2,
      title: "Local Sports Team Wins Championship Match",
      author: "Mike Rodriguez",
      category: "Sports",
      approvedDate: "15/01/2025 at 14:30:00",
      priority: "Medium",
      content:
        "In a thrilling match that went into overtime, the local team secured their championship...",
      status: "ready",
    },
    {
      id: 3,
      title: "New Technology Center Opens Downtown",
      author: "Lisa Wang",
      category: "Technology",
      approvedDate: "15/01/2025 at 12:15:00",
      priority: "Low",
      content:
        "The much-anticipated technology innovation center opened its doors to the public...",
      status: "ready",
    },
  ];

  const scheduledStories = [
    {
      id: 4,
      title: "Weekend Weather Forecast Update",
      author: "John Smith",
      category: "Weather",
      scheduledDate: "16/01/2025 at 08:00:00",
      priority: "Medium",
      content:
        "Weekend weather patterns show a chance of rain with temperatures...",
      status: "scheduled",
    },
    {
      id: 5,
      title: "Community Event Planning Meeting",
      author: "Emma Johnson",
      category: "Community",
      scheduledDate: "17/01/2025 at 10:00:00",
      priority: "Low",
      content:
        "Local community leaders will meet to discuss upcoming events...",
      status: "scheduled",
    },
  ];

  const publishedStories = [
    {
      id: 6,
      title: "Mayor Announces New Infrastructure Plan",
      author: "David Brown",
      category: "Politics",
      publishedDate: "14/01/2025 at 09:00:00",
      priority: "High",
      views: "2,450",
      status: "published",
    },
  ];

  const getCurrentStories = () => {
    switch (activeTab) {
      case "Ready to Publish":
        return readyToPublishStories;
      case "Scheduled":
        return scheduledStories;
      case "Published":
        return publishedStories;
      default:
        return readyToPublishStories;
    }
  };

  const handlePublishNow = (storyId: number) => {
    console.log("Publishing story immediately:", storyId);
  };

  const handleSchedulePublish = (story: any) => {
    setSelectedStoryForScheduling(story);
    setScheduleModalOpen(true);
  };

  const handleConfirmSchedule = () => {
    console.log("Scheduling story:", selectedStoryForScheduling, {
      date: scheduledDate,
      time: scheduledTime,
      repeat: scheduleRepeat,
      notifySubscribers,
      priorityPublish,
    });
    setScheduleModalOpen(false);
    setSelectedStoryForScheduling(null);
    // Reset form
    setScheduledDate("");
    setScheduledTime("");
    setScheduleRepeat("");
    setNotifySubscribers(true);
    setPriorityPublish(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-8 max-w-6xl">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <BookOpen className="w-6 h-6 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Publish Center
              </h1>
            </div>
            <p className="text-gray-600">
              Manage and publish approved articles to your news platform.
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center space-x-2 ${
                    activeTab === tab.name
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <span>{tab.name}</span>
                  <Badge
                    className={`text-xs px-2 py-1 ${
                      activeTab === tab.name
                        ? "bg-green-600 text-white"
                        : "bg-gray-300 text-gray-700"
                    }`}
                  >
                    {tab.count}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          {/* Stories List */}
          <div className="space-y-4">
            {getCurrentStories().map((story) => (
              <div
                key={story.id}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {story.title}
                      </h3>
                      <Badge
                        className={`text-xs px-2 py-1 ${getPriorityColor(
                          story.priority
                        )}`}
                      >
                        {story.priority}
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{story.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          {story.status === "published"
                            ? `Published: ${story.publishedDate}`
                            : story.status === "scheduled"
                            ? `Scheduled: ${story.scheduledDate}`
                            : `Approved: ${story.approvedDate}`}
                        </span>
                      </div>
                      {story.views && (
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{story.views} views</span>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-4">
                      {story.content}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className="text-xs px-2 py-1 text-blue-600 border-blue-200 bg-blue-50"
                  >
                    {story.category}
                  </Badge>

                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => {}}
                      className="text-gray-700 border-gray-300 hover:bg-gray-50"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>

                    {story.status === "ready" && (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => handleSchedulePublish(story)}
                          className="text-blue-600 border-blue-300 hover:bg-blue-50"
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Schedule
                        </Button>
                        <Button
                          onClick={() => handlePublishNow(story.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Globe className="w-4 h-4 mr-2" />
                          Publish Now
                        </Button>
                      </>
                    )}

                    {story.status === "published" && (
                      <Button
                        variant="outline"
                        className="text-gray-600 border-gray-300 hover:bg-gray-50"
                      >
                        <Printer className="w-4 h-4 mr-2" />
                        Print Version
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {getCurrentStories().length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No articles in {activeTab.toLowerCase()}
              </h3>
              <p className="text-gray-500">
                {activeTab === "Ready to Publish"
                  ? "Articles approved for publication will appear here."
                  : activeTab === "Scheduled"
                  ? "Scheduled articles will appear here."
                  : "Published articles will appear here."}
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Schedule Modal */}
      <Dialog open={scheduleModalOpen} onOpenChange={setScheduleModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Schedule Publication
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 mt-1">
                Set a specific date and time for this article to be published
                automatically.
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setScheduleModalOpen(false)}
              className="h-auto p-1 shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogHeader>

          <div className="space-y-6">
            {/* Article Title */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Article
              </Label>
              <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                {selectedStoryForScheduling?.title}
              </p>
            </div>

            {/* Date Selection */}
            <div>
              <Label
                htmlFor="schedule-date"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Publication Date
              </Label>
              <Input
                id="schedule-date"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Time Selection */}
            <div>
              <Label
                htmlFor="schedule-time"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Publication Time
              </Label>
              <Input
                id="schedule-time"
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Repeat Options */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Repeat
              </Label>
              <Select value={scheduleRepeat} onValueChange={setScheduleRepeat}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select repeat option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Don't repeat</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notification Options */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="notify-subscribers"
                  checked={notifySubscribers}
                  onCheckedChange={setNotifySubscribers}
                />
                <Label
                  htmlFor="notify-subscribers"
                  className="text-sm text-gray-700"
                >
                  Notify subscribers via email
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="priority-publish"
                  checked={priorityPublish}
                  onCheckedChange={setPriorityPublish}
                />
                <Label
                  htmlFor="priority-publish"
                  className="text-sm text-gray-700"
                >
                  Mark as priority publication
                </Label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setScheduleModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmSchedule}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                disabled={!scheduledDate || !scheduledTime}
              >
                <Clock className="w-4 h-4 mr-2" />
                Schedule
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
