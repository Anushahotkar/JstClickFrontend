/* ProductDeleteForm.jsx */

import { FaTrash, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import { deleteProduct, deleteImagesFromCloudinary } from "../../api/productApi";

const ProductDeleteForm = ({ product, onCancel, onDeleted }) => {
  const handleDelete = async () => {
    try {
      // Delete product from backend
      await deleteProduct(product._id);

      // Delete images from Cloudinary if any
      // if (product.image?.length) {
      //   await deleteImagesFromCloudinary(product.image);
      // }

      toast.success("Product deleted successfully!");
      onDeleted(product._id);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to delete product");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl max-w-[95%] sm:max-w-md w-full p-5 sm:p-6 md:p-8 transition-transform duration-300 ease-out transform scale-95 hover:scale-100">
        
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <FaTimes className="text-xl sm:text-2xl" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4 sm:mb-5">
          <FaTrash className="text-red-600 text-2xl sm:text-3xl" />
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
            Delete Product
          </h2>
        </div>

        {/* Body */}
        <div className="text-gray-700 space-y-3 sm:space-y-4">
          <p className="text-sm sm:text-base">
            Are you sure you want to permanently delete{" "}
            <span className="font-semibold text-gray-900">“{product.name}”</span>?
          </p>

          <p className="text-xs sm:text-sm text-red-600 font-medium bg-red-50/80 p-2 sm:p-3 rounded-md border border-red-200">
            <strong>Warning:</strong> This action cannot be undone. All associated images and data will be lost.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-4 sm:px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="w-full sm:w-auto px-4 sm:px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <FaTrash /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDeleteForm;
