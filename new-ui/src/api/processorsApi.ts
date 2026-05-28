import apiClient from './client';
import { Processor, ProcessorCreatePayload } from '../types/processor';

export const getProcessors = () =>
  apiClient.get<Processor[]>('/processors');

export const createProcessor = (body: ProcessorCreatePayload) =>
  apiClient.post<Processor>('/processors', body);

export const updateProcessor = (id: string, body: Partial<ProcessorCreatePayload>) =>
  apiClient.put<Processor>(`/processors/${id}`, body);

export const deleteProcessor = (id: string) =>
  apiClient.delete(`/processors/${id}`);
