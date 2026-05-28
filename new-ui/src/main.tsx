import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store';
import App from './App';
import { theme } from './theme/theme';
import './assets/styles/global.scss';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root container element with id "root" not found in the document.');
}

createRoot(rootElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <DndProvider backend={HTML5Backend}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </DndProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
