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
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import {
  editProduct,
  uploadImageToCloudinary,
  fetchProductCategories,
  productSchema,
} from "../../api/productApi";

const EditProductForm = ({ productData, onClose, onProductUpdated }) => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);

  // Convert local paths to public URLs
const normalizeImages = (images, singleImage) => {
  const allImages = images?.length ? images : singleImage ? [singleImage] : [];
  return allImages
    .map((img) => {
      if (!img) return null;
      return img.startsWith("http")
        ? img // Cloudinary or full URL
        : `${import.meta.env.VITE_API_BASE_URL}${img}`; // prepend backend URL for local uploads
    })
    .filter(Boolean);
};


  const [formData, setFormData] = useState({
    name: productData?.name || "",
    description: productData?.description || "",
    cost: productData?.cost || "",
    images: productData?.images?.length
      ? normalizeImages(productData.images)
      : productData?.image
      ? [normalizeImages([productData.image])[0]]
      : [],
  });

  const [previewImages, setPreviewImages] = useState(formData.images);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await fetchProductCategories();
        const cat = data.find((c) => c._id === categoryId);
        setCategory(cat || null);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, [categoryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setIsUploading(true);
    setError(null);

    try {
      const uploaded = [];
      for (const file of files) {
        const img = await uploadImageToCloudinary(file);
        uploaded.push(img.url);
      }
      setFormData((prev) => ({ ...prev, images: uploaded }));
      setPreviewImages(uploaded);
    } catch (err) {
      setError(err.message || "Image upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Joi validation
    const { error: validationError } = productSchema.validate({
      ...formData,
      category: category?._id,
    });
    if (validationError) {
      setError(validationError.details[0].message);
      setIsSubmitting(false);
      return;
    }

    try {
      const updated = await editProduct(productData._id, {
        ...formData,
        category: category._id,
      });
      onProductUpdated(updated);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50 p-3 sm:p-6">
      <div className="bg-white rounded-2xl w-full max-w-md sm:max-w-lg p-5 sm:p-8 shadow-2xl border border-gray-200 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaPen className="text-purple-600" />
            Edit Product
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <MdClose size={28} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category */}
          <div>
            <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-700">
              <FaInfoCircle className="text-purple-500" />
              Product Category
            </label>
            <input
              type="text"
              value={category?.name || "Loading..."}
              readOnly
              className="mt-1 block w-full rounded-lg bg-gray-100 p-2 text-gray-700 text-sm sm:text-base"
            />
          </div>

          {/* Product Name */}
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

          {/* Image Upload */}
          <div>
            <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-700">
              <FaFileImage className="text-purple-500" /> Product Image
            </label>
            <div className="mt-1 flex items-center gap-3 flex-wrap">
              <label className="cursor-pointer bg-purple-50 text-purple-600 rounded-md px-3 py-1.5 text-sm sm:text-base font-medium hover:bg-purple-100 transition-colors">
                Upload
                <input
                  type="file"
                  multiple
                  onChange={handleImageUpload}
                  className="sr-only"
                  accept="image/*"
                />
              </label>
              {previewImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`preview-${idx}`}
                  className="w-16 h-16 object-cover rounded-md border"
                />
              ))}
            </div>
          </div>

          {error && <div className="text-red-500 text-sm sm:text-base font-medium">{error}</div>}

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
              disabled={isSubmitting || isUploading}
              className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 flex items-center justify-center gap-2"
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
          Product updated successfully!
        </div>
      )}
    </div>
  );
};

export default EditProductForm;
