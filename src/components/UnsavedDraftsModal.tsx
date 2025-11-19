import React, { useEffect } from "react";
import { X } from "lucide-react";

interface UnsavedChangesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void | Promise<void>;
  onDiscard: () => void;
  warningIcon?: string;
}

const UnsavedChangesDialog: React.FC<UnsavedChangesDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  onDiscard,
  warningIcon,
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave();
    onDiscard();
  };

  const handleDiscard = () => {
    onDiscard();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[200]">
      <div className="flex justify-center items-center flex-col gap-3">
        <button className="bg-white rounded-full p-1" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="bg-white rounded-2xl flex flex-col items-center shadow-lg p-6 max-h-80 h-full w-96 text-center">
          {warningIcon && (
            <img
              src={warningIcon || "/placeholder.svg"}
              alt="warning"
              className="max-h-24 max-w-24 h-full w-full"
            />
          )}

          <p className="text-lg text-center py-4 font-semibold">
            Are you sure you want to leave
            <br />
            without saving this form?
          </p>

          <div className="flex w-full justify-center gap-4 my-2">
            <button
              onClick={handleDiscard}
              className="px-6 py-2 w-1/2 font-semibold rounded-lg border border-[#008001] text-[#008001]"
            >
              Don't Save
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 w-1/2 font-semibold rounded-lg bg-[#008001] text-white"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnsavedChangesDialog;
