import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import _ from 'lodash';
import Snackbar from '@mui/material/Snackbar';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  selectReports,
  selectProcessingGetReports,
  selectErrorOnGetReports,
} from '../../store/reports/reportsSelectors';
import {
  GET_REPORTS,
  DELETE_REPORT,
  EDIT_REPORT,
  CLEAR_SELECTED_REPORT,
  CLEAR_ERROR_ON_GET_REPORTS,
} from '../../store/reports/reportsTypes';
import { CREATE_JOB } from '../../store/jobs/jobsTypes';
import { Report } from '../../types/report';
import * as reportsApi from '../../api/reportsApi';
import Page from '../../components/Page/Page';
import ReactTable from '../../components/ReactTable/ReactTable';
import Button from '../../components/Button/Button';
import Loader from '../../components/Loader/Loader';
import ErrorDialog from '../../components/ErrorDialog/ErrorDialog';
import DeleteDialog from '../../components/DeleteDialog/DeleteDialog';
import Dialog from '../../components/Dialog/Dialog';
import TitleInput from '../../components/TitleInput/TitleInput';
import UiSwitcher from '../../components/UiSwitcher/UiSwitcher';
import { getReportColumns } from './columns';
import styles from './Reports.module.scss';

const DESCRIPTION = 'All reports for a given test.';

const TestReportsPage: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const reports = useAppSelector(selectReports);
  const processing = useAppSelector(selectProcessingGetReports);
  const error = useAppSelector(selectErrorOnGetReports);

  const [sortedReports, setSortedReports] = useState<Report[]>([]);
  const [sortHeader, setSortHeader] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [selectedReports, setSelectedReports] = useState<Report[]>([]);
  const [openViewReport, setOpenViewReport] = useState<Report | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    if (testId) {
      dispatch({ type: CLEAR_ERROR_ON_GET_REPORTS });
      dispatch({ type: GET_REPORTS, testId });
    }
    return () => {
      dispatch({ type: CLEAR_SELECTED_REPORT });
    };
  }, [dispatch, testId]);

  useEffect(() => {
    if (!reports) return;
    let filtered = [...reports];
    if (onlyFavorites) {
      filtered = filtered.filter((r) => r.is_favorite);
    }
    setSortedReports(filtered);
  }, [reports, onlyFavorites]);

  const onSearch = useCallback(
    (value: string) => {
      if (!value) {
        const filtered = onlyFavorites
          ? reports.filter((r) => r.is_favorite)
          : [...reports];
        setSortedReports(filtered);
        return;
      }
      const newSorted = reports.filter((report) => {
        return String(report.status).toLowerCase().includes(value.toLowerCase());
      });
      setSortedReports(onlyFavorites ? newSorted.filter((r) => r.is_favorite) : newSorted);
    },
    [reports, onlyFavorites]
  );

  const onSort = useCallback(
    (field: string) => {
      let isAsc = false;
      if (sortHeader.includes(field)) {
        isAsc = !sortHeader.includes('+');
      } else {
        isAsc = true;
      }
      const sorted = isAsc
        ? _.chain(sortedReports).sortBy(field).reverse().value()
        : _.chain(sortedReports).sortBy(field).value();
      setSortedReports(sorted);
      setSortHeader(`${field}${isAsc ? '+' : '-'}`);
    },
    [sortHeader, sortedReports]
  );

  const onReportView = useCallback(
    (report: Report) => {
      navigate(`/tests/${report.test_id}/reports/${report.report_id}`);
    },
    [navigate]
  );

  const onRawView = useCallback((report: Report) => {
    setOpenViewReport(report);
  }, []);

  const onRunTest = useCallback(
    (report: Report) => {
      const requestBody: Record<string, unknown> = {
        test_id: report.test_id,
        arrival_rate: 1,
        duration: 60,
        environment: 'test',
        run_immediately: true,
        type: 'load_test',
      };
      dispatch({ type: CREATE_JOB, payload: requestBody });
      setFeedbackMessage('Rerun job created');
    },
    [dispatch]
  );

  const onStop = useCallback(
    (report: Report) => {
      reportsApi.stopRunningReport(report.test_id, report.report_id).then(() => {
        setFeedbackMessage('Job successfully aborted');
      }).catch(() => {
        setFeedbackMessage('Failed to stop job');
      });
    },
    []
  );

  const onEditNote = useCallback(
    (testId: string, reportId: string, notes: string) => {
      dispatch({ type: EDIT_REPORT, testId, reportId, body: { notes } });
      setFeedbackMessage('Successfully updated note');
    },
    [dispatch]
  );

  const onDeleteReport = useCallback((report: Report) => {
    setSelectedReports([report]);
    setShowDeleteWarning(true);
  }, []);

  const onDeleteSelectedReports = useCallback(() => {
    const reportsToDelete = selectedReports.map((r) => ({
      testId: r.test_id,
      reportId: r.report_id,
    }));
    dispatch({ type: DELETE_REPORT, selectedReports: reportsToDelete });
    setShowDeleteWarning(false);
    setSelectedReports([]);
    setFeedbackMessage(`Successfully deleted ${reportsToDelete.length} report(s)`);
  }, [dispatch, selectedReports]);

  const onCloseErrorDialog = useCallback(() => {
    dispatch({ type: CLEAR_ERROR_ON_GET_REPORTS });
  }, [dispatch]);

  const columns = useMemo(
    () =>
      getReportColumns({
        onReportView,
        onRawView,
        onRunTest,
        onStop,
        onEditNote,
        onDeleteReport,
        showTestName: false,
      }) as unknown as import('@tanstack/react-table').ColumnDef<Report & Record<string, unknown>, unknown>[],
    [onReportView, onRawView, onRunTest, onStop, onEditNote, onDeleteReport]
  );

  const searchSections = useMemo(
    () => [
      <TitleInput key="favorites" style={{ flexGrow: 0 }} width="130px" height="33px" title="Favorites">
        <UiSwitcher
          onChange={(value: boolean) => setOnlyFavorites(value)}
          activeState={onlyFavorites}
          height={12}
          width={22}
          style={{ alignSelf: 'center' }}
        />
      </TitleInput>,
    ],
    [onlyFavorites]
  );

  const pageTitle = reports.length > 0 ? `${reports[0].test_name} Reports` : 'Test Reports';
  const noDataText = processing ? undefined : 'There is no data to display.';

  return (
    <Page title={pageTitle} description={DESCRIPTION}>
      <div className={styles.reportsPage}>
        <div className={styles.actionsBar}>
          <Button
            disabled={selectedReports.length === 0}
            onClick={() => setShowDeleteWarning(true)}
          >
            Delete Reports
          </Button>
        </div>

        {processing && sortedReports.length === 0 ? (
          <Loader />
        ) : (
          <ReactTable<Report & Record<string, unknown>>
            data={sortedReports as (Report & Record<string, unknown>)[]}
            columns={columns}
            onSearch={onSearch}
            sortEvent={onSort}
            pageSize={10}
            noDataText={noDataText}
            rowHeight="46px"
            cursor="default"
            searchSections={searchSections}
            tableRowId="report_id"
          />
        )}

        {openViewReport && (
          <Dialog
            data={openViewReport as unknown as Record<string, unknown>}
            titleKey="report_id"
            closeDialog={() => setOpenViewReport(null)}
          />
        )}

        {showDeleteWarning && (
          <DeleteDialog
            display={
              selectedReports.length === 1
                ? 'report'
                : `${selectedReports.length} selected reports`
            }
            onSubmit={onDeleteSelectedReports}
            onCancel={() => setShowDeleteWarning(false)}
          />
        )}

        {error && (
          <ErrorDialog showMessage={error} closeDialog={onCloseErrorDialog} />
        )}

        <Snackbar
          open={!!feedbackMessage}
          message={feedbackMessage}
          autoHideDuration={3000}
          onClose={() => setFeedbackMessage('')}
          ContentProps={{ style: { backgroundColor: '#2fbb67' } }}
        />
      </div>
    </Page>
  );
};

export default TestReportsPage;
