import { useState, useMemo } from 'react';

interface UsePaginationOptions<T> {
  data: T[];
  pageSize: number;
}

interface UsePaginationResult<T> {
  paginatedData: T[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function usePagination<T>({ data, pageSize }: UsePaginationOptions<T>): UsePaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(data.length / pageSize));
  }, [data.length, pageSize]);

  const paginatedData = useMemo(() => {
    const start = currentPage * pageSize;
    const end = start + pageSize;
    return data.slice(start, end);
  }, [data, currentPage, pageSize]);

  const onPageChange = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  return { paginatedData, currentPage, totalPages, onPageChange };
}

export default usePagination;
