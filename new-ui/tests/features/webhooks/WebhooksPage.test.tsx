import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../setup';
import WebhooksPage from '@/features/webhooks/WebhooksPage';

describe('WebhooksPage', () => {
  it('renders without throwing', () => {
    expect(() =>
      renderWithProviders(<WebhooksPage />, {
        initialState: {
          webhooks: {
            webhooks: [],
            selectedWebhook: null,
            processing: false,
            error: null,
            deleteSuccess: false,
            createSuccess: null,
            loading: false,
          },
        },
        route: '/webhooks',
      })
    ).not.toThrow();
  });
});
