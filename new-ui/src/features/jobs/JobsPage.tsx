import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import { ColumnDef } from '@tanstack/react-table';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  selectJobs,
  selectProcessingGetJobs,
  selectErrorOnGetJobs,
  selectDeleteJobSuccess,
  selectCreateJobSuccess,
} from '../../store/jobs/jobsSelectors';
import { selectTests } from '../../store/tests/testsSelectors';
import {
  getJobs,
  deleteJob,
  updateJob,
  createJob,
  clearAllJobsSuccess,
  clearErrorOnGetJobs,
} from '../../store/jobs/jobsTypes';
import { getTests } from '../../store/tests/testsTypes';
import Page from '../../components/Page/Page';
import ReactTable from '../../components/ReactTable/ReactTable';
import Dialog from '../../components/Dialog/Dialog';
import DeleteDialog from '../../components/DeleteDialog/DeleteDialog';
import ErrorDialog from '../../components/ErrorDialog/ErrorDialog';
import Button from '../../components/Button/Button';
import { getJobColumns } from './columns';
import JobForm from './components/JobForm';
import { Job } from '../../types/job';

const DESCRIPTION = 'Scheduled jobs configured with a cron expression.';
const ERROR_MSG_GET_JOBS = 'Error occurred while trying to get all jobs.';

type JobRow = Job & { test_name?: string };

const JobsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId?: string }>();

  const jobs = useAppSelector(selectJobs);
  const tests = useAppSelector(selectTests);
  const processing = useAppSelector(selectProcessingGetJobs);
  const errorOnGetJobs = useAppSelector(selectErrorOnGetJobs);
  const deleteSuccess = useAppSelector(selectDeleteJobSuccess);
  const createSuccess = useAppSelector(selectCreateJobSuccess);

  const [sortedJobs, setSortedJobs] = useState<JobRow[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<Job | null>(null);
  const [rawViewJob, setRawViewJob] = useState<Job | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    dispatch(getJobs());
    dispatch(getTests());
  }, [dispatch]);

  // Enrich jobs with test_name
  useEffect(() => {
    const enriched: JobRow[] = jobs.map((job) => {
      const test = tests.find((t) => t.id === job.test_id);
      return { ...job, test_name: test?.name || job.test_id };
    });
    setSortedJobs(enriched);
  }, [jobs, tests]);

  // Handle route-based edit
  useEffect(() => {
    if (jobId && jobs.length > 0) {
      const jobToEdit = jobs.find((j) => j.id === jobId);
      if (jobToEdit) {
        setEditJob(jobToEdit);
      } else {
        navigate('/jobs', { replace: true });
      }
    }
  }, [jobId, jobs, navigate]);

  // Handle success feedback
  useEffect(() => {
    if (deleteSuccess) {
      setSnackbarMessage('Job deleted successfully');
      dispatch(clearAllJobsSuccess());
      dispatch(getJobs());
    }
  }, [deleteSuccess, dispatch]);

  useEffect(() => {
    if (createSuccess) {
      setSnackbarMessage('Job operation completed successfully');
      dispatch(clearAllJobsSuccess());
      dispatch(getJobs());
    }
  }, [createSuccess, dispatch]);

  const handleSearch = useCallback(
    (value: string) => {
      if (!value) {
        const enriched: JobRow[] = jobs.map((job) => {
          const test = tests.find((t) => t.id === job.test_id);
          return { ...job, test_name: test?.name || job.test_id };
        });
        setSortedJobs(enriched);
        return;
      }
      const lower = value.toLowerCase();
      const enriched: JobRow[] = jobs.map((job) => {
        const test = tests.find((t) => t.id === job.test_id);
        return { ...job, test_name: test?.name || job.test_id };
      });
      const filtered = enriched.filter(
        (job) =>
          (job.test_name || '').toLowerCase().includes(lower) ||
          (job.environment || '').toLowerCase().includes(lower)
      );
      setSortedJobs(filtered);
    },
    [jobs, tests]
  );

  const handleRawView = useCallback((job: Job) => {
    setRawViewJob(job);
  }, []);

  const handleDelete = useCallback((job: Job) => {
    setDeleteDialog(job);
  }, []);

  const handleEdit = useCallback(
    (job: Job) => {
      navigate(`/jobs/${job.id}/edit`);
      setEditJob(job);
    },
    [navigate]
  );

  const handleRunNow = useCallback(
    (job: Job) => {
      const body: Record<string, unknown> = {
        test_id: job.test_id,
        type: job.type,
        duration: job.duration,
        arrival_rate: job.arrival_rate,
        environment: job.environment,
        run_immediately: true,
      };
      if (job.ramp_to) body.ramp_to = job.ramp_to;
      if (job.max_virtual_users) body.max_virtual_users = job.max_virtual_users;
      if (job.webhooks) body.webhooks = job.webhooks;
      if (job.emails) body.emails = job.emails;
      dispatch(createJob(body));
    },
    [dispatch]
  );

  const handleEnableDisable = useCallback(
    (job: Job, enabled: boolean) => {
      dispatch(updateJob(job.id, { enabled }));
    },
    [dispatch]
  );

  const handleSubmitDelete = useCallback(() => {
    if (deleteDialog) {
      dispatch(deleteJob(deleteDialog.id));
      setDeleteDialog(null);
    }
  }, [deleteDialog, dispatch]);

  const handleCloseEditDialog = useCallback(() => {
    setEditJob(null);
    navigate('/jobs', { replace: true });
  }, [navigate]);

  const columns = useMemo(
    () =>
      getJobColumns({
        onRawView: handleRawView,
        onDelete: handleDelete,
        onEdit: handleEdit,
        onRunNow: handleRunNow,
        onEnableDisable: handleEnableDisable,
      }),
    [handleRawView, handleDelete, handleEdit, handleRunNow, handleEnableDisable]
  );

  const noDataText = errorOnGetJobs ? ERROR_MSG_GET_JOBS : processing ? 'Loading...' : 'There is no data to display.';

  return (
    <Page title="Scheduled Jobs" description={DESCRIPTION}>
      <div style={{ marginBottom: '16px' }}>
        <Button onClick={() => setShowCreateDialog(true)}>Create Job</Button>
      </div>

      <ReactTable
        data={sortedJobs as unknown as Record<string, unknown>[]}
        columns={columns as ColumnDef<Record<string, unknown>, unknown>[]}
        onSearch={handleSearch}
        pageSize={10}
        noDataText={noDataText}
        showPagination
        cursor="default"
        tableRowId="id"
      />

      {rawViewJob && (
        <Dialog
          data={rawViewJob as unknown as Record<string, unknown>}
          titleKey="id"
          closeDialog={() => setRawViewJob(null)}
        />
      )}

      {showCreateDialog && (
        <JobForm closeDialog={() => setShowCreateDialog(false)} />
      )}

      {editJob && (
        <JobForm data={editJob} closeDialog={handleCloseEditDialog} />
      )}

      {deleteDialog && (
        <DeleteDialog
          display={`job ${deleteDialog.id}`}
          onSubmit={handleSubmitDelete}
          onCancel={() => setDeleteDialog(null)}
        />
      )}

      {errorMessage && (
        <ErrorDialog
          showMessage={errorMessage}
          closeDialog={() => setErrorMessage('')}
        />
      )}

      {errorOnGetJobs && (
        <ErrorDialog
          showMessage={errorOnGetJobs}
          closeDialog={() => dispatch(clearErrorOnGetJobs())}
        />
      )}

      <Snackbar
        open={!!snackbarMessage}
        message={snackbarMessage}
        autoHideDuration={4000}
        onClose={() => setSnackbarMessage('')}
        ContentProps={{ sx: { backgroundColor: '#2fbb67' } }}
      />
    </Page>
  );
};

export default JobsPage;
