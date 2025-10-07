// src/components/AddServiceForm.jsx
import { useState } from "react";
import { MdAddCircleOutline, MdCloudUpload } from "react-icons/md";
import { VscSymbolNamespace } from "react-icons/vsc";
import { createServiceCategory,serviceCategorySchema } from "../../api/categoryApi";
import { toast } from "react-hot-toast"; // <-- import toast

const AddServiceForm = ({ onClose, onServiceAdded }) => {
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
  // ✅ Joi validation
    const { error } = serviceCategorySchema.validate({ name, image }, { abortEarly: false });
    if (error) {
      toast.error(error.details.map((d) => d.message).join("\n"));
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createServiceCategory(name, image);
      toast.success("Service category added successfully! 🎉"); // <-- success toast
      onServiceAdded(result);
      onClose();
    } catch (error) {
      console.error(error);
      // ✅ Extract backend message or fallback to generic error
      const message =
        error.response?.data?.message || error.message || "Failed to add service category ❌";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 
                    bg-white rounded-xl max-w-md mx-auto">
      {/* Heading */}
      <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
        <MdAddCircleOutline className="mr-2 text-violet-600" size={32} />
        Add Service Category
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Category Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="service-name" className="text-sm font-semibold text-gray-700">
            Category Name
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <VscSymbolNamespace size={20} />
            </span>
            <input
              type="text"
              id="service-name"
              placeholder="e.g., Electrical"
              value={name}
              onChange={(e) => setName(e.target.value)}
              // required
              className="w-full rounded-lg border border-gray-300 bg-gray-50 pl-10 pr-4 py-3 text-sm text-gray-900
                         focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="flex flex-col gap-2">
          <label htmlFor="service-image" className="text-sm font-semibold text-gray-700">
            Category Image
          </label>
          <input
            type="file"
            id="service-image"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <label
            htmlFor="service-image"
            className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50"
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="h-32 w-32 sm:h-36 sm:w-36 md:h-40 md:w-40 object-cover rounded-md border border-gray-300"
              />
            ) : (
              <>
                <MdCloudUpload className="text-5xl text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">
                  Click to upload an image
                </span>
              </>
            )}
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-violet-600 py-2 text-lg font-bold text-white disabled:bg-gray-400 disabled:text-gray-600"
        >
          {isSubmitting ? "Creating..." : "Create Category"}
        </button>
      </form>
    </div>
  );
};

export default AddServiceForm;
