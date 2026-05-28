import React, { useState, useMemo, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import classnames from 'classnames';
import Pagination from './Pagination';
import NumericPagination from './NumericPagination';
import SearchBar from './SearchBar';
import styles from './ReactTable.module.scss';

interface TableColors {
  background?: { default?: string; selected?: string };
  text?: { default?: string; selected?: string };
  header?: { default?: string };
}

export interface ReactTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  pageSize?: number;
  noDataText?: string;
  onSearch?: (value: string) => void;
  selectRow?: (rowId: string | null) => void;
  selectedRow?: string | null;
  sortEvent?: (columnId: string) => void;
  onPageChange?: (page: number) => void;
  manual?: boolean;
  totalDataCount?: number;
  pages?: number;
  page?: number;
  rowHeight?: string;
  cursor?: string;
  resizable?: boolean;
  searchSections?: React.ReactNode[];
  colors?: TableColors;
  tableRowId?: string;
  showPagination?: boolean;
  numericPagination?: boolean;
  tdStyle?: React.CSSProperties;
  style?: React.CSSProperties;
}

const DEFAULT_COLORS: TableColors = {
  background: {
    default: '#fff',
    selected: '#108ee9',
  },
  text: {
    default: '#000',
    selected: '#fff',
  },
  header: {
    default: '#108ee9',
  },
};

const DEFAULT_PAGE_SIZE = 20;

function ReactTable<T extends Record<string, unknown>>({
  data,
  columns,
  pageSize = DEFAULT_PAGE_SIZE,
  noDataText = 'There is no data',
  onSearch,
  selectRow,
  selectedRow: controlledSelectedRow,
  sortEvent,
  onPageChange,
  manual = false,
  totalDataCount,
  pages: manualPages,
  page: controlledPage,
  rowHeight,
  cursor = 'pointer',
  searchSections,
  colors = {},
  tableRowId = 'id',
  showPagination = true,
  numericPagination = false,
  tdStyle,
  style: customStyle,
}: ReactTableProps<T>): React.ReactElement {
  const [internalSelectedRow, setInternalSelectedRow] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const currentSelectedRow = controlledSelectedRow !== undefined ? controlledSelectedRow : internalSelectedRow;

  const backgroundColors = useMemo(
    () => ({ ...DEFAULT_COLORS.background, ...colors.background }),
    [colors.background]
  );
  const textColors = useMemo(
    () => ({ ...DEFAULT_COLORS.text, ...colors.text }),
    [colors.text]
  );
  const headerColors = useMemo(
    () => ({ ...DEFAULT_COLORS.header, ...colors.header }),
    [colors.header]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter: manual ? undefined : globalFilter,
      ...(manual && controlledPage !== undefined ? { pagination: { pageIndex: controlledPage, pageSize } } : {}),
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: manual ? undefined : getSortedRowModel(),
    getFilteredRowModel: manual ? undefined : getFilteredRowModel(),
    getPaginationRowModel: manual ? undefined : getPaginationRowModel(),
    manualPagination: manual,
    manualSorting: manual,
    manualFiltering: manual,
    pageCount: manual ? manualPages : undefined,
    initialState: {
      pagination: {
        pageSize,
        pageIndex: 0,
      },
    },
  });

  const handleRowClick = useCallback(
    (row: T) => {
      const rowId = String(row[tableRowId] ?? '');
      const newSelection = rowId === currentSelectedRow ? null : rowId;

      if (controlledSelectedRow === undefined) {
        setInternalSelectedRow(newSelection);
      }

      if (selectRow) {
        selectRow(newSelection);
      }
    },
    [tableRowId, currentSelectedRow, controlledSelectedRow, selectRow]
  );

  const handleSearch = useCallback(
    (value: string) => {
      if (manual && onSearch) {
        onSearch(value);
      } else {
        setGlobalFilter(value);
        if (onSearch) {
          onSearch(value);
        }
      }
    },
    [manual, onSearch]
  );

  const handlePageChange = useCallback(
    (pageIndex: number) => {
      if (manual && onPageChange) {
        onPageChange(pageIndex);
      } else {
        table.setPageIndex(pageIndex);
      }
    },
    [manual, onPageChange, table]
  );

  const handleSortClick = useCallback(
    (columnId: string) => {
      if (manual && sortEvent) {
        sortEvent(columnId);
      } else {
        setSorting((prev) => {
          const existing = prev.find((s) => s.id === columnId);
          if (!existing) {
            return [{ id: columnId, desc: true }];
          }
          if (existing.desc) {
            return [{ id: columnId, desc: false }];
          }
          return [];
        });
      }
    },
    [manual, sortEvent]
  );

  const rows = table.getRowModel().rows;
  const headerGroups = table.getHeaderGroups();

  const currentPage = manual ? (controlledPage ?? 0) : table.getState().pagination.pageIndex;
  const totalPages = manual ? (manualPages ?? 1) : table.getPageCount();
  const dataLength = manual ? (totalDataCount ?? data.length) : table.getFilteredRowModel().rows.length;

  return (
    <div style={customStyle}>
      {onSearch && <SearchBar searchSections={searchSections} onSearch={handleSearch} />}
      <div className={styles.tableWrapper}>
        {data.length === 0 && !rows.length ? (
          <div className={styles.noData}>{noDataText}</div>
        ) : (
          <table className={styles.table}>
            <thead
              className={styles.thead}
              style={{ '--header-color': headerColors.default } as React.CSSProperties}
            >
              {headerGroups.map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={styles.th}
                      style={{ cursor, width: header.getSize() !== 150 ? header.getSize() : undefined }}
                      onClick={() => handleSortClick(header.id)}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className={styles.tbody}>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className={styles.noData}>
                    {noDataText}
                  </td>
                </tr>
              ) : (
                rows.map((row, rowIndex) => {
                  const rowData = row.original;
                  const rowId = String(rowData[tableRowId] ?? '');
                  const isSelected = rowId === currentSelectedRow;

                  return (
                    <tr
                      key={row.id}
                      className={classnames(styles.tr, {
                        [styles.trSelected]: isSelected,
                        [styles.trStriped]: rowIndex % 2 === 1,
                      })}
                      style={{
                        cursor,
                        lineHeight: rowHeight ?? undefined,
                        '--background-default': backgroundColors.default,
                        '--background-selected': backgroundColors.selected,
                        '--text-default': textColors.default,
                        '--text-selected': textColors.selected,
                      } as React.CSSProperties}
                      onClick={() => handleRowClick(rowData)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className={styles.td}
                          style={{
                            lineHeight: rowHeight ?? undefined,
                            ...tdStyle,
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}

        {showPagination && totalPages > 1 && (
          numericPagination ? (
            <NumericPagination
              page={currentPage}
              pages={totalPages}
              canPrevious={currentPage > 0}
              canNext={currentPage < totalPages - 1}
              onPageChange={handlePageChange}
            />
          ) : (
            <Pagination
              page={currentPage}
              pages={totalPages}
              pageSize={pageSize}
              dataLength={dataLength}
              canPrevious={currentPage > 0}
              canNext={currentPage < totalPages - 1}
              onPageChange={handlePageChange}
            />
          )
        )}
      </div>
    </div>
  );
}

export default ReactTable;
