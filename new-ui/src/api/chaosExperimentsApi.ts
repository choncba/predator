import apiClient from './client';
import { ChaosExperiment, ChaosExperimentCreatePayload } from '../types/chaosExperiment';

export const getChaosExperiments = () =>
  apiClient.get<ChaosExperiment[]>('/chaos-experiments');

export const createChaosExperiment = (body: ChaosExperimentCreatePayload) =>
  apiClient.post<ChaosExperiment>('/chaos-experiments', body);

export const updateChaosExperiment = (id: string, body: ChaosExperimentCreatePayload) =>
  apiClient.put<ChaosExperiment>(`/chaos-experiments/${id}`, body);

export const deleteChaosExperiment = (id: string) =>
  apiClient.delete(`/chaos-experiments/${id}`);
