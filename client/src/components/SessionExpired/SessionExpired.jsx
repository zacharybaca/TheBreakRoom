import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Hourglass } from 'lucide-react';
import ReusableStyledButton from '../ReusableStyledButton/ReusableStyledButton';
import './session-expired.css';

const SessionExpired = () => {
  const navigate = useNavigate();

  return (
    <div className="session-container">
      <div className="session-card glow-on-hover">
        <div className="session-icon-wrapper">
          <Hourglass size={80} strokeWidth={1.5} className="session-icon" />
        </div>

        <h1>Shift Ended</h1>

        <p>
          Looks like you've been clocked out due to inactivity.
          <br />
          To keep chatting in the breakroom, please punch back in (log in).
        </p>

        <ReusableStyledButton
          title="Log In Again"
          onClick={() => navigate('/')} // Assuming '/' is your login page
          className="session-button"
        />
      </div>
    </div>
  );
};

export default SessionExpired;
