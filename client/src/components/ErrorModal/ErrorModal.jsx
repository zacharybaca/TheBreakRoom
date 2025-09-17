import './error-modal.css';
import React from 'react';
import PropTypes from 'prop-types';

const ErrorModal = ({ errorStatement, errorIcon, onClose }) => {
  const [showDialog, setShowDialog] = React.useState(!!errorStatement);

  React.useEffect(() => {
    setShowDialog(!!errorStatement);
  }, [errorStatement]);

  React.useEffect(() => {
    document.body.style.overflow = showDialog ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showDialog]);

  const handleDialog = () => {
    setShowDialog(false);
    onClose?.();
  };

  return showDialog ? (
    <div id="error-dialog-overlay" role="dialog" aria-hidden={!showDialog}>
      <div id="error-dialog-content">
        <div id="error-title-container">
          <img src={errorIcon || ErrorIcon} id="error-icon" alt="error icon" />
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
  ) : null;
};

ErrorModal.propTypes = {
  errorStatement: PropTypes.string,
  errorIcon: PropTypes.string,
  onClose: PropTypes.func,
};

export default ErrorModal;
