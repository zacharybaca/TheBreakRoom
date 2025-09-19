import './register.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ReusableStyledButton from '../ReusableStyledButton/ReusableStyledButton.jsx';

const Register = () => {
  const formik = useFormik({
    initialValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      role: 'user',
      job: '',
      isAdmin: false,
      bio: '',
      gender: '',
      avatar: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      username: Yup.string().required('Username is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const formData = new FormData();

        // Append all fields manually
        formData.append('name', values.name);
        formData.append('username', values.username);
        formData.append('email', values.email);
        formData.append('password', values.password);
        formData.append('role', values.role);
        formData.append('job', values.job);
        formData.append('bio', values.bio);
        formData.append('gender', values.gender);
        formData.append('isAdmin', values.isAdmin); // booleans get converted to "true"/"false"

        if (values.avatar) {
          formData.append('avatar', values.avatar); // attach file
        }

        const res = await fetch('http://localhost:9000/api/register', {
          method: 'POST',
          body: formData, // no headers! browser sets Content-Type automatically
        });

        if (!res.ok) {
          throw new Error('Failed to register');
        }

        const data = await res.json();
        console.log('✅ Registered successfully:', data);

        resetForm(); // clear form after successful submission
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
      <h2>Sign Up. Speak Up. Be Heard.</h2>
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="name">Enter Your Name: </label>
        <input
          id="name"
          name="name"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.name}
        />
        {formik.touched.name && formik.errors.name && (
          <p className="form-error">{formik.errors.name}</p>
        )}

        <label htmlFor="username">Enter A Username: </label>
        <input
          id="username"
          name="username"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.username}
        />
        {formik.touched.username && formik.errors.username && (
          <p className="form-error">{formik.errors.username}</p>
        )}

        <label htmlFor="email">Enter Your E-mail: </label>
        <input
          id="email"
          name="email"
          type="email"
          onChange={formik.handleChange}
          value={formik.values.email}
        />
        {formik.touched.email && formik.errors.email && (
          <p className="form-error">{formik.errors.email}</p>
        )}

        <label htmlFor="password">Enter A Password: </label>
        <input
          id="password"
          name="password"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.password}
        />
        {formik.touched.password && formik.errors.password && (
          <p className="form-error">{formik.errors.password}</p>
        )}

        <label htmlFor="role">Select A Role: </label>
        <select
          id="role"
          name="role"
          onChange={formik.handleChange}
          value={formik.values.role}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        {formik.touched.role && formik.errors.role && (
          <p className="form-error">{formik.errors.role}</p>
        )}

        <label htmlFor="job">Job Title: </label>
        <input
          id="job"
          name="job"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.job}
        />
        {formik.touched.job && formik.errors.job && (
          <p className="form-error">{formik.errors.job}</p>
        )}

        <label htmlFor="bio">Enter A Bio: </label>
        <textarea
          id="bio"
          name="bio"
          rows="4"
          cols="40"
          onChange={formik.handleChange}
          value={formik.values.bio}
        />
        {formik.touched.bio && formik.errors.bio && (
          <p className="form-error">{formik.errors.bio}</p>
        )}

        <label htmlFor="gender">Gender: </label>
        <select
          id="gender"
          name="gender"
          onChange={formik.handleChange}
          value={formik.values.gender}
        >
          <option value="">Select...</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {formik.touched.gender && formik.errors.gender && (
          <p className="form-error">{formik.errors.gender}</p>
        )}

        <label>
          <input
            type="checkbox"
            name="isAdmin"
            onChange={formik.handleChange}
            checked={formik.values.isAdmin}
          />
          Admin Access
        </label>

        <label htmlFor="avatar">Avatar: </label>
        <div className="file-input-container">
          <input
            id="avatar"
            name="avatar"
            type="file"
            onChange={(event) => {
              formik.setFieldValue('avatar', event.currentTarget.files[0]);
            }}
          />
        </div>
        {formik.touched.avatar && formik.errors.avatar && (
          <p className="form-error">{formik.errors.avatar}</p>
        )}

        <br />
        <ReusableStyledButton title="Submit" type="submit" />
      </form>
    </div>
  );
};

export default Register;
