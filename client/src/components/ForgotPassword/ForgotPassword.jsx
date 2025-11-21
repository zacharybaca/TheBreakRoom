import './forgot-password.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const ForgotPassword = () => {
  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmNewPassword: '',
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('New password is required'),
      confirmNewPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords must match')
        .required('Please confirm your new password'),
    }),
    onSubmit: async (values) => {
      const res = await fetch('http://localhost:9000/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error('Failed to reset password');
    },
  });

  return (
    <>
      <hr />
      <form onSubmit={formik.handleSubmit} className="forgot-password-form">
        <h2>Reset Your Password</h2>
        <input
          type="password"
          name="newPassword"
          onChange={formik.handleChange}
          value={formik.values.newPassword}
          onBlur={formik.handleBlur}
          placeholder="New Password"
        />
        {formik.touched.newPassword && formik.errors.newPassword && (
          <div className="error">{formik.errors.newPassword}</div>
        )}

        <input
          type="password"
          name="confirmNewPassword"
          onChange={formik.handleChange}
          value={formik.values.confirmNewPassword}
          onBlur={formik.handleBlur}
          placeholder="Confirm New Password"
        />
        {formik.touched.confirmNewPassword &&
          formik.errors.confirmNewPassword && (
            <div className="error">{formik.errors.confirmNewPassword}</div>
          )}

        <button type="submit">Reset Password</button>
      </form>
      <hr />
    </>
  );
};

export default ForgotPassword;
