import './App.css';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Login from './components/Login/Login.jsx';
import NavBar from './components/NavBar/NavBar.jsx';
import Footer from './components/Footer/Footer.jsx';
import ErrorModal from './components/ErrorModal/ErrorModal.jsx';
import Register from './components/Register/Register.jsx';
import Confirmation from './components/Confirmation/Confirmation.jsx';
import Breakrooms from './components/Breakrooms/Breakrooms.jsx';
import Users from './components/Users/Users.jsx';
import Loading from './components/Loading/Loading.jsx';
import ChatRoom from './components/ChatRoom/ChatRoom.jsx';
import ForgotPassword from './components/ForgotPassword/ForgotPassword.jsx';
import OAuthSuccess from './components/OAuthSuccess/OAuthSuccess.jsx';
import NewsFeed from './components/NewsFeed/NewsFeed.jsx';
import DeveloperAccessOnly from './components/DeveloperAccessOnly/DeveloperAccessOnly.jsx';
import PrivateProfileView from './components/PrivateProfileView/PrivateProfileView.jsx';
import UserBanned from './components/UserBanned/UserBanned.jsx';
import NotFound from './components/NotFound/NotFound.jsx';
import MaintenanceMode from './components/MaintenanceMode/MaintenanceMode.jsx';
import SessionExpired from './components/SessionExpired/SessionExpired.jsx';
import AdminCreateBreakroom from './components/AdminCreateBreakroom/AdminCreateBreakroom.jsx';
import AdminReactivationQueue from './components/AdminReactivationQueue/AdminReactivationQueue.jsx';

// Import the new standalone component
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';

// --- HELPER COMPONENT: ERROR ROUTE WRAPPER ---
const ErrorRouteWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { message, icon } = location.state || {};

  return (
    <ErrorModal
      errorStatement={message || 'Something went wrong!'}
      errorIcon={icon || '/assets/error.png'}
      onClose={() => navigate('/')}
    />
  );
};

function App() {
  // We removed the destructuring of { isAuthenticated } here because
  // ProtectedRoute now handles that logic internally!

  return (
    <div id="main-app-container">
      <NavBar />
      <main id="content">
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />

          {/* Helper Routes */}
          <Route path="/error" element={<ErrorRouteWrapper />} />
          <Route path="/denied" element={<DeveloperAccessOnly />} />
          <Route path="/private-profile" element={<PrivateProfileView />} />
          <Route path="/banned" element={<UserBanned />} />
          <Route path="/maintenance" element={<MaintenanceMode />} />
          <Route path="/session-expired" element={<SessionExpired />} />

          {/* --- Protected Routes --- */}
          <Route
            path="/news-feed"
            element={
              <ProtectedRoute>
                <NewsFeed />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            }
          />

          <Route
            path="/breakrooms"
            element={
              <ProtectedRoute>
                <Breakrooms />
              </ProtectedRoute>
            }
          />

          <Route
            path="/chatroom"
            element={
              <ProtectedRoute>
                <ChatRoom />
              </ProtectedRoute>
            }
          />

          {/* Admin / Developer Routes */}
          <Route
            path="/admin/reactivation-requests"
            element={
              <ProtectedRoute>
                <AdminReactivationQueue />
              </ProtectedRoute>
              }
          />

          <Route
            path="/admin/breakrooms/create"
            element={
              <ProtectedRoute>
                <AdminCreateBreakroom />
              </ProtectedRoute>
            }
          />

          {/* Catch-All 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
