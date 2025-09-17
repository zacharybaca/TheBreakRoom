import React from 'react';
import './confirmation.css';


const Confirmation = () => {
    const context = React.useContext(ConfirmationDialogBoxContext);
    const defaultQuestion = "Are you sure you want to perform this action?"

  return (
    context.showDialog ? (
      <div className="dialog-overlay">
        <div className="dialog-content">
          <h2 className="dialog-question">
            {context.dialogQuestion ? context.dialogQuestion : context.handleDialogQuestion(defaultQuestion)}
          </h2>
          <button type="button" className="confirm-button glow-on-hover" onClick={context.handleConfirm} value="confirm">
            ✅ Confirm
          </button>
          <button type="button" className="delete-button glow-on-hover" onClick={context.handleCancel} value="cancel">
            ❎ Cancel
          </button>
        </div>
      </div>
    ) : ""
  );
}

export default Confirmation;
