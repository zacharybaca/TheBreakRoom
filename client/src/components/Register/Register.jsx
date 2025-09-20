// components/Register.jsx
import './register.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useModal } from '../../hooks/useModal';
import Modal from '../Modal/Modal.jsx';
import ReusableStyledButton from '../ReusableStyledButton/ReusableStyledButton.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const stepVariants = {
  enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction < 0 ? 300 : -300, opacity: 0 }),
};

// Step components for clarity
const Step1 = ({ formik, nextStep }) => (
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
    {formik.errors.email && <p className="form-error">{formik.errors.email}</p>}

    <div className="step-actions">
      <ReusableStyledButton title="Next" type="button" onClick={nextStep} />
    </div>
  </div>
);

const Step2 = ({ formik, nextStep, prevStep }) => (
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
      <option value="admin">Admin</option>
    </select>

    <div className="step-actions">
      <ReusableStyledButton title="Back" type="button" onClick={prevStep} />
      <ReusableStyledButton title="Next" type="button" onClick={nextStep} />
    </div>
  </div>
);

const Step3 = ({ formik, prevStep }) => (
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
      onChange={(e) => formik.setFieldValue('avatar', e.currentTarget.files[0])}
    />

    <div className="step-actions">
      <ReusableStyledButton title="Back" type="button" onClick={prevStep} />
      <ReusableStyledButton title="Submit" type="submit" />
    </div>
  </div>
);

const Register = () => {
  const { step, setStep, direction, setDirection, isOpen, onClose, onOpen } =
    useModal();

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
      console.log('✅ Registered successfully');
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

  return (
    <>
      <button onClick={onOpen}>Register</button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <form onSubmit={formik.handleSubmit} className="form-container">
          <h1>Sign Up</h1>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step} // Important: key = step
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {step === 1 && <Step1 formik={formik} nextStep={nextStep} />}
              {step === 2 && (
                <Step2
                  formik={formik}
                  nextStep={nextStep}
                  prevStep={prevStep}
                />
              )}
              {step === 3 && <Step3 formik={formik} prevStep={prevStep} />}
            </motion.div>
          </AnimatePresence>
        </form>
      </Modal>
    </>
  );
};

export default Register;
