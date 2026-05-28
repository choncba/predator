import React, { useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  selectReport,
  selectAggregateReport,
  selectErrorOnGetReports,
} from '../../store/reports/reportsSelectors';
import {
  GET_REPORT,
  GET_AGGREGATE_REPORT,
  CLEAR_SELECTED_REPORT,
  CLEAR_ERROR_ON_GET_REPORTS,
} from '../../store/reports/reportsTypes';
import * as reportsApi from '../../api/reportsApi';
import Page from '../../components/Page/Page';
import Loader from '../../components/Loader/Loader';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import ErrorDialog from '../../components/ErrorDialog/ErrorDialog';
import ReportStats from './components/ReportStats';
import LatencyChart from './components/LatencyChart';
import RpsChart from './components/RpsChart';
import StatusCodesChart from './components/StatusCodesChart';
import styles from './Reports.module.scss';

const REFRESH_DATA_INTERVAL = 30000;
const TEST_FAIL_ERROR = 'The test failed, there is no data to present. Please check test logs';

const ReportPage: React.FC = () => {
  const { testId, reportId } = useParams<{ testId: string; reportId: string }>();
  const dispatch = useAppDispatch();
  const report = useAppSelector(selectReport);
  const aggregateReport = useAppSelector(selectAggregateReport);
  const error = useAppSelector(selectErrorOnGetReports);

  const loadData = useCallback(() => {
    if (testId && reportId) {
      dispatch({ type: GET_REPORT, testId, reportId });
      dispatch({ type: GET_AGGREGATE_REPORT, reportsData: [{ testId, reportId }] });
    }
  }, [dispatch, testId, reportId]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, REFRESH_DATA_INTERVAL);
    return () => {
      clearInterval(interval);
      dispatch({ type: CLEAR_SELECTED_REPORT });
    };
  }, [loadData, dispatch]);

  const onStop = useCallback(() => {
    if (report) {
      reportsApi.stopRunningReport(report.test_id, report.report_id).then(() => {
        loadData();
      });
    }
  }, [report, loadData]);

  const onCloseErrorDialog = useCallback(() => {
    dispatch({ type: CLEAR_ERROR_ON_GET_REPORTS });
  }, [dispatch]);

  const isRunning = report?.status === 'started' || report?.status === 'initializing';
  const isFailed = report?.status === 'failed';

  const statusCodesData = useMemo(() => {
    if (!report?.last_stats?.codes) return [];
    return Object.entries(report.last_stats.codes).map(([code, count]) => ({
      code,
      count,
    }));
  }, [report]);

  const errorsData = useMemo(() => {
    if (!report?.last_stats?.errors) return [];
    return Object.entries(report.last_stats.errors).map(([error, count]) => ({
      code: error,
      count,
    }));
  }, [report]);

  // Build chart data from aggregate report if available
  const latencyChartData = useMemo(() => {
    if (!aggregateReport) return [];
    const benchmarkData = aggregateReport.benchmarkWeightsData as Record<string, unknown> | undefined;
    if (benchmarkData && Array.isArray(benchmarkData)) {
      return benchmarkData as Array<{ timestamp: string; median?: number; p95?: number; p99?: number }>;
    }
    // Fallback: use last_stats if available
    if (report?.last_stats) {
      return [{
        timestamp: report.last_stats.timestamp,
        median: report.last_stats.latency?.median,
        p95: report.last_stats.latency?.p95,
        p99: report.last_stats.latency?.p99,
      }];
    }
    return [];
  }, [aggregateReport, report]);

  const rpsChartData = useMemo(() => {
    if (report?.last_stats) {
      return [{
        timestamp: report.last_stats.timestamp,
        mean: report.last_stats.rps?.mean,
        count: report.last_stats.rps?.count,
      }];
    }
    return [];
  }, [report]);

  if (!report) {
    return (
      <Page title="Report">
        <Loader />
      </Page>
    );
  }

  const reportTitle = report.test_name
    ? report.test_name.charAt(0).toUpperCase() + report.test_name.slice(1)
    : 'Report';

  return (
    <Page title={reportTitle}>
      <div className={styles.reportDetailPage}>
        <div className={styles.reportHeader}>
          <h1 className={styles.reportTitle}>{reportTitle}</h1>
          <div className={styles.statsGrid}>
            <StatBox title="Status" value={report.status} />
            <StatBox title="Phase" value={report.phase} />
          </div>
        </div>

        <div className={styles.reportStartTime}>
          Started at {dayjs(report.start_time).format('dddd, MMMM D, YYYY, h:mm:ss A')}
          {report.end_time && (
            <span> — Ended at {dayjs(report.end_time).format('dddd, MMMM D, YYYY, h:mm:ss A')}</span>
          )}
        </div>

        <div className={styles.reportActions}>
          <div>
            {isRunning && (
              <Button onClick={onStop} color="error">
                Stop Test
              </Button>
            )}
          </div>
        </div>

        {isRunning && (
          <div className={styles.loadingMessage}>
            <Loader />
            <span>Test is running...</span>
          </div>
        )}

        {isFailed && (
          <div className={styles.failedMessage}>{TEST_FAIL_ERROR}</div>
        )}

        {!isRunning && !isFailed && (
          <>
            <ReportStats stats={report.last_stats} />

            <Card className={styles.chartCard}>
              <h3 className={styles.chartTitle}>Overall Latency</h3>
              <LatencyChart data={latencyChartData} />
            </Card>

            <Card className={styles.chartCard}>
              <h3 className={styles.chartTitle}>RPS</h3>
              <RpsChart data={rpsChartData} />
            </Card>

            <div className={styles.chartsRow}>
              <Card className={styles.chartHalf}>
                <h3 className={styles.chartTitle}>Status Codes Distribution</h3>
                <StatusCodesChart data={statusCodesData} />
              </Card>
              {errorsData.length > 0 && (
                <Card className={styles.chartHalf}>
                  <h3 className={styles.chartTitle}>Errors Distribution</h3>
                  <StatusCodesChart data={errorsData} />
                </Card>
              )}
            </div>
          </>
        )}

        {error && (
          <ErrorDialog showMessage={error} closeDialog={onCloseErrorDialog} />
        )}
      </div>
    </Page>
  );
};

interface StatBoxProps {
  title: string;
  value: string | number;
}

const StatBox: React.FC<StatBoxProps> = ({ title, value }) => (
  <div className={styles.statBox}>
    <span className={styles.statBoxTitle}>{title}</span>
    <span className={styles.statBoxValue}>{value}</span>
  </div>
);

export default ReportPage;
