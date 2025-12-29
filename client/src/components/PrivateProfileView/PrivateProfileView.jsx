import React from 'react';
import { useNavigate } from 'react-router-dom';
// Switched to 'Lock' which implies privacy rather than a ban
import { Lock } from 'lucide-react';
import ReusableStyledButton from '../ReusableStyledButton/ReusableStyledButton';
import './private-profile-view.css';

const PrivateProfileView = () => {
  const navigate = useNavigate();

  return (
    <div className="ppv-container">
      <div className="ppv-card glow-on-hover">
        <div className="ppv-icon-wrapper">
          <Lock size={80} strokeWidth={1.5} className="ppv-icon" />
        </div>

        <h1>Profile Locked</h1>

        <p>
          This user's profile is set to private.
          <br />
          To see their posts and updates, you need to be part of their network.
        </p>

        {/* Future Feature Idea:
           You could add a second button here: <ReusableStyledButton title="Connect" />
        */}

        <ReusableStyledButton
          title="Go Back Home"
          onClick={() => navigate('/')}
          className="ppv-button"
        />
      </div>
    </div>
  );
};

export default PrivateProfileView;
