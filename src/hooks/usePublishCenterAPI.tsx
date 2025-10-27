import { POST } from "@/api/apiMethods";
import { API_LIST } from "@/api/endpoints";
import { AxiosError } from "axios";
import { useState, useCallback, useRef, useEffect } from "react";

interface UseSchedulePostProps {
  refreshDrafts?: () => void;
}

export function usePublishCenterAPI({
  refreshDrafts,
}: UseSchedulePostProps = {}) {
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const schedulePostAPI = useCallback(
    async (id: string, platforms: string[], time: string, date: string) => {
      if (!id) return;

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        setLoading(true);

        const url = API_LIST.BASE_URL + API_LIST.SCHEDULED_POST;

        await POST(
          url,
          {
            id,
            date,
            time,
            platforms,
          },
          { signal: controller.signal }
        );

        refreshDrafts?.();

        console.log("✅ Story scheduled successfully!");
      } catch (err: unknown) {
        const error = err as AxiosError;
        if (error.name === "AbortError") {
          console.warn("Request aborted");
        } else {
          console.error("Error scheduling story:", err);
        }
      } finally {
        setLoading(false);
      }
    },
    [refreshDrafts]
  );

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return { schedulePostAPI, loading };
}
