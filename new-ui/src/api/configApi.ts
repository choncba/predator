import apiClient from './client';
import { AppConfig } from '../types/config';

export const getConfig = () =>
  apiClient.get<AppConfig>('/config');

export const updateConfig = (body: Partial<AppConfig>) =>
  apiClient.put<void>('/config', body);

export const deleteConfig = (configKey: string) =>
  apiClient.delete<void>(`/config/${configKey}`);

export const cleanFinishedContainers = () =>
  apiClient.delete<string>('/jobs/runs/containers');
