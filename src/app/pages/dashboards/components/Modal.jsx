import { MdClose } from 'react-icons/md';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    // Backdrop + modal container (lighter white transparent blur)
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/20 backdrop-blur-md transition-opacity duration-300 ease-in-out"
      onClick={onClose} // Close when clicking outside
    >
      {/* Modal content */}
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white p-4 sm:p-6 shadow-2xl transform scale-100 opacity-100 transition-transform transition-opacity duration-300 ease-out"
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-400 hover:text-gray-700 transition-colors duration-200"
          aria-label="Close modal"
        >
          <MdClose size={28} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
