import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../setup';
import ConfigurationPage from '@/features/configuration/ConfigurationPage';

describe('ConfigurationPage', () => {
  it('renders without throwing', () => {
    expect(() =>
      renderWithProviders(<ConfigurationPage />, {
        initialState: {
          config: { config: {}, loading: false, error: null },
        },
        route: '/settings',
      })
    ).not.toThrow();
  });
});
