import { type ColumnDef } from '@tanstack/react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { Processor } from '../../types/processor';

dayjs.extend(localizedFormat);

interface ColumnOptions {
  onEdit: (processor: Processor) => void;
  onDelete: (processor: Processor) => void;
  sortHeader: string;
  onSort: (field: string) => void;
}

export function getProcessorColumns({
  onEdit,
  onDelete,
  sortHeader,
  onSort,
}: ColumnOptions): ColumnDef<Processor & Record<string, unknown>, unknown>[] {
  return [
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Processor Name',
      enableSorting: false,
    },
    {
      id: 'description',
      accessorKey: 'description',
      header: 'Description',
      enableSorting: false,
    },
    {
      id: 'exported_functions',
      accessorKey: 'exported_functions',
      header: 'Exported Functions',
      enableSorting: false,
      cell: ({ getValue }) => {
        const fns = getValue() as string[];
        return fns ? fns.join(', ') : '';
      },
    },
    {
      id: 'updated_at',
      accessorKey: 'updated_at',
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
      cell: ({ getValue }) => {
        const val = getValue() as string;
        return val ? dayjs(val).format('lll') : '';
      },
      size: 140,
      enableSorting: false,
    },
    {
      id: 'edit',
      header: 'Edit',
      size: 50,
      enableSorting: false,
      cell: ({ row }) => (
        <span
          style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center' }}
          onClick={(e) => {
            e.stopPropagation();
            onEdit(row.original);
          }}
        >
          <FontAwesomeIcon icon={faPen} />
        </span>
      ),
    },
    {
      id: 'delete',
      header: 'Delete',
      size: 60,
      enableSorting: false,
      cell: ({ row }) => (
        <span
          style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center' }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(row.original);
          }}
        >
          <FontAwesomeIcon icon={faTrashAlt} />
        </span>
      ),
    },
  ];
}
