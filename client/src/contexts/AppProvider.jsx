// AppProvider.jsx
import { BrowserRouter as Router } from 'react-router-dom';
import { FetcherProvider } from './Fetcher/FetcherProvider';
import { AuthProvider } from './Auth/AuthProvider';
import { ToggleProvider } from './Toggle/ToggleProvider';
import { ConfirmationProvider } from './Confirmation/ConfirmationProvider';
import { ModalProvider } from './Modal/ModalProvider';
import { UsersProvider } from './Users/UsersProvider';
import { PostsProvider } from './Posts/PostsProvider';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/Loading/Loading.jsx';

// Inner app wrapper that waits for auth to finish bootstrapping
const AppWrapper = ({ children }) => {
  const { loading } = useAuth();

  if (loading) return <Loading loadingMessage="Loading Your Social Network" />; // Prevent rendering children until auth ready

  return children;
};

export const AppProvider = ({ children }) => {
  return (
    <Router>
      <AuthProvider>
        <AppWrapper>
          {/* <UsersProvider> */}
          {/* <PostsProvider> */}
          <ModalProvider>
            <ConfirmationProvider>
              <ToggleProvider>
                <FetcherProvider>{children}</FetcherProvider>
              </ToggleProvider>
            </ConfirmationProvider>
          </ModalProvider>
          {/* </PostsProvider> */}
          {/* </UsersProvider> */}
        </AppWrapper>
      </AuthProvider>
    </Router>
  );
};
