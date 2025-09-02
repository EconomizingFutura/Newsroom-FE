import { useState, useCallback, useMemo } from "react";

interface UsePaginationProps {
  initialPage?: number;
  totalPages: number;
  initialPageSize: number;
}

export const usePagination = ({
  initialPage = 1,
  totalPages,
  initialPageSize = 10,
}: UsePaginationProps) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const handlePageChange = useCallback((event: { selected: number }) => {
    setCurrentPage(event.selected + 1);
  }, []);

  const goToNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const goToPrevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const totalPage = useMemo(() => {
    return Math.ceil(totalPages / pageSize) || 1;
  }, [pageSize, totalPages]);
  return {
    currentPage,
    pageCount: totalPage,
    setCurrentPage,
    handlePageChange,
    goToNextPage,
    goToPrevPage,
    resetPage,
    pageSize,
    setPageSize,
  };
};
