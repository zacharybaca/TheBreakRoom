// AppProvider.jsx
import { BrowserRouter as Router } from 'react-router-dom';
import { FetcherProvider } from './Fetcher/FetcherProvider';
import { AuthProvider } from './Auth/AuthProvider';
import { ToggleProvider } from './Toggle/ToggleProvider';
import { ConfirmationProvider } from './Confirmation/ConfirmationProvider';
import { ModalProvider } from './Modal/ModalProvider';
import { UsersProvider } from './Users/UsersProvider';
import { useAuth } from '../hooks/useAuth';

// Loader component
const Loader = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '1.5rem',
    }}
  >
    Loading...
  </div>
);

// Inner app wrapper that waits for auth to finish bootstrapping
const AppWrapper = ({ children }) => {
  const { loading } = useAuth();

  if (loading) return <Loader />; // Prevent rendering children until auth ready

  return children;
};

export const AppProvider = ({ children }) => {
  return (
    <Router>
      <AuthProvider>
        <AppWrapper>
          <UsersProvider>
            <ModalProvider>
              <ConfirmationProvider>
                <ToggleProvider>
                  <FetcherProvider>{children}</FetcherProvider>
                </ToggleProvider>
              </ConfirmationProvider>
            </ModalProvider>
          </UsersProvider>
        </AppWrapper>
      </AuthProvider>
    </Router>
  );
};
