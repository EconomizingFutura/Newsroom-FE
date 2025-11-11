import React, { useEffect } from "react";
import { X } from "lucide-react";
import Success from "@/assets/Success.gif";

interface SaveDraftUIProps {
  onCancel: () => void;
  saveType: "DRAFT" | "SUBMIT" | "SCHEDULE" | "PUBLISHED";
}

const SaveDraftsUI: React.FC<SaveDraftUIProps> = ({ onCancel, saveType }) => {
  const wordings =
    saveType == "DRAFT"
      ? "The article has been successfully saved as a draft."
      : "The article has been successfully submitted for review.";
  const SCHEDULEDTYPE =
    saveType == "SCHEDULE"
      ? "The article has been successfully scheduled."
      : saveType
      ? "The article has been successfully saved."
      : wordings;
  useEffect(() => {
    const timer = setTimeout(() => {
      onCancel();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="flex justify-center items-center flex-col gap-3">
        <button className=" bg-white rounded-full p-1" onClick={onCancel}>
          <X size={20} />
        </button>
        <div className="bg-white rounded-2xl flex gap-8 flex-col items-center shadow-lg py-8 px-12 min-h-80 h-full w-96 text-center">
          <img
            src={Success}
            alt="delete"
            className="max-h-40 max-w-40 h-full w-full"
          />

          <div className="flex w-full text-[#03101F] font-semibold justify-center text-[18px]">
            {SCHEDULEDTYPE}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveDraftsUI;
