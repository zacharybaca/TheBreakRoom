import React from 'react';
import { useNavigate } from 'react-router-dom';
// Using a "missing file" icon from lucide-react
import { FileQuestion } from 'lucide-react';
import ReusableStyledButton from '../ReusableStyledButton/ReusableStyledButton';
import './not-found.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="nf-container">
      <div className="nf-card glow-on-hover">
        <div className="nf-icon-wrapper">
          {/* Added a slight tilt to the icon for character */}
          <FileQuestion
            size={80}
            strokeWidth={1.5}
            className="nf-icon"
            style={{ transform: 'rotate(-10deg)' }}
          />
        </div>

        <h1>Oops! This page is MIA.</h1>

        <p>
          We looked everywhere—under the coffee machine, behind the water
          cooler...
          <br />
          It seems the page you are looking for has gone on a permanent coffee
          break.
        </p>

        <ReusableStyledButton
          title="Head back to the Breakroom"
          onClick={() => navigate('/')}
          className="nf-button"
        />
      </div>
    </div>
  );
};

export default NotFound;
