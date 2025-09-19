import "./register.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useModal } from '../../hooks/useModal';
import Modal from "../Modal/Modal.jsx";
import ReusableStyledButton from "../ReusableStyledButton/ReusableStyledButton.jsx";
import { motion, AnimatePresence } from "framer-motion";

const stepVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

const Register = () => {
  const { direction, setDirection, step, setStep, isOpen, onClose } = useModal();

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
      avatar: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      username: Yup.string().required("Username is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
          if (values[key] !== null) formData.append(key, values[key]);
        });

        const res = await fetch("http://localhost:9000/api/register", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Failed to register");

        const data = await res.json();
        console.log("✅ Registered successfully:", data);
        resetForm();
        onClose();
      } catch (err) {
        console.error("❌ Error submitting form:", err);
      } finally {
        setSubmitting(false);
      }
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={formik.handleSubmit} className="form-container">
        <h1>Sign Up</h1>

        <AnimatePresence mode="wait" custom={direction}>
          {step === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <label htmlFor="name">Name:</label>
              <input
                id="name"
                name="name"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
              {formik.errors.name && (
                <p className="form-error">{formik.errors.name}</p>
              )}

              <label htmlFor="username">Username:</label>
              <input
                id="username"
                name="username"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.username}
              />
              {formik.errors.username && (
                <p className="form-error">{formik.errors.username}</p>
              )}

              <label htmlFor="email">Email:</label>
              <input
                id="email"
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
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <label htmlFor="password">Password:</label>
              <input
                id="password"
                name="password"
                type="password"
                onChange={formik.handleChange}
                value={formik.values.password}
              />
              {formik.errors.password && (
                <p className="form-error">{formik.errors.password}</p>
              )}

              <label htmlFor="role">Role:</label>
              <select
                id="role"
                name="role"
                onChange={formik.handleChange}
                value={formik.values.role}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              <div className="step-actions">
                <ReusableStyledButton
                  title="Back"
                  type="button"
                  onClick={prevStep}
                />
                <ReusableStyledButton
                  title="Next"
                  type="button"
                  onClick={nextStep}
                />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <label htmlFor="job">Job Title:</label>
              <input
                id="job"
                name="job"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.job}
              />

              <label htmlFor="bio">Bio:</label>
              <textarea
                id="bio"
                name="bio"
                rows="4"
                onChange={formik.handleChange}
                value={formik.values.bio}
              />

              <label htmlFor="gender">Gender:</label>
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

              <label htmlFor="avatar">Avatar:</label>
              <input
                id="avatar"
                name="avatar"
                type="file"
                onChange={(e) =>
                  formik.setFieldValue("avatar", e.currentTarget.files[0])
                }
              />

              <div className="step-actions">
                <ReusableStyledButton
                  title="Back"
                  type="button"
                  onClick={prevStep}
                />
                <ReusableStyledButton title="Submit" type="submit" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </Modal>
  );
};

export default Register;
