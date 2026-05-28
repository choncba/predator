import React, { useMemo } from 'react';
import styles from './Pagination.module.scss';

interface PaginationProps {
  page: number;
  pages: number;
  pageSize: number;
  dataLength: number;
  canPrevious: boolean;
  canNext: boolean;
  onPageChange: (page: number) => void;
}

function getFirstPageIndex(page: number, pageSize: number, dataLength: number): number {
  if (page === 0 && !dataLength) {
    return 0;
  }
  return page * pageSize + 1;
}

function getLastPageIndex(page: number, pageSize: number, dataLength: number): number {
  if (page === 0 && !dataLength) {
    return 0;
  }
  const startingIndex = getFirstPageIndex(page, pageSize, dataLength);
  return startingIndex + pageSize > dataLength ? dataLength : startingIndex + pageSize - 1;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  pages,
  pageSize,
  dataLength,
  canPrevious,
  canNext,
  onPageChange,
}) => {
  const currentStartingIndex = getFirstPageIndex(page, pageSize, dataLength);
  const currentEndingIndex = getLastPageIndex(page, pageSize, dataLength);

  const pagesOptions = useMemo(() => {
    const options: string[] = [];
    for (let i = 0; i < pages; i++) {
      const start = getFirstPageIndex(i, pageSize, dataLength);
      const end = getLastPageIndex(i, pageSize, dataLength);
      options.push(`${start}-${end} of ${dataLength}`);
    }
    return options;
  }, [pages, pageSize, dataLength]);

  return (
    <div className={styles.pagination}>
      <span className={styles.description}>
        <label>
          {currentStartingIndex}-{currentEndingIndex} of {dataLength}
        </label>
        {pages > 1 && (
          <div className={styles.pageSwitcher}>
            {pagesOptions.map((pageText, i) => (
              <div
                key={pageText}
                className={i === page ? styles.currentPage : undefined}
                onClick={() => onPageChange(i)}
              >
                {pageText}
              </div>
            ))}
          </div>
        )}
      </span>
      <div className={styles.arrows}>
        <button
          className={styles.arrowBtn}
          disabled={!canPrevious}
          onClick={() => canPrevious && onPageChange(page - 1)}
          aria-label="Previous page"
        >
          ‹
        </button>
        <button
          className={styles.arrowBtn}
          disabled={!canNext}
          onClick={() => canNext && onPageChange(page + 1)}
          aria-label="Next page"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default Pagination;
