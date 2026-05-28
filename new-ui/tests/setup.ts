import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { createStore } from 'redux';

afterEach(() => {
  cleanup();
});

// Minimal theme for testing
const testTheme = createTheme({
  palette: {
    primary: {
      main: '#108ee9',
    },
  },
});

// Minimal root state shape matching the 8 reducer keys
interface MinimalRootState {
  tests: Record<string, unknown>;
  jobs: Record<string, unknown>;
  reports: Record<string, unknown>;
  auth: Record<string, unknown>;
  config: Record<string, unknown>;
  processors: Record<string, unknown>;
  chaosExperiments: Record<string, unknown>;
  webhooks: Record<string, unknown>;
}

const defaultState: MinimalRootState = {
  tests: { tests: [], selectedTest: null, processing: false, error: null, deleteSuccess: false, createSuccess: null, loading: false, fileMetadata: null },
  jobs: { jobs: [], selectedJob: null, processing: false, error: null, deleteSuccess: false, createSuccess: null, loading: false },
  reports: { reports: [], selectedReport: null, processing: false, error: null, loading: false, report: null },
  auth: { token: null },
  config: { config: {}, loading: false, error: null },
  processors: { processors: [], selectedProcessor: null, processing: false, error: null, deleteSuccess: false, createSuccess: null, loading: false },
  chaosExperiments: { chaosExperiments: [], selectedExperiment: null, processing: false, error: null, deleteSuccess: false, createSuccess: null, loading: false },
  webhooks: { webhooks: [], selectedWebhook: null, processing: false, error: null, deleteSuccess: false, createSuccess: null, loading: false },
};

function createMockStore(initialState: Partial<MinimalRootState> = {}) {
  const state = { ...defaultState, ...initialState };
  return createStore((s = state) => s);
}

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  initialState?: Partial<MinimalRootState>;
  route?: string;
}

export function renderWithProviders(
  ui: React.ReactElement,
  options: RenderWithProvidersOptions = {}
) {
  const { initialState, route = '/', ...renderOptions } = options;
  const store = createMockStore(initialState);

  function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      Provider,
      { store, children: React.createElement(
        ThemeProvider,
        { theme: testTheme, children: React.createElement(
          MemoryRouter,
          { initialEntries: [route], children }
        ) }
      ) }
    );
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
