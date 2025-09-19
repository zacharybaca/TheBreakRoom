import { useState } from 'react';
import { ModalContext } from './ModalContext.jsx';

export const ModalProvider = ({ children }) => {
    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState(0); // 1 = next, -1 = back
    const [isOpen, setIsOpen] = useState(false);

    return (
        <ModalContext.Provider value={{
            step,
            setStep,
            direction,
            setDirection,
            isOpen,
            setIsOpen
        }}>
            {children}
        </ModalContext.Provider>
    )
}
