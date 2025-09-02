import { CirclePlus, FolderOpen } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";

interface EmptyStateProps {
  state: "Text" | "Audio" | "Video";
  onCreateNew?: () => void;
}

const EmptyStateComponent: React.FC<EmptyStateProps> = ({
  state,
  onCreateNew,
}) => {
  return (
    <div
      style={{ boxShadow: "0px 2px 15px 0px #64646F1A" }}
      className="flex flex-col items-center  justify-center py-20"
    >
      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
        <FolderOpen className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-2xl font-bold text-[#000000] mb-2">
        No {state} drafts created yet
      </h3>
      <p className="text-[16px] text-[#4A5565] text-center mb-6">
        Start creating your first draft
      </p>
      <Button
        className="bg-[#008001] w-full max-w-xs hover:bg-[#008001] text-white gap-2"
        onClick={onCreateNew}
      >
        <CirclePlus className="w-4 h-4" />
        Create
      </Button>
    </div>
  );
};

export default EmptyStateComponent;
