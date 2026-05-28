import { RootState } from '../index';
import { Report, AggregateReport } from '../../types/report';

export const selectReports = (state: RootState): Report[] =>
  state.reports?.reports ?? [];

export const selectReport = (state: RootState): Report | null =>
  state.reports?.report ?? null;

export const selectAggregateReport = (state: RootState): AggregateReport | null =>
  state.reports?.aggregateReport ?? null;

export const selectProcessingGetReports = (state: RootState): boolean =>
  state.reports?.processing ?? false;

export const selectErrorOnGetReports = (state: RootState): string | null =>
  state.reports?.error ?? null;
