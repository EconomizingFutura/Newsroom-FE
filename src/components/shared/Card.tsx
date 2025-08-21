import React from "react";
import { Trash, MessageSquare, PenLine, Clock } from "lucide-react";

type CardProps = {
  title: string;
  subtitle?: string;
  contentPreview?: string;
  updatedDate: string;
  wordCount?: number;
  savedTime?: string;
  type?: "Text" | "All Type" | "Audio" | "Video" | undefined;
  status?: "Auto-saved" | "Reverted";
  remarkMessage?: string;
};

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  contentPreview,
  updatedDate,
  wordCount,
  savedTime,
  type = "Text",
  status = "Auto-saved",
  remarkMessage,
}) => {
  return (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-md border border-gray-200 p-[24px] flex flex-col justify-between">
      {/* Title */}
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>

      {/* Tags */}
      <div className="flex items-center gap-2 mt-2">
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded-md ${
            type === "Text"
                ? "text-[#193CB8] border border-[#BEDBFF] bg-[#dbe9fe]"
              : type === "Audio"
              ? "bg-purple-100 text-purple-700"
              : "bg-orange-100 text-orange-700"
          }`}
        >
          {type}
        </span>
        <span className="px-2 py-0.5 text-xs font-medium rounded-md  border border-[#B3E6B3] text-[#006601] bg-[#f0f9f0]">
          Auto-saved
        </span>
      </div>

      {/* Content Preview */}
      {status === "Auto-saved" && (
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {contentPreview}
        </p>
      )}

      {/* Remark Block */}
      {status === "Reverted" && (
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
      {savedTime && status === "Auto-saved" && (<div className="flex items-center justify-between mt-3 text-xs text-gray-500">
        <div>
         <Clock className="w-5 h-5" />
          <p>Updated {updatedDate}</p>
        </div>
          <div>{wordCount && <p>{wordCount} words</p>}</div>
          
            <p className="text-green-600 font-medium">{savedTime}</p>
        </div>
      )}
      {/* Actions */}
      <div className="flex items-center gap-3 mt-3">
        <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition">
          <PenLine className="w-5 h-5" />
          Edit
        </button>
        <button className="p-2 border border-red-300 rounded-lg hover:bg-red-100 transition">
          <Trash className="text-red-500" size={18} />
        </button>
      </div>
    </div>
  );
};

export default Card;
