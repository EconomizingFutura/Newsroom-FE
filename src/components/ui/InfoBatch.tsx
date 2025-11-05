import React from "react";
import { Clock, User } from "lucide-react";

interface InfoBadgeProps {
  type: "date" | "user";
  value: string;
}

const InfoBadge: React.FC<InfoBadgeProps> = ({ type, value }) => {
  return (
    <div className="flex items-center gap-1 rounded-[8px] border px-3 py-1 text-sm text-[#6A7282] bg-[#F8FAF9] border-[#E5E7EB] ">
      {type === "date" && <Clock size={14} />}
      {type === "user" && <User size={14} />}
      <span>{value}</span>
    </div>
  );
};

export default InfoBadge;
