import './reusable-styled-button.css';

const ReusableStyledButton = ({
  title,
  onClick,
  type = 'button',
  className = '',
  fullWidth = false, // new prop
}) => {
  const combinedClassNames = [
    'reusable-styled-button',
    'glow-on-arrival-entry',
    fullWidth ? 'register-button' : '',
    className, // keep manual overrides last
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={combinedClassNames} onClick={onClick}>
      {title}
    </button>
  );
};

export default ReusableStyledButton;
