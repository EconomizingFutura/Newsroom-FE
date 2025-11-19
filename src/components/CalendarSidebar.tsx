import { Mic, Video, X } from "lucide-react";
import { Button } from "./ui/button";
import { useRef, useState } from "react";
import { stripHTML, type TransformedItem } from "@/utils/PublishCenter";
import moment from "moment";
import { useNavigate } from "react-router";
import { ScheduledPlatformsUI } from "./ui/PublisCenterUI";
import { createPortal } from "react-dom";
import { SchedulePlatformCard } from "./TextEditor/SchedulePlatformCard";

interface CalendarSidebarProps {
  onConfirmdelete: (id: string,platforms:string[]) => void;
  onToggle: () => void;
  events: TransformedItem[];
}

interface ArticleCardProps {
  event: TransformedItem;
  onConfirmDelete?: () => void;
  onClose?: () => void;
  onCancelClick?: (
    event: TransformedItem,
    ref: React.RefObject<HTMLButtonElement | null>
  ) => void;
}

const RETURN_CONTENT = (event: TransformedItem) => {
  const hasAudio = !!event.audioUrl;
  const hasVideo = !!event.videoUrl;
  const isText = !hasAudio && !hasVideo;

  if (isText) {
    return (
      <p className="text-[14px] font-normal text-[#4A5565] line-clamp-2">
        {stripHTML(event.content)}
      </p>
    );
  }

  if (hasAudio) {
    return (
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-100">
          <Mic className="text-purple-700 w-6 h-6" />
        </div>
        <audio controls className="w-full">
          <source src={event.audioUrl} type="audio/mpeg" />
        </audio>
      </div>
    );
  }

  if (hasVideo) {
    return (
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[linear-gradient(180deg,#FFEDD4_0%,#FEE6C5_100%)]">
          <Video size={20} color="#9F2E00" className=" w-6 h-6" />
        </div>
        <video controls className="w-full hidden rounded-lg">
          <source src={event.videoUrl} type="video/mp4" />
        </video>
      </div>
    );
  }
};

const Article = ({ event, onCancelClick }: ArticleCardProps) => {
  const navigate = useNavigate();
const cancelButtonRef = useRef<HTMLButtonElement | null>(null);
  const showCancel = event.scheduledPosts.some((a) => !a.isPosted);

  const handleViewStory = () => {
    navigate(`/editor/viewcontent/${event.id.split("-")[0]}?from=calendar`, {
      state: { articletype: event.type, editable: true },
    });
  };

  return (
    <div className="bg-[#F3FFF3] flex flex-col p-4 gap-4 rounded-2xl">
      <h1 className="text-[16px] font-bold line-clamp-1">{event.title}</h1>

      {RETURN_CONTENT(event)}

      <div>
        <ScheduledPlatformsUI scheduledArr={event.scheduledPosts} columns={2} />
      </div>

      <div className="flex h-[34px] gap-4 text-[14px] justify-start">
        <Button
          onClick={handleViewStory}
          className="h-full hover:bg-[#FFFFFF] px-4 py-1.5 border border-[#008001] bg-[#FFFFFF] text-[#008001]"
        >
          View {event.type === "TEXT" ? "Article" : event.type}
        </Button>

        {/* CANCEL BUTTON */}
        {showCancel && (
          <Button
            ref={cancelButtonRef}
            onClick={() => onCancelClick?.(event, cancelButtonRef)}
            className="h-full bg-[#FFFFFF] hover:bg-[#FFFFFF] border border-[#1E2939] text-[#1E2939]"
          >
            <X /> <span>Cancel Schedule</span>
          </Button>
        )}
      </div>
    </div>
  );
};

const CalendarSidebar = ({
  onConfirmdelete,
  onToggle,
  events,
}: CalendarSidebarProps) => {
  const [showCancelCard, setShowCancelCard] = useState(false);
  const [cancelEvent, setCancelEvent] = useState<TransformedItem | null>(null);
  const [cancelButtonRect, setCancelButtonRect] = useState<DOMRect | null>(
    null
  );

  const handleCancelClick = (
    event: TransformedItem,
    ref: React.RefObject<HTMLButtonElement | null>
  ) => {
    setCancelEvent(event);
    if (ref.current) {
      setCancelButtonRect(ref.current.getBoundingClientRect());
    }
    setShowCancelCard(true);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-end bg-black/50 z-50">
      <div className="flex p-4 flex-col gap-3 max-w-xl w-full h-full bg-white">
        <div className="flex border-b border-[#E0E0E0] py-2 items-center justify-between w-full">
          <h1 className="text-[#1E2939] text-[21px] font-bold">
            {moment(events[0]?.start).format("MMMM Do, YYYY")}
          </h1>
          <X size={24} onClick={onToggle} />
        </div>

        <div className="flex flex-col gap-3 py-2 overflow-y-auto">
          {events.length > 0 ? (
            events.map((event) => (
              <Article
                key={event.id}
                event={event}
                onCancelClick={handleCancelClick}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center py-10">
              No events scheduled for this day.
            </p>
          )}
        </div>
      </div>

      {/* PLATFORM SELECTION POPUP */}
      {showCancelCard &&
        createPortal(
          <div
            className="fixed z-[999] bg-white rounded-lg shadow-lg"
            style={{
              top: cancelButtonRect?.top ?? 0,
              left: cancelButtonRect?.left ?? 0,
              transform: "translateY(-104%)",
            }}
          >
            <SchedulePlatformCard
              schedulePost={cancelEvent?.scheduledPosts || []}
              isOpen={showCancelCard}
              onClose={() => setShowCancelCard(false)}
              onPublish={(platforms) => {
                if (cancelEvent) {
                  onConfirmdelete(cancelEvent.id, platforms);
                }
                setShowCancelCard(false);
              }}
            />
          </div>,
          document.body
        )}
    </div>
  );
};

export default CalendarSidebar;
