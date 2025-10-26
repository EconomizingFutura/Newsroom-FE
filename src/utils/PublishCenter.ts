export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800 border-red-200";
    case "Medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Low":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

type ScheduledItem = {
  id: number;
  title: string;
  scheduledDate: string;
  scheduledTime: string;
  scheduledPlatforms: string[];
  audioUrl: string;
  videoUrl: string;
  thumbnailUrl: string;
  status: "SCHEDULED" | "POSTED";
  content: string;
  type: "TEXT" | "VIDEO" | "AUDIO";
};

export type TransformedItem = {
  id: number;
  title: string;
  start: Date;
  end: Date;
  scheduledPlatforms: string[];
  audioUrl: string;
  videoUrl: string;
  thumbnailUrl: string;
  scheduledDate: string;
  status: "SCHEDULED" | "POSTED";
  type: "TEXT" | "VIDEO" | "AUDIO";
  content: string;
};

export const transformScheduleData = (
  data: ScheduledItem[]
): TransformedItem[] => {
  return data.map((item) => {
    const start = new Date(item.scheduledDate);
    const [hours, minutes, seconds = "0"] = item.scheduledTime.split(":");
    start.setHours(Number(hours), Number(minutes), Number(seconds));

    const end = new Date(start);
    end.setMinutes(start.getMinutes() + 30);

    return {
      ...item,
      start,
      end,
    };
  });
};

export const stripHTML = (html: string): string => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};
