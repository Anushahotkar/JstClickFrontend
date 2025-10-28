import { useState, useEffect, useRef } from "react";
import { MdClose } from "react-icons/md";
import {
  FaRupeeSign,
  FaCloud,
  FaSpinner,
  FaPen,
  FaFileImage,
  FaTag,
  FaSave,
  FaInfoCircle,
   FaBalanceScale,
  FaFlask,
  FaHashtag,
} from "react-icons/fa";
import toast from "react-hot-toast";
import {
  fetchProductCategory,
  editProduct,
  editProductSchema,
} from "../../api/productApi";

const EditProductForm = ({ productData, onClose, onProductUpdated }) => {
  const [category, setCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: productData?.name || "",
    description: productData?.description || "",
    cost: productData?.cost || "",
    unit: productData?.unit || "quantity",
    quantity: productData?.quantity || "",
    weight: productData?.weight || "",
    volume: productData?.volume || "",
    image: null,
    preview: productData?.image || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fileRef = useRef(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

  // Fetch product category name using API
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categoryName = await fetchProductCategory(productData._id);
        setCategory({_id: categoryName.id,  name: categoryName.name });
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch product category");
      }
    };
    fetchCategory();
  }, [productData._id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    fileRef.current = file;
    setImageError(false); // reset error
    setFormData((prev) => ({
      ...prev,
      image: file,
      preview: URL.createObjectURL(file),
    }));
    setIsUploading(false);
  };

const getPreviewUrl = (preview) => {
  if (!preview) return "";
  // Blob from upload
  if (preview.startsWith("blob:")) return preview;
  // Absolute URL
  if (preview.startsWith("http")) return preview;
  // Relative path from API
  return `${API_BASE_URL}${preview.startsWith("/") ? "" : "/"}${preview}`;
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const imageToValidate = fileRef.current ? fileRef.current : formData.preview;

    const { error } = editProductSchema.validate(
      { ...formData, category: category?._id, image: imageToValidate },
      { abortEarly: false, stripUnknown: true }
    );

    if (error) {
      toast.error(error.details[0].message);
      setIsSubmitting(false);
      return;
    }

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("description", formData.description || "");
      form.append("cost", parseFloat(formData.cost));
       form.append("unit", formData.unit);
   // Only append the relevant field based on unit
    if (formData.unit === "quantity") form.append("quantity", formData.quantity || 0);
    if (formData.unit === "kg") form.append("weight", formData.weight || 0);
    if (formData.unit === "liters") form.append("volume", formData.volume || 0);
      if (category?._id) form.append("category", category._id);
      if (fileRef.current) form.append("image", fileRef.current);

      const updated = await editProduct(productData._id, form);
      onProductUpdated(updated);
      onClose();
    } catch (err) {
      console.error(err);
      if (err?.response?.data?.errors) {
        err.response.data.errors.forEach((e) => toast.error(e.message));
      } else {
        toast.error(err?.response?.data?.message || "Failed to update product");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
   <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 p-2 sm:p-4">
      <div
        className="bg-white rounded-2xl w-full max-w-[95%] sm:max-w-md md:max-w-lg 
                   p-4 shadow-lg border border-gray-200 transition-all 
                   max-h-[90vh] overflow-y-auto scrollbar-hide"
      >
        {/* Header */}
         <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaPen className="text-indigo-600" /> Edit Product
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <MdClose size={28} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            />
          </div>

          {/* Unit, Quantity/Weight/Volume */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FaBalanceScale className="text-purple-500" /> Unit
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="quantity">Quantity</option>
                <option value="kg">Weight (kg)</option>
                <option value="liters">Volume (L)</option>
              </select>
            </div>

            {formData.unit === "quantity" && (
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FaHashtag className="text-purple-500" /> Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-sm focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            )}

            {formData.unit === "kg" && (
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FaBalanceScale className="text-purple-500" /> Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-sm focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            )}

            {formData.unit === "liters" && (
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FaFlask className="text-purple-500" /> Volume (L)
                </label>
                <input
                  type="number"
                  name="volume"
                  value={formData.volume}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-sm focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-700">
              <FaFileImage className="text-purple-500" /> Product Image
            </label>
            <div className="mt-1 flex items-center gap-2 sm:gap-3 flex-wrap">
              <label className="cursor-pointer bg-purple-50 text-purple-600 rounded-md px-2 sm:px-3 py-1 sm:py-1.5 text-sm sm:text-base font-medium hover:bg-purple-100 transition-colors flex items-center gap-2">
                Upload
                <input
                  type="file"
                  onChange={handleImageUpload}
                  className="sr-only"
                  accept="image/*"
                />
              </label>

              <div className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 flex items-center justify-center rounded-md border border-gray-300 bg-gray-100 overflow-hidden">
                {formData.preview && !imageError ? (
                  <img
                    src={getPreviewUrl(formData.preview)}
                    alt="product preview"
                    className="h-full w-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <FaCloud className="text-gray-400 text-3xl sm:text-4xl md:text-5xl" />
                )}
              </div>
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
              {isSubmitting && <FaSpinner className="animate-spin" />}
              {isSubmitting ? "Saving..." : <><FaSave /> Save</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductForm;
