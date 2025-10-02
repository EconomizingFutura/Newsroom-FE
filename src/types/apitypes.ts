export type LoginResponse = {
  accessToken: string;
};

export type contentResponse = {
  id: string | number;
  title: string;
  content: string;
  type: "TEXT" | "VIDEO" | "AUDIO";
  status: "SUBMITTED";
  remarks: string | null;
  audioUrl: string;
  videoUrl: string;
  thumbnailUrl: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  reporterId: string;
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
