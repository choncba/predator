import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../setup';
import ReportPage from '@/features/reports/ReportPage';

describe('ReportPage', () => {
  it('renders without throwing', () => {
    expect(() =>
      renderWithProviders(<ReportPage />, {
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
        route: '/tests/test-123/reports/report-456',
      })
    ).not.toThrow();
  });
});
