import apiClient from './client';
import { Report, AggregateReport } from '../types/report';
import { PaginatedResponse } from '../types/api';

export const getReports = (testId: string, queryParams?: string) => {
  const url = queryParams
    ? `/tests/${testId}/reports${queryParams}`
    : `/tests/${testId}/reports`;
  return apiClient.get<PaginatedResponse<Report>>(url);
};

export const getLastReports = (queryParams?: string) => {
  const url = queryParams
    ? `/tests/last_reports${queryParams}`
    : '/tests/last_reports?limit=200';
  return apiClient.get<PaginatedResponse<Report>>(url);
};

export const getReport = (testId: string, reportId: string) =>
  apiClient.get<Report>(`/tests/${testId}/reports/${reportId}`);

export const deleteReport = (testId: string, reportId: string) =>
  apiClient.delete(`/tests/${testId}/reports/${reportId}`);

export const editReport = (testId: string, reportId: string, body: Partial<Report>) =>
  apiClient.put<Report>(`/tests/${testId}/reports/${reportId}`, body);

export const getAggregateReport = (testId: string, reportId: string) =>
  apiClient.get<AggregateReport>(`/tests/${testId}/reports/${reportId}/aggregate`);

export const stopRunningReport = (jobId: string, runId: string) =>
  apiClient.post(`/jobs/${jobId}/runs/${runId}/stop`);
