import {
  Captions,
  FileStack,
  ShieldX,
  CircleCheckBig,
  CalendarCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type StatusType = {
  key: keyof ApiStats;
  title: string;
  color: string;
  icon: LucideIcon;
};

export type ApiStats = {
  todaySubmissions: number;
  pendingReviews: number;
  revertedSubmissions: number;
  approvedToPublish: number;
  scheduledPosts: number;
};

export const statusConfig: StatusType[] = [
  {
    key: "todaySubmissions",
    title: "Today Submissions",
    color: "#2B7FFF",
    icon: Captions,
  },
  {
    key: "pendingReviews",
    title: "Pending Reviews",
    color: "#6A7282",
    icon: FileStack,
  },
  {
    key: "revertedSubmissions",
    title: "Reverted Submissions",
    color: "#FB2C36",
    icon: ShieldX,
  },
  {
    key: "approvedToPublish",
    title: "Approved & Ready to Publish",
    color: "#008001",
    icon: CircleCheckBig,
  },
  {
    key: "scheduledPosts",
    title: "Scheduled Posts",
    color: "#2B7FFF",
    icon: CalendarCheck,
  },
];
