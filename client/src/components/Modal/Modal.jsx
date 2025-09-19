// components/Modal.jsx
import "./modal.css";
import { useModal } from '../../hooks/useModal';

const Modal = () => {
    const { isOpen, onClose } = useModal();

    if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // prevent closing on inner click
      >
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
