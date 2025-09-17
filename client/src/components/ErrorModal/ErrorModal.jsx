import './error-modal.css';
import React from 'react';
import PropTypes from 'prop-types';

const ErrorModal = ({ errorStatement, errorIcon, onClose }) => {
  const [showDialog, setShowDialog] = React.useState(!!errorStatement);
  const dialogRef = React.useRef(null);

  React.useEffect(() => {
    setShowDialog(!!errorStatement);
  }, [errorStatement]);

  // Lock body scroll when modal is open
  React.useEffect(() => {
    document.body.style.overflow = showDialog ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showDialog]);

  // Focus trap for accessibility
  React.useEffect(() => {
    if (showDialog && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [showDialog]);

  const handleDialog = () => {
    setShowDialog(false);
    onClose?.();
  };

  if (!showDialog) return null;

  return (
    <div
      id="error-dialog-overlay"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="error-dialog-statement"
      ref={dialogRef}
      tabIndex="-1"
    >
      <div id="error-dialog-content">
        <div id="error-title-container">
          <img
            src={errorIcon || <img src="/assets/error.png" alt="error icon" />}
            id="error-icon"
            alt="Error icon"
          />
        </div>
        <h2 id="error-dialog-statement">
          {errorStatement || 'Unknown Error Has Occurred'}
        </h2>
        <button
          type="button"
          className="error-confirm-button glow-on-entra"
          onClick={handleDialog}
        >
          ✅ Okay
        </button>
      </div>
    </div>
  );
};

ErrorModal.propTypes = {
  errorStatement: PropTypes.string,
  errorIcon: PropTypes.string,
  onClose: PropTypes.func,
};

export default ErrorModal;
