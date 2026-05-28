import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../setup';
import ProcessorsPage from '@/features/processors/ProcessorsPage';

describe('ProcessorsPage', () => {
  it('renders without throwing', () => {
    expect(() =>
      renderWithProviders(<ProcessorsPage />, {
        initialState: {
          processors: {
            processors: [],
            selectedProcessor: null,
            processing: false,
            error: null,
            deleteSuccess: false,
            createSuccess: null,
            loading: false,
          },
        },
        route: '/processors',
      })
    ).not.toThrow();
  });
});
