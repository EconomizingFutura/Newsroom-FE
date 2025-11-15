import React from "react";
import { Trash, MessageSquare, PenLine, Clock } from "lucide-react";
import { formatDate } from "@/utils/utils";
import { cn } from "../ui/utils";
import { ImageWithFallback } from "../ImageWithFallback";

type CardProps = {
  id: string;
  title: string;
  subtitle?: string;
  contentPreview?: string;
  updatedDate: string;
  wordCount?: number;
  savedTime?: string;
  type?: "TEXT" | "All Type" | "AUDIO" | "VIDEO";
  status?: "Auto-saved" | "REVERTED" | "DRAFT";
  remarkMessage?: string;
  thumbnailUrl?: string;
  handleDelete: (id: string) => void;
  handleEdit: (id: string) => void;
};

const Card: React.FC<CardProps> = ({
  id,
  title,
  contentPreview,
  updatedDate,
  wordCount = 0,
  savedTime,
  type = "TEXT",
  status = "Auto-saved",
  remarkMessage,
  thumbnailUrl,
  handleDelete,
  handleEdit,
}) => {
  return (
    <div
      className="
        w-full
    max-w-[358px]
    h-[294px]
    bg-white
    rounded-xl
    border
    border-gray-200
    shadow-sm
    p-6
    flex
    flex-col
    justify-between
    overflow-hidden
      "
    >
      {/* Title */}
      <h2
        className="text-base font-semibold text-gray-900 line-clamp-2 break-words text-balance"
        title={title}
      >
        {title}
      </h2>

      {/* Tags */}
      <div className="flex items-center gap-2 mt-1">
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded-md ${type === "TEXT"
            ? "bg-[#DBEAFE] border border-[#BEDBFF] text-[#193CB8]"
            : type === "AUDIO"
              ? "bg-[#F3E8FF] border border-[#EAD4FF] text-[#6D11B0]"
              : type === "VIDEO"
                ? "bg-[#FFEDD4] border border-[#FFD6A7] text-[#9F2E00]"
                : "bg-gray-200 border border-gray-300 text-gray-700"
            }`}
        >
          {type}
        </span>

        <span className="px-2 py-0.5 text-xs font-medium rounded-md border border-[#B3E6B3] text-[#006601] bg-[#f0f9f0]">
          {status}
        </span>
      </div>

      {/* Dynamic Preview Section */}
      <div className="mt-2 flex-1">
        {type === "TEXT" && (
          <p className="text-sm text-gray-600 line-clamp-2 sm:line-clamp-3 break-words min-h-[40px]">
            {contentPreview}
          </p>
        )}

        {type === "AUDIO" && (
          <div className="flex justify-center items-center">
            <ImageWithFallback
              mediaType="audio"
              src={thumbnailUrl || "/images/audio-placeholder.png"}
              alt="Audio Thumbnail"
              className="w-full h-[100px] object-cover rounded-lg"
            />
          </div>
        )}

        {type === "VIDEO" && (
          <div className="flex justify-center items-center relative">
            <ImageWithFallback
              mediaType="video"
              src={thumbnailUrl}
              alt="Video Thumbnail"
              className="w-full h-[100px] object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Remarks Section (for REVERTED) */}
      {status === "REVERTED" && remarkMessage && (
        <div className="mt-2 p-2 border border-red-300 bg-red-50 rounded-lg text-xs text-red-700 break-words">
          <div className="flex gap-1 items-start">
            <MessageSquare size={14} />
            <div>
              <div className="font-semibold text-sm">Editor Remarks</div>
              <p className="line-clamp-2">{remarkMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Info (for DRAFT) */}
      {savedTime && status === "DRAFT" && (
        <div
          className={cn(
            "grid items-center justify-between mt-2 text-[13px] text-gray-500",
            wordCount > 0 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2"
          )}
        >
          <div className="flex items-center gap-2 truncate">
            <Clock className="w-4 h-4" />
            <p className="truncate">Updated {formatDate(updatedDate)}</p>
          </div>

          {wordCount > 0 && (
            <div className="text-center truncate">
              <p>{wordCount} words</p>
            </div>
          )}

          <p className="text-[#008001] text-right">{savedTime}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mt-3">
        <button
          onClick={() => handleEdit(id)}
          className="flex-1 bg-[#008001] text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition hover:bg-[#009901]"
        >
          <PenLine className="w-5 h-5" />
          Edit
        </button>
        <button
          onClick={() => handleDelete(id)}
          className="p-2 border border-red-300 rounded-lg hover:bg-red-100 transition"
        >
          <Trash className="text-red-500" size={18} />
        </button>
      </div>
    </div>
  );
};

export default Card;
