// src/pages/AddServiceForm.jsx
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
  FaLink,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import { fetchCategories, createService } from "../api/servicesApi";
import { serviceSchema } from "../validation/serviceValidation";

const AddServiceForm = ({ onClose, onServiceAdded }) => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    cost: "",
    images: [], // now supports multiple images
  });
  const [newImageUrl, setNewImageUrl] = useState(""); // for http/cloudinary
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // ✅ fetch category
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchCategories();
        const found = res.data.find((c) => c._id === categoryId);
        setCategory(found);
      } catch {
        setErrors((prev) => ({ ...prev, category: "Failed to load category" }));
      }
    };
    load();
  }, [categoryId]);

  // ✅ handle text input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ handle file upload (multiple)
  const handleFileUpload = (e) => {
  const files = Array.from(e.target.files);
  setFormData((prev) => ({
    ...prev,
    images: [...prev.images, ...files.filter(f => !prev.images.some(i => i instanceof File && i.name === f.name))],
  }));
};


  // ✅ handle http/cloudinary url
  const handleAddUrl = () => {
    if (newImageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()],
      }));
      setNewImageUrl("");
    }
  };

  // ✅ remove image
  const handleRemoveImage = (idx) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  // ✅ submit handler with Joi validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // validate with Joi
    const { error } = serviceSchema.validate(formData, { abortEarly: false });
    if (error) {
      const fieldErrors = {};
      error.details.forEach((d) => {
        fieldErrors[d.path[0]] = d.message;
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }
    setErrors({});

    try {
      // build FormData
      const form = new FormData();
      form.append("name", formData.name);
      form.append("description", formData.description);
      form.append("cost", formData.cost);
      form.append("category", category._id);

      formData.images.forEach((img) => {
        if (img instanceof File) {
          form.append("images", img);
        } else {
          form.append("images", img); // http/cloudinary/base64
        }
      });

      const res = await createService(form);
      onServiceAdded(res.data || res.service);

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 p-3 sm:p-4">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-lg border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FaPen className="text-indigo-600" /> Add Service
          </h2>
          <button
            onClick={onClose}
            aria-label="Close form"
            className="text-gray-400 hover:text-gray-600"
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
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
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category}</p>
            )}
          </div>

          {/* Service Name */}
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
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
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
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
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
            {errors.cost && (
              <p className="text-red-500 text-xs mt-1">{errors.cost}</p>
            )}
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FaFileImage className="text-indigo-500" /> Service Images
            </label>

            {/* file upload */}
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="mt-1 block w-full text-sm"
            />

            {/* url input */}
            <div className="flex gap-2 mt-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Paste image URL"
                className="flex-1 rounded-lg border p-2 text-sm"
              />
              <button
                type="button"
                onClick={handleAddUrl}
                className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm flex items-center gap-1"
              >
                <FaLink /> Add
              </button>
            </div>

            {/* previews */}
            <div className="mt-3 flex flex-wrap gap-3">
              {formData.images.map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={
                      img instanceof File ? URL.createObjectURL(img) : img
                    }
                    alt="preview"
                    className="h-20 w-20 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {errors.images && (
              <p className="text-red-500 text-xs mt-1">{errors.images}</p>
            )}
          </div>

          {/* error */}
          {errors.submit && (
            <div className="text-red-500 text-sm font-medium">
              {errors.submit}
            </div>
          )}

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
              disabled={isSubmitting}
              className="px-4 py-2 text-sm rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <FaSave /> {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>

      {/* success popup */}
      {showSuccess && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-300 text-green-800 px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm shadow">
          <FaCheckCircle className="text-green-600" />
          Service added successfully!
        </div>
      )}
    </div>
  );
};

export default AddServiceForm;
