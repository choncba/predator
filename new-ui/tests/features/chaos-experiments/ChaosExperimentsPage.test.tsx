import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../setup';
import ChaosExperimentsPage from '@/features/chaos-experiments/ChaosExperimentsPage';

describe('ChaosExperimentsPage', () => {
  it('renders without throwing', () => {
    expect(() =>
      renderWithProviders(<ChaosExperimentsPage />, {
        initialState: {
          chaosExperiments: {
            chaosExperiments: [],
            selectedExperiment: null,
            processing: false,
            error: null,
            deleteSuccess: false,
            createSuccess: null,
            loading: false,
          },
        },
        route: '/chaos_experiments',
      })
    ).not.toThrow();
  });
});
