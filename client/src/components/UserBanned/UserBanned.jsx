import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Ban } from 'lucide-react';
import ReusableStyledButton from '../ReusableStyledButton/ReusableStyledButton';
import './user-banned.css';

const UserBanned = () => {
  const navigate = useNavigate();

  return (
    <div className="banned-container">
      <div className="banned-card glow-on-hover">
        <div className="banned-icon-wrapper">
          {/* The Ban icon is universally understood */}
          <Ban size={80} strokeWidth={1.5} className="banned-icon" />
        </div>

        <h1>Account Suspended</h1>

        <p>
          We're sorry, but your account has been suspended indefinitely due to a
          violation of our{' '}
          <a href="/terms" className="banned-link">
            Community Guidelines
          </a>
          .
          <br />
          <br />
          You are currently unable to access The Breakroom.
        </p>

        {/* Action Buttons */}
        <div className="banned-actions">
          <ReusableStyledButton
            title="Return Home"
            onClick={() => navigate('/')}
            className="banned-button"
          />

          {/* Optional: Add a contact support link if you have one */}
          <a href="mailto:support@nine2five.com" className="contact-link">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserBanned;
