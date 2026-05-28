import { createColumnHelper } from '@tanstack/react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faTrashAlt,
  faClone,
  faPen,
} from '@fortawesome/free-solid-svg-icons';
import { Test } from '../../types/test';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localizedFormat);

interface ColumnCallbacks {
  onRunTest: (data: Test) => void;
  onReportView: (data: Test) => void;
  onEdit: (data: Test) => void;
  onRawView: (data: Test) => void;
  onClone: (data: Test) => void;
  onDelete: (data: Test) => void;
  onSort: (field: string) => void;
  sortHeader: string;
}

const columnHelper = createColumnHelper<Test>();

export const getTestColumns = ({
  onRunTest,
  onReportView,
  onEdit,
  onRawView,
  onClone,
  onDelete,
  onSort,
  sortHeader,
}: ColumnCallbacks) => [
  columnHelper.accessor('name', {
    header: () => <span>Test Name</span>,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('description', {
    header: () => <span>Description</span>,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('updated_at', {
    header: () => {
      const isActive = sortHeader.includes('updated_at');
      const isAsc = isActive && sortHeader.includes('+');
      const isDesc = isActive && sortHeader.includes('-');
      return (
        <span
          style={{ cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation();
            onSort('updated_at');
          }}
        >
          Modified {isAsc && '▲'}{isDesc && '▼'}
        </span>
      );
    },
    cell: (info) => {
      const value = info.getValue();
      return value ? dayjs(value).format('lll') : '';
    },
    size: 140,
  }),
  columnHelper.accessor('type', {
    header: () => <span>Type</span>,
    cell: (info) => info.getValue(),
    size: 50,
  }),
  columnHelper.display({
    id: 'run_test',
    header: () => <span>Run Test</span>,
    cell: ({ row }) => (
      <div
        style={{ cursor: 'pointer', color: '#108ee9' }}
        onClick={(e) => {
          e.stopPropagation();
          onRunTest(row.original);
        }}
      >
        Run
      </div>
    ),
    size: 70,
  }),
  columnHelper.display({
    id: 'report',
    header: () => <span>Report</span>,
    cell: ({ row }) => (
      <div
        style={{ cursor: 'pointer', color: '#108ee9' }}
        onClick={(e) => {
          e.stopPropagation();
          onReportView(row.original);
        }}
      >
        View
      </div>
    ),
    size: 60,
  }),
  columnHelper.display({
    id: 'edit',
    header: () => <span>Edit</span>,
    cell: ({ row }) => {
      const data = row.original;
      if (data.type !== 'basic') {
        return <span title="DSL not supported">N/A</span>;
      }
      return (
        <div
          style={{ cursor: 'pointer', color: '#108ee9' }}
          onClick={(e) => {
            e.stopPropagation();
            onEdit(data);
          }}
        >
          <FontAwesomeIcon icon={faPen} />
        </div>
      );
    },
    size: 50,
  }),
  columnHelper.display({
    id: 'raw',
    header: () => <span>Raw</span>,
    cell: ({ row }) => (
      <div
        style={{ cursor: 'pointer', color: '#108ee9' }}
        onClick={(e) => {
          e.stopPropagation();
          onRawView(row.original);
        }}
      >
        <FontAwesomeIcon icon={faEye} />
      </div>
    ),
    size: 50,
  }),
  columnHelper.display({
    id: 'clone',
    header: () => <span>Clone</span>,
    cell: ({ row }) => (
      <div
        style={{ cursor: 'pointer', color: '#108ee9' }}
        onClick={(e) => {
          e.stopPropagation();
          onClone(row.original);
        }}
      >
        <FontAwesomeIcon icon={faClone} />
      </div>
    ),
    size: 60,
  }),
  columnHelper.display({
    id: 'delete',
    header: () => <span>Delete</span>,
    cell: ({ row }) => (
      <div
        style={{ cursor: 'pointer', color: '#108ee9' }}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(row.original);
        }}
      >
        <FontAwesomeIcon icon={faTrashAlt} />
      </div>
    ),
    size: 60,
  }),
];
