// components/CreateBreakRoom/CreateBreakRoom.jsx
import './create-break-room.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useModal } from '../../hooks/useModal';
import { useFetcher } from '../../hooks/useFetcher'; // ✅ from FetcherProvider
import Modal from '../Modal/Modal.jsx';
import ReusableStyledButton from '../ReusableStyledButton/ReusableStyledButton.jsx';
import AccentPicker from '../AccentPicker/AccentPicker.jsx';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const stepVariants = {
  enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction < 0 ? 300 : -300, opacity: 0 }),
};

// ✅ Step 1 — Name / Description / Vibe
const Step1 = ({ formik, nextStep }) => (
  <div className="form-fields">
    <label htmlFor="name">Name:</label>
    <input
      id="name"
      name="name"
      onChange={formik.handleChange}
      value={formik.values.name}
    />
    {formik.errors.name && <p className="form-error">{formik.errors.name}</p>}

    <label htmlFor="description">Description:</label>
    <input
      id="description"
      name="description"
      onChange={formik.handleChange}
      value={formik.values.description}
    />
    {formik.errors.description && (
      <p className="form-error">{formik.errors.description}</p>
    )}

    <label htmlFor="vibe">Vibe:</label>
    <input
      id="vibe"
      name="vibe"
      type="text"
      onChange={formik.handleChange}
      value={formik.values.vibe}
    />
    {formik.errors.vibe && <p className="form-error">{formik.errors.vibe}</p>}

    <div className="step-actions">
      <ReusableStyledButton
        title="Next"
        type="button"
        onClick={nextStep}
        className="reusable"
        disabled={
          !formik.values.name ||
          !formik.values.description ||
          !formik.values.vibe ||
          Object.keys(formik.errors).length > 0
        }
      />
    </div>
  </div>
);

// ✅ Step 2 — Accent + IconURL
const Step2 = ({ formik, prevStep, isSubmitting }) => (
  <div className="form-fields">
    <label>Accent:</label>
    <AccentPicker
      value={formik.values.accent}
      onChange={(value) => formik.setFieldValue('accent', value)}
    />
    {formik.errors.accent && (
      <p className="form-error">{formik.errors.accent}</p>
    )}

    <label htmlFor="iconURL">Icon URL:</label>
    <input
      id="iconURL"
      name="iconURL"
      type="text"
      onChange={formik.handleChange}
      value={formik.values.iconURL}
    />
    {formik.errors.iconURL && (
      <p className="form-error">{formik.errors.iconURL}</p>
    )}

    <div className="step-actions-submit">
      <ReusableStyledButton
        title="Back"
        type="button"
        onClick={prevStep}
        className="reusable"
      />
      <ReusableStyledButton
        title={isSubmitting ? 'Submitting...' : 'Submit'}
        type="submit"
        className="reusable"
        disabled={isSubmitting}
      />
    </div>
  </div>
);

const CreateBreakRoom = () => {
  const { step, setStep, direction, setDirection, isOpen, onClose } =
    useModal();
  const { fetcher } = useFetcher();
  const [statusMsg, setStatusMsg] = useState(null);

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
      iconURL: Yup.string().url('Must be a valid URL').nullable(),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setStatusMsg(null);
      try {
        const formData = new FormData();
        Object.entries(values).forEach(([key, val]) => {
          if (val) formData.append(key, val);
        });

        const response = await fetcher('/api/breakrooms', {
          method: 'POST',
          body: formData,
        });

        if (!response.success) {
          throw new Error(response.error || 'Failed to create breakroom');
        }

        setStatusMsg('✅ Breakroom created successfully!');
        resetForm();
        setTimeout(() => {
          setStatusMsg(null);
          onClose();
        }, 1500);
      } catch (err) {
        setStatusMsg(`❌ ${err.message}`);
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
    setStep((s) => Math.max(1, s - 1));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={formik.handleSubmit} className="form-container">
        <h1>Create Breakroom</h1>
        <p className="step-progress">Step {step} of 2</p>

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
            {step === 1 && <Step1 formik={formik} nextStep={nextStep} />}
            {step === 2 && (
              <Step2
                formik={formik}
                prevStep={prevStep}
                isSubmitting={formik.isSubmitting}
              />
            )}
          </Motion.div>
        </AnimatePresence>

        {statusMsg && (
          <p
            className={`status-message ${
              statusMsg.startsWith('✅') ? 'success' : 'error'
            }`}
          >
            {statusMsg}
          </p>
        )}
      </form>
    </Modal>
  );
};

export default CreateBreakRoom;
