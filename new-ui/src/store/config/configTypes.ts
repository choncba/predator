import { AppConfig } from '../../types/config';

// State interface
export interface ConfigState {
  config: AppConfig | null;
  loading: boolean;
  error: string | null;
  updateSuccess: boolean;
  updateError: string | null;
  deleteLoading: boolean;
  cleanFinishedContainersSuccess: string | null;
  cleanFinishedContainersFailure: string | null;
}

// Action type constants
export const GET_CONFIG = 'GET_CONFIG' as const;
export const GET_CONFIG_SUCCESS = 'GET_CONFIG_SUCCESS' as const;
export const GET_CONFIG_FAILURE = 'GET_CONFIG_FAILURE' as const;
export const UPDATE_CONFIG = 'UPDATE_CONFIG' as const;
export const UPDATE_CONFIG_SUCCESS = 'UPDATE_CONFIG_SUCCESS' as const;
export const UPDATE_CONFIG_FAILURE = 'UPDATE_CONFIG_FAILURE' as const;
export const CLEAR_UPDATE_CONFIG_ERROR = 'CLEAR_ERROR_ON_UPDATE_CONFIG' as const;
export const CLEAN_UPDATE_CONFIG_SUCCESS = 'CLEAN_UPDATE_CONFIG_SUCCESS' as const;
export const DELETE_CONFIG = 'DELETE_CONFIG_KEY' as const;
export const DELETE_CONFIG_SUCCESS = 'DELETE_CONFIG_SUCCESS' as const;
export const DELETE_CONFIG_FAILURE = 'DELETE_CONFIG_FAILURE' as const;
export const CLEAN_FINISHED_CONTAINERS = 'CLEAN_FINISHED_CONTAINERS' as const;
export const CLEAN_FINISHED_CONTAINERS_SUCCESS = 'CLEAN_FINISHED_CONTAINERS_SUCCESS' as const;
export const CLEAN_FINISHED_CONTAINERS_FAILURE = 'CLEAN_FINISHED_CONTAINERS_FAILURE' as const;

// Discriminated union for all config actions
export type ConfigAction =
  | { type: typeof GET_CONFIG }
  | { type: typeof GET_CONFIG_SUCCESS; payload: AppConfig }
  | { type: typeof GET_CONFIG_FAILURE; payload: string }
  | { type: typeof UPDATE_CONFIG; payload: Partial<AppConfig> }
  | { type: typeof UPDATE_CONFIG_SUCCESS }
  | { type: typeof UPDATE_CONFIG_FAILURE; payload: string }
  | { type: typeof CLEAR_UPDATE_CONFIG_ERROR }
  | { type: typeof CLEAN_UPDATE_CONFIG_SUCCESS }
  | { type: typeof DELETE_CONFIG; payload: string }
  | { type: typeof DELETE_CONFIG_SUCCESS }
  | { type: typeof DELETE_CONFIG_FAILURE; payload: string }
  | { type: typeof CLEAN_FINISHED_CONTAINERS }
  | { type: typeof CLEAN_FINISHED_CONTAINERS_SUCCESS; payload: string }
  | { type: typeof CLEAN_FINISHED_CONTAINERS_FAILURE; payload: string };

// Action creators
export const getConfig = (): ConfigAction => ({
  type: GET_CONFIG,
});

export const getConfigSuccess = (config: AppConfig): ConfigAction => ({
  type: GET_CONFIG_SUCCESS,
  payload: config,
});

export const getConfigFailure = (error: string): ConfigAction => ({
  type: GET_CONFIG_FAILURE,
  payload: error,
});

export const updateConfig = (body: Partial<AppConfig>): ConfigAction => ({
  type: UPDATE_CONFIG,
  payload: body,
});

export const updateConfigSuccess = (): ConfigAction => ({
  type: UPDATE_CONFIG_SUCCESS,
});

export const updateConfigFailure = (error: string): ConfigAction => ({
  type: UPDATE_CONFIG_FAILURE,
  payload: error,
});

export const clearUpdateConfigError = (): ConfigAction => ({
  type: CLEAR_UPDATE_CONFIG_ERROR,
});

export const cleanUpdateConfigSuccess = (): ConfigAction => ({
  type: CLEAN_UPDATE_CONFIG_SUCCESS,
});

export const deleteConfig = (key: string): ConfigAction => ({
  type: DELETE_CONFIG,
  payload: key,
});

export const deleteConfigSuccess = (): ConfigAction => ({
  type: DELETE_CONFIG_SUCCESS,
});

export const deleteConfigFailure = (error: string): ConfigAction => ({
  type: DELETE_CONFIG_FAILURE,
  payload: error,
});

export const cleanFinishedContainers = (): ConfigAction => ({
  type: CLEAN_FINISHED_CONTAINERS,
});

export const cleanFinishedContainersSuccess = (result: string): ConfigAction => ({
  type: CLEAN_FINISHED_CONTAINERS_SUCCESS,
  payload: result,
});

export const cleanFinishedContainersFailure = (error: string): ConfigAction => ({
  type: CLEAN_FINISHED_CONTAINERS_FAILURE,
  payload: error,
});
