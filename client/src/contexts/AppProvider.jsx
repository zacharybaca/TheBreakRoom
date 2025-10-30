// AppProvider.jsx
import { BrowserRouter as Router } from 'react-router-dom';
import { FetcherProvider } from './Fetcher/FetcherProvider';
import { AuthProvider } from './Auth/AuthProvider';
import { ToggleProvider } from './Toggle/ToggleProvider';
import { ConfirmationProvider } from './Confirmation/ConfirmationProvider';
import { ModalProvider } from './Modal/ModalProvider';
import { UsersProvider } from './Users/UsersProvider';
import { PostsProvider } from './Posts/PostsProvider';
import { SocketProvider } from './Socket/SocketProvider';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/Loading/Loading.jsx';

const AppWrapper = ({ children }) => {
  const { loading } = useAuth();
  if (loading) return <Loading />;
  return children;
};

export const AppProvider = ({ children }) => {
  return (
    <Router>
      <AuthProvider>
        <AppWrapper>
          <SocketProvider>
            <UsersProvider>
              <PostsProvider>
                <ModalProvider>
                  <ConfirmationProvider>
                    <ToggleProvider>
                      <FetcherProvider>{children}</FetcherProvider>
                    </ToggleProvider>
                  </ConfirmationProvider>
                </ModalProvider>
              </PostsProvider>
            </UsersProvider>
          </SocketProvider>
        </AppWrapper>
      </AuthProvider>
    </Router>
  );
};
