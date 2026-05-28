import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../setup';
import TestsPage from '@/features/tests/TestsPage';

describe('TestsPage', () => {
  it('renders without throwing', () => {
    expect(() =>
      renderWithProviders(<TestsPage />, {
        initialState: {
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
          jobs: {
            jobs: [],
            selectedJob: null,
            processing: false,
            error: null,
            deleteSuccess: false,
            createSuccess: null,
            loading: false,
          },
        },
        route: '/tests',
      })
    ).not.toThrow();
  });
});
