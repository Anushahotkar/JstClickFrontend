
import { FaTimes } from "react-icons/fa";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      {/* Modal container */}
      <div className="relative bg-white rounded-3xl max-w-lg w-full mx-4 p-6 md:p-8 shadow-lg overflow-y-auto max-h-[90vh]">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition text-xl"
          aria-label="Close"
        >
          <FaTimes />
        </button>

        {/* Content */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
