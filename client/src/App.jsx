import './App.css';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Login from './components/Login/Login.jsx';
import NavBar from './components/NavBar/NavBar.jsx';
import Footer from './components/Footer/Footer.jsx';
import ErrorModal from './components/ErrorModal/ErrorModal.jsx'; // Keep your existing component
import Register from './components/Register/Register.jsx';
import Confirmation from './components/Confirmation/Confirmation.jsx';
import Breakrooms from './components/Breakrooms/Breakrooms.jsx';
import CreateBreakRoom from './components/CreateBreakRoom/CreateBreakRoom.jsx';
import Users from './components/Users/Users.jsx';
import Loading from './components/Loading/Loading.jsx';
import ChatRoom from './components/ChatRoom/ChatRoom.jsx';
import ForgotPassword from './components/ForgotPassword/ForgotPassword.jsx';
import OAuthSuccess from './components/OAuthSuccess/OAuthSuccess.jsx';
import NewsFeed from './components/NewsFeed/NewsFeed.jsx';
import DeveloperAccessOnly from './components/DeveloperAccessOnly/DeveloperAccessOnly.jsx';
import { useAuth } from './hooks/useAuth.js';

// --- HELPER COMPONENT: ERROR ROUTE WRAPPER ---
// This reads the error message sent via navigation state
const ErrorRouteWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Get dynamic message (defaults if none provided)
  const { message, icon } = location.state || {};

  return (
    <ErrorModal
      errorStatement={message || "Something went wrong!"}
      errorIcon={icon || "/assets/error.png"}
      // 2. Critical: Navigate away when closed, don't just log to console
      onClose={() => navigate('/')}
    />
  );
};

// --- HELPER COMPONENT: PROTECTED ROUTE ---
// Optional: Prevents access to pages like NewsFeed if not logged in
const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// const AdminRoute = ({ children, user }) => {
//   // Provided your user object has a role field like: user.role === 'admin' or 'developer'
//   if (user?.role !== 'admin' && user?.role !== 'developer') {
//     return <DeveloperAccessOnly />;
//   }

//   // If they have access, render the actual page
//   return children;
// };

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div id="main-app-container">
      <NavBar />
      <main id="content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />

          {/* The Error Route now uses the wrapper.
             To use it from other pages: navigate('/error', { state: { message: 'Login Failed' } })
          */}
          <Route path="/error" element={<ErrorRouteWrapper />} />

          {/* Protected Routes (Optional: Wrap these to secure them) */}
          <Route
            path="/news-feed"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <NewsFeed />
              </ProtectedRoute>
            }
          />
          <Route path="/users" element={<Users />} />
          <Route path="/breakrooms" element={<Breakrooms />} />
          <Route path="/breakrooms/create" element={<CreateBreakRoom />} />
          {/* Developer Access Only */}
          {/* <Route
         path="/breakrooms/create"
         element={
           <AdminRoute user={user}>
             <CreateBreakRoom />
           </AdminRoute>
         }
        /> */}
          <Route path="/chatroom" element={<ChatRoom />} />
          <Route path="/denied" element={<DeveloperAccessOnly />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
