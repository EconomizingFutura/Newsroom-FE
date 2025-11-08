import React, { useState, useRef, useEffect } from "react";
import { Clock, User, PenLine, Send, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SocialMediaPublishCard } from "./TextEditor/SocialMediaPublishCard";
import { SchedulePlatformCard } from "./TextEditor/SchedulePlatformCard";
import type { scheduledPost } from "@/types/apitypes";
import { createPortal } from "react-dom";
import { scheduledPlatformsUI } from "./ui/PublisCenterUI";

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
  // --- Publish card states
  const [showPublishCard, setShowPublishCard] = useState(false);
  const publishCardRef = useRef<HTMLDivElement>(null);
  const publishButtonRef = useRef<HTMLButtonElement>(null);
  const [publishButtonRect, setPublishButtonRect] = useState<DOMRect | null>(
    null
  );

  // --- Schedule card states
  const [showScheduleCard, setShowScheduleCard] = useState(false);
  const scheduleCardRef = useRef<HTMLDivElement>(null);
  const scheduleButtonRef = useRef<HTMLButtonElement>(null);
  const [scheduleButtonRect, setScheduleButtonRect] = useState<DOMRect | null>(
    null
  );

  // ------------------ Publish Now ------------------
  const handlePublishNowClick = () => {
    if (publishButtonRef.current) {
      setPublishButtonRect(publishButtonRef.current.getBoundingClientRect());
    }
    setShowPublishCard((prev) => !prev);
    setShowScheduleCard(false); // close schedule if open
  };

  const handlePublishCardPublish = (selectedPlatforms: string[]) => {
    handlePublishNow(story.id, selectedPlatforms);
    setShowPublishCard(false);
  };

  const handlePublishCardClose = () => setShowPublishCard(false);

  // ------------------ Schedule Card ------------------
  const handleScheduleClick = () => {
    if (scheduleButtonRef.current) {
      setScheduleButtonRect(scheduleButtonRef.current.getBoundingClientRect());
    }
    setShowScheduleCard((prev) => !prev);
    setShowPublishCard(false); // close publish if open
  };

  const handleScheduleCardPublish = (selectedPlatforms: string[]) => {
    handleSchedulePublish(story);
    setShowScheduleCard(false);
  };

  const handleScheduleCardClose = () => setShowScheduleCard(false);

  // ------------------ Common Position Updates ------------------
  const updatePosition = () => {
    if (publishButtonRef.current) {
      setPublishButtonRect(publishButtonRef.current.getBoundingClientRect());
    }
    if (scheduleButtonRef.current) {
      setScheduleButtonRect(scheduleButtonRef.current.getBoundingClientRect());
    }
  };

  useEffect(() => {
    if (showPublishCard || showScheduleCard) {
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
    }
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [showPublishCard, showScheduleCard]);

  // ------------------ Click Outside ------------------
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        publishCardRef.current &&
        !publishCardRef.current.contains(event.target as Node) &&
        publishButtonRef.current &&
        !publishButtonRef.current.contains(event.target as Node) &&
        scheduleCardRef.current &&
        !scheduleCardRef.current.contains(event.target as Node) &&
        scheduleButtonRef.current &&
        !scheduleButtonRef.current.contains(event.target as Node)
      ) {
        setShowPublishCard(false);
        setShowScheduleCard(false);
      }
    };

    if (showPublishCard || showScheduleCard) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPublishCard, showScheduleCard]);

  // ------------------ Render ------------------
  return (
    <div
      key={story.id}
      className="bg-white rounded-lg border border-gray-200 p-6 relative"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-[#101828]">
              {story.title}
            </h3>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{new Date(story.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{story.author}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">{scheduledPlatformsUI(story.scheduledPosts)}</div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Badge
          variant="outline"
          className="text-xs px-2 py-1 text-blue-600 hidden border-blue-200 bg-blue-50"
        >
          {story.category}
        </Badge>

        <div className="flex items-center space-x-3">
          {/* Final Edit */}
          <Button
            variant="outline"
            onClick={() => handleViewStory(story.id, story.articleType)}
            className="text-gray-700 cursor-pointer border-gray-300 hover:bg-gray-50"
          >
            <PenLine className="w-4 h-4 mr-2" />
            Final Edit
          </Button>

          {/* Publish Now */}
          <div className="relative">
            <Button
              ref={publishButtonRef}
              onClick={handlePublishNowClick}
              className="bg-[#008001] cursor-pointer hover:bg-green-700 text-white"
            >
              <Send className="w-4 h-4 mr-2" />
              Publish Now
            </Button>

            {showPublishCard &&
              createPortal(
                <div
                  ref={publishCardRef}
                  className="fixed z-50 bg-white shadow-lg rounded-lg"
                  style={{
                    top: publishButtonRect?.top ?? 0,
                    left: publishButtonRect?.left ?? 0,
                    transform: "translateY(-105%)",
                  }}
                >
                  <SocialMediaPublishCard
                    isOpen={showPublishCard}
                    onClose={handlePublishCardClose}
                    onPublish={handlePublishCardPublish}
                  />
                </div>,
                document.body
              )}
          </div>
          {story.type === "REVIEWED" && (
            <Button
              variant="outline"
              onClick={() => handleSchedulePublish(story)}
              className="bg-[#f0f9f0] text-[#006601] border hover:bg-[#f0f9f0] hover:text-[#006601] cursor-pointer border-[#B3E6B3]"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule
            </Button>
          )}

          {/* Cancel Scheduled */}
          {story && story.type === "SCHEDULED" && (
            <div className="relative">
              <Button
                ref={scheduleButtonRef}
                variant="outline"
                onClick={() => {
                  if (scheduleButtonRef.current) {
                    setScheduleButtonRect(
                      scheduleButtonRef.current.getBoundingClientRect()
                    );
                  }
                  setShowScheduleCard(true);
                }}
                className="bg-[#ffffff] text-[#FB2C36] border hover:bg-[#ffffff] hover:text-[#FB2C36] cursor-pointer border-[#FB2C36]"
              >
                <Calendar className="w-4 h-4 mr-2" color="#FB2C36" />
                Cancel
              </Button>

              {/* Show popup when clicking Cancel */}
              {showScheduleCard &&
                createPortal(
                  <div
                    ref={publishCardRef}
                    className="fixed z-50 bg-white shadow-lg rounded-lg"
                    style={{
                      top: scheduleButtonRect?.top ?? 0,
                      left: scheduleButtonRect?.left ?? 0,
                      transform: "translateY(-105%)",
                    }}
                  >
                    <SchedulePlatformCard
                      schedulePost={story.scheduledPosts}
                      isOpen={showScheduleCard}
                      onClose={() => setShowScheduleCard(false)}
                      onPublish={(platforms) => {
                        handleCancel(story.id);
                        console.log("Cancelling schedule for:", platforms);
                        setShowScheduleCard(false);
                      }}
                    />
                  </div>,
                  document.body
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryCard;
