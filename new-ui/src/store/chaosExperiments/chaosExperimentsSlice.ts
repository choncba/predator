import {
  ChaosExperimentsState,
  ChaosExperimentsAction,
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
  CLEAR_SELECTED_CHAOS_EXPERIMENT,
  CLEAR_ALL_CHAOS_EXPERIMENTS_SUCCESS,
} from './chaosExperimentsTypes';

const initialState: ChaosExperimentsState = {
  chaosExperiments: [],
  selectedExperiment: null,
  processing: false,
  error: null,
  deleteSuccess: false,
  createSuccess: false,
  loading: false,
};

export function chaosExperimentsReducer(
  state = initialState,
  action: ChaosExperimentsAction
): ChaosExperimentsState {
  switch (action.type) {
    case GET_CHAOS_EXPERIMENTS:
      return { ...state, loading: true, error: null };
    case GET_CHAOS_EXPERIMENTS_SUCCESS:
      return { ...state, chaosExperiments: action.payload, loading: false };
    case GET_CHAOS_EXPERIMENTS_FAILURE:
      return { ...state, error: action.payload, loading: false };
    case CREATE_CHAOS_EXPERIMENT:
      return { ...state, processing: true, error: null, createSuccess: false };
    case CREATE_CHAOS_EXPERIMENT_SUCCESS:
      return { ...state, processing: false, createSuccess: true };
    case CREATE_CHAOS_EXPERIMENT_FAILURE:
      return { ...state, processing: false, error: action.payload };
    case UPDATE_CHAOS_EXPERIMENT:
      return { ...state, processing: true, error: null };
    case UPDATE_CHAOS_EXPERIMENT_SUCCESS:
      return { ...state, processing: false };
    case UPDATE_CHAOS_EXPERIMENT_FAILURE:
      return { ...state, processing: false, error: action.payload };
    case DELETE_CHAOS_EXPERIMENT:
      return { ...state, processing: true, error: null, deleteSuccess: false };
    case DELETE_CHAOS_EXPERIMENT_SUCCESS:
      return { ...state, processing: false, deleteSuccess: true };
    case DELETE_CHAOS_EXPERIMENT_FAILURE:
      return { ...state, processing: false, error: action.payload };
    case CLEAR_SELECTED_CHAOS_EXPERIMENT:
      return { ...state, selectedExperiment: null };
    case CLEAR_ALL_CHAOS_EXPERIMENTS_SUCCESS:
      return { ...state, createSuccess: false, deleteSuccess: false };
    default:
      return state;
  }
}
