import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ModalContext } from './ModalContext.jsx';

export const ModalProvider = ({ children }) => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [isOpen, setIsOpen] = useState(false); // start closed
  const navigate = useNavigate();
  const location = useLocation();

  const previousLocation = location.state?.background?.pathname || "/";

  const onClose = () => {
    setIsOpen(false);
    setStep(1);
    setDirection(0);
    navigate(previousLocation);
  };

  const onOpen = (url) => {
    // Save the current page as "background"
    setIsOpen(true);
    navigate(`/${url}`, { state: { background: location } });
  };

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
