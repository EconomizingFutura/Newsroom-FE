import React, { useEffect } from "react";
import { X } from "lucide-react";
import Success from "@/assets/Success.json";
import Lottie from "lottie-react";

interface SuccessUIProps {
  onCancel: () => void;
  label: string;
}

const SuccessUI: React.FC<SuccessUIProps> = ({ onCancel, label }) => {
  const wordings = label;
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
        <div className="bg-white rounded-2xl flex flex-col items-center shadow-lg py-6 px-12 gap-8 min-h-80 h-full w-96 text-center">
          <div className="max-h-40 max-w-40 h-full w-full">
            <Lottie
              className="max-h-40 max-w-40"
              animationData={Success}
              loop={true}
            />
          </div>
          <div className="flex w-full text-[#03101F] justify-center font-semibolds gap-4 text-[18px]">
            {wordings}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessUI;
