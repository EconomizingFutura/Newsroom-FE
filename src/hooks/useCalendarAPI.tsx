import { useState } from "react";
import { API_LIST } from "@/api/endpoints";
import type { AxiosError } from "axios";
import { GET } from "@/api/apiMethods";

interface CancelPostResponse {
  message: string;
  status: number;
}

export function useCancelEvent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCancelAPI = async (
    id: string
  ): Promise<CancelPostResponse | null> => {
    const url = `${API_LIST.BASE_URL}${API_LIST.CANCEL_SCHEDULED_POST}/${id}`;
    setLoading(true);
    setError(null);

    try {
      const response = await GET<CancelPostResponse>(url);
      if (response.status === 200) {
        return response;
      } else {
        setError(`Unexpected status: ${response.status}`);
        return null;
      }
    } catch (err) {
      const axiosErr = err as AxiosError;
      setError(axiosErr.message || "Something went wrong");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleCancelAPI, loading, error };
}
