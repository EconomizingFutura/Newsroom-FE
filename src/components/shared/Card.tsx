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
  thumbnailUrl?: string; // 👈 supports both AUDIO + VIDEO
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
  console.log(thumbnailUrl)
  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-gray-200 max-h-[300px] p-[24px] flex flex-col justify-between">
      {/* Title */}
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>

      {/* Tags */}
      <div className="flex items-center gap-2 mt-2">
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
      <div className="mt-2">
        {/* TEXT */}
        {type === "TEXT" && (
          <p className="text-sm text-gray-600  min-h-20 line-clamp-2">{contentPreview}</p>
        )}

        {/* AUDIO */}
        {type === "AUDIO" && (
          <div className="flex justify-center items-center">
            <ImageWithFallback
              mediaType="audio"
              src={thumbnailUrl || "/images/audio-placeholder.png"}
              alt="Audio Thumbnail"
              className="w-full h-32 object-cover rounded-lg"
            />
          </div>
        )}

        {/* VIDEO */}
        {type === "VIDEO" && (
          <div className="flex justify-center items-center relative">
            <ImageWithFallback
            mediaType="video"
              src={thumbnailUrl || "/images/video-placeholder.png"}
              alt="Video Thumbnail"
              className="w-full h-32 object-cover rounded-lg"
            />
            {/* Play overlay */}
            {/* <div className="absolute inset-0 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-white bg-black bg-opacity-50 rounded-full p-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div> */}
          </div>
        )}
      </div>

      {/* Remark Block */}
      {status === "REVERTED" && (
        <div className="mt-3 p-3 border border-red-300 bg-red-50 rounded-lg text-sm text-red-700">
          <div className="flex gap-[8px]">
            <MessageSquare size={18} />
            <div>
              <div className="flex items-center font-semibold">
                Editor Remarks
              </div>
              <p className="text-xs leading-snug">{remarkMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      {savedTime && status === "DRAFT" && (
        <div
          className={cn(
            "grid items-center justify-between mt-3 text-[14px] text-gray-500",
            wordCount > 0 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2"
          )}        >
          <div className="flex items-center  gap-2">
            <Clock className="w-5 h-5" />
            <p>Updated {formatDate(updatedDate)} </p>
          </div>
          {wordCount > 0 && <div className="text-center ">{wordCount && <p>{wordCount} words</p>}</div>}
          <p className="text-green-600 ">{savedTime}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 mt-3">
        <button
          onClick={() => handleEdit(id)}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition"
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