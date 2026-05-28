import { call, put, takeLatest } from 'redux-saga/effects';
import {
  GET_PROCESSORS,
  GET_PROCESSORS_SUCCESS,
  GET_PROCESSORS_FAILURE,
  CREATE_PROCESSOR,
  CREATE_PROCESSOR_SUCCESS,
  CREATE_PROCESSOR_FAILURE,
  UPDATE_PROCESSOR,
  UPDATE_PROCESSOR_SUCCESS,
  UPDATE_PROCESSOR_FAILURE,
  DELETE_PROCESSOR,
  DELETE_PROCESSOR_SUCCESS,
  DELETE_PROCESSOR_FAILURE,
  ProcessorsAction,
} from './processorsTypes';
import * as processorsApi from '../../api/processorsApi';

function* getProcessorsSaga() {
  try {
    const { data } = yield call(processorsApi.getProcessors);
    yield put({ type: GET_PROCESSORS_SUCCESS, payload: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch processors';
    yield put({ type: GET_PROCESSORS_FAILURE, payload: message });
  }
}

function* createProcessorSaga(action: Extract<ProcessorsAction, { type: typeof CREATE_PROCESSOR }>) {
  try {
    yield call(processorsApi.createProcessor, action.payload);
    yield put({ type: CREATE_PROCESSOR_SUCCESS });
    yield put({ type: GET_PROCESSORS });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create processor';
    yield put({ type: CREATE_PROCESSOR_FAILURE, payload: message });
  }
}

function* updateProcessorSaga(action: Extract<ProcessorsAction, { type: typeof UPDATE_PROCESSOR }>) {
  try {
    yield call(processorsApi.updateProcessor, action.payload.id, action.payload.body);
    yield put({ type: UPDATE_PROCESSOR_SUCCESS });
    yield put({ type: GET_PROCESSORS });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update processor';
    yield put({ type: UPDATE_PROCESSOR_FAILURE, payload: message });
  }
}

function* deleteProcessorSaga(action: Extract<ProcessorsAction, { type: typeof DELETE_PROCESSOR }>) {
  try {
    yield call(processorsApi.deleteProcessor, action.payload);
    yield put({ type: DELETE_PROCESSOR_SUCCESS });
    yield put({ type: GET_PROCESSORS });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete processor';
    yield put({ type: DELETE_PROCESSOR_FAILURE, payload: message });
  }
}

export function* processorsRegister() {
  yield takeLatest(GET_PROCESSORS, getProcessorsSaga);
  yield takeLatest(CREATE_PROCESSOR, createProcessorSaga);
  yield takeLatest(UPDATE_PROCESSOR, updateProcessorSaga);
  yield takeLatest(DELETE_PROCESSOR, deleteProcessorSaga);
}
