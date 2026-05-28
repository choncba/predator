import { RootState } from '../index';
import { AppConfig } from '../../types/config';

export const selectConfig = (state: RootState): AppConfig | null =>
  state.config.config;

export const selectConfigLoading = (state: RootState): boolean =>
  state.config.loading;

export const selectConfigError = (state: RootState): string | null =>
  state.config.error;

export const selectConfigUpdateSuccess = (state: RootState): boolean =>
  state.config.updateSuccess;

export const selectConfigUpdateError = (state: RootState): string | null =>
  state.config.updateError;

export const selectConfigDeleteLoading = (state: RootState): boolean =>
  state.config.deleteLoading;

export const selectCleanFinishedContainersSuccess = (state: RootState): string | null =>
  state.config.cleanFinishedContainersSuccess;

export const selectCleanFinishedContainersFailure = (state: RootState): string | null =>
  state.config.cleanFinishedContainersFailure;
