import { useState, useMemo } from 'react';

type SortDirection = 'asc' | 'desc';

interface UseSortResult<T> {
  sortedData: T[];
  sortField: keyof T | null;
  sortDirection: SortDirection;
  onSort: (field: keyof T) => void;
}

function useSort<T>(data: T[]): UseSortResult<T> {
  const [sortField, setSortField] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const onSort = (field: keyof T) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortField) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return sortDirection === 'asc' ? -1 : 1;
      if (bVal == null) return sortDirection === 'asc' ? 1 : -1;

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        const comparison = aVal.localeCompare(bVal);
        return sortDirection === 'asc' ? comparison : -comparison;
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal);
      const bStr = String(bVal);
      const comparison = aStr.localeCompare(bStr);
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortField, sortDirection]);

  return { sortedData, sortField, sortDirection, onSort };
}

export default useSort;
