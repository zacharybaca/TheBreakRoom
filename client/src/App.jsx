import './App.css';
import { Routes, Route } from 'react-router-dom';

// Public / Auth
import Login from './components/Login/Login.jsx';
import Register from './components/Register/Register.jsx';
import ForgotPassword from './components/ForgotPassword/ForgotPassword.jsx';
import Confirmation from './components/Confirmation/Confirmation.jsx';
import OAuthSuccess from './components/OAuthSuccess/OAuthSuccess.jsx';

// Core Features
import NewsFeed from './components/NewsFeed/NewsFeed.jsx';
import Users from './components/Users/Users.jsx';
import Breakrooms from './components/Breakrooms/Breakrooms.jsx';
import ChatRoom from './components/ChatRoom/ChatRoom.jsx';

// Admin / Developer
import AdminDashboard from './pages/AdminDashboard.jsx'; // <--- NEW IMPORT
import AdminCreateBreakroom from './components/AdminCreateBreakroom/AdminCreateBreakroom.jsx';
import DeveloperAccessOnly from './components/DeveloperAccessOnly/DeveloperAccessOnly.jsx';

// Helpers / System
import NavBar from './components/NavBar/NavBar.jsx';
import Footer from './components/Footer/Footer.jsx';
import Loading from './components/Loading/Loading.jsx';
import ErrorRouteWrapper from './components/ErrorRouteWrapper/ErrorRouteWrapper.jsx';
import PrivateProfileView from './components/PrivateProfileView/PrivateProfileView.jsx';
import UserBanned from './components/UserBanned/UserBanned.jsx';
import NotFound from './components/NotFound/NotFound.jsx';
import MaintenanceMode from './components/MaintenanceMode/MaintenanceMode.jsx';
import SessionExpired from './components/SessionExpired/SessionExpired.jsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';

function App() {
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

          {/* --- Admin Routes --- */}

          {/* 1. The Main Dashboard (Tickets, Users, Reactivation Queue) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 2. Specific Creation Tools (Kept separate for now) */}
          <Route
            path="/admin/breakrooms/create"
            element={
              <ProtectedRoute requireAdmin={true}>
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
