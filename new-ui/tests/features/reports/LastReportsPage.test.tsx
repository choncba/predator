import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../setup';
import LastReportsPage from '@/features/reports/LastReportsPage';

describe('LastReportsPage', () => {
  it('renders without throwing', () => {
    expect(() =>
      renderWithProviders(<LastReportsPage />, {
        initialState: {
          reports: {
            reports: [],
            selectedReport: null,
            processing: false,
            error: null,
            loading: false,
            report: null,
          },
        },
        route: '/last_reports',
      })
    ).not.toThrow();
  });
});
