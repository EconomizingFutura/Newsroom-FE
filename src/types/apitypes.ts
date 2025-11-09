import type { ScheduledPost } from "@/utils/PublishCenter";

export type LoginResponse = {
  accessToken: string;
};

export type contentResponse = {
  id: string | number;
  title: string;
  content: string;
  type: "TEXT" | "VIDEO" | "AUDIO";
  status: "SUBMITTED" | "POSTED" | "SCHEDULED";
  remarks: string | null;
  audio: string | File | null;
  audioUrl?: string | File | null;
  videoUrl: string;
  thumbnailUrl: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  scheduledPosts: scheduledPostArray[];
  reporter: {
    id: string;
    username: string;
    email: string;
  };
  editorId: string | null;
};

export type PaginationTypes = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type ArticleReviewStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "REVIEWED" /* approved */
  | "REVERTED"
  | "PUBLISHED";

export type ArticleReviewRequestBody = {
  articleId: number;
  status: "DRAFT" | "SUBMITTED" | "REVIEWED" | "REVERTED" | "PUBLISHED";
  remarks?: string;
};

export type EditorStatsData = {
  todaySubmissions: number;
  pendingReviews: number;
  revertedSubmissions: number;
  approvedToPublish: number;
  scheduledPosts: number;
};

export type EditorStatsResponse = {
  success: boolean;
  data: EditorStatsData;
};

export type scheduledPostArray = {
  platform: string;
  date: Date | string;
  time: string;
  isPosted: boolean;
};

export type scheduledPost = {
  id: string;
  title: string;
  createdAt: string;
  schuduledAt: string;
  author: string;
  articleType: "TEXT" | "VIDEO" | "AUDIO";
  audiourl: string;
  videourl: string;
  thumbnailurl: string;
  category: string;
  type: "SCHEDULED" | "REVIEWED";
  scheduledPosts: scheduledPostArray[];
};

export type scheduledPostsResponse = {
  success: boolean;
  data: {
    articles: scheduledPost[];
    pagination: PaginationTypes;
  };
  status: number;
};

export interface PublishCenterArticle {
  id: number;
  title: string;
  createdAt: string;
  author: string;
  articleType: string;
}

export interface calendarEvent {
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
  scheduledPosts: ScheduledPost[];
}

export interface CalendarEventsResponse {
  data: calendarEvent[];
  success: boolean;
}

export interface AuthorResponse {
  id: string;
  username: string;
  email: string;
}

export interface HistoryStatus {
  DRAFT: number;
  SUBMITTED: number;
  REVIEWED: number;
  REVERTED: number;
  PUBLISHED: number;
  SCHEDULED: number;
  POSTED: number;
}

export type ArticleStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "REVIEWED"
  | "REVERTED"
  | "PUBLISHED"
  | "SCHEDULED"
  | "POSTED";

export type HistoryContentResponse = {
  id: string | number;
  title: string;
  content: string;
  type: "TEXT" | "VIDEO" | "AUDIO";
  status: ArticleStatus;
  remarks: string | null;
  audio: string | File | null;
  audioUrl?: string | File | null;
  videoUrl: string;
  thumbnailUrl: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  reporterId: string;
  scheduledDate: Date | null;
  scheduledTime: string | null;
  scheduledPlatforms: string[];
  reporter: {
    id: string;
    username: string;
    email: string;
  };
  editorId: string | null;
};
export interface HistoryResponse {
  articles: HistoryContentResponse[];
  pagination: PaginationTypes;
}
export const historyStatus = (status: string) => {
  switch (status) {
    case "SUBMITTED":
    case "POSTED":
      return "bg-green-100 text-green-800 border-green-200";
    case "REVERTED":
      return "bg-red-100 text-red-800 border-red-200";
    case "SCHEDULED":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "PUBLISHED":
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};
