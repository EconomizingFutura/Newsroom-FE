import { useState } from "react";
import { API_LIST } from "@/api/endpoints";
import { GET, POST } from "@/api/apiMethods";
import type { AxiosError } from "axios";
import type {
  ArticleReviewRequestBody,
  ArticleReviewStatus,
  contentResponse,
  EditorStatsResponse,
  PaginationTypes,
} from "@/types/apitypes";

interface ReviewArticleResponse {
  success: boolean;
  data: contentResponse[];
  pagination: PaginationTypes;
}

export const useEditorReviewArticle = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reviewArticle = async (
    category: string,
    page: number,
    pageSize: number
  ) => {
    const params = new URLSearchParams();
    params.append("category", category);
    params.append("page", page.toString());
    params.append("pageSize", pageSize.toString());

    const API_URL =
      API_LIST.BASE_URL +
      API_LIST.EDITOR_REVIEW_ARTICLE +
      `?${params.toString()}`;

    try {
      setIsLoading(true);
      setError(null);
      const response = (await GET(API_URL)) as ReviewArticleResponse;
      return response;
    } catch (err) {
      const axiosError = err as AxiosError;
      console.error("Error fetching articles:", axiosError);
      setError("Failed to fetch articles. Please try again.");
      throw axiosError;
    } finally {
      setIsLoading(false);
    }
  };

  const revertArticle = async (
    id: string,
    status: ArticleReviewStatus,
    remarks?: string
  ) => {
    const REVERT_API_URL = API_LIST.BASE_URL + API_LIST.REVIEW_ARTICLE;

    const requestBody: ArticleReviewRequestBody = {
      articleId: Number(id),
      status,
    };

    if (remarks) {
      requestBody.remarks = remarks;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = (await POST(
        REVERT_API_URL,
        requestBody
      )) as ReviewArticleResponse;
      return response;
    } catch (err) {
      const axiosError = err as AxiosError;
      console.error("Error fetching articles:", axiosError);
      setError("Failed to fetch articles. Please try again.");
      throw axiosError;
    } finally {
      setIsLoading(false);
    }
  };

  const getEditorArticleStats = async () => {
    const REVERT_API_URL = API_LIST.BASE_URL + API_LIST.EDITOR_STATS;
    try {
      setIsLoading(true);
      const response = (await GET(REVERT_API_URL)) as EditorStatsResponse;
      return response;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error fetching stats:", axiosError);
      setError("Failed to fetch stats. Please try again.");
      throw axiosError;
    } finally {
      setIsLoading(false);
    }
  };

  const getArticleById = async (id: string) => {
    const REVERT_API_URL = API_LIST.BASE_URL + API_LIST.GET_ARTICLE + "/" + id;
    try {
      setIsLoading(true);
      setError(null);
      const response = (await GET(REVERT_API_URL)) as contentResponse;
      return response;
    } catch (err) {
      const axiosError = err as AxiosError;
      console.error("Error fetching articles:", axiosError);
      setError("Failed to fetch articles. Please try again.");
      throw axiosError;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    reviewArticle,
    revertArticle,
    getEditorArticleStats,
    getArticleById,
  };
};
