import { useState, useEffect, useRef } from "react";
import { MdClose } from "react-icons/md";
import {
  FaRupeeSign,
  FaPen,
  FaFileImage,
  FaTag,
  FaSave,
  FaInfoCircle,
  FaCheckCircle,
} from "react-icons/fa";
import { useParams } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditServiceForm = ({ serviceData, onClose, onServiceUpdated }) => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: serviceData?.name || "",
    description: serviceData?.description || "",
    cost: serviceData?.cost || "",
    image: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileRef = useRef(null);

  // Fetch category info
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(`${API_BASE_URL}/admin/api/service-categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        const foundCategory = data.data.find((c) => c._id === categoryId);
        setCategory(foundCategory);
      } catch {
        setError("Could not load category");
      }
    };
    fetchCategory();
  }, [categoryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    fileRef.current = e.target.files[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!formData.name || !formData.cost || !category?._id) {
      setError("Name, category, and cost are required");
      setIsSubmitting(false);
      return;
    }

    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description || "");
    form.append("cost", parseFloat(formData.cost));
    form.append("category", category._id);
    if (fileRef.current) form.append("image", fileRef.current);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/admin/services/${serviceData._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update service");

      onServiceUpdated(data.data || data.service);

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50 p-3 sm:p-6">
      <div className="bg-white rounded-2xl w-full max-w-md sm:max-w-lg p-5 sm:p-8 shadow-2xl border border-gray-200 transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaPen className="text-indigo-600" />
            Edit Service
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <MdClose size={28} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category */}
          <div>
            <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-700">
              <FaInfoCircle className="text-indigo-500" />
              Service Category
            </label>
            <input
              type="text"
              value={category?.name || "Loading..."}
              readOnly
              className="mt-1 block w-full rounded-lg bg-gray-100 p-2 text-gray-700 text-sm sm:text-base"
            />
          </div>

          {/* Service Name */}
          <div>
            <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-700">
              <FaTag className="text-indigo-500" /> Service Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter service name"
              className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-sm sm:text-base focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-700">
              <FaPen className="text-indigo-500" /> Service Description
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
              className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-sm sm:text-base focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Cost */}
          <div>
            <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-700">
              <FaRupeeSign className="text-indigo-500" /> Cost
            </label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              placeholder="e.g., 250"
              className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-sm sm:text-base focus:ring-indigo-500 focus:border-indigo-500"
              min="0"
              step="0.01"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-700">
              <FaFileImage className="text-indigo-500" /> Service Image
            </label>
            <div className="mt-1 flex items-center gap-3 flex-wrap">
              <label className="cursor-pointer bg-indigo-50 text-indigo-600 rounded-md px-3 py-1.5 text-sm sm:text-base font-medium hover:bg-indigo-100 transition-colors">
                Upload
                <input
                  type="file"
                  name="image"
                  onChange={handleImageUpload}
                  className="sr-only"
                />
              </label>
              {formData.image && (
                <span className="text-xs sm:text-sm text-gray-500 truncate max-w-[150px]">
                  {formData.image.name}
                </span>
              )}
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm sm:text-base font-medium">{error}</div>
          )}

          {/* Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base font-medium rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center justify-center gap-2"
            >
              <FaSave /> {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-300 text-green-800 px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm sm:text-base opacity-90">
          <FaCheckCircle className="text-green-600" />
          Service updated successfully!
        </div>
      )}
    </div>
  );
};

export default EditServiceForm;
