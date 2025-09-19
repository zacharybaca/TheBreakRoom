import { useContext } from 'react';
import { ModalContext } from '../contexts/Modal/ModalContext';

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
}
