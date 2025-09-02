import type {
  DraftArticle,
  RevertedArticleTypes,
} from "@/types/draftPageTypes";

export const getTypeColor = (type: string) => {
  switch (type) {
    case "Text":
      return "bg-[#DBEAFE] border border-[#BEDBFF] text-[#193CB8]";
    case "Audio":
      return "bg-[#F3E8FF] border border-[#EAD4FF] text-[#6D11B0]";
    case "Video":
      return "bg-[#FFEDD4] border border-[#FFD6A7] text-[#9F2E00]";
    default:
      return "bg-[#DBEAFE] border border-[#BEDBFF] text-[#193CB8]";
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "Auto-saved":
      return "bg-[#F0F9F0] border border-[#B3E6B3] text-[#006601]";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const DELETE_DRAFT_MODAL_ID = (
  id: string,
  callBack: (draftArticles: DraftArticle[]) => void,
  state: DraftArticle[]
) => {
  const filteredDrafts = state.filter((article) => article.id !== id);

  callBack(filteredDrafts);
};

export const EDIT_DRAFT_NAVIGATE = (
  id: string,
  draftArticles: DraftArticle[]
): "textArticle" | "audio" | "video" => {
  const articleType =
    draftArticles.find((article) => article.id === id)?.type || "Text";

  switch (articleType) {
    case "Text":
      return "textArticle";
    case "Audio":
      return "audio";
    case "Video":
      return "video";
    default:
      return "textArticle";
  }
};

// Mock reverted articles data
export const revertedArticlesData: RevertedArticleTypes[] = [
  {
    id: "1",
    title: "Climate Change Report: Impact on Local Communities",
    type: "Text",
    status: "Reverted",
    wordCount: 1247,
    lastUpdated: "14/01/2025",
    timeAgo: "Reverted 1 day ago",
    reason:
      "Factual inconsistencies found in paragraph 3. Sources need verification.",
    editor: "John Smith",
  },
  {
    id: "2",
    title: "Economic Impact of Local Business Closures",
    type: "Text",
    status: "Reverted",
    wordCount: 892,
    lastUpdated: "13/01/2025",
    timeAgo: "Reverted 2 days ago",
    reason: "Article lacks supporting evidence for statistical claims.",
    editor: "Sarah Johnson",
  },
  {
    id: "3",
    title: "Traffic Management Solutions for City Center",
    type: "Text",
    status: "Reverted",
    wordCount: 1156,
    lastUpdated: "12/01/2025",
    timeAgo: "Reverted 3 days ago",
    reason: "Interview quotes need verification and proper attribution.",
    editor: "Mike Davis",
  },
];

export const HISTORY_STATUS = (status: string) => {
  switch (status.toLowerCase()) {
    case "approved":
    case "submitted":
      return "bg-green-100 text-green-800";
    case "review":
      return "bg-blue-100 text-blue-800";
    case "reverted":
      return "bg-red-100 text-red-800";
    case "draft":
      return "bg-orange-100 text-orange-800";
    default:
      return "";
  }
};
