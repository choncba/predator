import { put, takeLatest, takeEvery, call } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import * as jobsApi from '../../api/jobsApi';
import {
  GET_JOBS,
  CREATE_JOB,
  UPDATE_JOB,
  DELETE_JOB,
  getJobsSuccess,
  getJobsFailure,
  createJobSuccess,
  createJobFailure,
  updateJobSuccess,
  updateJobFailure,
  deleteJobSuccess,
  deleteJobFailure,
  JobsAction,
} from './jobsTypes';
import { Job, CreateJobSuccess } from '../../types/job';
import { PaginatedResponse } from '../../types/api';

export function* getJobsSaga() {
  try {
    const response: AxiosResponse<PaginatedResponse<Job>> = yield call(jobsApi.getJobs);
    let allJobs: Job[] = response.data.data;
    let nextUrl = response.data.next;

    while (nextUrl) {
      const queryStart = nextUrl.indexOf('?');
      const queryParams = nextUrl.substring(queryStart);
      const nextResponse: AxiosResponse<PaginatedResponse<Job>> = yield call(jobsApi.getJobs, queryParams);
      allJobs = allJobs.concat(nextResponse.data.data);
      nextUrl = nextResponse.data.next;
    }

    yield put(getJobsSuccess(allJobs));
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to fetch jobs';
    yield put(getJobsFailure(message));
  }
}

export function* createJobSaga(action: Extract<JobsAction, { type: typeof CREATE_JOB }>) {
  try {
    const response: AxiosResponse<CreateJobSuccess> = yield call(jobsApi.createJob, action.payload);
    yield put(createJobSuccess(response.data));
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to create job';
    yield put(createJobFailure(message));
  }
}

export function* updateJobSaga(action: Extract<JobsAction, { type: typeof UPDATE_JOB }>) {
  try {
    yield call(jobsApi.updateJob, action.payload.id, action.payload.body);
    yield put(updateJobSuccess());
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to update job';
    yield put(updateJobFailure(message));
  }
}

export function* deleteJobSaga(action: Extract<JobsAction, { type: typeof DELETE_JOB }>) {
  try {
    yield call(jobsApi.deleteJob, action.payload);
    yield put(deleteJobSuccess());
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to delete job';
    yield put(deleteJobFailure(message));
  }
}

export function* jobsRegister() {
  yield takeLatest(GET_JOBS, getJobsSaga);
  yield takeEvery(CREATE_JOB, createJobSaga);
  yield takeEvery(UPDATE_JOB, updateJobSaga);
  yield takeLatest(DELETE_JOB, deleteJobSaga);
}
