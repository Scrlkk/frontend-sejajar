import { useState, useCallback } from 'react';

export interface UsePaginationResult {
  page: number;
  limit: number;
  offset: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  reset: () => void;
}

export function usePagination(defaultLimit = 20): UsePaginationResult {
  const [page, setPage] = useState(1);
  const [limit] = useState(defaultLimit);

  const goToPage = useCallback((targetPage: number) => {
    setPage(Math.max(1, targetPage));
  }, []);

  const nextPage = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  const prevPage = useCallback(() => {
    setPage((prev) => Math.max(1, prev - 1));
  }, []);

  const reset = useCallback(() => {
    setPage(1);
  }, []);

  const offset = (page - 1) * limit;

  return {
    page,
    limit,
    offset,
    goToPage,
    nextPage,
    prevPage,
    reset,
  };
}
