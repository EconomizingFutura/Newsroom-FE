import React, { useState, useRef, useEffect } from "react";

import { Clock, User, PenLine, Send, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SocialMediaPublishCard } from "./TextEditor/SocialMediaPublishCard";
import type { scheduledPost } from "@/types/apitypes";
import { convertISOToReadable } from "@/utils/utils";

interface StoryCardProps {
  story: scheduledPost;
  getPriorityColor: (priority: string) => string;
  handlePublishNow: (id: string, platforms: string[]) => void;
  handleSchedulePublish: (story: scheduledPost) => void;
  handleCancel: (id: string) => void;
  handleViewStory: (id: string, text: "TEXT" | "VIDEO" | "AUDIO") => void;
}
const StoryCard: React.FC<StoryCardProps> = ({
  story,
  handlePublishNow,
  handleSchedulePublish,
  handleCancel,
  handleViewStory,
}) => {
  const [showPublishCard, setShowPublishCard] = useState(false);
  const publishCardRef = useRef<HTMLDivElement>(null);
  const publishButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        publishCardRef.current &&
        !publishCardRef.current.contains(event.target as Node) &&
        publishButtonRef.current &&
        !publishButtonRef.current.contains(event.target as Node)
      ) {
        setShowPublishCard(false);
      }
    };

    if (showPublishCard) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPublishCard]);

  const handlePublishNowClick = () => {
    setShowPublishCard(!showPublishCard);
  };

  const handlePublishCardClose = () => {
    setShowPublishCard(false);
  };

  const handlePublishCardPublish = (selectedPlatforms: string[]) => {
    handlePublishNow(story.id, selectedPlatforms);
    console.log("Publishing to platforms:", selectedPlatforms);
    setShowPublishCard(false);
  };

  return (
    <div
      key={story.id}
      className="bg-white rounded-lg border border-gray-200 p-6 relative"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-[#101828] ">
              {story.title}
            </h3>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{new Date(story.createdAt).toLocaleString()} </span>
            </div>
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{story.author}</span>
            </div>
          </div>
          {/* <p className="text-gray-700 leading-relaxed mb-4">{story.content}</p> */}
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
            onClick={() => handleViewStory(story.id, story.articleType)}
            className="text-gray-700 cursor-pointer border-gray-300 hover:bg-gray-50"
          >
            <PenLine className="w-4 h-4 mr-2" />
            Final Edit
          </Button>

          <>
            <div className="relative">
              <Button
                ref={publishButtonRef}
                onClick={handlePublishNowClick}
                className="bg-[#008001] cursor-pointer hover:bg-green-700 text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                Publish Now
              </Button>

              {showPublishCard && (
                <div
                  ref={publishCardRef}
                  className="absolute bottom-full right-0 mb-2 z-10"
                >
                  <SocialMediaPublishCard
                    isOpen={showPublishCard}
                    onClose={handlePublishCardClose}
                    onPublish={handlePublishCardPublish}
                  />
                </div>
              )}
            </div>
            {story.type == "REVIEWED" && (
              <Button
                variant="outline"
                onClick={() => handleSchedulePublish(story)}
                className="bg-[#f0f9f0] text-[#006601] border hover:bg-[#f0f9f0] hover:text-[#006601] cursor-pointer border-[#B3E6B3]"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Schedule
              </Button>
            )}
            {story && story.type == "SCHEDULED" && (
              <Button
                variant="outline"
                onClick={() => handleCancel(story.id)}
                className="bg-[#ffffff] text-[#FB2C36] border hover:bg-[#ffffff] hover:text-[#FB2C36] cursor-pointer border-[#FB2C36]"
              >
                <Calendar className="w-4 h-4 mr-2" color="#FB2C36" />
                Cancel ({convertISOToReadable(story?.schuduledAt)})
              </Button>
            )}
          </>
        </div>
      </div>
    </div>
  );
};

export default StoryCard;
