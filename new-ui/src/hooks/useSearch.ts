import { useState, useMemo } from 'react';

interface UseSearchOptions<T> {
  data: T[];
  searchableFields: (keyof T)[];
}

interface UseSearchResult<T> {
  searchValue: string;
  setSearchValue: (value: string) => void;
  filteredData: T[];
}

function useSearch<T>({ data, searchableFields }: UseSearchOptions<T>): UseSearchResult<T> {
  const [searchValue, setSearchValue] = useState('');

  const filteredData = useMemo(() => {
    if (!searchValue.trim()) {
      return data;
    }

    const lowerSearch = searchValue.toLowerCase();

    return data.filter((item) =>
      searchableFields.some((field) => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(lowerSearch);
        }
        if (typeof value === 'number') {
          return String(value).includes(lowerSearch);
        }
        return false;
      })
    );
  }, [data, searchValue, searchableFields]);

  return { searchValue, setSearchValue, filteredData };
}

export default useSearch;
