import React, { useState } from 'react';
import { Gavel, AlertTriangle, X } from 'lucide-react';
import ReusableStyledButton from '../ReusableStyledButton/ReusableStyledButton';
import { useFetcher } from '../../hooks/useFetcher';
import './admin-ban-user.css';

const BAN_REASONS = [
  'Violation of Community Guidelines',
  'Harassment or Bullying',
  'Spam or Bot Activity',
  'Inappropriate Content',
  'Security Risk / Compromised Account',
  'Other',
];

const AdminBanUserModal = ({ userToBan, onClose, onSuccess }) => {
  const { fetcher } = useFetcher();
  const [selectedReason, setSelectedReason] = useState(BAN_REASONS[0]);
  const [customReason, setCustomReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If the user is ALREADY banned, we are unbanning them.
  const isUnbanning = userToBan?.isBanned;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // If "Other" is selected, use the text input; otherwise use the dropdown value
    const finalReason =
      selectedReason === 'Other' ? customReason : selectedReason;

    // Use the route defined in your userRoutes.js
    const { success, message } = await fetcher(
      `/api/users/${userToBan._id}/ban`,
      {
        method: 'PUT',
        body: JSON.stringify({
          // Only send reason if we are banning, not unbanning
          banReason: isUnbanning ? null : finalReason,
        }),
        headers: { 'Content-Type': 'application/json' },
      }
    );

    setIsLoading(false);

    if (success) {
      alert(message);
      if (onSuccess) onSuccess(); // Refresh the parent list
      onClose(); // Close modal
    } else {
      alert(`Error: ${message}`);
    }
  };

  if (!userToBan) return null;

  return (
    <div className="ban-modal-overlay">
      <div className="ban-modal-content">
        {/* Header */}
        <div className="ban-modal-header">
          <div className="ban-icon-wrapper">
            <Gavel size={24} className="ban-icon" />
          </div>
          <h2>{isUnbanning ? 'Lift Suspension' : 'Suspend User'}</h2>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>

        {/* Warning Body */}
        <div className="ban-modal-body">
          <p>
            You are about to {isUnbanning ? 'reactivate' : 'suspend'} the
            account for:
            <br />
            <strong>{userToBan.name}</strong>
            <span className="user-handle"> (@{userToBan.username})</span>
          </p>

          {!isUnbanning && (
            <div className="ban-form-group">
              <label>Reason for Suspension</label>
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="ban-select"
              >
                {BAN_REASONS.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>

              {/* Conditional Input for 'Other' */}
              {selectedReason === 'Other' && (
                <textarea
                  className="ban-textarea"
                  placeholder="Please describe the reason..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  maxLength={100}
                />
              )}
            </div>
          )}

          {isUnbanning && (
            <div className="unban-notice">
              <AlertTriangle size={18} />
              <span>This will restore their access immediately.</span>
            </div>
          )}
        </div>

        {/* Footer / Buttons */}
        <div className="ban-modal-footer">
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>

          <ReusableStyledButton
            title={
              isLoading
                ? 'Processing...'
                : isUnbanning
                  ? 'Reactivate User'
                  : 'Confirm Suspension'
            }
            onClick={handleSubmit}
            className={`confirm-ban-btn ${isUnbanning ? 'green-mode' : 'red-mode'}`}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminBanUserModal;
