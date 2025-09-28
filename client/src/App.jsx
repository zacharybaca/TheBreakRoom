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
import { useAuth } from './hooks/useAuth.js';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div id="main-app-container">
      <NavBar />
      <hr />
      <main id="content">
        {!isAuthenticated && (
          <div id="app-icon">
            <div id="app-icon-container">
              <img
                src="/assets/Nine2Five-logo.png"
                id="app-logo"
                alt="app logo"
              />
              <h1 className="slogan">
                The Platform for the People Who Keep Things Moving.
              </h1>
              <h2 className="slogan">
                From the Breakroom to the World.....We Speak.
              </h2>

            </div>
            <br />
          </div>
        )}

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/breakrooms/create" element={<CreateBreakRoom />} />
          <Route path="/breakrooms" element={<Breakrooms />} />
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
      <hr />
      <Footer />
    </div>
  );
}

export default App;
