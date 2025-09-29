import { MessageSquare } from "lucide-react";
interface RemarkTypes {
  remarks: string
}

export default function EditorRemarks({ remarks }: RemarkTypes) {
  return (
    <div className="border border-[#C1000866] bg-[#FEF3F2] px-4 py-2 my-4 rounded-[12px]">
      <div className=" flex space-x-2 ">
        <MessageSquare color="#9E0812" className="w-5 h-5 mt-1" />

        <div>
          <h3 className="text-[#9E0812] font-semibold flex items-center ">
            Editor Remarks
          </h3>
          <p className="text-[#C10008] text-sm">
            {remarks}
          </p>
        </div>
      </div>
    </div>
  );
}
