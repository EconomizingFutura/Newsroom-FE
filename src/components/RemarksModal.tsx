import { X } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";

interface RemarksModalProps {
  onCancel: () => void;
  onConfirm?: (remarks: string) => void;
}

const RemarksModal: React.FC<RemarksModalProps> = ({ onCancel, onConfirm }) => {
  const [remark, setRemark] = useState("");
  const handleConfirm = () => {
    if (onConfirm && remark !== "") {
      onConfirm(remark);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="flex flex-col items-center justify-center gap-3">
        {/* Close Button */}
        <button className="bg-white rounded-full p-1" onClick={onCancel}>
          <X size={20} />
        </button>

        {/* Modal Box */}
        <div className="bg-white flex flex-col rounded-3xl w-full max-w-4xl">
          {/* Header + Textarea */}
          <div className="flex flex-col justify-center w-full items-center p-6">
            <div className="w-full flex flex-col gap-5">
              <p className="font-bold text-[#03101F] text-xl  leading-6">
                Write a Comment
              </p>

              <textarea
                className="min-h-[180px] min-w-[680px] max-h-[400px] w-full text-sm border border-[#ECECEC] bg-[#F7FBF7] rounded-lg p-4 outline-none resize-none"
                placeholder="comment"
                value={remark}
                onChange={(e) => {
                  const sanitizedValue = e.target.value.replace(
                    /[^a-zA-Z0-9 ]/g,
                    ""
                  );
                  setRemark(sanitizedValue);
                }}
                draggable={false}
              ></textarea>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex rounded-b-xl px-6 h-[72px] items-center bg-white shadow-[0px_2px_10px_0px_#0000001A,0px_0px_2px_0px_#00000033] w-full justify-end gap-4 py-4">
            <button
              onClick={onCancel}
              className=" h-10 w-30 text-[14px] py-2 font-semibold rounded-lg border border-[#008001] text-[#008001]"
            >
              Cancel
            </button>
            {/* <button
              type="button"
              disabled={remark === ''}
              onClick={handleConfirm}
              className="bg-[#008001] border font-circular-500 font-medium rounded-lg h-10 w-28 text-white"
            >
              Revert
            </button> */}

            <Button
              type="button"
              name="Revert"
              size="sm"
              disabled={remark === ""}
              onClick={handleConfirm}
              className="bg-[#008001] hover:bg-[#008001] border text-[14px] font-semibold rounded-lg h-10 w-30 py-2 text-white"
            >
              Revert
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemarksModal;
