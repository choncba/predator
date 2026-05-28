import apiClient from './client';
import { Test, TestCreatePayload, FileMetadata } from '../types/test';
import { PaginatedResponse } from '../types/api';

export const getTests = (queryParams?: string) =>
  apiClient.get<PaginatedResponse<Test>>(
    queryParams ? `/tests${queryParams}` : '/tests'
  );

export const getTest = (testId: string) =>
  apiClient.get<Test>(`/tests/${testId}`);

export const createTest = (body: TestCreatePayload) =>
  apiClient.post<Test>('/tests', body);

export const updateTest = (id: string, body: Partial<TestCreatePayload> | Record<string, unknown>) =>
  apiClient.put<Test>(`/tests/${id}`, body);

export const deleteTest = (testId: string) =>
  apiClient.delete(`/tests/${testId}`);

export const uploadFile = (file: File) => {
  const data = new FormData();
  data.append('csv', file);
  return apiClient.post<{ id: string }>('/files', data);
};

export const getFileMetadata = (fileId: string) =>
  apiClient.get<FileMetadata>(`/files/${fileId}/metadata`);
