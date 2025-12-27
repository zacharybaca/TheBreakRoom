import './error-modal.css';
import React from 'react';
import PropTypes from 'prop-types';

const ErrorModal = ({ errorStatement, errorIcon, onClose }) => {
  const dialogRef = React.useRef(null);

  // If there is no error statement, we assume the modal is closed.
  const showDialog = !!errorStatement;

  // Lock body scroll when modal is open
  React.useEffect(() => {
    if (showDialog) {
      document.body.style.overflow = 'hidden';
      // Focus the modal for accessibility
      dialogRef.current?.focus();
    } else {
      document.body.style.overflow = 'auto';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showDialog]);

  // Handle closing
  const handleDialog = () => {
    if (onClose) onClose();
  };

  // If not open, render nothing
  if (!showDialog) return null;

  // FIX: Determine which image source to use before rendering
  const finalIconSrc = errorIcon || '/assets/error.png';

  return (
    <div
      id="error-dialog-overlay"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="error-dialog-statement"
      ref={dialogRef}
      tabIndex="-1"
      onClick={handleDialog} // Close when clicking the dark background
    >
      {/* Stop click propagation so clicking the card doesn't close it */}
      <div id="error-dialog-content" onClick={(e) => e.stopPropagation()}>
        <div id="error-title-container">
          <img
            src={finalIconSrc}
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
          autoFocus // Automatically select the "Okay" button
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
  onClose: PropTypes.func.isRequired, // It's best practice to require this
};

export default ErrorModal;
