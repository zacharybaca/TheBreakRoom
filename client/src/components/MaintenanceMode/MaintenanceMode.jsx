import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Construction } from 'lucide-react';
import ReusableStyledButton from '../ReusableStyledButton/ReusableStyledButton';
import './maintenance-mode.css';

const MaintenanceMode = () => {
  const navigate = useNavigate();

  return (
    <div className="maintenance-container">
      <div className="maintenance-card glow-on-hover">
        <div className="maintenance-icon-wrapper">
          {/* A Construction Cone or Wrench fits best here */}
          <Construction
            size={80}
            strokeWidth={1.5}
            className="maintenance-icon"
          />
        </div>

        <h1>Clean-up on Server 5</h1>

        <p>
          The Breakroom is currently closed for maintenance.
          <br />
          We're sweeping the code and restocking the database features.
          <br />
          <span className="estimated-time">
            Estimated downtime: ~15 minutes
          </span>
        </p>

        <ReusableStyledButton
          title="Try Refreshing"
          onClick={() => window.location.reload()}
          className="maintenance-button"
        />

        <button onClick={() => navigate('/')} className="maintenance-sub-link">
          Check Home Page
        </button>
      </div>
    </div>
  );
};

export default MaintenanceMode;
