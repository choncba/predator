import { Webhook, WebhookCreatePayload } from '../../types/webhook';

// State interface
export interface WebhooksState {
  webhooks: Webhook[];
  selectedWebhook: Webhook | null;
  processing: boolean;
  error: string | null;
  deleteSuccess: boolean;
  createSuccess: boolean;
  loading: boolean;
}

// Action type constants
export const GET_WEBHOOKS = 'GET_WEBHOOKS' as const;
export const GET_WEBHOOKS_SUCCESS = 'GET_WEBHOOKS_SUCCESS' as const;
export const GET_WEBHOOKS_FAILURE = 'GET_WEBHOOKS_FAILURE' as const;

export const CREATE_WEBHOOK = 'CREATE_WEBHOOK' as const;
export const CREATE_WEBHOOK_SUCCESS = 'CREATE_WEBHOOK_SUCCESS' as const;
export const CREATE_WEBHOOK_FAILURE = 'CREATE_WEBHOOK_FAILURE' as const;

export const UPDATE_WEBHOOK = 'UPDATE_WEBHOOK' as const;
export const UPDATE_WEBHOOK_SUCCESS = 'UPDATE_WEBHOOK_SUCCESS' as const;
export const UPDATE_WEBHOOK_FAILURE = 'UPDATE_WEBHOOK_FAILURE' as const;

export const DELETE_WEBHOOK = 'DELETE_WEBHOOK' as const;
export const DELETE_WEBHOOK_SUCCESS = 'DELETE_WEBHOOK_SUCCESS' as const;
export const DELETE_WEBHOOK_FAILURE = 'DELETE_WEBHOOK_FAILURE' as const;

export const CLEAR_SELECTED_WEBHOOK = 'CLEAR_SELECTED_WEBHOOK' as const;
export const CLEAR_ALL_WEBHOOKS_SUCCESS = 'CLEAR_ALL_WEBHOOKS_SUCCESS' as const;

// Discriminated union for all webhook actions
export type WebhooksAction =
  | { type: typeof GET_WEBHOOKS }
  | { type: typeof GET_WEBHOOKS_SUCCESS; payload: Webhook[] }
  | { type: typeof GET_WEBHOOKS_FAILURE; payload: string }
  | { type: typeof CREATE_WEBHOOK; payload: WebhookCreatePayload }
  | { type: typeof CREATE_WEBHOOK_SUCCESS }
  | { type: typeof CREATE_WEBHOOK_FAILURE; payload: string }
  | { type: typeof UPDATE_WEBHOOK; payload: { id: string; body: Partial<WebhookCreatePayload> } }
  | { type: typeof UPDATE_WEBHOOK_SUCCESS }
  | { type: typeof UPDATE_WEBHOOK_FAILURE; payload: string }
  | { type: typeof DELETE_WEBHOOK; payload: string }
  | { type: typeof DELETE_WEBHOOK_SUCCESS }
  | { type: typeof DELETE_WEBHOOK_FAILURE; payload: string }
  | { type: typeof CLEAR_SELECTED_WEBHOOK }
  | { type: typeof CLEAR_ALL_WEBHOOKS_SUCCESS };

// Action creators
export const getWebhooks = (): WebhooksAction => ({ type: GET_WEBHOOKS });

export const getWebhooksSuccess = (webhooks: Webhook[]): WebhooksAction => ({
  type: GET_WEBHOOKS_SUCCESS,
  payload: webhooks,
});

export const getWebhooksFailure = (error: string): WebhooksAction => ({
  type: GET_WEBHOOKS_FAILURE,
  payload: error,
});

export const createWebhook = (body: WebhookCreatePayload): WebhooksAction => ({
  type: CREATE_WEBHOOK,
  payload: body,
});

export const createWebhookSuccess = (): WebhooksAction => ({
  type: CREATE_WEBHOOK_SUCCESS,
});

export const createWebhookFailure = (error: string): WebhooksAction => ({
  type: CREATE_WEBHOOK_FAILURE,
  payload: error,
});

export const updateWebhook = (id: string, body: Partial<WebhookCreatePayload>): WebhooksAction => ({
  type: UPDATE_WEBHOOK,
  payload: { id, body },
});

export const updateWebhookSuccess = (): WebhooksAction => ({
  type: UPDATE_WEBHOOK_SUCCESS,
});

export const updateWebhookFailure = (error: string): WebhooksAction => ({
  type: UPDATE_WEBHOOK_FAILURE,
  payload: error,
});

export const deleteWebhook = (id: string): WebhooksAction => ({
  type: DELETE_WEBHOOK,
  payload: id,
});

export const deleteWebhookSuccess = (): WebhooksAction => ({
  type: DELETE_WEBHOOK_SUCCESS,
});

export const deleteWebhookFailure = (error: string): WebhooksAction => ({
  type: DELETE_WEBHOOK_FAILURE,
  payload: error,
});

export const clearSelectedWebhook = (): WebhooksAction => ({
  type: CLEAR_SELECTED_WEBHOOK,
});

export const clearAllWebhooksSuccess = (): WebhooksAction => ({
  type: CLEAR_ALL_WEBHOOKS_SUCCESS,
});
