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
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

// Direct API imports
import {
  fetchProductCategories,
  addProduct,
  productSchema
} from "../../api/productApi";


const AddProductForm = ({ onClose, onProductAdded }) => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    cost: "",
    image: "",
  });
  // const [preview, setPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {

      setFormData((prev) => ({ ...prev}));
   
      // toast.success("Image uploaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const body = {
      ...formData,
      cost: parseFloat(formData.cost),
      category: categoryId,
    };

    const { error } = productSchema.validate(body, { abortEarly: false });
    if (error) {
      toast.error(error.details.map((d) => d.message).join(", "));
      setIsSubmitting(false);
      return;
    }

    try {
      const newProduct = await addProduct(body);
      onProductAdded(newProduct);
      // toast.success("Product added successfully");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 p-3 sm:p-4">
      <div className="bg-white rounded-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl p-4 sm:p-6 shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaBox className="text-purple-600" /> Add Product
          </h2>
          <button
            onClick={onClose}
            aria-label="Close form"
            className="text-gray-400 hover:text-gray-600"
          >
            <MdClose size={28} />
          </button>
        </div>

        {/* Form */}
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
              className="mt-1 block w-full rounded-lg bg-gray-100 p-2 text-gray-700 text-sm sm:text-base"
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
              className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-sm sm:text-base focus:ring-purple-500 focus:border-purple-500"
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
              className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-sm sm:text-base focus:ring-purple-500 focus:border-purple-500 resize-none"
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
              className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-sm sm:text-base focus:ring-purple-500 focus:border-purple-500"
              min="0"
              step="0.01"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FaFileImage className="text-purple-500" /> Product Image
            </label>
            <div className="mt-1 flex items-center gap-2 flex-wrap">
              <label className="cursor-pointer bg-purple-50 text-purple-600 rounded-md px-3 py-1.5 text-sm font-medium hover:bg-purple-100 transition-colors flex items-center gap-2">
                <FaCloudUploadAlt /> {isUploading ? "Uploading..." : "Upload"}
                <input
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="sr-only"
                />
              </label>
              {/* {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover rounded-md border"
                />
              )} */}
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-sm font-medium rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="px-4 py-1.5 text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 flex items-center justify-center gap-2 w-full sm:w-auto"
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
