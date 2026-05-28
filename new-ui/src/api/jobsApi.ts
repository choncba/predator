import apiClient from './client';
import { Job, CreateJobSuccess } from '../types/job';
import { PaginatedResponse } from '../types/api';

export const getJobs = (queryParams?: string) =>
  apiClient.get<PaginatedResponse<Job>>(
    queryParams ? `/jobs${queryParams}` : '/jobs'
  );

export const getJob = (jobId: string) =>
  apiClient.get<Job>(`/jobs/${jobId}`);

export const createJob = (body: Record<string, unknown>) =>
  apiClient.post<CreateJobSuccess>('/jobs', body);

export const updateJob = (jobId: string, body: Record<string, unknown>) =>
  apiClient.put<Job>(`/jobs/${jobId}`, body);

export const deleteJob = (jobId: string) =>
  apiClient.delete(`/jobs/${jobId}`);

export const runJob = (jobId: string) =>
  apiClient.post<CreateJobSuccess>(`/jobs/${jobId}/runs`, {});
