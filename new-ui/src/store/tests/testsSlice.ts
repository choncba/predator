import {
  TestsState,
  TestsAction,
  GET_TESTS_SUCCESS,
  GET_TESTS_FAILURE,
  PROCESSING_GET_TESTS,
  DELETE_TEST_SUCCESS,
  DELETE_TEST_FAILURE,
  CLEAR_SELECTED_TEST,
  CLEAR_ERROR_ON_GET_TESTS,
  CLEAR_ALL_SUCCESS_OPERATIONS,
  CLEAN_ALL_ERRORS,
  CREATE_JOB_SUCCESS,
  SET_FAVORITE,
  GET_TEST_SUCCESS,
  GET_TEST_FAILURE,
  CREATE_TEST_SUCCESS,
  CREATE_TEST_FAILURE,
  IS_LOADING,
  GET_FILE_METADATA_SUCCESS,
} from './testsTypes';

const initialState: TestsState = {
  tests: [],
  selectedTest: null,
  processing: false,
  error: null,
  deleteSuccess: false,
  createSuccess: null,
  loading: false,
  fileMetadata: null,
};

export function testsReducer(
  state: TestsState = initialState,
  action: TestsAction
): TestsState {
  switch (action.type) {
    case GET_TESTS_SUCCESS:
      return { ...state, tests: action.payload, processing: false };

    case GET_TESTS_FAILURE:
      return { ...state, error: action.payload, processing: false };

    case PROCESSING_GET_TESTS:
      return { ...state, processing: action.payload };

    case GET_TEST_SUCCESS:
      return { ...state, selectedTest: action.payload };

    case GET_TEST_FAILURE:
      return { ...state, error: action.payload };

    case DELETE_TEST_SUCCESS:
      return { ...state, deleteSuccess: true };

    case DELETE_TEST_FAILURE:
      return { ...state, error: action.payload };

    case CLEAR_SELECTED_TEST:
      return { ...state, selectedTest: null };

    case CLEAR_ERROR_ON_GET_TESTS:
      return { ...state, error: null };

    case CLEAR_ALL_SUCCESS_OPERATIONS:
      return { ...state, deleteSuccess: false, createSuccess: null };

    case CLEAN_ALL_ERRORS:
      return { ...state, error: null };

    case CREATE_JOB_SUCCESS:
      return { ...state, createSuccess: action.payload };

    case CREATE_TEST_SUCCESS:
      return { ...state, createSuccess: action.payload };

    case CREATE_TEST_FAILURE:
      return { ...state, error: action.payload };

    case SET_FAVORITE: {
      const updatedTests = state.tests.map((test) =>
        test.id === action.payload.testId
          ? { ...test, is_favorite: action.payload.isFavorite }
          : test
      );
      return { ...state, tests: updatedTests };
    }

    case IS_LOADING:
      return { ...state, loading: action.payload };

    case GET_FILE_METADATA_SUCCESS:
      return { ...state, fileMetadata: action.payload };

    default:
      return state;
  }
}
