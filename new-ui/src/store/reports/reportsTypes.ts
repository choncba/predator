import { Report, AggregateReport } from '../../types/report';

// State interface
export interface ReportsState {
  reports: Report[];
  report: Report | null;
  aggregateReport: AggregateReport | null;
  processing: boolean;
  error: string | null;
  loading: boolean;
}

// Action type constants
export const GET_REPORTS = 'GET_REPORTS' as const;
export const GET_REPORTS_SUCCESS = 'GET_REPORTS_SUCCESS' as const;
export const GET_REPORTS_FAILURE = 'GET_REPORTS_FAILURE' as const;
export const GET_REPORT = 'GET_REPORT' as const;
export const GET_REPORT_SUCCESS = 'GET_REPORT_SUCCESS' as const;
export const GET_REPORT_FAILURE = 'GET_REPORT_FAILURE' as const;
export const GET_LAST_REPORTS = 'GET_LAST_REPORTS' as const;
export const GET_LAST_REPORTS_SUCCESS = 'GET_LAST_REPORTS_SUCCESS' as const;
export const GET_LAST_REPORTS_FAILURE = 'GET_LAST_REPORTS_FAILURE' as const;
export const DELETE_REPORT = 'DELETE_REPORT' as const;
export const DELETE_REPORT_SUCCESS = 'DELETE_REPORT_SUCCESS' as const;
export const EDIT_REPORT = 'EDIT_REPORT' as const;
export const EDIT_REPORT_SUCCESS = 'EDIT_REPORT_SUCCESS' as const;
export const GET_AGGREGATE_REPORT = 'GET_AGGREGATE_REPORT' as const;
export const GET_AGGREGATE_REPORT_SUCCESS = 'GET_AGGREGATE_REPORT_SUCCESS' as const;
export const CLEAR_SELECTED_REPORT = 'CLEAR_SELECTED_REPORT' as const;
export const CLEAR_ERROR_ON_GET_REPORTS = 'CLEAR_ERROR_ON_GET_REPORTS' as const;

// Discriminated union for actions
export type ReportsAction =
  | { type: typeof GET_REPORTS; testId: string }
  | { type: typeof GET_REPORTS_SUCCESS; payload: Report[] }
  | { type: typeof GET_REPORTS_FAILURE; payload: string }
  | { type: typeof GET_REPORT; testId: string; reportId: string }
  | { type: typeof GET_REPORT_SUCCESS; payload: Report }
  | { type: typeof GET_REPORT_FAILURE; payload: string }
  | { type: typeof GET_LAST_REPORTS }
  | { type: typeof GET_LAST_REPORTS_SUCCESS; payload: Report[] }
  | { type: typeof GET_LAST_REPORTS_FAILURE; payload: string }
  | { type: typeof DELETE_REPORT; selectedReports: Array<{ testId: string; reportId: string }> }
  | { type: typeof DELETE_REPORT_SUCCESS; payload: number }
  | { type: typeof EDIT_REPORT; testId: string; reportId: string; body: Partial<Report> }
  | { type: typeof EDIT_REPORT_SUCCESS; payload: boolean }
  | { type: typeof GET_AGGREGATE_REPORT; reportsData: Array<{ testId: string; reportId: string }> }
  | { type: typeof GET_AGGREGATE_REPORT_SUCCESS; payload: AggregateReport }
  | { type: typeof CLEAR_SELECTED_REPORT }
  | { type: typeof CLEAR_ERROR_ON_GET_REPORTS };
