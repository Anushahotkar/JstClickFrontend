/* AddProductForm.jsx */

import { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { FaRupeeSign, FaBox, FaFileImage, FaTag, FaSave, FaInfoCircle, FaPen, FaCloudUploadAlt } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { fetchProductCategories, addProduct, uploadImageToCloudinary } from "../../api/productApi";

const AddProductForm = ({ onClose, onProductAdded }) => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "", cost: "", images: [] });
  const [preview, setPreview] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch category info
  useEffect(() => {
    const loadCategory = async () => {
      try {
        const categories = await fetchProductCategories();
        const found = categories.find((c) => c._id === categoryId);
        setCategory(found);
      } catch (err) {
        console.error(err);
      }
    };
    loadCategory();
  }, [categoryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle single/multiple image uploads
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setIsUploading(true);
    setError(null);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const uploaded = await uploadImageToCloudinary(file);
        uploadedUrls.push(uploaded.url);
      }
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
      setPreview((prev) => [...prev, ...uploadedUrls]);
    } catch (err) {
      console.error(err);
      setError("Failed to upload image(s)");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!formData.name || !formData.cost || !categoryId || formData.images.length === 0) {
      setError("Name, cost, category, and at least one image are required.");
      setIsSubmitting(false);
      return;
    }

    const body = {
      ...formData,
      cost: parseFloat(formData.cost),
      category: categoryId,
    };

    try {
      const newProduct = await addProduct(body);
      onProductAdded(newProduct);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 p-4 sm:p-6">
      <div className="bg-white rounded-2xl w-full max-w-md sm:max-w-lg p-6 sm:p-8 shadow-lg overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaBox className="text-purple-600" /> Add Product
          </h2>
          <button onClick={onClose} aria-label="Close form" className="text-gray-400 hover:text-gray-600">
            <MdClose size={28} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FaInfoCircle className="text-purple-500" /> Product Category
            </label>
            <input
              type="text"
              value={category?.name || "Loading..."}
              readOnly
              className="mt-1 block w-full rounded-lg bg-gray-100 p-2.5 text-gray-700 text-sm sm:text-base"
            />
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FaTag className="text-purple-500" /> Product Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm sm:text-base focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FaPen className="text-purple-500" /> Description
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm sm:text-base focus:ring-purple-500 focus:border-purple-500 resize-none"
            />
          </div>

          {/* Cost */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FaRupeeSign className="text-purple-500" /> Cost
            </label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              placeholder="e.g., 250"
              className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm sm:text-base focus:ring-purple-500 focus:border-purple-500"
              min="0"
              step="0.01"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FaFileImage className="text-purple-500" /> Product Images
            </label>
            <div className="mt-1 flex items-center gap-3 flex-wrap">
              <label className="cursor-pointer bg-purple-50 text-purple-600 rounded-md px-4 py-2 text-sm font-medium hover:bg-purple-100 transition-colors flex items-center gap-2">
                <FaCloudUploadAlt /> {isUploading ? "Uploading..." : "Upload"}
                <input
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/*"
                  multiple
                  className="sr-only"
                />
              </label>
              {preview.map((url, idx) => (
                <img key={idx} src={url} alt={`Preview ${idx}`} className="w-16 h-16 object-cover rounded-md border" />
              ))}
            </div>
          </div>

          {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

          {/* Buttons */}
          <div className="pt-3 flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="px-5 py-2 text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <FaSave /> {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;
