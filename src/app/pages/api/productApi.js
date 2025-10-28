import axios from "axios";
import Joi from "joi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`;
// const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
// const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;
// ------------------------------
// Joi validation schema for product
// ------------------------------
const token = localStorage.getItem("authToken");

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
  // ✅ Dynamic fields
  unit: Joi.string().valid("quantity", "kg", "liters").required().messages({
    "any.required": "Unit is required",
    "any.only": "Unit must be one of: quantity, kg, or liters",
  }),
  quantity: Joi.when("unit", {
    is: "quantity",
    then: Joi.number().min(1).required().messages({
      "any.required": "Quantity is required when unit is 'quantity'",
      "number.base": "Quantity must be a number",
      "number.min": "Quantity must be at least 1",
    }),
    // otherwise: Joi.forbidden(),
  }),
   weight: Joi.when("unit", {
    is: "kg",
    then: Joi.number().min(0.1).required().messages({
      "any.required": "Weight is required when unit is 'kg'",
      "number.base": "Weight must be a number",
      "number.min": "Weight must be at least 0.1 kg",
    }),
    // otherwise: Joi.forbidden(),
  }),
  volume: Joi.when("unit", {
    is: "liters",
    then: Joi.number().min(0.1).required().messages({
      "any.required": "Volume is required when unit is 'liters'",
      "number.base": "Volume must be a number",
      "number.min": "Volume must be at least 0.1 L",
    }),
    // otherwise: Joi.forbidden(),
  }),

  description: Joi.string().allow("").max(500).messages({
    "string.max": "Description should not exceed 500 characters",
  }),
  image: Joi.any()
    .custom((value, helpers) => {
      if (!value) return helpers.error("any.required");
      if (value instanceof File) return value; // valid file
      if (typeof value === "string" && /^https?:\/\/.+/.test(value)) return value; // valid URL
      return helpers.error("any.invalid");
    })
    .required()
    .messages({
      "any.required": "Product image is required",
      "any.invalid": "Invalid image. Must be a File or a valid URL",
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
    // ✅ Unit optional in edit
  unit: Joi.string().valid("quantity", "kg", "liters").optional().messages({
    "any.only": "Unit must be one of: quantity, kg, or liters",
  }),
    // ✅ Dynamic fields required conditionally
  quantity: Joi.when("unit", {
    is: "quantity",
    then: Joi.number().min(1).required().messages({
      "any.required": "Quantity is required when unit is 'quantity'",
      "number.base": "Quantity must be a number",
      "number.min": "Quantity must be at least 1",
    }),
    otherwise: Joi.optional(),
  }),

  weight: Joi.when("unit", {
    is: "kg",
    then: Joi.number().min(0.1).required().messages({
      "any.required": "Weight is required when unit is 'kg'",
      "number.base": "Weight must be a number",
      "number.min": "Weight must be at least 0.1 kg",
    }),
    otherwise: Joi.optional(),
  }),

  volume: Joi.when("unit", {
    is: "liters",
    then: Joi.number().min(0.1).required().messages({
      "any.required": "Volume is required when unit is 'liters'",
      "number.base": "Volume must be a number",
      "number.min": "Volume must be at least 0.1 L",
    }),
    otherwise: Joi.optional(),
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
// Error Handler (centralized for toast-friendly messages)
// ------------------------------



// ------------------------------
// Fetch products by category
// ------------------------------
export const fetchProductsByCategory = async (categoryId) => {
  if (!categoryId) throw new Error("Category ID is required");

  
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
  
  const res = await axios.get(`${API_BASE_URL}/admin/api/category/product-categories`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data || [];
};

// ------------------------------
// Add a new product with Joi validation
// ------------------------------
export const addProduct = async (formData) => {
  
  const res = await axios.post(`${API_BASE_URL}/admin/api/products/products`, formData, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};


// ------------------------------
// Upload image to Cloudinary
// ------------------------------


// Edit product
export const editProduct = async (productId, formData) => {
  
  const res = await axios.put(`${API_BASE_URL}/admin/products/${productId}`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data || res.data.product;
};


// Delete product
export const deleteProduct = async (productId) => {

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


// ------------------------------
// Fetch category name of a single product
// ------------------------------
export const fetchProductCategory = async (productId) => {
  if (!productId) throw new Error("Product ID is required");

  try {
    const res = await axios.get(`${API_BASE_URL}/admin/api/products/product/${productId}/category`, {
      headers: { Authorization: `Bearer ${token}` },
    });

     // Return both categoryId and categoryName
    return {
      id: res.data.data?.categoryId || null,
      name: res.data.data?.categoryName || "Unknown Category",
    };
  } catch (err) {
    console.error("Error fetching product category:", err);
    return "Unknown Category";
  }
};
