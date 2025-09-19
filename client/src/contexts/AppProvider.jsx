import { BrowserRouter as Router } from 'react-router-dom';
import { FetcherProvider } from './Fetcher/FetcherProvider';
import { AuthProvider } from './Auth/AuthProvider';
import { ToggleProvider } from './Toggle/ToggleProvider';
import { ConfirmationProvider } from './Confirmation/ConfirmationProvider';
import { ModalProvider } from './Modal/ModalProvider';

export const AppProvider = ({ children }) => {
  return (
    <Router>
      {/* AuthProvider is outermost so all providers have access to auth */}
      <AuthProvider>
        <ModalProvider>
          <ConfirmationProvider>
            <ToggleProvider>
              <FetcherProvider>{children}</FetcherProvider>
            </ToggleProvider>
          </ConfirmationProvider>
        </ModalProvider>
      </AuthProvider>
    </Router>
  );
};
