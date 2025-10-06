import axios from "axios";
import Joi from "joi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;
// ------------------------------
// Joi validation schema for product
// ------------------------------
import { productSchema } from "../validation/productValidation";

// ------------------------------
// Fetch products by category
// ------------------------------
export const fetchProductsByCategory = async (categoryId) => {
  if (!categoryId) throw new Error("Category ID is required");

  const token = localStorage.getItem("authToken");
  const res = await axios.get(`${API_BASE_URL}/admin/api/products/products/${categoryId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  // Normalize images safely
  return (res.data.data || []).map((p) => {
    const images =
      Array.isArray(p.images) && p.images.length > 0
        ? p.images.map((img) => (typeof img === "string" ? img : img.url)).filter(Boolean)
        : p.image
        ? [p.image]
        : [];
    return { ...p, images };
  });
};

// ------------------------------
// Fetch all product categories
// ------------------------------
export const fetchProductCategories = async () => {
  const token = localStorage.getItem("authToken");
  const res = await axios.get(`${API_BASE_URL}/admin/api/category/product-categories`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data || [];
};

// ------------------------------
// Add a new product with Joi validation
// ------------------------------
export const addProduct = async (productData) => {
  // Validate data
  const { error } = productSchema.validate(productData, { abortEarly: false });
  if (error) {
    throw new Error(`Validation error: ${error.details.map((d) => d.message).join(", ")}`);
  }

  const token = localStorage.getItem("authToken");
  const res = await axios.post(`${API_BASE_URL}/admin/api/products/products`, productData, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  return res.data.data;
};

// ------------------------------
// Upload image to Cloudinary
// ------------------------------
export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  try {
    const res = await fetch(CLOUDINARY_URL, { method: "POST", body: formData });
    const data = await res.json();
    if (!data.secure_url) throw new Error("Cloudinary upload failed");
    return { url: data.secure_url, publicId: data.public_id };
  } catch (err) {
    console.error(err);
    throw new Error("Cloudinary upload failed");
  }
};

// Edit product
export const editProduct = async (productId, formData) => {
  const token = localStorage.getItem("authToken");
  const res = await axios.put(`${API_BASE_URL}/admin/products/${productId}`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data || res.data.product;
};


// Delete product
export const deleteProduct = async (productId) => {
  const token = localStorage.getItem("authToken");
  const res = await axios.delete(`${API_BASE_URL}/admin/products/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Delete images from Cloudinary
export const deleteImagesFromCloudinary = async (images) => {
  if (!images) return;
  const imageArray = Array.isArray(images) ? images : [images];

  for (const url of imageArray) {
    try {
      await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/destroy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: url, api_key: CLOUDINARY_API_KEY }),
      });
    } catch (err) {
      console.error("Failed to delete image:", url, err);
    }
  }
};

// Joi validation
export const validateProductDelete = (product) => {
  const schema = Joi.object({
    _id: Joi.string().required(),
    name: Joi.string().required(),
    images: Joi.array().items(Joi.string().uri()).optional(),
  });
  return schema.validate(product);
};