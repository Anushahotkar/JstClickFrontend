import axios from "axios";
import Joi from "joi";
import api from "./authApi";

// src/api/categoryApi.jsx
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// Validation schema for product category ID
const categoryIdSchema = Joi.string().hex().length(24).required();


// Helper to get the token from localStorage
const getToken = () => localStorage.getItem("authToken");

/**
 * Fetch all categories (services or products)
 * @param {"services" | "products"} type
 * @returns {Promise<Array>} list of categories
 */
export const fetchCategoriesApi = async (type = "services") => {
  const endpoint =
    type === "services"
      ? "/admin/api/category/service-categories"
      : "/admin/api/category/product-categories";

  try {
    const res = await api.get(endpoint);
    // return data from ApiResponse
    return res.data.data;
  } catch (err) {
    const message = err.response?.data?.message || err.message;
    throw new Error(message);
  }
};

// ✅ Delete category (services or products)
export const deleteCategoryApi = async (activeTab, categoryId) => {
  const token = getToken();
  if (!token) throw new Error("Authentication token missing");

  const endpoint =
    activeTab === "services"
      ? `${API_BASE_URL}/admin/api/adminCategory/service-category/${categoryId}`
      : `${API_BASE_URL}/admin/api/product-category/${categoryId}`;

  const res = await fetch(endpoint, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete category");
  }

  return true;
};

// ✅ Create Product Category (supports multiple images)
export const createProductCategory = async (name, image) => {
  if (!name || !image || image.length === 0) {
    throw new Error("Category name and at least one image are required.");
  }

  const token = getToken();
  if (!token) throw new Error("No authentication token found. Please log in.");

  const formData = new FormData();
  formData.append("name", name);
  image.forEach((img) => formData.append("image", img));

  const res = await fetch(`${API_BASE_URL}/admin/api/adminCategory/product-category`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create category.");
  }

  const data = await res.json();
  return data.data;
};


// ✅ Create service category (supports multiple images)
// Create Service Category (single image)
// src/api/categoryApi.js
export const createServiceCategory = async (name, file) => {
  if (!name || !file) throw new Error("Category name and an image are required.");

  const { url, public_id } = await uploadServiceCategoryImage(file);

  const token = getToken();
  if (!token) throw new Error("Authentication token missing");

  const res = await fetch(`${API_BASE_URL}/admin/api/adminCategory/category`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, image: url, public_id }), // include public_id
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create service category.");
  }

  const data = await res.json();
  return data.data;
};





// ✅ Update product category
export const updateProductCategory = async (categoryId, formData) => {
  const token = getToken();
  if (!token) throw new Error("Authentication token missing");

  const res = await fetch(`${API_BASE_URL}/admin/api/adminCategory/product-category/${categoryId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`, // only auth header
    },
    body: formData,
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update category");
  }

  const data = await res.json();
  return data.data;
};



// ✅ Upload image to Cloudinary
export const uploadImageToCloudinary = async (file, folder = "productCategories") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok || !data.secure_url) throw new Error(data.error?.message || "Cloudinary upload failed");
  return data.secure_url;
};


// Update service category (with optional image)
export const updateServiceCategory = async (categoryId, payload, file) => {
  const token = getToken();
  if (!token) throw new Error("Authentication token missing");

  if (file) {
    const { url } = await uploadServiceCategoryImage(file); // only take URL
    payload.image = url;
  }

  const res = await fetch(`${API_BASE_URL}/admin/api/adminCategory/service-category/${categoryId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update service category.");
  }

  const data = await res.json();
  return data.data;
};




/**
 * Delete a product category by ID
 * @param {string} categoryId
 * @returns {Promise<Object>} API response
 */
export const deleteProductCategory = async (categoryId) => {
  // Validate category ID
  const { error } = categoryIdSchema.validate(categoryId);
  if (error) {
    throw new Error(`Invalid category ID: ${error.message}`);
  }
   const token = getToken();
  if (!token) throw new Error("Authentication token missing");

  try {
    
    const response = await axios.delete(
      `${API_BASE_URL}/admin/api/adminCategory/product-category/${categoryId}`,
      {
         headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true, // include cookies if using session auth
      }
    );
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: err.message };
  }
};


/**
 * Delete a service category by ID
 * @param {string} categoryId
 * @param {string} publicId
 * @returns {Promise<{ success: boolean, message: string }>} API response
 */
export const deleteServiceCategory = async (categoryId, publicId) => {
  const { error } = categoryIdSchema.validate(categoryId);
  if (error) throw new Error(`Invalid category ID: ${error.message}`);

  const token = getToken();
  if (!token) throw new Error("Authentication token missing");

  try {
    console.log("in API call");

    // Delete category in backend
    await axios.delete(
      `${API_BASE_URL}/admin/api/adminCategory/service-category/${categoryId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Delete image from Cloudinary
    if (publicId) {
      await axios.post(
        `${API_BASE_URL}/admin/api/adminCategory/delete-image`,
        { public_id: publicId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    // ✅ Return a message from API
    return {
      success: true,
      message: `Service category deleted successfully ✅`,
    };
  } catch (err) {
    const message =
      err.response?.data?.message || err.message || "Failed to delete service category ❌";
    throw new Error(message);
  }
};





export const uploadServiceCategoryImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file); // File object from input
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", "serviceCategories");

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData // ✅ Must send as form-data
  });

  const data = await res.json();

  if (!res.ok || !data.secure_url) {
    throw new Error(data.error?.message || "Cloudinary upload failed");
  }

  // Return URL and public_id
  return { url: data.secure_url, public_id: data.public_id };
};


