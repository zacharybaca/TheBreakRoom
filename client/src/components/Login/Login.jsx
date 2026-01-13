import './login.css';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import ReusableStyledButton from '../ReusableStyledButton/ReusableStyledButton.jsx';
import { useModal } from '../../hooks/useModal.js';
import { useAuth } from '../../hooks/useAuth.js'; // Optional: Use Auth Context for login if preferred

const Login = () => {
  const { onOpen } = useModal();
  const navigate = useNavigate();
  const { loginUser } = useAuth(); // Using the context helper is usually cleaner, but we can keep fetch here if you prefer.

  // 1. State to track if the user is blocked due to inactivity
  const [isInactive, setIsInactive] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const formik = useFormik({
    initialValues: {
      identifier: '',
      password: '',
    },
    validationSchema: Yup.object({
      identifier: Yup.string().required('Username or E-mail is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      // Reset states on new attempt
      setIsInactive(false);
      setGeneralError('');

      try {
        // We use JSON here to match standard MERN AuthController expectations
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        const data = await res.json();

        // 2. Handle Errors
        if (!res.ok) {
          // Check for specific "Inactive" status (403) from backend
          if (res.status === 403 && (data.message?.includes('inactive') || data.message?.includes('deactivated'))) {
            setIsInactive(true);
            return; // Stop here, UI will update to show Reactivate button
          }

          // Check for "Banned" status
          if (res.status === 403 && data.message?.includes('suspended')) {
             navigate('/banned');
             return;
          }

          throw new Error(data.message || 'Failed to login');
        }

        console.log('✅ Logged-in successfully:', data);

        // Save token (or let AuthProvider handle it if using context)
        localStorage.setItem('accessToken', data.accessToken);

        resetForm();
        navigate('/news-feed'); // Success!

      } catch (err) {
        console.error('❌ Login Error:', err.message);
        setGeneralError(err.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // 3. Handler for Reactivation Request
  const handleRequestReactivation = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/request-reactivation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formik.values.identifier }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Reactivation request sent! Admins will review it shortly.");
        setIsInactive(false); // Reset UI so they can try logging in later
        navigate('/'); // Optional refresh
      } else {
        alert(data.message || "Failed to send request.");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    }
  };

  return (
    <div className="split-screen-container">
      {/* LEFT SIDE: Visual Branding */}
      <div className="split-brand-side">
        <div className="brand-content">
          <h1>The Breakroom</h1>
          <p className="brand-tagline">Where work stories find a home.</p>

          <div className="brand-features">
            <div className="feature-item">
              <span className="feature-icon">☕</span>
              <span>Vent without judgment</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💬</span>
              <span>Connect with coworkers</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🚀</span>
              <span>No manager oversight</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: The Login Form */}
      <div className="split-form-side">
        <div className="form-container">
          <div className="form-header">
            <h1>Welcome Back</h1>
            <h2>Log in to start chatting</h2>
          </div>

          <ReusableStyledButton
            type="button"
            fullWidth
            title="Register New Account"
            onClick={() => onOpen('register')}
          />

          <div className="divider">
            <span>or login with email</span>
          </div>

          <form onSubmit={formik.handleSubmit} noValidate>
            {/* Identifier field */}
            <div className="form-group">
              <label htmlFor="identifier">Username or E-mail</label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.identifier}
                aria-invalid={
                  formik.touched.identifier && !!formik.errors.identifier
                }
              />
              {formik.touched.identifier && formik.errors.identifier && (
                <p id="identifier-error" className="error-text">
                  {formik.errors.identifier}
                </p>
              )}
            </div>

            {/* Password field */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                aria-invalid={
                  formik.touched.password && !!formik.errors.password
                }
              />
              {formik.touched.password && formik.errors.password && (
                <p id="password-error" className="error-text">
                  {formik.errors.password}
                </p>
              )}
            </div>

            {/* General Error Message */}
            {generalError && (
              <div className="error-banner" style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>
                {generalError}
              </div>
            )}

            {/* 4. Conditional Rendering: Login vs Reactivate */}
            {isInactive ? (
              <div className="inactive-notice" style={{ textAlign: 'center', animation: 'fadeIn 0.3s' }}>
                <p style={{ color: '#e53e3e', fontWeight: 'bold', marginBottom: '10px' }}>
                  Account Inactive due to absence.
                </p>
                <ReusableStyledButton
                  title="Request Reactivation"
                  type="button"
                  onClick={handleRequestReactivation}
                  fullWidth
                  style={{ backgroundColor: '#dd6b20', borderColor: '#c05621' }}
                />
                <button
                  type="button"
                  onClick={() => setIsInactive(false)}
                  style={{ background: 'none', border: 'none', textDecoration: 'underline', color: '#718096', marginTop: '10px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <ReusableStyledButton
                title={formik.isSubmitting ? 'Logging in...' : 'Login'}
                type="submit"
                disabled={formik.isSubmitting}
                fullWidth
              />
            )}
          </form>

          <div className="social-login-buttons-container">
            <a href={`${import.meta.env.VITE_BACKEND_URL}/auth/google`}>
              <button className="google-btn">
                <img src="/assets/google.png" alt="google icon" />
                Sign in with Google
              </button>
            </a>

            <a href={`${import.meta.env.VITE_BACKEND_URL}/auth/apple`}>
              <button className="apple-btn">
                <img src="/assets/apple.png" alt="apple icon" />
                Sign in with Apple
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
