import { put, takeLatest, call } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import * as api from '../../api/configApi';
import {
  GET_CONFIG,
  UPDATE_CONFIG,
  DELETE_CONFIG,
  CLEAN_FINISHED_CONTAINERS,
  ConfigAction,
  getConfigSuccess,
  getConfigFailure,
  updateConfigSuccess,
  updateConfigFailure,
  deleteConfigSuccess,
  deleteConfigFailure,
  cleanFinishedContainersSuccess,
  cleanFinishedContainersFailure,
} from './configTypes';
import { AppConfig } from '../../types/config';
import { isNumber, isBoolean } from 'lodash';

export function* getConfigSaga() {
  try {
    const response: AxiosResponse<AppConfig> = yield call(api.getConfig);
    yield put(getConfigSuccess(response.data));
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to get config';
    yield put(getConfigFailure(message));
  }
}

export function* updateConfigSaga(action: Extract<ConfigAction, { type: typeof UPDATE_CONFIG }>) {
  try {
    const body = action.payload;
    // Delete keys that have empty/null values (except numbers and booleans)
    for (const key in body) {
      if (!body[key] && !isNumber(body[key]) && !isBoolean(body[key])) {
        yield call(api.deleteConfig, key);
      }
    }
    // Clean empty or null values before updating
    const cleanedBody = cleanEmptyOrNullValues(body);
    yield call(api.updateConfig, cleanedBody);
    yield put(updateConfigSuccess());
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to update config';
    yield put(updateConfigFailure(message));
  }
}

export function* deleteConfigSaga(action: Extract<ConfigAction, { type: typeof DELETE_CONFIG }>) {
  try {
    yield call(api.deleteConfig, action.payload);
    yield put(deleteConfigSuccess());
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to delete config key';
    yield put(deleteConfigFailure(message));
  }
}

export function* cleanFinishedContainersSaga() {
  try {
    const response: AxiosResponse<string> = yield call(api.cleanFinishedContainers);
    yield put(cleanFinishedContainersSuccess(response.data));
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to clean finished containers';
    yield put(cleanFinishedContainersFailure(message));
  }
}

function cleanEmptyOrNullValues(object: Partial<AppConfig>): Partial<AppConfig> {
  const result: Partial<AppConfig> = {};
  for (const key in object) {
    const value = object[key];
    if (value !== undefined && value !== null) {
      result[key] = value;
    }
  }
  return result;
}

export function* configRegister() {
  yield takeLatest(GET_CONFIG, getConfigSaga);
  yield takeLatest(UPDATE_CONFIG, updateConfigSaga);
  yield takeLatest(DELETE_CONFIG, deleteConfigSaga);
  yield takeLatest(CLEAN_FINISHED_CONTAINERS, cleanFinishedContainersSaga);
}
