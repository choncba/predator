import {
  ConfigState,
  ConfigAction,
  GET_CONFIG,
  GET_CONFIG_SUCCESS,
  GET_CONFIG_FAILURE,
  UPDATE_CONFIG,
  UPDATE_CONFIG_SUCCESS,
  UPDATE_CONFIG_FAILURE,
  CLEAR_UPDATE_CONFIG_ERROR,
  CLEAN_UPDATE_CONFIG_SUCCESS,
  DELETE_CONFIG,
  DELETE_CONFIG_SUCCESS,
  DELETE_CONFIG_FAILURE,
  CLEAN_FINISHED_CONTAINERS,
  CLEAN_FINISHED_CONTAINERS_SUCCESS,
  CLEAN_FINISHED_CONTAINERS_FAILURE,
} from './configTypes';

const initialState: ConfigState = {
  config: null,
  loading: false,
  error: null,
  updateSuccess: false,
  updateError: null,
  deleteLoading: false,
  cleanFinishedContainersSuccess: null,
  cleanFinishedContainersFailure: null,
};

export function configReducer(
  state: ConfigState = initialState,
  action: ConfigAction
): ConfigState {
  switch (action.type) {
    case GET_CONFIG:
      return { ...state, loading: true, error: null };
    case GET_CONFIG_SUCCESS:
      return { ...state, config: action.payload, loading: false, error: null };
    case GET_CONFIG_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case UPDATE_CONFIG:
      return { ...state, updateError: null };
    case UPDATE_CONFIG_SUCCESS:
      return { ...state, updateSuccess: true };
    case UPDATE_CONFIG_FAILURE:
      return { ...state, updateError: action.payload };
    case CLEAR_UPDATE_CONFIG_ERROR:
      return { ...state, updateError: null };
    case CLEAN_UPDATE_CONFIG_SUCCESS:
      return { ...state, updateSuccess: false };
    case DELETE_CONFIG:
      return { ...state, deleteLoading: true };
    case DELETE_CONFIG_SUCCESS:
      return { ...state, deleteLoading: false };
    case DELETE_CONFIG_FAILURE:
      return { ...state, deleteLoading: false };
    case CLEAN_FINISHED_CONTAINERS:
      return {
        ...state,
        cleanFinishedContainersSuccess: null,
        cleanFinishedContainersFailure: null,
      };
    case CLEAN_FINISHED_CONTAINERS_SUCCESS:
      return { ...state, cleanFinishedContainersSuccess: action.payload };
    case CLEAN_FINISHED_CONTAINERS_FAILURE:
      return { ...state, cleanFinishedContainersFailure: action.payload };
    default:
      return state;
  }
}
