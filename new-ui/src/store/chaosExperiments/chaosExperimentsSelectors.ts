import { RootState } from '../index';
import { ChaosExperiment } from '../../types/chaosExperiment';

export const selectChaosExperiments = (state: RootState): ChaosExperiment[] =>
  state.chaosExperiments.chaosExperiments;

export const selectSelectedChaosExperiment = (state: RootState): ChaosExperiment | null =>
  state.chaosExperiments.selectedExperiment;

export const selectChaosExperimentsProcessing = (state: RootState): boolean =>
  state.chaosExperiments.processing;

export const selectChaosExperimentsError = (state: RootState): string | null =>
  state.chaosExperiments.error;

export const selectChaosExperimentsDeleteSuccess = (state: RootState): boolean =>
  state.chaosExperiments.deleteSuccess;

export const selectChaosExperimentsCreateSuccess = (state: RootState): boolean =>
  state.chaosExperiments.createSuccess;

export const selectChaosExperimentsLoading = (state: RootState): boolean =>
  state.chaosExperiments.loading;
