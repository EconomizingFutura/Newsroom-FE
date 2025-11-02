import { useState, useCallback, useRef, useEffect } from "react";
import { POST } from "@/api/apiMethods";
import { API_LIST } from "@/api/endpoints";
import { AxiosError } from "axios";

interface UsePublishCenterAPIProps {
  refreshDrafts?: () => void;
}

export function usePublishCenterAPI({
  refreshDrafts,
}: UsePublishCenterAPIProps = {}) {
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const url = `${API_LIST.BASE_URL}${API_LIST.SCHEDULED_POST}`;

  const schedulePostAPI = useCallback(
    async (id: string, platforms: string[], time: string, date: string) => {
      if (!id) {
        console.warn("❌ Missing 'id' for scheduling post");
        return;
      }

      // Abort any existing request before starting a new one
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        setLoading(true);

        await POST(
          url,
          { id, date, time, platforms },
          { signal: controller.signal }
        );

        refreshDrafts?.();
        console.log("✅ Story scheduled successfully!");
      } catch (err) {
        if (err instanceof AxiosError) {
          if (err.name === "CanceledError" || err.name === "AbortError") {
            console.warn("⚠️ Request aborted");
          } else {
            console.error(
              "❌ Axios error scheduling story:",
              err.response?.data || err.message
            );
          }
        } else {
          console.error("❌ Unexpected error scheduling story:", err);
        }
      } finally {
        setLoading(false);
      }
    },
    [url, refreshDrafts]
  );

  const editSchedulePostAPI = useCallback(
    async (id: string, platforms: string[], time: string, date: string) => {
      if (!id) {
        return;
      }

      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        setLoading(true);

        await POST(
          url,
          { id, date, time, platforms },
          { signal: controller.signal }
        );

        refreshDrafts?.();
      } catch (err) {
        if (err instanceof AxiosError) {
          console.error(err.response?.data || err.message);
        } else {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    },
    [url, refreshDrafts]
  );

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return { schedulePostAPI, editSchedulePostAPI, loading };
}
