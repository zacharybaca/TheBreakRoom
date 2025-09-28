// import './login.css';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import ReusableStyledButton from '../ReusableStyledButton/ReusableStyledButton.jsx';

// const Login = () => {
//     const formik = useFormik({
//         initialValues: {
//             identifier: "",
//             password: "",
//         },
//         validationSchema: Yup.object({
//             identifier: Yup.string().required('Username or E-mail is required'),
//             password: Yup.string()
//                 .min(6, 'Password must be at least 6 characters')
//                 .required('Password is required'),
//         }),
//         onSubmit: async (values, { setSubmitting, resetForm }) => {
//             try {
//                 const formData = new FormData();

//                 // Append all fields manually
//                 formData.append('identifier', values.identifier);
//                 formData.append('password', values.password);

//                 const res = await fetch('http://localhost:9000/api/login', {
//                     method: 'POST',
//                     body: formData, // no headers! browser sets Content-Type automatically
//                 });

//                 if (!res.ok) {
//                     throw new Error('Failed to login');
//                 }

//                 const data = await res.json();
//                 console.log('✅ Logged-in successfully:', data);

//                 resetForm(); // clear form after successful submission
//             } catch (err) {
//                 console.error('❌ Error submitting form:', err);
//             } finally {
//                 setSubmitting(false);
//             }
//         },
//     });

//     return (
//         <div className="form-container">
//             <h1>Your Workday Stories Belong Here</h1>
//             <h2>Log In and Vent Your Frustrations Away</h2>
//             <form onSubmit={formik.handleSubmit}>

//                 <label htmlFor="identifier">Enter A Username or E-mail: </label>
//                 <input
//                     id="identifier"
//                     name="identifier"
//                     type="text"
//                     onChange={formik.handleChange}
//                     value={formik.values.identifier}
//                 />
//                 {formik.touched.username && formik.errors.username && (
//                     <p>{formik.errors.username}</p>
//                 )}

//                 <label htmlFor="password">Enter A Password: </label>
//                 <input
//                     id="password"
//                     name="password"
//                     type="password"
//                     onChange={formik.handleChange}
//                     value={formik.values.password}
//                 />
//                 {formik.touched.password && formik.errors.password && (
//                     <p>{formik.errors.password}</p>
//                 )}

//                 <br />
//                 <ReusableStyledButton title="Login" type="submit" />
//             </form>
//         </div>
//     );
// };

// export default Login;

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
      <h1>Your Workday Stories Belong Here</h1>
      <h2>Log In and Vent Your Frustrations Away</h2>
      <ReusableStyledButton type="button" title="Register" onClick={() => onOpen('register')} />
      <br />
      <form onSubmit={formik.handleSubmit} noValidate>
        {/* Identifier field */}
        <div className="form-group">
          <label htmlFor="identifier">Enter a Username or E-mail:</label>
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
            aria-describedby="identifier-error"
          />
          {formik.touched.identifier && formik.errors.identifier && (
            <p id="identifier-error" className="error-text">
              {formik.errors.identifier}
            </p>
          )}
        </div>

        {/* Password field */}
        <div className="form-group">
          <label htmlFor="password">Enter a Password:</label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            aria-invalid={formik.touched.password && !!formik.errors.password}
            aria-describedby="password-error"
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
        />
      </form>
    </div>
  );
};

export default Login;
