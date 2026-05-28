import {
  JobsState,
  JobsAction,
  GET_JOBS,
  GET_JOBS_SUCCESS,
  GET_JOBS_FAILURE,
  CREATE_JOB,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_FAILURE,
  UPDATE_JOB,
  UPDATE_JOB_SUCCESS,
  UPDATE_JOB_FAILURE,
  DELETE_JOB,
  DELETE_JOB_SUCCESS,
  DELETE_JOB_FAILURE,
  CLEAR_SELECTED_JOB,
  CLEAR_ERROR_ON_GET_JOBS,
  CLEAR_ALL_JOBS_SUCCESS,
} from './jobsTypes';

const initialState: JobsState = {
  jobs: [],
  selectedJob: null,
  processing: false,
  error: null,
  deleteSuccess: false,
  createSuccess: false,
  loading: false,
};

export function jobsReducer(
  state: JobsState = initialState,
  action: JobsAction
): JobsState {
  switch (action.type) {
    case GET_JOBS:
      return { ...state, processing: true, error: null };
    case GET_JOBS_SUCCESS:
      return { ...state, jobs: action.payload, processing: false };
    case GET_JOBS_FAILURE:
      return { ...state, error: action.payload, processing: false };
    case CREATE_JOB:
      return { ...state, loading: true, error: null };
    case CREATE_JOB_SUCCESS:
      return { ...state, createSuccess: true, loading: false };
    case CREATE_JOB_FAILURE:
      return { ...state, error: action.payload, loading: false };
    case UPDATE_JOB:
      return { ...state, loading: true, error: null };
    case UPDATE_JOB_SUCCESS:
      return { ...state, loading: false };
    case UPDATE_JOB_FAILURE:
      return { ...state, error: action.payload, loading: false };
    case DELETE_JOB:
      return { ...state, loading: true, error: null };
    case DELETE_JOB_SUCCESS:
      return { ...state, deleteSuccess: true, loading: false };
    case DELETE_JOB_FAILURE:
      return { ...state, error: action.payload, loading: false };
    case CLEAR_SELECTED_JOB:
      return { ...state, selectedJob: null };
    case CLEAR_ERROR_ON_GET_JOBS:
      return { ...state, error: null };
    case CLEAR_ALL_JOBS_SUCCESS:
      return { ...state, deleteSuccess: false, createSuccess: false };
    default:
      return state;
  }
}
