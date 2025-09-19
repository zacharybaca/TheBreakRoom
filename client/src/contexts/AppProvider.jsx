import { BrowserRouter as Router } from 'react-router-dom';
import { FetcherProvider } from './Fetcher/FetcherProvider';
import { AuthProvider } from './Auth/AuthProvider';
import { ToggleProvider } from './Toggle/ToggleProvider';
import { ConfirmationProvider } from './Confirmation/ConfirmationProvider';
import { ModalProvider } from './Modal/ModalProvider';

export const AppProvider = ({ children }) => {
  return (
    <Router>
      <ModalProvider>
        <ConfirmationProvider>
        <ToggleProvider>
          <AuthProvider>
            <FetcherProvider>{children}</FetcherProvider>
          </AuthProvider>
        </ToggleProvider>
      </ConfirmationProvider>
      </ModalProvider>
    </Router>
  );
};
