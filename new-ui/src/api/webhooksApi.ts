import apiClient from './client';
import { Webhook, WebhookCreatePayload } from '../types/webhook';

export const getWebhooks = () =>
  apiClient.get<Webhook[]>('/webhooks');

export const createWebhook = (body: WebhookCreatePayload) =>
  apiClient.post<Webhook>('/webhooks', body);

export const updateWebhook = (id: string, body: Partial<WebhookCreatePayload>) =>
  apiClient.put<Webhook>(`/webhooks/${id}`, body);

export const deleteWebhook = (id: string) =>
  apiClient.delete(`/webhooks/${id}`);
