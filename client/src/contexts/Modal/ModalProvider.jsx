import { useState } from 'react';
import { ModalContext } from './ModalContext.jsx';

export const ModalProvider = ({ children }) => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [isOpen, setIsOpen] = useState(false); // start closed

  const onClose = () => {
    setIsOpen(false);
    setStep(1);
    setDirection(0);
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
