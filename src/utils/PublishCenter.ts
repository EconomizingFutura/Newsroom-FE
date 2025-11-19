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

export interface ScheduledPost {
  date: string;
  time: string;
  isPosted: boolean;
  platform: string;
}

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
  scheduledPosts: ScheduledPost[];
  type: "TEXT" | "VIDEO" | "AUDIO";
};

export interface TransformedItem {
  id: string;
  title: string;
  start: Date;
  end: Date;
  date: string;
  type: string;
  status: string;
  platforms?: string[];
  platform?: string;
  originalScheduledTime?: string;
  audioUrl: string;
  videoUrl: string;
  thumbnailUrl: string;
  content: string;
  scheduledPosts: ScheduledPost[];
}

const normalizeTo30MinBlock = (date: Date): Date => {
  const normalized = new Date(date);
  const minutes = normalized.getMinutes();

  normalized.setMinutes(minutes < 30 ? 0 : 30);
  normalized.setSeconds(0);
  normalized.setMilliseconds(0);

  return normalized;
};


export const transformScheduleData = (
  data: ScheduledItem[],
  viewType: "month" | "week" | "day"
): TransformedItem[] => {
  console.log("Transforming data for view type:", viewType);
  const events: TransformedItem[] = [];

  data.forEach((article) => {
    if (!article.scheduledPosts?.length) return;

    if (viewType === "day" || viewType === 'week') {
      // ✅ Show each platform as separate event
      article.scheduledPosts.forEach((post) => {
        let start = new Date(`${post.date}T${post.time}`);
        start = normalizeTo30MinBlock(start);

        const end = new Date(start);
        end.setMinutes(start.getMinutes() + 30);

        events.push({
          id: `${article.id}-${post.platform}`,
          title: `${article.title} (${post.platform})`,
          date: post.date,
          type: article.type,
          status: article.status,
          platform: post.platform,
          originalScheduledTime: post.time,
          start,
          end,
          audioUrl: article.audioUrl,
          videoUrl: article.videoUrl,
          thumbnailUrl: article.thumbnailUrl,
          content: article.content,
          scheduledPosts: article.scheduledPosts,
        });
      });
    } else {
      // ✅ For month/week: group all platforms for same article + date
      const groupedByDate: Record<string, string[]> = {};

      article.scheduledPosts.forEach((post) => {
        if (!groupedByDate[post.date]) groupedByDate[post.date] = [];
        groupedByDate[post.date].push(post.platform);
      });

      Object.entries(groupedByDate).forEach(([date, platforms]) => {
        const start = new Date(`${date}T00:00:00`);
        const end = new Date(start);
        end.setMinutes(start.getMinutes() + 30);

        events.push({
          id: `${article.id}-${date}`, // group by article + date
          title: `${article.title} (${platforms.length} platforms)`,
          date,
          type: article.type,
          status: article.status,
          platform: platforms.join(", "),
          originalScheduledTime: '',
          start,
          end,
          audioUrl: article.audioUrl,
          videoUrl: article.videoUrl,
          thumbnailUrl: article.thumbnailUrl,
          content: article.content,
          scheduledPosts: article.scheduledPosts,
        });
      });
    }
  });

  return events;
};

export const stripHTML = (html: string): string => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};
