import { useState, useEffect, useRef } from "react";
import { MdClose } from "react-icons/md";
import { FaRupeeSign, FaPen, FaFileImage, FaTag, FaSave, FaInfoCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchProductCategories, editProduct, uploadImageToCloudinary } from "../../api/productApi";
import { editProductSchema } from "../../validation/productValidation";

const EditProductForm = ({ productData, onClose, onProductUpdated }) => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: productData?.name || "",
    description: productData?.description || "",
    cost: productData?.cost || "",
    image: null,
    preview: productData?.image || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await fetchProductCategories();
        const cat = data.find((c) => c._id === categoryId);
        setCategory(cat || null);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, [categoryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    fileRef.current = file;
    try {
      const { url } = await uploadImageToCloudinary(file);
      setFormData((prev) => ({ ...prev, image: file, preview: url }));
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Image upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const getPreviewUrl = (preview) => (preview?.startsWith("http") ? preview : API_BASE_URL + preview);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate using URL instead of File
    const { error } = editProductSchema.validate({
      ...formData,
      category: category?._id,
      image: formData.preview, // ✅ fix for ValidationError
    },
  { abortEarly: false, stripUnknown: true } // 👈 strips "preview"
  );

    if (error) {
      console.log(error);
      toast.error(error.details[0].message);
      setIsSubmitting(false);
      return;
    }

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("description", formData.description || "");
      form.append("cost", parseFloat(formData.cost));
      form.append("category", category._id);
      if (fileRef.current) form.append("image", fileRef.current);

      const updated = await editProduct(productData._id, form);
      onProductUpdated(updated);

      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl w-full max-w-[95%] sm:max-w-md md:max-w-lg p-3 sm:p-4 shadow-lg border border-gray-200 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaPen className="text-purple-600" /> Edit Product
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <MdClose size={26} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {/* Category */}
          <div>
            <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-700">
              <FaInfoCircle className="text-purple-500" /> Product Category
            </label>
            <input
              type="text"
              value={category?.name || "Loading..."}
              readOnly
              className="mt-1 block w-full rounded-lg bg-gray-100 p-2 text-gray-700 text-sm sm:text-base"
            />
          </div>

          {/* Name */}
          <div>
            <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-700">
              <FaTag className="text-purple-500" /> Product Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-sm sm:text-base focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-700">
              <FaPen className="text-purple-500" /> Description
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
              className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-sm sm:text-base focus:ring-purple-500 focus:border-purple-500 resize-none"
            />
          </div>

          {/* Cost */}
          <div>
            <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-700">
              <FaRupeeSign className="text-purple-500" /> Cost
            </label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              placeholder="e.g., 250"
              className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-sm sm:text-base focus:ring-purple-500 focus:border-purple-500"
              min="0"
              step="0.01"
              required
            />
          </div>

          {/* Image */}
          <div>
            <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-700">
              <FaFileImage className="text-purple-500" /> Product Image
            </label>
            <div className="mt-1 flex items-center gap-2 sm:gap-3 flex-wrap">
              <label className="cursor-pointer bg-purple-50 text-purple-600 rounded-md px-2 sm:px-3 py-1 sm:py-1.5 text-sm sm:text-base font-medium hover:bg-purple-100 transition-colors flex items-center gap-2">
                Upload
                <input type="file" onChange={handleImageUpload} className="sr-only" accept="image/*" />
              </label>
              {formData.preview && (
                <img
                  src={getPreviewUrl(formData.preview)}
                  alt="product preview"
                  className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 object-cover rounded-md border border-gray-300"
                />
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 flex items-center justify-center gap-2"
            >
              <FaSave /> {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductForm;
