import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faRedo,
  faTrash,
  faStop,
  faFileAlt,
} from '@fortawesome/free-solid-svg-icons';
import { Report } from '../../types/report';
import dayjs from 'dayjs';

interface ColumnOptions {
  onReportView: (report: Report) => void;
  onRawView: (report: Report) => void;
  onRunTest: (report: Report) => void;
  onStop: (report: Report) => void;
  onEditNote: (testId: string, reportId: string, notes: string) => void;
  onDeleteReport: (report: Report) => void;
  showTestName?: boolean;
}

export function getReportColumns(options: ColumnOptions): ColumnDef<Report, unknown>[] {
  const {
    onReportView,
    onRawView,
    onRunTest,
    onStop,
    onEditNote,
    onDeleteReport,
    showTestName = true,
  } = options;

  const columns: ColumnDef<Report, unknown>[] = [];

  if (showTestName) {
    columns.push({
      id: 'test_name',
      header: 'Test Name',
      accessorKey: 'test_name',
      size: 200,
    });
  }

  columns.push(
    {
      id: 'start_time',
      header: 'Start Time',
      accessorKey: 'start_time',
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return value ? dayjs(value).format('MM/DD/YYYY HH:mm:ss') : '';
      },
      size: 170,
    },
    {
      id: 'end_time',
      header: 'End Time',
      accessorKey: 'end_time',
      cell: ({ getValue }) => {
        const value = getValue() as string | undefined;
        return value ? dayjs(value).format('MM/DD/YYYY HH:mm:ss') : 'N/A';
      },
      size: 170,
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      cell: ({ getValue }) => {
        const status = getValue() as string;
        return <StatusBadge status={status} />;
      },
      size: 120,
    },
    {
      id: 'phase',
      header: 'Phase',
      accessorKey: 'phase',
      size: 120,
    },
    {
      id: 'notes',
      header: 'Notes',
      accessorKey: 'notes',
      cell: ({ row }) => {
        const report = row.original;
        return (
          <NotesCell
            notes={report.notes ?? ''}
            onSave={(notes: string) => onEditNote(report.test_id, report.report_id, notes)}
          />
        );
      },
      size: 200,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const report = row.original;
        const isRunning = report.status === 'started' || report.status === 'initializing';
        return (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              title="View Report"
              onClick={(e) => { e.stopPropagation(); onReportView(report); }}
              style={actionButtonStyle}
            >
              <FontAwesomeIcon icon={faEye} />
            </button>
            <button
              title="Rerun"
              onClick={(e) => { e.stopPropagation(); onRunTest(report); }}
              style={actionButtonStyle}
            >
              <FontAwesomeIcon icon={faRedo} />
            </button>
            <button
              title="Raw View"
              onClick={(e) => { e.stopPropagation(); onRawView(report); }}
              style={actionButtonStyle}
            >
              <FontAwesomeIcon icon={faFileAlt} />
            </button>
            {isRunning && (
              <button
                title="Stop"
                onClick={(e) => { e.stopPropagation(); onStop(report); }}
                style={{ ...actionButtonStyle, color: '#f44336' }}
              >
                <FontAwesomeIcon icon={faStop} />
              </button>
            )}
            <button
              title="Delete"
              onClick={(e) => { e.stopPropagation(); onDeleteReport(report); }}
              style={{ ...actionButtonStyle, color: '#f44336' }}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        );
      },
      size: 200,
    }
  );

  return columns;
}

const actionButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '4px',
  color: '#108ee9',
  fontSize: '14px',
};

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getColor = (s: string): string => {
    switch (s) {
      case 'finished':
        return '#2fbb67';
      case 'failed':
        return '#f44336';
      case 'started':
      case 'initializing':
        return '#ff9800';
      case 'aborted':
        return '#9e9e9e';
      default:
        return '#555';
    }
  };

  return (
    <span style={{ color: getColor(status), fontWeight: 600 }}>
      {status}
    </span>
  );
};

interface NotesCellProps {
  notes: string;
  onSave: (notes: string) => void;
}

const NotesCell: React.FC<NotesCellProps> = ({ notes, onSave }) => {
  const [editing, setEditing] = React.useState(false);
  const [value, setValue] = React.useState(notes);

  const handleSave = () => {
    onSave(value);
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
    if (e.key === 'Escape') {
      setValue(notes);
      setEditing(false);
    }
  };

  if (editing) {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        autoFocus
        style={{ width: '100%', padding: '2px 4px', fontSize: '13px' }}
        onClick={(e) => e.stopPropagation()}
      />
    );
  }

  return (
    <span
      onClick={(e) => { e.stopPropagation(); setEditing(true); }}
      style={{ cursor: 'text', minHeight: '20px', display: 'inline-block', width: '100%' }}
      title="Click to edit"
    >
      {notes || <span style={{ color: '#999', fontStyle: 'italic' }}>Click to add note</span>}
    </span>
  );
};
