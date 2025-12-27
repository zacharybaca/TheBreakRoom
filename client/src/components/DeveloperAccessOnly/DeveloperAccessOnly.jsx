import React from 'react';
import { useNavigate } from 'react-router-dom';
// Using Lucide-react as seen in your package.json
import { ShieldBan } from 'lucide-react';
import ReusableStyledButton from '../ReusableStyledButton/ReusableStyledButton';
import './developer-access-only.css';

const DeveloperAccessOnly = () => {
  const navigate = useNavigate();

  return (
    <div className="dao-container">
      <div className="dao-card glow-on-hover">
        <div className="dao-icon-wrapper">
          <ShieldBan size={80} strokeWidth={1.5} className="dao-icon" />
        </div>

        <h1>Restricted Access</h1>

        <p>
          Hold up! You don't have the required permissions to view this area.
          <br />
          This part of the breakroom is reserved for administrators and developers only.
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

export default DeveloperAccessOnly;
