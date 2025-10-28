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
  FaBalanceScale,
  FaHashtag,
  FaFlask,
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
    unit: "quantity",
    quantity: "",
    weight: "",
    volume: "",
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

  // Inside component
const handleUnitChange = (e) => {
  const unit = e.target.value;
  setFormData((prev) => ({
    ...prev,
    unit,
    quantity: unit === "quantity" ? prev.quantity : undefined,
    weight: unit === "kg" ? prev.weight : undefined,
    volume: unit === "liters" ? prev.volume : undefined,
  }));
};


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
  { ...formData, 
    cost: Number(formData.cost),
     category: categoryId },
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
       
      form.append("unit", formData.unit);

      if (formData.unit === "quantity") form.append("quantity", formData.quantity || 0);
      if (formData.unit === "kg") form.append("weight", formData.weight || 0);
      if (formData.unit === "liters") form.append("volume", formData.volume || 0);
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
      <div className="bg-white rounded-xl w-full max-w-md sm:max-w-lg md:max-w-2xl p-6 shadow-lg border border-gray-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaBox className="text-purple-600" /> Add Product
          </h2>
          <button onClick={onClose} aria-label="Close form" className="text-gray-400 hover:text-gray-600">
            <MdClose size={28} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-5">
          {/* Category */}
          <div>
            <label className="block text-base sm:text-sm md:text-base font-semibold text-gray-700 flex items-center gap-2">
              <FaInfoCircle className="text-purple-500" /> Product Category
            </label>
            <input
              type="text"
              value={category?.name || "Loading..."}
              readOnly
              className="mt-1 block w-full rounded-lg bg-gray-100 p-3 sm:p-2 text-base sm:text-sm md:text-base text-gray-700"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-base sm:text-sm md:text-base font-semibold text-gray-700 flex items-center gap-2">
              <FaTag className="text-purple-500" /> Product Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className="mt-1 block w-full rounded-lg border p-3 sm:p-2 text-base sm:text-sm md:text-base focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-base sm:text-sm md:text-base font-semibold text-gray-700 flex items-center gap-2">
              <FaPen className="text-purple-500" /> Description
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              className="mt-1 block w-full rounded-lg border p-3 sm:p-2 text-base sm:text-sm md:text-base focus:ring-purple-500 focus:border-purple-500 resize-none"
            />
          </div>

          {/* Cost */}
          <div>
            <label className="block text-base sm:text-sm md:text-base font-semibold text-gray-700 flex items-center gap-2">
              <FaRupeeSign className="text-purple-500" /> Cost
            </label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              placeholder="e.g., 250"
              className="mt-1 block w-full rounded-lg border p-3 sm:p-2 text-base sm:text-sm md:text-base focus:ring-purple-500 focus:border-purple-500"
              min="0"
              step="0.01"
            />
          </div>

          {/* Unit + dynamic fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="flex items-center gap-2 text-base sm:text-sm md:text-base font-semibold text-gray-700">
                <FaBalanceScale className="text-purple-500" /> Unit
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleUnitChange}
                className="mt-1 w-full border border-gray-300 rounded-lg p-3 sm:p-2 text-base sm:text-sm md:text-base focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="quantity">Quantity</option>
                <option value="kg">Weight (kg)</option>
                <option value="liters">Volume (L)</option>
              </select>
            </div>

            {formData.unit === "quantity" && (
              <div>
                <label className="flex items-center gap-2 text-base sm:text-sm md:text-base font-semibold text-gray-700">
                  <FaHashtag className="text-purple-500" /> Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 p-3 sm:p-2 text-base sm:text-sm md:text-base focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            )}

            {formData.unit === "kg" && (
              <div>
                <label className="flex items-center gap-2 text-base sm:text-sm md:text-base font-semibold text-gray-700">
                  <FaBalanceScale className="text-purple-500" /> Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 p-3 sm:p-2 text-base sm:text-sm md:text-base focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            )}

            {formData.unit === "liters" && (
              <div>
                <label className="flex items-center gap-2 text-base sm:text-sm md:text-base font-semibold text-gray-700">
                  <FaFlask className="text-purple-500" /> Volume (L)
                </label>
                <input
                  type="number"
                  name="volume"
                  value={formData.volume}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 p-3 sm:p-2 text-base sm:text-sm md:text-base focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-base sm:text-sm md:text-base font-semibold text-gray-700 flex items-center gap-2">
              <FaFileImage className="text-purple-500" /> Product Image
            </label>
            <div className="mt-2 flex items-center gap-3 flex-wrap">
              <label className="cursor-pointer bg-purple-50 text-purple-600 rounded-md px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm font-medium hover:bg-purple-100 transition-colors flex items-center gap-2">
                <FaCloudUploadAlt /> Upload
                <input type="file" accept="image/*" onChange={handleImageUpload} className="sr-only" />
              </label>
              {preview && (
                <div className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 flex items-center justify-center overflow-hidden rounded-md border">
                  <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-3 text-base sm:text-lg md:text-base font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-3 text-base sm:text-lg md:text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 flex items-center justify-center gap-2"
            >
              {isSubmitting && <FaSpinner className="animate-spin" />}
              {isSubmitting ? "Saving..." : <><FaSave /> Save</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;
