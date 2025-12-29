import React from 'react';
import { useNavigate } from 'react-router-dom';
// Using Lucide-react as seen in your package.json
import { ShieldBan } from 'lucide-react';
import ReusableStyledButton from '../ReusableStyledButton/ReusableStyledButton';
import './private-profile-view.css';

const PrivateProfileView = () => {
  const navigate = useNavigate();

  return (
    <div className="dao-container">
      <div className="dao-card glow-on-hover">
        <div className="dao-icon-wrapper">
          <ShieldBan size={80} strokeWidth={1.5} className="dao-icon" />
        </div>

        <h1>Restricted Profile</h1>

        <p>
          Sorry! The current user's profile you are trying to view is restricted or they are not apart of your network.
          <br />
          If you would like to view their profile, please send them a connection request.
        </p>

        <ReusableStyledButton
          title="Go Back Home"
          onClick={() => navigate('/')}
          className="dao-button"
        />
      </div>
    </div>
  );
};

export default PrivateProfileView;
