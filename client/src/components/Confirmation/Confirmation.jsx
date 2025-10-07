import React from 'react';
import './confirmation.css';
import { useConfirmation } from '../../hooks/useConfirmation.js';

const Confirmation = () => {

  const {showDialog, dialogQuestion, handleConfirm, handleCancel } = useConfirmation();

  if (!showDialog) return null;

  return (
    <div className="dialog-overlay" role="dialog" aria-modal="true">
      <div className="dialog-content">
        <h2 className="dialog-question">{dialogQuestion}</h2>

        <button
          type="button"
          className="confirm-button glow-on-hover"
          value="confirm"
          onClick={handleConfirm}
        >
          ✅ Confirm
        </button>

        <button
          type="button"
          className="delete-button glow-on-hover"
          value="cancel"
          onClick={handleCancel}
        >
          ❎ Cancel
        </button>
      </div>
    </div>
  );
};

export default Confirmation;
