import { useState } from "react";
import { MdAddCircleOutline, MdCloudUpload } from "react-icons/md";
import { VscSymbolNamespace } from "react-icons/vsc";
import { toast } from "react-hot-toast";

import { createProductCategory } from "../../api/categoryApi";
import { createCategorySchema } from "../../validation/category.validation";

const AddProductForm = ({ onClose, onProductAdded }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validate input using Joi
    const { error } = createCategorySchema.validate({ name, image });
    if (error) {
      toast.error(error.details[0].message);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createProductCategory(name, [image]); // API expects array
      toast.success(`Product category "${result.name}" added successfully! 🎉`);
      onProductAdded(result);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to add product category ❌");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto p-4 sm:p-6">
      <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
        <MdAddCircleOutline className="text-green-600" size={32} />
        Add New Product Category
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Category Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="category-name" className="text-sm sm:text-base font-semibold text-gray-700">
            Category Name
          </label>
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <VscSymbolNamespace size={20} />
            </span>
            <input
              type="text"
              id="category-name"
              placeholder="e.g., Electronics"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 pl-10 pr-4 py-3 text-sm sm:text-base text-gray-900 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="flex flex-col gap-2">
          <label htmlFor="category-image" className="text-sm sm:text-base font-semibold text-gray-700">
            Category Image
          </label>
          <input
            type="file"
            id="category-image"
            onChange={handleFileChange}
            style={{ display: "none" }}
            accept="image/*"
          />
          <label
            htmlFor="category-image"
            className="flex h-40 sm:h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50"
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48 object-cover rounded-md border border-gray-300"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-center">
                <MdCloudUpload className="text-4xl sm:text-5xl text-gray-400" />
                <span className="mt-2 text-xs sm:text-sm text-gray-500">
                  Click to upload one image
                </span>
              </div>
            )}
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-green-600 py-3 text-lg sm:text-xl font-bold text-white disabled:bg-gray-400 disabled:text-gray-600 transition-colors duration-200"
        >
          {isSubmitting ? "Creating..." : "Create Category"}
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;
