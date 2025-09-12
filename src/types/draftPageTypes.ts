export type ArticleType = "TEXT" | "AUDIO" | "VIDEO";
export type ArticleStatus = "Auto-saved" | "REVERTED";
export interface DraftArticle {
  id: string;
  title: string;
  type: ArticleType;
  status: ArticleStatus;
  wordCount: number;
  updatedAt: string;
  timeAgo: string;
  thumbnailUrl?: string;
  content?: string;
}

// export const draftArticles: DraftArticle[] = [
//   {
//     id: "1",
//     title: "Climate Change Report: Impact on Local Communities",
//     type: "Text",
//     status: "Auto-saved",
//     wordCount: 1247,
//     updatedAt: "15/01/2025",
//     timeAgo: "Saved 2 minutes ago",
//   },
//   {
//     id: "2",
//     title: "Climate Change Report: Impact on Local Communities",
//     type: "Text",
//     status: "Auto-saved",
//     wordCount: 1247,
//     updatedAt: "15/01/2025",
//     timeAgo: "Saved 2 minutes ago",
//   },
//   {
//     id: "3",
//     title: "Climate Change Report: Impact on Local Communities",
//     type: "Text",
//     status: "Auto-saved",
//     wordCount: 1247,
//     updatedAt: "15/01/2025",
//     timeAgo: "Saved 2 minutes ago",
//   },
//   {
//     id: "4",
//     title: "Climate Change Report: Impact on Local Communities",
//     type: "Audio",
//     status: "Auto-saved",
//     wordCount: 1247,
//     updatedAt: "15/01/2025",
//     timeAgo: "Saved 2 minutes ago",
//   },
// ];

export interface RevertedArticleTypes {
  id: string;
  title: string;
  type: ArticleType;
  status: ArticleStatus;
  wordCount: number;
  updatedAt: string;
  timeAgo: string;
  remarks: string;
  editor: string;
  thumbnailUrl?: string;
  content?: string;

}

export interface DeleteArticleProps {
  id: string | null;
  isOpen: boolean;
}
