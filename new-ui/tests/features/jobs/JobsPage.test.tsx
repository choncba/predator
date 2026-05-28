import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../setup';
import JobsPage from '@/features/jobs/JobsPage';

describe('JobsPage', () => {
  it('renders without throwing', () => {
    expect(() =>
      renderWithProviders(<JobsPage />, {
        initialState: {
          jobs: {
            jobs: [],
            selectedJob: null,
            processing: false,
            error: null,
            deleteSuccess: false,
            createSuccess: null,
            loading: false,
          },
          tests: {
            tests: [],
            processing: false,
            error: null,
            deleteSuccess: false,
            createSuccess: null,
            selectedTest: null,
            loading: false,
            fileMetadata: null,
          },
        },
        route: '/jobs',
      })
    ).not.toThrow();
  });
});
