import { call, put, takeLatest } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import * as testsApi from '../../api/testsApi';
import { Test, FileMetadata } from '../../types/test';
import { PaginatedResponse } from '../../types/api';
import {
  TestsAction,
  GET_TESTS,
  GET_TEST,
  DELETE_TEST,
  CREATE_TEST,
  EDIT_TEST,
  SET_FAVORITE,
  GET_FILE_METADATA,
  getTestsSuccess,
  getTestsFailure,
  processingGetTests,
  getTestSuccess,
  getTestFailure,
  deleteTestSuccess,
  deleteTestFailure,
  createTestSuccess,
  createTestFailure,
  setLoading,
  getFileMetadataSuccess,
} from './testsTypes';

function* getTests() {
  try {
    yield put(processingGetTests(true));

    const response: AxiosResponse<PaginatedResponse<Test>> = yield call(testsApi.getTests);
    let testsData: Test[] = response.data.data;
    let nextUrl = response.data.next;

    while (nextUrl) {
      const charIndex = nextUrl.indexOf('?');
      const queryString = nextUrl.substring(charIndex);
      const paginationResponse: AxiosResponse<PaginatedResponse<Test>> = yield call(
        testsApi.getTests,
        queryString
      );
      testsData = testsData.concat(paginationResponse.data.data);
      nextUrl = paginationResponse.data.next;
    }

    yield put(getTestsSuccess(testsData));
    yield put(processingGetTests(false));
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Failed to fetch tests';
    yield put(getTestsFailure(errorMessage));
    yield put(processingGetTests(false));
  }
}

function* getTest(action: Extract<TestsAction, { type: typeof GET_TEST }>) {
  try {
    const response: AxiosResponse<Test> = yield call(testsApi.getTest, action.payload);
    yield put(getTestSuccess(response.data));
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Failed to fetch test';
    yield put(getTestFailure(errorMessage));
  }
}

function* deleteTest(action: Extract<TestsAction, { type: typeof DELETE_TEST }>) {
  try {
    yield call(testsApi.deleteTest, action.payload);
    yield put(deleteTestSuccess());
    yield call(getTests);
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Failed to delete test';
    yield put(deleteTestFailure(errorMessage));
  }
}

function* createTest(action: Extract<TestsAction, { type: typeof CREATE_TEST }>) {
  try {
    yield put(setLoading(true));

    let csvFileId: string | undefined;
    if (action.payload.file) {
      const fileResponse: AxiosResponse<{ id: string }> = yield call(
        testsApi.uploadFile,
        action.payload.file
      );
      csvFileId = fileResponse.data.id;
    }

    const body = { ...action.payload.body, csv_file_id: csvFileId };
    const response: AxiosResponse<Test> = yield call(testsApi.createTest, body);
    yield put(createTestSuccess({ testId: response.data.id, jobId: '' }));
    yield call(getTests);
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Failed to create test';
    yield put(createTestFailure(errorMessage));
  }
  yield put(setLoading(false));
}

function* editTest(action: Extract<TestsAction, { type: typeof EDIT_TEST }>) {
  try {
    yield put(setLoading(true));

    let csvFileId = action.payload.body.csv_file_id;
    if (action.payload.file) {
      const fileResponse: AxiosResponse<{ id: string }> = yield call(
        testsApi.uploadFile,
        action.payload.file
      );
      csvFileId = fileResponse.data.id;
    }

    const body = { ...action.payload.body, csv_file_id: csvFileId };
    const response: AxiosResponse<Test> = yield call(
      testsApi.updateTest,
      action.payload.id,
      body
    );
    yield put(createTestSuccess({ testId: response.data.id, jobId: '' }));
    yield call(getTests);
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Failed to edit test';
    yield put(createTestFailure(errorMessage));
  }
  yield put(setLoading(false));
}

function* setFavorite(action: Extract<TestsAction, { type: typeof SET_FAVORITE }>) {
  try {
    yield call(testsApi.updateTest, action.payload.testId, {
      is_favorite: action.payload.isFavorite,
    } as Record<string, unknown>);
  } catch (e) {
    // Silently fail - the UI already updated optimistically
  }
}

function* getFileMetadata(action: Extract<TestsAction, { type: typeof GET_FILE_METADATA }>) {
  try {
    const response: AxiosResponse<FileMetadata> = yield call(
      testsApi.getFileMetadata,
      action.payload
    );
    yield put(getFileMetadataSuccess(response.data));
  } catch (e) {
    // Silently fail for file metadata
  }
}

export function* testsRegister() {
  yield takeLatest(GET_TESTS, getTests);
  yield takeLatest(GET_TEST, getTest);
  yield takeLatest(DELETE_TEST, deleteTest);
  yield takeLatest(CREATE_TEST, createTest);
  yield takeLatest(EDIT_TEST, editTest);
  yield takeLatest(SET_FAVORITE, setFavorite);
  yield takeLatest(GET_FILE_METADATA, getFileMetadata);
}
