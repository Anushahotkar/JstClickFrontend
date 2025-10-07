import axios from "axios";
import Joi from "joi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`;
// const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
// const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;
// ------------------------------
// Joi validation schema for product
// ------------------------------


export const productSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Product name is required",
    "string.min": "Product name should be at least 2 characters",
    "string.max": "Product name should not exceed 100 characters",
  }),
  category: Joi.string().required().messages({
    "any.required": "Category is required",
  }),
  cost: Joi.number().min(0).required().messages({
    "number.base": "Cost must be a number",
    "number.min": "Cost must be greater than or equal to 0",
    "any.required": "Cost is required",
  }),
  description: Joi.string().allow("").max(500).messages({
    "string.max": "Description should not exceed 500 characters",
  }),
  image: Joi.string().uri().required().messages({
    "any.required": "Product image is required",
  }),
});


export const editProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Product name is required",
    "string.min": "Product name should be at least 2 characters",
    "string.max": "Product name should not exceed 100 characters",
  }),
  category: Joi.string().required().messages({
    "any.required": "Category is required",
  }),
  cost: Joi.number().min(0).required().messages({
    "number.base": "Cost must be a number",
    "number.min": "Cost must be greater than or equal to 0",
    "any.required": "Cost is required",
  }),
  description: Joi.string().allow("").max(500).messages({
    "string.max": "Description should not exceed 500 characters",
  }),
   // ✅ must be either valid URL (string) or a File (any)
image: Joi.alternatives()
  .try(
    Joi.object().instance(File),    // File from input
    Joi.string().pattern(/^https?:\/\/.+/) // Accepts http or https URLs only
  )
  .required()
  .messages({
    "any.required": "Product image is required",
    "string.pattern.base": "Invalid image URL",
  }),


});



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



// Joi validation
export const validateProductDelete = (product) => {
  const schema = Joi.object({
    _id: Joi.string().required(),
    name: Joi.string().required(),
    images: Joi.array().items(Joi.string().uri()).optional(),
  });
  return schema.validate(product);
};