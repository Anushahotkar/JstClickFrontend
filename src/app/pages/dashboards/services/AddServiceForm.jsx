/*AddServiceForm.jsx*/

/* AddServiceForm.jsx */

import { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import {
  FaRupeeSign,
  FaPen,
  FaFileImage,
  FaTag,
  FaSave,
  FaInfoCircle,
  FaCheckCircle,
  FaCloudUploadAlt,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import { fetchCategories, createService } from "../../api/servicesApi";
import { serviceSchema } from "../../validation/serviceValidation";
import { getCurrentUser } from "../../api/authApi";

const AddServiceForm = ({ onClose, onServiceAdded }) => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "", cost: "", image: null });
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Load logged-in user
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await getCurrentUser();
        if (res.success && res.data) setCurrentUser(res.data);
        else showToast("Failed to fetch user", "error");
      } catch {
        showToast("You are not authenticated", "error");
      }
    };
    loadUser();
  }, []);

  // Fetch category
  useEffect(() => {
    const loadCategory = async () => {
      try {
        const res = await fetchCategories();
        const found = res.data.find((c) => c._id === categoryId);
        setCategory(found);
      } catch {
        setErrors((prev) => ({ ...prev, category: "Failed to load category" }));
      }
    };
    loadCategory();
  }, [categoryId]);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  useEffect(() => {
    return () => preview && URL.revokeObjectURL(preview);
  }, [preview]);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return toast.error("User not authenticated");

    // Validation
    const { error } = serviceSchema.validate(
      {
        name: formData.name,
        description: formData.description,
        cost: Number(formData.cost),
        category: categoryId,
      },
      { abortEarly: false }
    );

    if (error) {
      error.details.forEach((d) => toast.error(d.message));
      return;
    }

    setIsSubmitting(true);
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("description", formData.description || "");
      form.append("cost", Number(formData.cost));
      form.append("category", categoryId);
      if (formData.image) form.append("image", formData.image);

      const res = await createService(form);
      onServiceAdded(res.data || res.service);

      toast.success("Service added successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to add service");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 p-3 sm:p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FaPen className="text-indigo-600" /> Add Service
          </h2>
          <button onClick={onClose} aria-label="Close form" className="text-gray-400 hover:text-gray-600">
            <MdClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* User Loading */}
          {!currentUser && <p className="text-yellow-600 text-sm mb-2">Loading user info...</p>}

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FaInfoCircle className="text-indigo-500" /> Service Category
            </label>
            <input
              type="text"
              value={category?.name || "Loading..."}
              readOnly
              className="mt-1 block w-full rounded-lg bg-gray-100 p-2 text-gray-700 text-sm"
            />
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FaTag className="text-indigo-500" /> Service Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter service name"
              className="mt-1 block w-full rounded-lg border p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FaPen className="text-indigo-500" /> Description
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
              className="mt-1 block w-full rounded-lg border p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Cost */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FaRupeeSign className="text-indigo-500" /> Cost
            </label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              placeholder="e.g., 250"
              className="mt-1 block w-full rounded-lg border p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.cost && <p className="text-red-500 text-xs mt-1">{errors.cost}</p>}
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FaFileImage className="text-indigo-500" /> Service Image
            </label>
            <div className="mt-2 flex items-center gap-3">
              <label className="cursor-pointer bg-indigo-50 text-indigo-600 rounded-md px-4 py-2 text-sm font-medium hover:bg-indigo-100 transition-colors flex items-center gap-2">
                <FaCloudUploadAlt /> Upload
                <input type="file" accept="image/*" onChange={handleFileUpload} className="sr-only" />
              </label>
              {preview && (
                <div className="relative w-12 h-12">
                  <img src={preview} alt="preview" className="w-full h-full object-cover rounded-md border" />
                </div>
              )}
            </div>
            {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
          </div>

          {/* Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-sm rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !currentUser || !category}
              className="px-4 py-2 text-sm rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <FaSave /> {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
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

export default AddServiceForm;
