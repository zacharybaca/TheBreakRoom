import './register.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useModal } from '../../hooks/useModal';
import { useAuth } from '../../hooks/useAuth';
import Modal from '../Modal/Modal.jsx';
import ReusableStyledButton from '../ReusableStyledButton/ReusableStyledButton.jsx';
import AttachmentPicker from '../AttachmentPicker/AttachmentPicker.jsx';
import { motion as Motion, AnimatePresence } from 'framer-motion';

const stepVariants = {
  enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction < 0 ? 300 : -300, opacity: 0 }),
};

const Register = () => {
  const { step, setStep, direction, setDirection, isOpen, onClose } =
    useModal();
  const { user, isAuthenticated } = useAuth();

  const formik = useFormik({
    initialValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      role: 'user',
      job: '',
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
    onSubmit: async (values) => {
      const formData = new FormData();
      Object.keys(values).forEach(
        (key) => values[key] && formData.append(key, values[key])
      );
      const res = await fetch('http://localhost:9000/api/register', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to register');
      onClose();
    },
  });

  const nextStep = () => {
    setDirection(1);
    setStep((s) => s + 1);
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const Step1 = () => (
    <div className="form-fields">
      <label>Name:</label>
      <input
        name="name"
        onChange={formik.handleChange}
        value={formik.values.name}
      />
      {formik.errors.name && <p className="form-error">{formik.errors.name}</p>}

      <label>Username:</label>
      <input
        name="username"
        onChange={formik.handleChange}
        value={formik.values.username}
      />
      {formik.errors.username && (
        <p className="form-error">{formik.errors.username}</p>
      )}

      <label>Email:</label>
      <input
        name="email"
        type="email"
        onChange={formik.handleChange}
        value={formik.values.email}
      />
      {formik.errors.email && (
        <p className="form-error">{formik.errors.email}</p>
      )}

      <div className="step-actions">
        <ReusableStyledButton
          title="Next"
          type="button"
          onClick={nextStep}
          className="reusable"
        />
      </div>
    </div>
  );

  const Step2 = () => (
    <div className="form-fields">
      <label>Password:</label>
      <input
        name="password"
        type="password"
        onChange={formik.handleChange}
        value={formik.values.password}
      />
      {formik.errors.password && (
        <p className="form-error">{formik.errors.password}</p>
      )}

      <label>Role:</label>
      <select
        name="role"
        onChange={formik.handleChange}
        value={formik.values.role}
      >
        <option value="user">User</option>
        {user && user.isAdmin && isAuthenticated && (
          <option value="admin">Admin</option>
        )}
      </select>

      <div className="step-actions">
        <ReusableStyledButton
          title="Back"
          type="button"
          onClick={prevStep}
          className="reusable"
        />
        <ReusableStyledButton
          title="Next"
          type="button"
          onClick={nextStep}
          className="reusable"
        />
      </div>
    </div>
  );

  const Step3 = () => (
    <div className="form-fields">
      <label>Job Title:</label>
      <input
        name="job"
        onChange={formik.handleChange}
        value={formik.values.job}
      />

      <label>Bio:</label>
      <textarea
        name="bio"
        rows="4"
        onChange={formik.handleChange}
        value={formik.values.bio}
      />

      <label>Gender:</label>
      <select
        name="gender"
        onChange={formik.handleChange}
        value={formik.values.gender}
      >
        <option value="">Select...</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>

      <label>Avatar:</label>
      <input
        name="avatar"
        type="file"
        onChange={(e) =>
          formik.setFieldValue('avatar', e.currentTarget.files[0])
        }
      />

      <AttachmentPicker
        value={formik.values.attachment}
        onChange={formik.handleChange}
      />

      {formik.errors.attachment && (
        <p className="form-error">{formik.errors.attachment}</p>
      )}

      <div className="step-actions-submit">
        <ReusableStyledButton
          title="Back"
          type="button"
          onClick={prevStep}
          className="reusable"
        />
        <ReusableStyledButton
          title="Submit"
          type="submit"
          className="reusable"
        />
      </div>
    </div>
  );

  const progressValue = (step / 3) * 100;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={formik.handleSubmit} className="form-container">
        <h1>Sign Up</h1>

        <progress
          max="100"
          value={progressValue}
          className="register-progress"
        />

        <AnimatePresence mode="wait" custom={direction}>
          <Motion.div
            key={step}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            {step === 1 && <Step1 />}
            {step === 2 && <Step2 />}
            {step === 3 && <Step3 />}
          </Motion.div>
        </AnimatePresence>
      </form>
    </Modal>
  );
};

export default Register;
