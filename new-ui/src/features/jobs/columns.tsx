import { ColumnDef } from '@tanstack/react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrashAlt, faPen, faRunning } from '@fortawesome/free-solid-svg-icons';
import UiSwitcher from '../../components/UiSwitcher/UiSwitcher';
import { Job } from '../../types/job';
import styles from './JobsPage.module.scss';

interface ColumnActions {
  onRawView: (job: Job) => void;
  onDelete: (job: Job) => void;
  onEdit: (job: Job) => void;
  onRunNow: (job: Job) => void;
  onEnableDisable: (job: Job, enabled: boolean) => void;
}

type JobRow = Job & { test_name?: string };

export function getJobColumns(actions: ColumnActions): ColumnDef<JobRow, unknown>[] {
  const { onRawView, onDelete, onEdit, onRunNow, onEnableDisable } = actions;

  return [
    {
      id: 'test_name',
      header: 'Test Name',
      accessorKey: 'test_name',
      cell: ({ row }) => row.original.test_name || row.original.test_id,
    },
    {
      id: 'cron_expression',
      header: 'Cron Expression',
      accessorKey: 'cron_expression',
      cell: ({ row }) => row.original.cron_expression || 'N/A',
    },
    {
      id: 'enabled',
      header: 'Enabled',
      accessorKey: 'enabled',
      cell: ({ row }) => (
        <div className={styles.enabledCell}>
          <UiSwitcher
            activeState={row.original.enabled}
            onChange={(value) => onEnableDisable(row.original, value)}
          />
        </div>
      ),
      size: 80,
    },
    {
      id: 'environment',
      header: 'Environment',
      accessorKey: 'environment',
    },
    {
      id: 'arrival_rate',
      header: 'Arrival Rate',
      accessorKey: 'arrival_rate',
      size: 100,
    },
    {
      id: 'duration',
      header: 'Duration (sec)',
      accessorKey: 'duration',
      size: 110,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <FontAwesomeIcon
            icon={faRunning}
            className={styles.actionIcon}
            title="Run Now"
            onClick={(e) => { e.stopPropagation(); onRunNow(row.original); }}
          />
          <FontAwesomeIcon
            icon={faPen}
            className={styles.actionIcon}
            title="Edit"
            onClick={(e) => { e.stopPropagation(); onEdit(row.original); }}
          />
          <FontAwesomeIcon
            icon={faEye}
            className={styles.actionIcon}
            title="Raw View"
            onClick={(e) => { e.stopPropagation(); onRawView(row.original); }}
          />
          <FontAwesomeIcon
            icon={faTrashAlt}
            className={styles.actionIcon}
            title="Delete"
            onClick={(e) => { e.stopPropagation(); onDelete(row.original); }}
          />
        </div>
      ),
      size: 150,
    },
  ];
}
