import { RootState } from '../index';
import { Job } from '../../types/job';

export const selectJobs = (state: RootState): Job[] => state.jobs?.jobs ?? [];

export const selectSelectedJob = (state: RootState): Job | null => state.jobs?.selectedJob ?? null;

export const selectProcessingGetJobs = (state: RootState): boolean => state.jobs?.processing ?? false;

export const selectErrorOnGetJobs = (state: RootState): string | null => state.jobs?.error ?? null;

export const selectDeleteJobSuccess = (state: RootState): boolean => state.jobs?.deleteSuccess ?? false;

export const selectCreateJobSuccess = (state: RootState): boolean => state.jobs?.createSuccess ?? false;
