import type { DraftArticle } from "@/types/draftPageTypes";
import { DELETE } from "@/api/apiMethods";
import { API_LIST } from "@/api/endpoints";
export const getTypeColor = (type: string) => {
  switch (type) {
    case "text":
      return "!bg-[#DBEAFE] !border !border-[#BEDBFF] !text-[#193CB8]";
    case "Audio":
    case "audio":
      return "!bg-[#F3E8FF] !border !border-[#EAD4FF] !text-[#6D11B0]";
    case "Video":
    case "video":
      return "!bg-[#FFEDD4] !border !border-[#FFD6A7] !text-[#9F2E00]";
    default:
      return "!bg-[#DBEAFE] !border !border-[#BEDBFF] !text-[#193CB8]";
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

export const DELETE_DRAFT_MODAL_ID = async (
  id: string,
  callBack: (draftArticles: DraftArticle[]) => void,
  state: DraftArticle[]
) => {
  const response: any = await DELETE(
    `${API_LIST.BASE_URL}${API_LIST.DELETE_ARTICLE}${id}`
  );
  if (!response?.error) {
    const filteredDrafts = state.filter((article) => article.id !== id);
    callBack(filteredDrafts);
  }
};

export const EDIT_DRAFT_NAVIGATE = (
  id: string,
  draftArticles: DraftArticle[]
): "textArticle" | "audio" | "video" => {
  const articleType =
    draftArticles.find((article) => article.id === id)?.type || "TEXT";

  switch (articleType) {
    case "TEXT":
      return "textArticle";
    case "AUDIO":
      return "audio";
    case "VIDEO":
      return "video";
    default:
      return "textArticle";
  }
};

export const HISTORY_STATUS = (status: string) => {
  switch (status.toLowerCase()) {
    case "reviewed":
    case "submitted":
      return "bg-green-100 text-green-800";
    case "review":
      return "bg-blue-100 text-blue-800";
    case "reverted":
      return "bg-red-100 text-red-800";
    case "draft":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-green-100 text-green-800";
  }
};
