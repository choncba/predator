import { put, takeLatest, call } from 'redux-saga/effects';
import {
  GET_CHAOS_EXPERIMENTS,
  GET_CHAOS_EXPERIMENTS_SUCCESS,
  GET_CHAOS_EXPERIMENTS_FAILURE,
  CREATE_CHAOS_EXPERIMENT,
  CREATE_CHAOS_EXPERIMENT_SUCCESS,
  CREATE_CHAOS_EXPERIMENT_FAILURE,
  UPDATE_CHAOS_EXPERIMENT,
  UPDATE_CHAOS_EXPERIMENT_SUCCESS,
  UPDATE_CHAOS_EXPERIMENT_FAILURE,
  DELETE_CHAOS_EXPERIMENT,
  DELETE_CHAOS_EXPERIMENT_SUCCESS,
  DELETE_CHAOS_EXPERIMENT_FAILURE,
  ChaosExperimentsAction,
} from './chaosExperimentsTypes';
import {
  getChaosExperiments as getChaosExperimentsApi,
  createChaosExperiment as createChaosExperimentApi,
  updateChaosExperiment as updateChaosExperimentApi,
  deleteChaosExperiment as deleteChaosExperimentApi,
} from '../../api/chaosExperimentsApi';

function* getChaosExperimentsSaga() {
  try {
    const { data } = yield call(getChaosExperimentsApi);
    yield put({ type: GET_CHAOS_EXPERIMENTS_SUCCESS, payload: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch chaos experiments';
    yield put({ type: GET_CHAOS_EXPERIMENTS_FAILURE, payload: message });
  }
}

function* createChaosExperimentSaga(action: Extract<ChaosExperimentsAction, { type: typeof CREATE_CHAOS_EXPERIMENT }>) {
  try {
    yield call(createChaosExperimentApi, action.payload);
    yield put({ type: CREATE_CHAOS_EXPERIMENT_SUCCESS });
    yield put({ type: GET_CHAOS_EXPERIMENTS });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create chaos experiment';
    yield put({ type: CREATE_CHAOS_EXPERIMENT_FAILURE, payload: message });
  }
}

function* updateChaosExperimentSaga(action: Extract<ChaosExperimentsAction, { type: typeof UPDATE_CHAOS_EXPERIMENT }>) {
  try {
    yield call(updateChaosExperimentApi, action.payload.id, action.payload.body);
    yield put({ type: UPDATE_CHAOS_EXPERIMENT_SUCCESS });
    yield put({ type: GET_CHAOS_EXPERIMENTS });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update chaos experiment';
    yield put({ type: UPDATE_CHAOS_EXPERIMENT_FAILURE, payload: message });
  }
}

function* deleteChaosExperimentSaga(action: Extract<ChaosExperimentsAction, { type: typeof DELETE_CHAOS_EXPERIMENT }>) {
  try {
    yield call(deleteChaosExperimentApi, action.payload);
    yield put({ type: DELETE_CHAOS_EXPERIMENT_SUCCESS });
    yield put({ type: GET_CHAOS_EXPERIMENTS });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete chaos experiment';
    yield put({ type: DELETE_CHAOS_EXPERIMENT_FAILURE, payload: message });
  }
}

export function* chaosExperimentsRegister() {
  yield takeLatest(GET_CHAOS_EXPERIMENTS, getChaosExperimentsSaga);
  yield takeLatest(CREATE_CHAOS_EXPERIMENT, createChaosExperimentSaga);
  yield takeLatest(UPDATE_CHAOS_EXPERIMENT, updateChaosExperimentSaga);
  yield takeLatest(DELETE_CHAOS_EXPERIMENT, deleteChaosExperimentSaga);
}
