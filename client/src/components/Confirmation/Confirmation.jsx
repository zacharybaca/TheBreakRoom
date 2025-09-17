import React from 'react';
import './confirmation.css';

const Confirmation = ({
  showDialog = false,
  dialogQuestion = "Are you sure you want to perform this action?",
  onConfirm,
  onCancel
}) => {
  if (!showDialog) return null;

  return (
    <div className="dialog-overlay" role="dialog" aria-modal="true">
      <div className="dialog-content">
        <h2 className="dialog-question">{dialogQuestion}</h2>

        <button
          type="button"
          className="confirm-button glow-on-hover"
          onClick={onConfirm}
        >
          ✅ Confirm
        </button>

        <button
          type="button"
          className="delete-button glow-on-hover"
          onClick={onCancel}
        >
          ❎ Cancel
        </button>
      </div>
    </div>
  );
};

export default Confirmation;
