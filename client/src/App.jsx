import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login.jsx';
import NavBar from './components/NavBar/NavBar.jsx';
import Footer from './components/Footer/Footer.jsx';
import ErrorModal from './components/ErrorModal/ErrorModal.jsx';
import Register from './components/Register/Register.jsx';
import Confirmation from './components/Confirmation/Confirmation.jsx';
import Breakrooms from './components/Breakrooms/Breakrooms.jsx';
import CreateBreakRoom from './components/CreateBreakRoom/CreateBreakRoom.jsx';
import Users from './components/Users/Users.jsx';
import Loading from './components/Loading/Loading.jsx';
import ChatRoom from './components/ChatRoom/ChatRoom.jsx';
import ForgotPassword from './components/ForgotPassword/ForgotPassword.jsx';
import OAuthSuccess from './components/OAuthSuccess/OAuthSuccess.jsx';
import { useAuth } from './hooks/useAuth.js';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div id="main-app-container">
      <NavBar />
      {!isAuthenticated ? (
        <div className="jumbotron-container">
          <img
            src="/assets/app_homepage_logo.png"
            id="jumbotron-img"
            alt="homepage jumbotron"
          />
        </div>
      ) : (
        ''
      )}
      <main id="content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/users" element={<Users />} />
          <Route path="/register" element={<Register />} />
          <Route path="/breakrooms/create" element={<CreateBreakRoom />} />
          <Route path="/breakrooms" element={<Breakrooms />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="/chatroom" element={<ChatRoom />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route
            path="/error"
            element={
              <ErrorModal
                errorStatement="Something went wrong while fetching data!"
                errorIcon="/assets/error.png"
                onClose={() => console.log('Error modal closed')}
              />
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
