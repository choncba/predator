import { describe, it, expect } from 'vitest';
import { renderWithProviders } from './setup';
import App from '@/App';

describe('App', () => {
  it('renders without throwing', () => {
    expect(() =>
      renderWithProviders(<App />, {
        initialState: {
          config: { config: { chaos_mesh_enabled: false }, loading: false, error: null },
        },
        route: '/last_reports',
      })
    ).not.toThrow();
  });
});
