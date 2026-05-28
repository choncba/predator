import {
  ProcessorsState,
  ProcessorsAction,
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
  CLEAR_SELECTED_PROCESSOR,
  CLEAR_ALL_PROCESSORS_SUCCESS,
} from './processorsTypes';

const initialState: ProcessorsState = {
  processors: [],
  selectedProcessor: null,
  processing: false,
  error: null,
  deleteSuccess: false,
  createSuccess: false,
  loading: false,
};

export function processorsReducer(
  state: ProcessorsState = initialState,
  action: ProcessorsAction
): ProcessorsState {
  switch (action.type) {
    case GET_PROCESSORS:
      return { ...state, processing: true, error: null };
    case GET_PROCESSORS_SUCCESS:
      return { ...state, processors: action.payload, processing: false };
    case GET_PROCESSORS_FAILURE:
      return { ...state, error: action.payload, processing: false };
    case CREATE_PROCESSOR:
      return { ...state, loading: true, error: null, createSuccess: false };
    case CREATE_PROCESSOR_SUCCESS:
      return { ...state, loading: false, createSuccess: true };
    case CREATE_PROCESSOR_FAILURE:
      return { ...state, loading: false, error: action.payload, createSuccess: false };
    case UPDATE_PROCESSOR:
      return { ...state, loading: true, error: null };
    case UPDATE_PROCESSOR_SUCCESS:
      return { ...state, loading: false };
    case UPDATE_PROCESSOR_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case DELETE_PROCESSOR:
      return { ...state, loading: true, error: null, deleteSuccess: false };
    case DELETE_PROCESSOR_SUCCESS:
      return { ...state, loading: false, deleteSuccess: true };
    case DELETE_PROCESSOR_FAILURE:
      return { ...state, loading: false, error: action.payload, deleteSuccess: false };
    case CLEAR_SELECTED_PROCESSOR:
      return { ...state, selectedProcessor: null };
    case CLEAR_ALL_PROCESSORS_SUCCESS:
      return { ...state, deleteSuccess: false, createSuccess: false };
    default:
      return state;
  }
}
