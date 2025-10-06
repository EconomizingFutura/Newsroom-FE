import * as React from "react";

import { cn } from "./utils";
type StatCardProps = {
  title: string;
  count: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
};

type NotificationCardProps = {
  title: string;
  message: string;
  buttonText: string;
  id: string;
  onClick: (id: string) => void;
};

interface StatsCardProps {
  title: string;
  value: string | number;
  pillBg?: string; // Tailwind bg color class for title pill
  pillText?: string; // Tailwind text color class for title text
}

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <h4
      data-slot="card-title"
      className={cn("leading-none", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 [&:last-child]:pb-6", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 pb-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

function StatCard({ title, count, icon: Icon, color }: StatCardProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl shadow-md bg-white p-5 max-w-[230px] w-full">
      {/* Left Section */}
      <div>
        <p className="text-gray-500 text-sm max-w-28 font-medium">{title}</p>
        <p className="text-2xl font-semibold text-gray-900 mt-1">{count}</p>
      </div>

      {/* Right Icon */}
      <div className={`p-3 rounded-xl`} style={{ backgroundColor: color }}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  );
}

function DashboardListCard({
  title,
  message,
  buttonText,
  id,
  onClick,
}: NotificationCardProps) {
  return (
    <div className="flex items-center justify-between bg-red-50 rounded-xl p-4 shadow-sm">
      {/* Left Section */}
      <div>
        <p className="font-semibold warning-color mb-[8px]">{title}</p>
        <p className="text-[#E7000B]">{message}</p>
      </div>

      {/* Right Button */}
      <button
        onClick={() => onClick(id)}
        className="px-4 py-2 cursor-pointer rounded-lg bg-[linear-gradient(90deg,#FB2C36_0%,#E7000B_100%)] text-white font-semibold w-max text-[14px] transition"
      >
        {buttonText}
      </button>
    </div>
  );
}

function HistoryCard({
  title,
  value,
  pillBg = "bg-gray-100",
  pillText = "text-gray-600",
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center justify-center">
      <div
        className={`text-[14px] font-[600] px-6 py-2 rounded-full ${pillBg} ${pillText}`}
      >
        {title}
      </div>
      <div className="text-3xl font-bold mt-4">{value}</div>
    </div>
  );
}

import { Button } from "@/components/ui/button";

interface StoryCardProps {
  title: string;
  description: string;
  onView: () => void;
}

export default function StoryCard({
  title,
  description,
  onView,
}: StoryCardProps) {
  return (
    <div className="flex items-center justify-between rounded-md bg-green-50 px-6 py-4">
      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-semibold text-[#1E2939]">
          Article For Review
        </h4>
        <p className="text-sm text-[#6A7282]">
          Your article "{title}: {description}"
        </p>
      </div>

      <Button
        size="sm"
        onClick={onView}
        className="rounded-md bg-[#008001] hover:bg-[#008001] cursor-pointer px-4 py-1 text-sm font-medium text-white "
      >
        View Story
      </Button>
    </div>
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  StatCard,
  DashboardListCard,
  HistoryCard,
  StoryCard,
};
