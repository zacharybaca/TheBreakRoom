import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModalContext } from './ModalContext.jsx';

export const ModalProvider = ({ children }) => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [isOpen, setIsOpen] = useState(false); // start closed
  const navigate = useNavigate();

  const onClose = () => {
    setIsOpen(false);
    setStep(1);
    setDirection(0);
    navigate('/');
  };

  const onOpen = () => setIsOpen(true);

  return (
    <ModalContext.Provider
      value={{
        step,
        setStep,
        direction,
        setDirection,
        isOpen,
        setIsOpen,
        onClose,
        onOpen,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
