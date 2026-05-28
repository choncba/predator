import { RootState } from '../index';
import { Webhook } from '../../types/webhook';

export const selectWebhooks = (state: RootState): Webhook[] =>
  state.webhooks.webhooks;

export const selectSelectedWebhook = (state: RootState): Webhook | null =>
  state.webhooks.selectedWebhook;

export const selectWebhooksLoading = (state: RootState): boolean =>
  state.webhooks.loading;

export const selectWebhooksProcessing = (state: RootState): boolean =>
  state.webhooks.processing;

export const selectWebhooksError = (state: RootState): string | null =>
  state.webhooks.error;

export const selectWebhookDeleteSuccess = (state: RootState): boolean =>
  state.webhooks.deleteSuccess;

export const selectWebhookCreateSuccess = (state: RootState): boolean =>
  state.webhooks.createSuccess;
