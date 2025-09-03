import React, { useEffect } from "react";
import { X } from "lucide-react";
import Success from "@/assets/Success.gif";

interface SaveDraftUIProps {
  onCancel: () => void;
  saveType: "draft" | "submit";
}

const SaveDraftsUI: React.FC<SaveDraftUIProps> = ({ onCancel, saveType }) => {
  const wordings =
    saveType == "draft"
      ? "Successfully Article Stored in the Draft  !"
      : "Successfully Article Submit for the review  !";
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
        <div className="bg-white rounded-2xl flex flex-col items-center shadow-lg p-6 max-h-80 h-full w-96 text-center">
          <img
            src={Success}
            alt="delete"
            className="max-h-48 max-w-48 h-full w-full"
          />

          <div className="flex w-full text-[#03101F] font-semibold justify-center gap-4 text-xl">
            {wordings}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveDraftsUI;
