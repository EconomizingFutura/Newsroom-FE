import React from "react";
import { X } from "lucide-react";
import Delete from "@/assets/Delete.png";

interface DeleteConfirmationProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  onConfirm,
  onCancel,
}) => {
  const handleConfirm = () => {
    onConfirm();
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="flex justify-center items-center flex-col gap-3">
        <button className=" bg-white rounded-full p-1" onClick={onCancel}>
          <X size={20} />
        </button>
        <div className="bg-white rounded-2xl flex flex-col items-center shadow-lg p-6 max-h-80 h-full w-96 text-center">
          <img
            src={Delete}
            alt="delete"
            className="max-h-24 max-w-24 h-full w-full"
          />

          <p className="text-lg text-center py-4 font-semibold">
            Are you sure want to Delete <br /> the Article ?
          </p>

          <div className="flex w-full justify-center gap-4 my-2">
            <button
              onClick={handleConfirm}
              className="px-6 py-2 w-1/2  rounded-lg border border-[#008001] text-[#008001] "
            >
              Yes
            </button>
            <button
              onClick={onCancel}
              className="px-6 py-2 w-1/2 rounded-lg bg-[#008001] text-white "
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
