import { put, takeLatest, call } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import * as api from '../../api/webhooksApi';
import {
  GET_WEBHOOKS,
  CREATE_WEBHOOK,
  UPDATE_WEBHOOK,
  DELETE_WEBHOOK,
  getWebhooksSuccess,
  getWebhooksFailure,
  createWebhookSuccess,
  createWebhookFailure,
  updateWebhookSuccess,
  updateWebhookFailure,
  deleteWebhookSuccess,
  deleteWebhookFailure,
} from './webhooksTypes';
import { Webhook, WebhookCreatePayload } from '../../types/webhook';

function* getWebhooksSaga() {
  try {
    const result: AxiosResponse<Webhook[]> = yield call(api.getWebhooks);
    yield put(getWebhooksSuccess(result.data));
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Failed to fetch webhooks';
    yield put(getWebhooksFailure(error));
  }
}

function* createWebhookSaga(action: { type: typeof CREATE_WEBHOOK; payload: WebhookCreatePayload }) {
  try {
    yield call(api.createWebhook, action.payload);
    yield put(createWebhookSuccess());
    // Refresh the webhooks list after creation
    const result: AxiosResponse<Webhook[]> = yield call(api.getWebhooks);
    yield put(getWebhooksSuccess(result.data));
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Failed to create webhook';
    yield put(createWebhookFailure(error));
  }
}

function* updateWebhookSaga(action: { type: typeof UPDATE_WEBHOOK; payload: { id: string; body: Partial<WebhookCreatePayload> } }) {
  try {
    yield call(api.updateWebhook, action.payload.id, action.payload.body);
    yield put(updateWebhookSuccess());
    // Refresh the webhooks list after update
    const result: AxiosResponse<Webhook[]> = yield call(api.getWebhooks);
    yield put(getWebhooksSuccess(result.data));
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Failed to update webhook';
    yield put(updateWebhookFailure(error));
  }
}

function* deleteWebhookSaga(action: { type: typeof DELETE_WEBHOOK; payload: string }) {
  try {
    yield call(api.deleteWebhook, action.payload);
    yield put(deleteWebhookSuccess());
    // Refresh the webhooks list after deletion
    const result: AxiosResponse<Webhook[]> = yield call(api.getWebhooks);
    yield put(getWebhooksSuccess(result.data));
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Failed to delete webhook';
    yield put(deleteWebhookFailure(error));
  }
}

export function* webhooksRegister() {
  yield takeLatest(GET_WEBHOOKS, getWebhooksSaga);
  yield takeLatest(CREATE_WEBHOOK, createWebhookSaga);
  yield takeLatest(UPDATE_WEBHOOK, updateWebhookSaga);
  yield takeLatest(DELETE_WEBHOOK, deleteWebhookSaga);
}
