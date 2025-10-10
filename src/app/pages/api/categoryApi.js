import axios from "axios";
import Joi from "joi";
import api from "./authApi";

// const token = getToken();

// src/api/categoryApi.jsx
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


// Validation schema for product category ID
const categoryIdSchema = Joi.string().hex().length(24).required();


// Helper to get the token from localStorage
const getToken = () => localStorage.getItem("authToken");



  const token = getToken();
  if (!token) throw new Error("Authentication token missing");



// ObjectId validator for MongoDB
export const objectIdSchema = Joi.string()
  .length(24)
  .hex()
  .required()
  .messages({
    "string.length": "Invalid category ID",
    "string.hex": "Invalid category ID",
    "any.required": "Category ID is required",
  });

// ✅ New: Delete category schema
export const deleteCategorySchema = Joi.object({
  categoryId: objectIdSchema,
  publicId: Joi.string().allow("").optional(), // Cloudinary public_id may be optional
});

// Category fields validation
export const createCategorySchema = Joi.object({
    name: Joi.string()
    .pattern(/^[A-Za-z\s]+$/) // ✅ allow only alphabets + spaces
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.empty": "Category name is required",
      "string.pattern.base": "Category name must contain only alphabets",
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name cannot exceed 50 characters",
    }),

  description: Joi.string()
    .allow("")
    .max(300)
    .messages({
      "string.max": "Description cannot exceed 300 characters",
    }),

  image: Joi.any()
    .required()
    .messages({
      "any.required": "At least an image is required",
    }),
});

// Middleware to validate image
export const validateCategoryImage = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Category image is required",
    });
  }

  // Optional: check file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp","image/avif","image/jpg"];
  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({
      success: false,
      message: "Invalid image type. Allowed: jpeg, png, webp, avif, jpg",
    });
  }

  next();
};


//  Combined validation middleware: category fields + image

// export const editCategorySchema = createCategorySchema;

export const serviceCategorySchema=createCategorySchema;


// Edit category: image optional
export const editCategorySchema = Joi.object({
  name: Joi.string()
    .pattern(/^[A-Za-z\s]+$/) // ✅ allow only alphabets + spaces
    .min(2)
    .max(50)
    .optional()
    .messages({
      "string.pattern.base": "Category name must contain only alphabets",
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name cannot exceed 50 characters",
    }),
  description: Joi.string()
    .allow("")
    .max(300)
    .optional()
    .messages({
      "string.max": "Description cannot exceed 300 characters",
    }),
  image: Joi.any().optional(), // ✅ image is optional
});



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

try{
  const endpoint =
    activeTab === "services"
      ? `/admin/api/adminCategory/service-category/${categoryId}`
      : `/admin/api/product-category/${categoryId}`;

   const res = await api.delete(endpoint);
   
  return res.data;}
  catch(error){
    console.log(error);
     
  }
  
};

// ✅ Create Product Category (supports multiple images)
export const createProductCategory = async (name, image) => {
  if (!name || !image || image.length === 0) {
    throw new Error("Category name and an image are required.");
  }

  const formData = new FormData();
  formData.append("name", name);
   formData.append("image", image); // single File

  const res = await api.post(`/admin/api/adminCategory/product-category`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};


// ✅ Create service category (supports multiple images)
// Create Service Category (single image)
// src/api/categoryApi.js
export const createServiceCategory = async (name, file) => {
  if (!name || !file) throw new Error("Category name and an image are required.");

  const formData = new FormData();
  formData.append("name", name);
  formData.append("image", file); // <-- append image

  const res = await api.post(
    "/admin/api/adminCategory/category",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } } // <-- important
  );

  return res.data; // make sure backend returns image URL
};






// ✅ Update product category
export const updateProductCategory = async (categoryId, formData) => {


    const res = await api.put(
    `/admin/api/adminCategory/product-category/${categoryId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );


  return res.data;
};






// Update service category (with optional image)
export const updateServiceCategory = async (categoryId, { name, description, newImageFile }) => {
  const formData = new FormData();
  if (name) formData.append("name", name);
  if (description) formData.append("description", description);
  if (newImageFile) formData.append("image", newImageFile);

  const res = await api.put(
    `/admin/api/adminCategory/service-category/${categoryId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return res.data;
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
export const deleteServiceCategory = async (categoryId) => {
  const { error } = categoryIdSchema.validate(categoryId);
  if (error) throw new Error(`Invalid category ID: ${error.message}`);


  try {
    console.log("in API call");

    // Delete category in backend
    await axios.delete(
      `${API_BASE_URL}/admin/api/adminCategory/service-category/${categoryId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

   

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







