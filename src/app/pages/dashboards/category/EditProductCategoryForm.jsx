// src/components/EditProductCategoryForm.jsx
import { useState } from "react";
import { FaBox, FaSave, FaSpinner, FaTimes } from "react-icons/fa";
import { MdCloudUpload } from "react-icons/md";
import toast from "react-hot-toast"; // ✅ toast
import { updateProductCategory,editCategorySchema  } from "../../api/categoryApi";


const backendUrl = import.meta.env.VITE_API_BASE_URL;

const EditProductCategoryForm = ({ category, onSave, onCancel }) => {
  const [name, setName] = useState(category?.name || "");
  const [description, setDescription] = useState(category?.description || "");
  const [newImageFile, setNewImageFile] = useState(null);

  const initialImages = category?.images?.length
    ? category.images.map((img) => (img.startsWith("http") ? img : `${backendUrl}${img}`))
    : category?.image
    ? [category.image.startsWith("http") ? category.image : `${backendUrl}${category.image}`]
    : [];

  const [previewImage, setPreviewImage] = useState(initialImages[0] || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // ✅ Frontend validation
      const { error } = editCategorySchema.validate({ name, description });
      if (error) throw new Error(error.details.map((d) => d.message).join(", "));

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description || "");

      if (newImageFile) formData.append("image", newImageFile);

     const updatedCategory = await updateProductCategory(category._id, formData);

// Update preview image with backend URL if a new image was uploaded
// Update preview image with backend URL if a new image was uploaded
if (updatedCategory.data.image) {
  setPreviewImage(
    updatedCategory.data.image.startsWith("http")
      ? updatedCategory.data.image
      : `${backendUrl}${updatedCategory.data.image}`
  );
}


// Use the correct path for toast
toast.success(`Product category "${updatedCategory.data.name}" updated successfully! 🎉`);

onSave(updatedCategory.data);
onCancel();

    } 
    catch (err) {
  console.error(err);
  
  const message =
    err.response?.data?.message || err.message || "Failed to update product category ❌";

  toast.error(message);
}

    finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md sm:max-w-lg lg:max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-xl">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2 text-green-700 justify-center">
        <FaBox className="text-green-600" />
        Edit Product Category
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Name */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Category Name</label>
          <input
            type="text"
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            // required
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Description (optional)</label>
          <textarea
            placeholder="Optional description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 focus:border-green-500 focus:ring-1 focus:ring-green-500 resize-y transition-all"
          />
        </div>

        {/* Image Upload */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            id="product-image"
            onChange={handleImageChange}
            disabled={isSubmitting}
            className="hidden"
          />
          <label
            htmlFor="product-image"
            className="flex flex-col items-center justify-center gap-2 p-2 w-full min-h-[120px] cursor-pointer rounded-md border-2 border-dashed border-gray-300 bg-gray-50 hover:border-green-500 hover:bg-green-50 transition-all"
          >
            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                className="h-32 w-32 sm:h-36 sm:w-36 md:h-40 md:w-40 object-cover rounded-md border border-gray-300"
              />
            ) : (
              <>
                <MdCloudUpload className="text-4xl text-gray-400" />
                <span className="text-xs sm:text-sm text-gray-500">Click to upload an image</span>
              </>
            )}
          </label>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 transition-all"
          >
            {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaSave />}
            {isSubmitting ? "Updating..." : "Save"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="w-full sm:w-auto flex-1 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 flex items-center justify-center gap-2 transition-all"
          >
            <FaTimes />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductCategoryForm;
