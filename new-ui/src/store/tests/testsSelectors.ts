import { RootState } from '../index';
import { Test, FileMetadata } from '../../types/test';
import { CreateJobSuccess } from './testsTypes';

export const selectTests = (state: RootState): Test[] => state.tests?.tests ?? [];

export const selectSelectedTest = (state: RootState): Test | null => state.tests.selectedTest;

export const selectProcessingGetTests = (state: RootState): boolean => state.tests.processing;

export const selectErrorOnGetTests = (state: RootState): string | null => state.tests.error;

export const selectDeleteTestSuccess = (state: RootState): boolean => state.tests.deleteSuccess;

export const selectErrorOnDeleteTest = (state: RootState): string | null => state.tests.error;

export const selectCreateJobSuccess = (state: RootState): CreateJobSuccess | null => state.tests.createSuccess;

export const selectTestsLoading = (state: RootState): boolean => state.tests.loading;

export const selectFileMetadata = (state: RootState): FileMetadata | null => state.tests.fileMetadata;
