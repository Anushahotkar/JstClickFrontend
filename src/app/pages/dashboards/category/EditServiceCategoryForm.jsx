import { useState } from "react";
import { MdEdit, MdCloudUpload } from "react-icons/md";
import { FaSave, FaSpinner, FaTimes } from "react-icons/fa";
import {  updateServiceCategory, serviceCategorySchema } from "../../api/categoryApi";
// import { serviceCategorySchema } from "../../validation/category.validation";
import { toast } from "react-hot-toast";

const EditServiceCategoryForm = ({ category, onSave, onCancel }) => {
  const backendUrl = import.meta.env.VITE_API_BASE_URL;

  const [name, setName] = useState(category?.name || "");
  const [description, setDescription] = useState(category?.description || "");
  const [newImageFile, setNewImageFile] = useState(null);

  const initialImage = category?.images?.length
    ? category.images[0].startsWith("http")
      ? category.images[0]
      : `${backendUrl}${category.images[0]}`
    : category?.image
    ? category.image.startsWith("http")
      ? category.image
      : `${backendUrl}${category.image}`
    : "";

  const [previewImage, setPreviewImage] = useState(initialImage);
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

    // Joi validation
    const { error } = serviceCategorySchema.validate({
      name,
      description,
      image: newImageFile || previewImage,
    });

    if (error) {
      toast.error(error.details.map((d) => d.message).join("\n"));
      setIsSubmitting(false);
      return;
    }

    try {
      const updatedCategory = await updateServiceCategory(category._id, {
  name,
  description,
  newImageFile, // pass the actual File object, not preview URL
});
      toast.success(`Service category "${updatedCategory.data.name}" updated successfully! 🎉`);
      onSave(updatedCategory);
      onCancel();
    } catch (err) {
      console.error(err);
     const message = err.response?.data?.message || err.message || "Failed to update service ❌";
    toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4 sm:p-6 bg-white/90 rounded-xl ">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2 text-indigo-600 justify-center">
        <MdEdit className="text-indigo-500 text-2xl" />
        Edit Service Category
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Name */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            placeholder="e.g., Electrical, Plumbing"
            value={name}
            onChange={(e) => setName(e.target.value)}
            // required
            className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Description (optional)</label>
          <textarea
            placeholder="Optional description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-y transition-all"
          />
        </div>

        {/* Image Upload */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            id="service-image"
            onChange={handleImageChange}
            disabled={isSubmitting}
            className="hidden"
          />
          <label
            htmlFor="service-image"
            className="flex flex-col items-center justify-center gap-2 p-2 w-full min-h-[120px] cursor-pointer rounded-md border-2 border-dashed border-gray-300 bg-gray-50 hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
          >
            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                className="h-32 w-32 sm:h-36 sm:w-36 object-cover rounded-md border border-gray-300"
              />
            ) : (
              <>
                <MdCloudUpload className="text-4xl text-gray-400" />
                <span className="text-xs sm:text-sm text-gray-500">
                  Click to upload an image
                </span>
              </>
            )}
          </label>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-2 sm:py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 flex items-center justify-center gap-2 transition-all"
          >
            {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaSave />}
            {isSubmitting ? "Updating..." : "Save"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 py-2 sm:py-3 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 flex items-center justify-center gap-2 transition-all"
          >
            <FaTimes />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditServiceCategoryForm;
