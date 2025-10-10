import { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import {
  FaRupeeSign,
  FaBox,
  FaFileImage,
  FaTag, 
  FaSave,
  FaInfoCircle,
  FaPen,
  FaCloudUploadAlt,
  FaSpinner,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  fetchProductCategories,
  addProduct,
  productSchema,
} from "../../api/productApi";

const AddProductForm = ({ onClose, onProductAdded }) => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    cost: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  // const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load category
  useEffect(() => {
    const loadCategory = async () => {
      try {
        const categories = await fetchProductCategories();
        const found = categories.find((c) => c._id === categoryId);
        setCategory(found);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load category");
      }
    };
    loadCategory();
  }, [categoryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    setFormData((prev) => ({ ...prev, image: file }));
  };

  useEffect(() => {
    return () => preview && URL.revokeObjectURL(preview);
  }, [preview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // setErrors({});

    try {
      // Validate with Joi
     const { error } = productSchema.validate(
  { ...formData, cost: Number(formData.cost), category: categoryId },
  { abortEarly: false }
);

      if (error) {
        console.log(error);
         error.details.forEach((d) => toast.error(d.message));
        setIsSubmitting(false);
        return;

      }

      // Prepare FormData
      const form = new FormData();
      form.append("name", formData.name);
      form.append("description", formData.description || "");
      form.append("cost", Number(formData.cost));
      form.append("category", categoryId);
      if (formData.image) form.append("image", formData.image);

      const newProduct = await addProduct(form);
      onProductAdded(newProduct);

      onClose();
    } catch (err) {
      console.error(err);
 if (err.response?.data?.errors?.length) {
        err.response.data.errors.forEach((e) =>
          toast.error(e.message || "Validation error")
        );
      } else {
        toast.error(err.response?.data?.message || err.message || "Failed to add product");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 p-3 sm:p-4">
      <div className="bg-white rounded-xl w-full max-w-md sm:max-w-lg md:max-w-2xl p-6 shadow-lg border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FaBox className="text-purple-600" /> Add Product
          </h2>
          <button onClick={onClose} aria-label="Close form" className="text-gray-400 hover:text-gray-600">
            <MdClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FaInfoCircle className="text-purple-500" /> Product Category
            </label>
            <input
              type="text"
              value={category?.name || "Loading..."}
              readOnly
              className="mt-1 block w-full rounded-lg bg-gray-100 p-2 text-gray-700 text-sm"
            />
            {/* {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>} */}
          </div>

          {/* Name */}
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
              className="mt-1 block w-full rounded-lg border p-2 text-sm focus:ring-purple-500 focus:border-purple-500"
            />
            {/* {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>} */}
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
              className="mt-1 block w-full rounded-lg border p-2 text-sm focus:ring-purple-500 focus:border-purple-500 resize-none"
            />
            {/* {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>} */}
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
              className="mt-1 block w-full rounded-lg border p-2 text-sm focus:ring-purple-500 focus:border-purple-500"
              min="0"
              step="0.01"
            />
            {/* {errors.cost && <p className="text-red-500 text-xs mt-1">{errors.cost}</p>} */}
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FaFileImage className="text-purple-500" /> Product Image
            </label>
            <div className="mt-2 flex items-center gap-3">
              <label className="cursor-pointer bg-purple-50 text-purple-600 rounded-md px-4 py-2 text-sm font-medium hover:bg-purple-100 transition-colors flex items-center gap-2">
                <FaCloudUploadAlt /> Upload
                <input type="file" accept="image/*" onChange={handleImageUpload} className="sr-only" />
              </label>
              {preview && (
                <div className="relative w-12 h-12">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-md border" />
                </div>
              )}
            </div>
            {/* {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>} */}
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
              disabled={isSubmitting}
              className="px-4 py-2 text-sm sm:text-base rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:bg-purple-400 flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaSave />}
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;
