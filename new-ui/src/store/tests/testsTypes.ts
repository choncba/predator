import { Test, FileMetadata, TestCreatePayload } from '../../types/test';

// State interface
export interface CreateJobSuccess {
  testId: string;
  jobId: string;
}

export interface TestsState {
  tests: Test[];
  selectedTest: Test | null;
  processing: boolean;
  error: string | null;
  deleteSuccess: boolean;
  createSuccess: CreateJobSuccess | null;
  loading: boolean;
  fileMetadata: FileMetadata | null;
}

// Action type constants
export const GET_TESTS = 'GET_TESTS' as const;
export const GET_TESTS_SUCCESS = 'GET_TESTS_SUCCESS' as const;
export const GET_TESTS_FAILURE = 'GET_TESTS_FAILURE' as const;
export const PROCESSING_GET_TESTS = 'PROCESSING_GET_TESTS' as const;
export const DELETE_TEST = 'DELETE_TEST' as const;
export const DELETE_TEST_SUCCESS = 'DELETE_TEST_SUCCESS' as const;
export const DELETE_TEST_FAILURE = 'DELETE_TEST_FAILURE' as const;
export const CLEAR_SELECTED_TEST = 'CLEAR_SELECTED_TEST' as const;
export const CLEAR_ERROR_ON_GET_TESTS = 'CLEAR_ERROR_ON_GET_TESTS' as const;
export const CLEAR_ALL_SUCCESS_OPERATIONS = 'CLEAR_ALL_SUCCESS_OPERATIONS' as const;
export const CLEAN_ALL_ERRORS = 'CLEAN_ALL_ERRORS' as const;
export const CREATE_JOB_SUCCESS = 'CREATE_JOB_SUCCESS' as const;
export const SET_FAVORITE = 'SET_FAVORITE' as const;
export const GET_TEST = 'GET_TEST' as const;
export const GET_TEST_SUCCESS = 'GET_TEST_SUCCESS' as const;
export const GET_TEST_FAILURE = 'GET_TEST_FAILURE' as const;
export const CREATE_TEST = 'CREATE_TEST' as const;
export const CREATE_TEST_SUCCESS = 'CREATE_TEST_SUCCESS' as const;
export const CREATE_TEST_FAILURE = 'CREATE_TEST_FAILURE' as const;
export const EDIT_TEST = 'EDIT_TEST' as const;
export const IS_LOADING = 'IS_LOADING' as const;
export const GET_FILE_METADATA = 'GET_FILE_METADATA' as const;
export const GET_FILE_METADATA_SUCCESS = 'GET_FILE_METADATA_SUCCESS' as const;

// Discriminated union for all test actions
export type TestsAction =
  | { type: typeof GET_TESTS }
  | { type: typeof GET_TESTS_SUCCESS; payload: Test[] }
  | { type: typeof GET_TESTS_FAILURE; payload: string }
  | { type: typeof PROCESSING_GET_TESTS; payload: boolean }
  | { type: typeof DELETE_TEST; payload: string }
  | { type: typeof DELETE_TEST_SUCCESS }
  | { type: typeof DELETE_TEST_FAILURE; payload: string }
  | { type: typeof CLEAR_SELECTED_TEST }
  | { type: typeof CLEAR_ERROR_ON_GET_TESTS }
  | { type: typeof CLEAR_ALL_SUCCESS_OPERATIONS }
  | { type: typeof CLEAN_ALL_ERRORS }
  | { type: typeof CREATE_JOB_SUCCESS; payload: CreateJobSuccess }
  | { type: typeof SET_FAVORITE; payload: { testId: string; isFavorite: boolean } }
  | { type: typeof GET_TEST; payload: string }
  | { type: typeof GET_TEST_SUCCESS; payload: Test }
  | { type: typeof GET_TEST_FAILURE; payload: string }
  | { type: typeof CREATE_TEST; payload: { body: TestCreatePayload; file?: File } }
  | { type: typeof CREATE_TEST_SUCCESS; payload: CreateJobSuccess }
  | { type: typeof CREATE_TEST_FAILURE; payload: string }
  | { type: typeof EDIT_TEST; payload: { body: Partial<TestCreatePayload>; id: string; file?: File } }
  | { type: typeof IS_LOADING; payload: boolean }
  | { type: typeof GET_FILE_METADATA; payload: string }
  | { type: typeof GET_FILE_METADATA_SUCCESS; payload: FileMetadata };

// Action creators
export const getTests = (): TestsAction => ({ type: GET_TESTS });

export const getTestsSuccess = (tests: Test[]): TestsAction => ({
  type: GET_TESTS_SUCCESS,
  payload: tests,
});

export const getTestsFailure = (error: string): TestsAction => ({
  type: GET_TESTS_FAILURE,
  payload: error,
});

export const processingGetTests = (processing: boolean): TestsAction => ({
  type: PROCESSING_GET_TESTS,
  payload: processing,
});

export const deleteTest = (testId: string): TestsAction => ({
  type: DELETE_TEST,
  payload: testId,
});

export const deleteTestSuccess = (): TestsAction => ({
  type: DELETE_TEST_SUCCESS,
});

export const deleteTestFailure = (error: string): TestsAction => ({
  type: DELETE_TEST_FAILURE,
  payload: error,
});

export const clearSelectedTest = (): TestsAction => ({
  type: CLEAR_SELECTED_TEST,
});

export const clearErrorOnGetTests = (): TestsAction => ({
  type: CLEAR_ERROR_ON_GET_TESTS,
});

export const clearAllSuccessOperations = (): TestsAction => ({
  type: CLEAR_ALL_SUCCESS_OPERATIONS,
});

export const cleanAllErrors = (): TestsAction => ({
  type: CLEAN_ALL_ERRORS,
});

export const createJobSuccess = (data: CreateJobSuccess): TestsAction => ({
  type: CREATE_JOB_SUCCESS,
  payload: data,
});

export const setFavorite = (testId: string, isFavorite: boolean): TestsAction => ({
  type: SET_FAVORITE,
  payload: { testId, isFavorite },
});

export const getTest = (testId: string): TestsAction => ({
  type: GET_TEST,
  payload: testId,
});

export const getTestSuccess = (test: Test): TestsAction => ({
  type: GET_TEST_SUCCESS,
  payload: test,
});

export const getTestFailure = (error: string): TestsAction => ({
  type: GET_TEST_FAILURE,
  payload: error,
});

export const createTest = (body: TestCreatePayload, file?: File): TestsAction => ({
  type: CREATE_TEST,
  payload: { body, file },
});

export const createTestSuccess = (data: CreateJobSuccess): TestsAction => ({
  type: CREATE_TEST_SUCCESS,
  payload: data,
});

export const createTestFailure = (error: string): TestsAction => ({
  type: CREATE_TEST_FAILURE,
  payload: error,
});

export const editTest = (body: Partial<TestCreatePayload>, id: string, file?: File): TestsAction => ({
  type: EDIT_TEST,
  payload: { body, id, file },
});

export const setLoading = (isLoading: boolean): TestsAction => ({
  type: IS_LOADING,
  payload: isLoading,
});

export const getFileMetadata = (fileId: string): TestsAction => ({
  type: GET_FILE_METADATA,
  payload: fileId,
});

export const getFileMetadataSuccess = (fileMetadata: FileMetadata): TestsAction => ({
  type: GET_FILE_METADATA_SUCCESS,
  payload: fileMetadata,
});
