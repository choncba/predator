import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { ChaosExperiment } from '../../types/chaosExperiment';

dayjs.extend(localizedFormat);

interface ColumnCallbacks {
  onEdit: (data: ChaosExperiment) => void;
  onRawView: (data: ChaosExperiment) => void;
  onDelete: (data: ChaosExperiment) => void;
}

const columnHelper = createColumnHelper<ChaosExperiment>();

export const getColumns = ({ onEdit, onRawView, onDelete }: ColumnCallbacks): ColumnDef<ChaosExperiment, unknown>[] => [
  columnHelper.accessor('name', {
    header: 'Experiment Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('created_at', {
    header: 'Created',
    cell: (info) => {
      const value = info.getValue();
      return value ? dayjs(value).format('lll') : '';
    },
    size: 140,
  }),
  columnHelper.accessor('updated_at', {
    header: 'Modified',
    cell: (info) => {
      const value = info.getValue();
      return value ? dayjs(value).format('lll') : '';
    },
    size: 140,
  }),
  columnHelper.display({
    id: 'raw',
    header: 'Raw',
    cell: ({ row }) => (
      <div
        style={{ cursor: 'pointer', textAlign: 'center' }}
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
    id: 'edit',
    header: 'Edit',
    cell: ({ row }) => (
      <div
        style={{ cursor: 'pointer', textAlign: 'center' }}
        onClick={(e) => {
          e.stopPropagation();
          onEdit(row.original);
        }}
      >
        <FontAwesomeIcon icon={faPen} />
      </div>
    ),
    size: 50,
  }),
  columnHelper.display({
    id: 'delete',
    header: 'Delete',
    cell: ({ row }) => (
      <div
        style={{ cursor: 'pointer', textAlign: 'center' }}
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
] as ColumnDef<ChaosExperiment, unknown>[];
