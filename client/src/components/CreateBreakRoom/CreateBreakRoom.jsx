// components/Register.jsx
import './create-break-room.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useModal } from '../../hooks/useModal';
import Modal from '../Modal/Modal.jsx';
import ReusableStyledButton from '../ReusableStyledButton/ReusableStyledButton.jsx';
import { motion as Motion, AnimatePresence } from 'framer-motion';

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

    <label>Description:</label>
    <input
      name="description"
      onChange={formik.handleChange}
      value={formik.values.description}
    />
    {formik.errors.username && (
      <p className="form-error">{formik.errors.description}</p>
    )}

    <label>Vibe:</label>
    <input
      name="vibe"
      type="text"
      onChange={formik.handleChange}
      value={formik.values.vibe}
    />
    {formik.errors.vibe && <p className="form-error">{formik.errors.vibe}</p>}

    <div className="step-actions">
      <ReusableStyledButton title="Next" type="button" onClick={nextStep} className="reusable"/>
    </div>
  </div>
);

const Step2 = ({ formik, prevStep }) => (
  <div className="form-fields">
    <label>Accent:</label>
    <input
      name="accent"
      type="text"
      onChange={formik.handleChange}
      value={formik.values.accent}
    />
    {formik.errors.accent && (
      <p className="form-error">{formik.errors.accent}</p>
    )}

    <label>IconURL:</label>
    <input
        name="iconURL"
        type="text"
        onChange={formik.handleChange}
        value={formik.value.iconURL}
    />
    {formik.errors.iconURL && (
        <p className="form-error">{formik.errors.iconURL}</p>
    )}

    <div className="step-actions-submit">
        <ReusableStyledButton title="Back" type="button" onClick={prevStep} className="reusable" />
        <ReusableStyledButton title="Submit" type="submit" className="reusable" />
    </div>
  </div>
);

const CreateBreakRoom = () => {
  const { step, setStep, direction, setDirection, isOpen, onClose } =
    useModal();

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      vibe: '',
      accent: '',
      iconURL: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      description: Yup.string().required('Description is required'),
      vibe: Yup.string().required('Vibe is required'),
      accent: Yup.string().required('Accent is required'),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      Object.keys(values).forEach(
        (key) => values[key] && formData.append(key, values[key])
      );
      const res = await fetch('http://localhost:9000/api/breakrooms', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to create breakroom');
      console.log('✅ Breakroom created successfully');
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
      <Modal isOpen={isOpen} onClose={onClose}>
        <form onSubmit={formik.handleSubmit} className="form-container">
          <h1>Create Breakroom</h1>

          <AnimatePresence mode="wait" custom={direction}>
            <Motion.div
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
                  prevStep={prevStep}
                />
              )}
            </Motion.div>
          </AnimatePresence>
        </form>
      </Modal>
    </>
  );
};

export default CreateBreakRoom;
