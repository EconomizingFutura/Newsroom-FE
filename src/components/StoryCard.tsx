import React from "react";

import {
  Clock,
  User,
  Eye,
  PenLine,
  Send,
  Calendar,
  Printer,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type Story = {
  id: string;
  title: string;
  priority: string;
  status: "ready" | "published" | "scheduled" | "approved";
  publishedDate?: string;
  scheduledDate?: string;
  approvedDate?: string;
  author: string;
  views?: number;
  content?: string;
  category: string;
};

interface StoryCardProps {
  story: Story;
  getPriorityColor: (priority: string) => string;
  handlePublishNow: (id: string) => void;
  handleSchedulePublish: (story: Story) => void;
}
const StoryCard: React.FC<StoryCardProps> = ({
  story,
  getPriorityColor,
  handlePublishNow,
  handleSchedulePublish,
}) => {
  return (
    <div
      key={story.id}
      className="bg-white rounded-lg border border-gray-200 p-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {story.title}
            </h3>
            <Badge
              className={`text-xs px-2 py-1 hidden ${getPriorityColor(
                story.priority
              )}`}
            >
              {story.priority}
            </Badge>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>
                {story.status === "published"
                  ? story.publishedDate
                  : story.status === "scheduled"
                  ? story.scheduledDate
                  : story.approvedDate}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{story.author}</span>
            </div>
            {story.views && (
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{story.views} views</span>
              </div>
            )}
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">{story.content}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Badge
          variant="outline"
          className="text-xs px-2 py-1 text-blue-600 hidden border-blue-200 bg-blue-50"
        >
          {story.category}
        </Badge>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            className="text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            <PenLine className="w-4 h-4 mr-2" />
            Final Edit
          </Button>

          {story.status === "ready" && (
            <>
              <Button
                onClick={() => handlePublishNow(story.id)}
                className="bg-[#008001] hover:bg-green-700 text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                Publish Now
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSchedulePublish(story)}
                className="bg-[#f0f9f0] text-[#006601] border border-[#B3E6B3]"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Schedule
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
  );
};

export default StoryCard;
