import { BrowserRouter as Router } from 'react-router-dom';
import { FetcherProvider } from './Fetcher/FetcherProvider';
import { AuthProvider } from './Auth/AuthProvider';
import { ToggleProvider } from './Toggle/ToggleProvider';
import { ConfirmationProvider } from './Confirmation/ConfirmationProvider';

export const AppProvider = ({ children }) => {
  return (
    <Router>
      <ConfirmationProvider>
        <ToggleProvider>
          <AuthProvider>
            <FetcherProvider>{children}</FetcherProvider>
          </AuthProvider>
        </ToggleProvider>
      </ConfirmationProvider>
    </Router>
  );
};
