import './register.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Register = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      role: "user",
      job: "",
      isAdmin: false,
      bio: "",
      gender: "",
      avatar: null
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      username: Yup.string().required("Username is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required")
    }),
    onSubmit: (values) => {
      console.log("Form Data:", values);
    }
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
        {formik.touched.name && formik.errors.name && <p>{formik.errors.name}</p>}

        <label htmlFor="username">Enter A Username: </label>
        <input
          id="username"
          name="username"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.username}
        />
        {formik.touched.username && formik.errors.username && <p>{formik.errors.username}</p>}

        <label htmlFor="email">Enter Your E-mail: </label>
        <input
          id="email"
          name="email"
          type="email"
          onChange={formik.handleChange}
          value={formik.values.email}
        />
        {formik.touched.email && formik.errors.email && <p>{formik.errors.email}</p>}

        <label htmlFor="password">Enter A Password: </label>
        <input
          id="password"
          name="password"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.password}
        />
        {formik.touched.password && formik.errors.password && <p>{formik.errors.password}</p>}

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

        <label htmlFor="job">Job Title: </label>
        <input
          id="job"
          name="job"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.job}
        />

        <label htmlFor="bio">Enter A Bio: </label>
        <textarea
          id="bio"
          name="bio"
          rows="4"
          cols="50"
          onChange={formik.handleChange}
          value={formik.values.bio}
        />

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
        <input
          id="avatar"
          name="avatar"
          type="file"
          onChange={(event) => {
            formik.setFieldValue("avatar", event.currentTarget.files[0]);
          }}
        />
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Register;
