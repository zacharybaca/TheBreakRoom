// components/ReusableStyledButton.jsx
import './reusable-styled-button.css';

const ReusableStyledButton = ({ title, onClick, type = 'button', className = '' }) => {
  return (
    <button
      type={type}
      className={`reusable-styled-button glow-on-arrival-entry ${className}`}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default ReusableStyledButton;
