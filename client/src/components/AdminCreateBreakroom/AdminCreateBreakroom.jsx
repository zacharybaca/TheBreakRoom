import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hammer, Image as ImageIcon } from 'lucide-react';
import ReusableStyledButton from '../ReusableStyledButton/ReusableStyledButton';
import { useFetcher } from '../../hooks/useFetcher';
import './admin-create-breakroom.css';

const AdminCreateBreakroom = () => {
  const navigate = useNavigate();
  const { fetcher } = useFetcher();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    vibe: '',
    accentColor: '#000000',
    accentVibe: '',
    iconURL: '',
  });

  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: 'info', text: 'Constructing breakroom...' });

    // Format data to match Backend Expectation
    const payload = {
      name: formData.name,
      description: formData.description,
      vibe: formData.vibe, // The general vibe
      accent: {
        color: formData.accentColor,
        vibe: formData.accentVibe, // The specific styling vibe
      },
      iconURL: formData.iconURL,
    };

    const { success, error } = await fetcher('/api/breakrooms', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    });

    if (success) {
      setMessage({ type: 'success', text: 'Breakroom created successfully!' });
      // Reset form or navigate
      setTimeout(() => navigate('/breakrooms'), 1500);
    } else {
      setMessage({ type: 'error', text: error || 'Failed to create breakroom.' });
    }
  };

  return (
    <div className="acb-container">
      <div className="acb-card">
        <div className="acb-header">
          <div className="acb-icon-wrapper">
            <Hammer size={32} className="acb-icon" />
          </div>
          <h1>Construct Breakroom</h1>
        </div>

        {message && (
          <div className={`acb-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="acb-form">
          {/* Row 1: Identity */}
          <div className="form-group">
            <label>Breakroom Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. The Coffee Corner"
              value={formData.name}
              onChange={handleChange}
              required
              className="acb-input"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="What is this space for?"
              value={formData.description}
              onChange={handleChange}
              maxLength={500}
              className="acb-input acb-textarea"
            />
          </div>

          {/* Row 2: Vibes & Styling */}
          <div className="form-row">
            <div className="form-group">
              <label>General Vibe</label>
              <input
                type="text"
                name="vibe"
                placeholder="e.g. Chill"
                value={formData.vibe}
                onChange={handleChange}
                className="acb-input"
              />
            </div>

            <div className="form-group">
              <label>Accent Vibe (Subtitle)</label>
              <input
                type="text"
                name="accentVibe"
                placeholder="e.g. Retail Therapy"
                value={formData.accentVibe}
                onChange={handleChange}
                required
                className="acb-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Accent Color</label>
              <div className="color-picker-wrapper">
                <input
                  type="color"
                  name="accentColor"
                  value={formData.accentColor}
                  onChange={handleChange}
                  className="acb-color-input"
                />
                <span className="color-value">{formData.accentColor}</span>
              </div>
            </div>

            <div className="form-group" style={{ flex: 2 }}>
              <label>Icon URL</label>
              <div className="icon-input-wrapper">
                <ImageIcon size={18} className="input-icon" />
                <input
                  type="text"
                  name="iconURL"
                  placeholder="https://..."
                  value={formData.iconURL}
                  onChange={handleChange}
                  className="acb-input with-icon"
                />
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="acb-preview" style={{
            borderColor: formData.accentColor,
            background: `linear-gradient(135deg, rgba(255,255,255,0.9), ${formData.accentColor}22)`
          }}>
            <h4>Preview Card</h4>
            <h3>{formData.name || 'Breakroom Name'}</h3>
            <span className="preview-vibe">{formData.accentVibe || 'Vibe'}</span>
          </div>

          <ReusableStyledButton
            title="Create Breakroom"
            type="submit"
            className="acb-submit"
          />
        </form>
      </div>
    </div>
  );
};

export default AdminCreateBreakroom;
