import './login.css';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ReusableStyledButton from '../ReusableStyledButton/ReusableStyledButton.jsx';
import { useModal } from '../../hooks/useModal.js';

const Login = () => {
  const { onOpen } = useModal();

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
      try {
        const formData = new FormData();
        formData.append('identifier', values.identifier);
        formData.append('password', values.password);

        const res = await fetch('http://localhost:9000/api/login', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          throw new Error('Failed to login');
        }

        const data = await res.json();
        console.log('✅ Logged-in successfully:', data);

        resetForm();
      } catch (err) {
        console.error('❌ Error submitting form:', err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="form-container">
      {/* Updated Text to flow better with the Hero Banner */}
      <h1>Welcome Back</h1>
      <h2>Log in to vent your frustrations away</h2>

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
            aria-invalid={formik.touched.password && !!formik.errors.password}
          />
          {formik.touched.password && formik.errors.password && (
            <p id="password-error" className="error-text">
              {formik.errors.password}
            </p>
          )}
        </div>

        <ReusableStyledButton
          title={formik.isSubmitting ? 'Logging in...' : 'Login'}
          type="submit"
          disabled={formik.isSubmitting}
          fullWidth
        />
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
  );
};

export default Login;
