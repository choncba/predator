import { Job, CreateJobSuccess } from '../../types/job';

export interface JobsState {
  jobs: Job[];
  selectedJob: Job | null;
  processing: boolean;
  error: string | null;
  deleteSuccess: boolean;
  createSuccess: boolean;
  loading: boolean;
}

// Action type constants
export const GET_JOBS = 'GET_JOBS' as const;
export const GET_JOBS_SUCCESS = 'GET_JOBS_SUCCESS' as const;
export const GET_JOBS_FAILURE = 'GET_JOBS_FAILURE' as const;
export const CREATE_JOB = 'CREATE_JOB' as const;
export const CREATE_JOB_SUCCESS = 'CREATE_JOB_SUCCESS' as const;
export const CREATE_JOB_FAILURE = 'CREATE_JOB_FAILURE' as const;
export const UPDATE_JOB = 'UPDATE_JOB' as const;
export const UPDATE_JOB_SUCCESS = 'UPDATE_JOB_SUCCESS' as const;
export const UPDATE_JOB_FAILURE = 'UPDATE_JOB_FAILURE' as const;
export const DELETE_JOB = 'DELETE_JOB' as const;
export const DELETE_JOB_SUCCESS = 'DELETE_JOB_SUCCESS' as const;
export const DELETE_JOB_FAILURE = 'DELETE_JOB_FAILURE' as const;
export const CLEAR_SELECTED_JOB = 'CLEAR_SELECTED_JOB' as const;
export const CLEAR_ERROR_ON_GET_JOBS = 'CLEAR_ERROR_ON_GET_JOBS' as const;
export const CLEAR_ALL_JOBS_SUCCESS = 'CLEAR_ALL_JOBS_SUCCESS' as const;

// Action creators
export const getJobs = () => ({ type: GET_JOBS });
export const getJobsSuccess = (jobs: Job[]) => ({ type: GET_JOBS_SUCCESS, payload: jobs });
export const getJobsFailure = (error: string) => ({ type: GET_JOBS_FAILURE, payload: error });
export const createJob = (body: Record<string, unknown>) => ({ type: CREATE_JOB, payload: body });
export const createJobSuccess = (job: CreateJobSuccess) => ({ type: CREATE_JOB_SUCCESS, payload: job });
export const createJobFailure = (error: string) => ({ type: CREATE_JOB_FAILURE, payload: error });
export const updateJob = (id: string, body: Record<string, unknown>) => ({ type: UPDATE_JOB, payload: { id, body } });
export const updateJobSuccess = () => ({ type: UPDATE_JOB_SUCCESS });
export const updateJobFailure = (error: string) => ({ type: UPDATE_JOB_FAILURE, payload: error });
export const deleteJob = (jobId: string) => ({ type: DELETE_JOB, payload: jobId });
export const deleteJobSuccess = () => ({ type: DELETE_JOB_SUCCESS });
export const deleteJobFailure = (error: string) => ({ type: DELETE_JOB_FAILURE, payload: error });
export const clearSelectedJob = () => ({ type: CLEAR_SELECTED_JOB });
export const clearErrorOnGetJobs = () => ({ type: CLEAR_ERROR_ON_GET_JOBS });
export const clearAllJobsSuccess = () => ({ type: CLEAR_ALL_JOBS_SUCCESS });

// Discriminated union for all Jobs actions
export type JobsAction =
  | { type: typeof GET_JOBS }
  | { type: typeof GET_JOBS_SUCCESS; payload: Job[] }
  | { type: typeof GET_JOBS_FAILURE; payload: string }
  | { type: typeof CREATE_JOB; payload: Record<string, unknown> }
  | { type: typeof CREATE_JOB_SUCCESS; payload: CreateJobSuccess }
  | { type: typeof CREATE_JOB_FAILURE; payload: string }
  | { type: typeof UPDATE_JOB; payload: { id: string; body: Record<string, unknown> } }
  | { type: typeof UPDATE_JOB_SUCCESS }
  | { type: typeof UPDATE_JOB_FAILURE; payload: string }
  | { type: typeof DELETE_JOB; payload: string }
  | { type: typeof DELETE_JOB_SUCCESS }
  | { type: typeof DELETE_JOB_FAILURE; payload: string }
  | { type: typeof CLEAR_SELECTED_JOB }
  | { type: typeof CLEAR_ERROR_ON_GET_JOBS }
  | { type: typeof CLEAR_ALL_JOBS_SUCCESS };
