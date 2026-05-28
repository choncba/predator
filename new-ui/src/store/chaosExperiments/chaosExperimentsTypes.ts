import { ChaosExperiment, ChaosExperimentCreatePayload } from '../../types/chaosExperiment';

// State interface
export interface ChaosExperimentsState {
  chaosExperiments: ChaosExperiment[];
  selectedExperiment: ChaosExperiment | null;
  processing: boolean;
  error: string | null;
  deleteSuccess: boolean;
  createSuccess: boolean;
  loading: boolean;
}

// Action type constants
export const GET_CHAOS_EXPERIMENTS = 'GET_CHAOS_EXPERIMENTS' as const;
export const GET_CHAOS_EXPERIMENTS_SUCCESS = 'GET_CHAOS_EXPERIMENTS_SUCCESS' as const;
export const GET_CHAOS_EXPERIMENTS_FAILURE = 'GET_CHAOS_EXPERIMENTS_FAILURE' as const;

export const CREATE_CHAOS_EXPERIMENT = 'CREATE_CHAOS_EXPERIMENT' as const;
export const CREATE_CHAOS_EXPERIMENT_SUCCESS = 'CREATE_CHAOS_EXPERIMENT_SUCCESS' as const;
export const CREATE_CHAOS_EXPERIMENT_FAILURE = 'CREATE_CHAOS_EXPERIMENT_FAILURE' as const;

export const UPDATE_CHAOS_EXPERIMENT = 'UPDATE_CHAOS_EXPERIMENT' as const;
export const UPDATE_CHAOS_EXPERIMENT_SUCCESS = 'UPDATE_CHAOS_EXPERIMENT_SUCCESS' as const;
export const UPDATE_CHAOS_EXPERIMENT_FAILURE = 'UPDATE_CHAOS_EXPERIMENT_FAILURE' as const;

export const DELETE_CHAOS_EXPERIMENT = 'DELETE_CHAOS_EXPERIMENT' as const;
export const DELETE_CHAOS_EXPERIMENT_SUCCESS = 'DELETE_CHAOS_EXPERIMENT_SUCCESS' as const;
export const DELETE_CHAOS_EXPERIMENT_FAILURE = 'DELETE_CHAOS_EXPERIMENT_FAILURE' as const;

export const CLEAR_SELECTED_CHAOS_EXPERIMENT = 'CLEAR_SELECTED_CHAOS_EXPERIMENT' as const;
export const CLEAR_ALL_CHAOS_EXPERIMENTS_SUCCESS = 'CLEAR_ALL_CHAOS_EXPERIMENTS_SUCCESS' as const;

// Discriminated union for actions
export type ChaosExperimentsAction =
  | { type: typeof GET_CHAOS_EXPERIMENTS }
  | { type: typeof GET_CHAOS_EXPERIMENTS_SUCCESS; payload: ChaosExperiment[] }
  | { type: typeof GET_CHAOS_EXPERIMENTS_FAILURE; payload: string }
  | { type: typeof CREATE_CHAOS_EXPERIMENT; payload: ChaosExperimentCreatePayload }
  | { type: typeof CREATE_CHAOS_EXPERIMENT_SUCCESS }
  | { type: typeof CREATE_CHAOS_EXPERIMENT_FAILURE; payload: string }
  | { type: typeof UPDATE_CHAOS_EXPERIMENT; payload: { id: string; body: ChaosExperimentCreatePayload } }
  | { type: typeof UPDATE_CHAOS_EXPERIMENT_SUCCESS }
  | { type: typeof UPDATE_CHAOS_EXPERIMENT_FAILURE; payload: string }
  | { type: typeof DELETE_CHAOS_EXPERIMENT; payload: string }
  | { type: typeof DELETE_CHAOS_EXPERIMENT_SUCCESS }
  | { type: typeof DELETE_CHAOS_EXPERIMENT_FAILURE; payload: string }
  | { type: typeof CLEAR_SELECTED_CHAOS_EXPERIMENT }
  | { type: typeof CLEAR_ALL_CHAOS_EXPERIMENTS_SUCCESS };

// Action creators
export const getChaosExperiments = (): ChaosExperimentsAction => ({
  type: GET_CHAOS_EXPERIMENTS,
});

export const getChaosExperimentsSuccess = (experiments: ChaosExperiment[]): ChaosExperimentsAction => ({
  type: GET_CHAOS_EXPERIMENTS_SUCCESS,
  payload: experiments,
});

export const getChaosExperimentsFailure = (error: string): ChaosExperimentsAction => ({
  type: GET_CHAOS_EXPERIMENTS_FAILURE,
  payload: error,
});

export const createChaosExperiment = (body: ChaosExperimentCreatePayload): ChaosExperimentsAction => ({
  type: CREATE_CHAOS_EXPERIMENT,
  payload: body,
});

export const createChaosExperimentSuccess = (): ChaosExperimentsAction => ({
  type: CREATE_CHAOS_EXPERIMENT_SUCCESS,
});

export const createChaosExperimentFailure = (error: string): ChaosExperimentsAction => ({
  type: CREATE_CHAOS_EXPERIMENT_FAILURE,
  payload: error,
});

export const updateChaosExperiment = (id: string, body: ChaosExperimentCreatePayload): ChaosExperimentsAction => ({
  type: UPDATE_CHAOS_EXPERIMENT,
  payload: { id, body },
});

export const updateChaosExperimentSuccess = (): ChaosExperimentsAction => ({
  type: UPDATE_CHAOS_EXPERIMENT_SUCCESS,
});

export const updateChaosExperimentFailure = (error: string): ChaosExperimentsAction => ({
  type: UPDATE_CHAOS_EXPERIMENT_FAILURE,
  payload: error,
});

export const deleteChaosExperiment = (id: string): ChaosExperimentsAction => ({
  type: DELETE_CHAOS_EXPERIMENT,
  payload: id,
});

export const deleteChaosExperimentSuccess = (): ChaosExperimentsAction => ({
  type: DELETE_CHAOS_EXPERIMENT_SUCCESS,
});

export const deleteChaosExperimentFailure = (error: string): ChaosExperimentsAction => ({
  type: DELETE_CHAOS_EXPERIMENT_FAILURE,
  payload: error,
});

export const clearSelectedChaosExperiment = (): ChaosExperimentsAction => ({
  type: CLEAR_SELECTED_CHAOS_EXPERIMENT,
});

export const clearAllChaosExperimentsSuccess = (): ChaosExperimentsAction => ({
  type: CLEAR_ALL_CHAOS_EXPERIMENTS_SUCCESS,
});
