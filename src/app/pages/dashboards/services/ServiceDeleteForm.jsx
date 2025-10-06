/* ServiceDeleteForm.jsx */

import { useState } from "react";
import { FaTrash, FaTimes, FaCheckCircle } from "react-icons/fa";

const ServiceDeleteForm = ({ service, onCancel, onDelete }) => {
  const [toast, setToast] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(); // ✅ parent handles actual delete
      showToast("Service deleted successfully!", "success");
      onCancel(); // close modal after delete
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to delete service", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 p-4">
      {/* Modal */}
      <div className="relative bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-lg border border-gray-200 transition-transform duration-300 ease-out transform scale-95 hover:scale-100">
        
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <FaTimes className="text-xl" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <FaTrash className="text-red-600 text-3xl" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Delete Service
          </h2>
        </div>

        {/* Body */}
        <div className="text-gray-700 space-y-3">
          <p className="text-sm sm:text-base">
            Are you sure you want to permanently delete{" "}
            <span className="font-semibold text-gray-900">
              “{service.name}”
            </span>
            ?
          </p>
          <p className="text-xs sm:text-sm text-red-600 font-medium bg-red-50 p-3 rounded-md border border-red-200">
            <strong>Warning:</strong> This action cannot be undone. All associated data will be lost.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full sm:w-auto px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <FaTrash />
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 px-4 py-3 rounded shadow flex items-center gap-2 text-white transition-opacity ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          <FaCheckCircle />
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default ServiceDeleteForm;
