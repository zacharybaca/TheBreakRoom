import { AppProvider } from './contexts/AppProvider.jsx';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'modern-normalize';
import './index.css';

import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>
);
