import React from 'react';
import styles from './Pagination.module.scss';

interface NumericPaginationProps {
  page: number;
  pages: number;
  canPrevious: boolean;
  canNext: boolean;
  onPageChange: (page: number) => void;
}

const NumericPagination: React.FC<NumericPaginationProps> = ({
  page,
  pages,
  canPrevious,
  canNext,
  onPageChange,
}) => {
  const pageNumbers = Array.from({ length: pages }, (_, i) => i);

  return (
    <div className={styles.pagination}>
      <button
        className={styles.paginationButton}
        onClick={() => onPageChange(page - 1)}
        disabled={!canPrevious}
      >
        Previous
      </button>
      <div className={styles.pageNumbers}>
        {pageNumbers.map((pageNum) => (
          <button
            key={pageNum}
            className={`${styles.pageNumber} ${pageNum === page ? styles.active : ''}`}
            onClick={() => onPageChange(pageNum)}
          >
            {pageNum + 1}
          </button>
        ))}
      </div>
      <button
        className={styles.paginationButton}
        onClick={() => onPageChange(page + 1)}
        disabled={!canNext}
      >
        Next
      </button>
    </div>
  );
};

export default NumericPagination;
