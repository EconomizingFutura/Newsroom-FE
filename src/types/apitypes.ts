export type LoginResponse = {
  accessToken: string;
};

export type contentResponse = {
  id: string | number;
  title: string;
  content: string;
  type: "TEXT" | "VIDEO" | "AUDIO";
  status: "SUBMITTED" | "POSTED";
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
}

export interface CalendarEventsResponse {
  data: calendarEvent[];
  success: boolean;
}
