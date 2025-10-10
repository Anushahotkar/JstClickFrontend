import { MdClose } from "react-icons/md";

const AssignVendorsModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm transition-opacity duration-300 ease-in-out p-4"
      onClick={onClose} // Close when clicking outside
    >
      <div
        className="relative w-full max-w-md sm:max-w-3xl md:max-w-4xl lg:max-w-5xl bg-white rounded-2xl shadow-2xl flex flex-col p-4 sm:p-6 lg:p-8 
                   max-h-[90vh] sm:h-auto overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200 z-10"
          aria-label="Close modal"
        >
          <MdClose size={28} />
        </button>

        {/* Modal Content */}
        <div
          className="flex-1 overflow-y-auto"
          style={{
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE 10+
          }}
        >
          <style>{`
            /* Hide scrollbar for Webkit browsers (Chrome, Safari, Edge) */
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AssignVendorsModal;
