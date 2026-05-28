import { RootState } from '../index';
import { Processor } from '../../types/processor';

export const selectProcessors = (state: RootState): Processor[] =>
  state.processors.processors;

export const selectSelectedProcessor = (state: RootState): Processor | null =>
  state.processors.selectedProcessor;

export const selectProcessingGetProcessors = (state: RootState): boolean =>
  state.processors.processing;

export const selectErrorOnGetProcessors = (state: RootState): string | null =>
  state.processors.error;

export const selectDeleteProcessorSuccess = (state: RootState): boolean =>
  state.processors.deleteSuccess;

export const selectCreateProcessorSuccess = (state: RootState): boolean =>
  state.processors.createSuccess;

export const selectProcessorsLoading = (state: RootState): boolean =>
  state.processors.loading;
