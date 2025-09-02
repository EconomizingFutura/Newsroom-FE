import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { BookOpen, Clock, X, Search } from "lucide-react";
import { getPriorityColor } from "@/utils/PublishCenter";
import ContentHeader from "@/components/ContentHeader";
import StoryCard, { type Story } from "@/components/StoryCard";

const FILTER_TABS = Object.freeze([
  {
    name: "Politics",
  },
  {
    name: "Business",
  },
  {
    name: "Entertainment",
  },
  {
    name: "Sports",
  },
  {
    name: "Environment",
  },
]);

const CONTENT_TABS = Object.freeze([
  {
    name: "All",
  },
  {
    name: "Scheduled",
  },
]);

const ALL_STORIES: Story[] = ([
  {
    id: "1",
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
    id: "2",
    title: "Local Sports Team Wins Championship Match",
    author: "Mike Rodriguez",
    category: "Sports",
    approvedDate: "15/01/2025 at 14:30:00",
    priority: "Medium",
    content:
      "In a thrilling match that went into overtime, the local team secured their championship...",
    status: "scheduled",
  },
  {
    id: "3",
    title: "New Technology Center Opens Downtown",
    author: "Lisa Wang",
    category: "Technology",
    approvedDate: "15/01/2025 at 12:15:00",
    priority: "Low",
    content:
      "The much-anticipated technology innovation center opened its doors to the public...",
    status: "scheduled",
  },
  {
    id: "4",
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
    id: "5",
    title: "Community Event Planning Meeting",
    author: "Emma Johnson",
    category: "Community",
    scheduledDate: "17/01/2025 at 10:00:00",
    priority: "Low",
    content:
      "Local community leaders will meet to discuss upcoming events...",
    status: "scheduled",
  },
  {
    id: "6",
    title: "Mayor Announces New Infrastructure Plan",
    author: "David Brown",
    category: "Politics",
    publishedDate: "14/1/2025 at 09:00:00",
    priority: "High",
    status: "published",
  },
]);


export function PublishCenter() {
  const [activeTab, setActiveTab] = useState("All");
  const [activeFilterTab, setActiveFilterTab] = useState("Politics");
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedStoryForScheduling, setSelectedStoryForScheduling] =
    useState<any>(null);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [scheduleRepeat, setScheduleRepeat] = useState("");
  const [notifySubscribers, setNotifySubscribers] = useState(true);
  const [priorityPublish, setPriorityPublish] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const getCurrentStories = () => {
    const result = ALL_STORIES.filter(story => story.category === activeFilterTab);
    if (activeTab === "All") {
      return result;
    } else if (activeTab === "Scheduled") {
      return result.filter(story => story.status.toLowerCase() === "scheduled");
    }
    return result;
  };

  const handlePublishNow = (storyId: string) => {
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
    setScheduledDate("");
    setScheduledTime("");
    setScheduleRepeat("");
    setNotifySubscribers(true);
    setPriorityPublish(false);
  };

  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="flex">
        {/* Main Content */}

        <main className="flex-1   p-8 ">
          {/* Header Section */}
          <ContentHeader
            text="Publish Center"
            description="Review and approved content submissions from reporters."
            iconName="Publish Center"
          />
          {/* <section
            className={cn("mt-8 max-h-[calc(100vh-25rem)] overflow-y-scroll")}
          > */}
          <section className=" sticky top-10 bg-gray-50 pt-3 z-10">
            <div className="my-6 flex items-center justify-between bg-white py-2 px-6 rounded-lg">
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
                {CONTENT_TABS.map((tab) => (
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
                  </button>
                ))}
              </div>
              <div className="relative border border-history-select-border bg-[#F7FBF7] rounded-[8px] flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 "
                />
              </div>
            </div>

            <div className="my-6 bg-white py-2 px-6 rounded-lg">
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
                {FILTER_TABS.map((tab) => (
                  <button
                    key={tab.name}
                    onClick={() => setActiveFilterTab(tab.name)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center space-x-2 ${
                      activeFilterTab === tab.name
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <span>{tab.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Stories List */}
          <div className="space-y-4">
            {getCurrentStories().map((story) => (
              <StoryCard
                story={story}
                getPriorityColor={getPriorityColor}
                handlePublishNow={handlePublishNow}
                handleSchedulePublish={handleSchedulePublish}
              />
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
            <div className="space-y-3 ">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="notify-subscribers"
                  checked={notifySubscribers}
                  onCheckedChange={(c) => setNotifySubscribers(c === true)}
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
                  onCheckedChange={(c) => setPriorityPublish(c === true)}
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
